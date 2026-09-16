/**
 * Contrast scan of every text node on a set of pages, run from a browser.
 *
 * Lighthouse (`npm run a11y`) audits the page as loaded, in the machine's
 * colour scheme, and only the elements axe samples. This scans every text
 * node on every page you give it, in whichever colour scheme the browser
 * tab is in — so the same script covers light and dark mode by flipping
 * the OS setting (or DevTools > Rendering > Emulate prefers-color-scheme).
 * It was what found the September 2026 light-mode failures that Lighthouse
 * on a dark machine never saw (#151).
 *
 * How to run:
 *   1. Open any page on the site (production or `next start`) in Chrome.
 *   2. Paste this whole file into the DevTools console. It defines
 *      `pvScan(paths)` and `pvScanAll()`.
 *   3. `await pvScanAll()` — every sitemap URL, ~3 s a page — or
 *      `await pvScan(['/guaranteed-rent/', '/blog/'])`.
 *   Results print as they come; the return value is the list of failures.
 *
 * What it does: loads each page in a hidden same-origin iframe, freezes
 * transitions, then for every visible text node composites the real
 * background (translucent layers and gradient stops included) and reports
 * anything under WCAG AA — 4.5:1, or 3:1 for text that is 24px or 18.66px
 * bold. It skips the header, footer and nav (shared, checked once by hand),
 * SVG, gradient-clipped headline text, and visually hidden text.
 *
 * Known false positives: emoji with a variation selector, and inert
 * elements the site dims on purpose (the glossary's empty letters).
 */
(() => {
  const scanDoc = (doc, win) => {
    const cv = doc.createElement("canvas"); cv.width = cv.height = 1;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    const toRGBA = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }; };
    const parse = (c) => { if (!c) return null; if (/^rgba?\(/.test(c)) { const m = c.match(/[\d.]+/g); const [r, g, b, a = 1] = m.map(Number); return { r, g, b, a }; } return toRGBA(c); };
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const blend = (fg, bg) => { const a = fg.a + bg.a * (1 - fg.a); if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 }; const w = bg.a * (1 - fg.a); return { r: (fg.r * fg.a + bg.r * w) / a, g: (fg.g * fg.a + bg.g * w) / a, b: (fg.b * fg.a + bg.b * w) / a, a }; };
    const ratio = (x, y) => { const l1 = lum(x), l2 = lum(y); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    const gcs = (el) => win.getComputedStyle(el);
    const hidden = (el) => { for (let e = el; e; e = e.parentElement) { const cs = gcs(e); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return true; } return false; };
    const bgOf = (el) => {
      let acc = null;
      for (let e = el; e; e = e.parentElement) {
        const cs = gcs(e); const bc = parse(cs.backgroundColor); const img = cs.backgroundImage;
        if (img && img.startsWith("linear-gradient") && !(bc && bc.a >= 1)) {
          const m = img.match(/(rgba?|oklab|oklch|lab|hsla?)\([^)]*\)/);
          if (m) { const c = parse(m[0]); if (c && c.a > 0) { acc = acc ? blend(acc, c) : c; if (acc.a >= 1) return acc; } }
        }
        if (bc && bc.a > 0) { acc = acc ? blend(acc, bc) : bc; if (acc.a >= 1) return acc; }
      }
      let body = parse(gcs(doc.body).backgroundColor); if (!body || body.a < 1) body = { r: 255, g: 255, b: 255, a: 1 };
      return acc ? blend(acc, body) : body;
    };
    const out = []; const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT); const seen = new Set(); let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim(); if (!t || /^[\p{Emoji}\s\p{P}]+$/u.test(t)) continue;
      const el = n.parentElement; if (seen.has(el) || el.closest("svg, header, footer, nav, .text-gradient-gold, .sr-only")) continue; seen.add(el);
      if (hidden(el)) continue; const rect = el.getBoundingClientRect(); if (!rect.width || !rect.height) continue;
      const cs = gcs(el); let fg = parse(cs.color); if (!fg) continue; const bg = bgOf(el); if (fg.a < 1) fg = blend(fg, bg);
      const r = ratio(fg, bg); const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700; const large = size >= 24 || (size >= 18.66 && bold);
      if (r < (large ? 3 : 4.5)) out.push({ text: t.slice(0, 40), ratio: +r.toFixed(2), fg: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, size, tag: el.tagName.toLowerCase(), className: (el.className && el.className.toString ? el.className.toString() : "").slice(0, 60) });
    }
    return out;
  };

  window.pvScan = async (paths) => {
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;left:0;top:0;width:1000px;height:1300px;opacity:0.01;pointer-events:none;z-index:99999";
    document.body.appendChild(frame);
    const failures = [];
    for (const p of paths) {
      await new Promise((res) => { frame.onload = res; frame.onerror = res; frame.src = p; setTimeout(res, 15000); });
      const doc = frame.contentDocument, win = frame.contentWindow;
      try { const st = doc.createElement("style"); st.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"; doc.head.appendChild(st); } catch {}
      await new Promise((r) => setTimeout(r, 500)); try { doc.getAnimations().forEach((a) => a.finish()); } catch {}
      let out; try { out = scanDoc(doc, win); } catch (e) { out = [{ text: "SCAN ERROR " + e.message }]; }
      console.log(`${p}  ${out.length ? out.length + " under AA" : "ok"}`);
      for (const f of out) { console.log("   ", f); failures.push({ page: p, ...f }); }
    }
    frame.remove();
    console.log(`${paths.length} pages, ${failures.length} failures, ${document.documentElement.classList.contains("dark") ? "dark" : "light"} mode`);
    return failures;
  };

  window.pvScanAll = async () => {
    const xml = await (await fetch("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""));
    return window.pvScan(paths);
  };

  console.log("pvScan(paths) and pvScanAll() are ready.");
})();
