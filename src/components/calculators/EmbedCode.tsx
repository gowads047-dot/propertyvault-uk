"use client";
import { useState } from "react";

interface EmbedCodeProps {
  slug: string;
  title: string;
}

export function EmbedCode({ slug, title }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://propertyvaultuk.co.uk/embed/${slug}/`;
  const code = `<iframe src="${url}" width="100%" height="620" frameborder="0" style="border-radius:12px;border:1px solid #e8eaf0;" title="${title} — PropertyVault UK" loading="lazy"></iframe>\n<p style="font-size:11px;color:#888;margin-top:6px;">Powered by <a href="https://propertyvaultuk.co.uk/calculators/" target="_blank" rel="noopener">PropertyVault UK</a></p>`;

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-10 border border-navy-100 rounded-2xl p-6 bg-navy-50">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-bold text-navy-800 text-sm">Embed this calculator on your website</p>
          <p className="text-xs text-navy-500 mt-0.5">Free to use — copy the code below and paste it into any page.</p>
        </div>
        <button onClick={copy} className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg transition-all ${copied ? "bg-green-100 text-green-700" : "bg-navy-800 text-white hover:bg-navy-700"}`}>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <pre className="bg-white border border-navy-100 rounded-lg p-3 text-xs text-navy-600 overflow-x-auto whitespace-pre-wrap leading-relaxed">{code}</pre>
      <p className="text-xs text-navy-400 mt-2">Works on WordPress, Webflow, Squarespace, Wix, or any HTML page. The &ldquo;Powered by PropertyVault UK&rdquo; attribution is required.</p>
    </div>
  );
}
