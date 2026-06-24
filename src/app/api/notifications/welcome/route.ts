import { NextResponse } from "next/server";

const RESEND_KEY = process.env.RESEND_API_KEY;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    console.log(`[WELCOME EMAIL] to=${to} subject=${subject}`);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({ from: "PropertyVault <hello@propertyvaultuk.co.uk>", to, subject, html }),
  });
}

function renturaWelcomeHtml(name: string) {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:580px;margin:0 auto;background:#0c0f1a;color:#e5e5e5;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04));padding:36px 40px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <p style="font-size:20px;font-weight:800;color:#c9a84c;margin:0 0 4px;">Rentura™</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.35);margin:0;">Property Operating System</p>
    </div>
    <div style="padding:36px 40px;">
      <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.2;">Welcome${name ? `, ${name}` : ""}. You're in.</h1>
      <p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;margin:0 0 28px;">
        Rentura is your all-in-one landlord operating system. Here's what's waiting for you:
      </p>
      <div style="display:grid;gap:12px;margin-bottom:32px;">
        ${[
          ["🏠","Properties","Add your portfolio and track every unit"],
          ["👤","Tenants","Manage tenancies, rent due dates, and deposits"],
          ["✓","Compliance","Track Gas Safety, EICR, EPC and more — get alerts before they expire"],
          ["🔧","Maintenance","Log issues, assign costs, track resolution"],
          ["🏦","Mortgages","Track fixed-rate expiry dates and ERC windows"],
          ["£","Financials","Monitor income, expenses, and yield per property"],
        ].map(([icon, title, desc]) => `
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;">
            <span style="font-size:18px;flex-shrink:0;">${icon}</span>
            <div>
              <p style="font-size:13px;font-weight:700;color:#e5e5e5;margin:0 0 2px;">${title}</p>
              <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0;">${desc}</p>
            </div>
          </div>
        `).join("")}
      </div>
      <a href="https://propertyvaultuk.co.uk/rentura/dashboard" style="display:inline-block;background:#c9a84c;color:#0f1b36;font-weight:800;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Open Rentura →
      </a>
      <p style="font-size:12px;color:rgba(255,255,255,0.25);margin-top:32px;">
        Questions? Reply to this email or WhatsApp us: <a href="https://wa.me/447415721628" style="color:#c9a84c;">07415 721628</a>
      </p>
    </div>
    <div style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.2);">
      <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;">© PropertyVault UK · <a href="https://propertyvaultuk.co.uk/rentura/settings" style="color:rgba(255,255,255,0.3);">Manage notifications</a></p>
    </div>
  </div>`;
}

function academyWelcomeHtml(name: string) {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:580px;margin:0 auto;background:#0a0f1e;color:#e5e5e5;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03));padding:36px 40px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#d4af37,#f0d060);display:flex;align-items:center;justify-content:center;font-size:18px;">🎓</div>
        <p style="font-size:17px;font-weight:800;color:#fff;margin:0;">PropertyVault Academy</p>
      </div>
    </div>
    <div style="padding:36px 40px;">
      <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.2;">Your property education starts now${name ? `, ${name}` : ""}.</h1>
      <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;margin:0 0 28px;">
        You now have access to every course in the Academy. Start anywhere — here are our most popular:
      </p>
      <div style="display:grid;gap:10px;margin-bottom:32px;">
        ${[
          "Property Investing Fundamentals",
          "Deal Sourcing & Analysis Masterclass",
          "HMO Conversions A–Z",
          "Serviced Accommodation Blueprint",
          "Raising Private Finance",
          "Building a Portfolio from £0",
        ].map((title, i) => `
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:11px;font-weight:700;color:rgba(212,175,55,0.6);width:18px;">${i + 1}</span>
            <p style="font-size:13px;color:#e5e5e5;margin:0;">${title}</p>
          </div>
        `).join("")}
      </div>
      <a href="https://propertyvaultuk.co.uk/academy/courses" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#f0d060);color:#0f1b36;font-weight:800;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Browse all courses →
      </a>
      <p style="font-size:12px;color:rgba(255,255,255,0.25);margin-top:32px;">
        Reply to this email with any questions — we read everything.
      </p>
    </div>
    <div style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.3);">
      <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;">© PropertyVault UK · <a href="https://propertyvaultuk.co.uk/academy/dashboard" style="color:rgba(255,255,255,0.3);">Your dashboard</a></p>
    </div>
  </div>`;
}

function subscriptionConfirmHtml(name: string, platform: string, amount: string) {
  const isRentura = platform === "rentura";
  const brandColor = isRentura ? "#c9a84c" : "#d4af37";
  const brandName = isRentura ? "Rentura™" : "PropertyVault Academy";
  const dashUrl = isRentura ? "/rentura/dashboard" : "/academy/dashboard";
  return `
  <div style="font-family:system-ui,sans-serif;max-width:580px;margin:0 auto;background:#0c0f1a;color:#e5e5e5;border-radius:16px;overflow:hidden;">
    <div style="padding:36px 40px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <p style="font-size:18px;font-weight:800;color:${brandColor};margin:0 0 4px;">${brandName}</p>
    </div>
    <div style="padding:36px 40px;">
      <div style="font-size:48px;margin-bottom:20px;">🎉</div>
      <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 12px;">You're subscribed${name ? `, ${name}` : ""}!</h1>
      <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;margin:0 0 28px;">
        Your ${brandName} subscription is now active. ${amount}/month — you'll be billed on the same date each month. Cancel anytime from your dashboard.
      </p>
      <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:18px 22px;margin-bottom:28px;">
        <p style="font-size:14px;font-weight:700;color:#22c55e;margin:0 0 4px;">✓ Payment confirmed</p>
        <p style="font-size:13px;color:rgba(255,255,255,0.5);margin:0;">Full access is now unlocked.</p>
      </div>
      <a href="https://propertyvaultuk.co.uk${dashUrl}" style="display:inline-block;background:${brandColor};color:#0f1b36;font-weight:800;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        Go to your dashboard →
      </a>
      <p style="font-size:12px;color:rgba(255,255,255,0.25);margin-top:28px;">
        To manage or cancel your subscription: <a href="https://propertyvaultuk.co.uk${dashUrl}" style="color:${brandColor};">billing settings</a>
      </p>
    </div>
    <div style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.2);">
      <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;">© PropertyVault UK</p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const { email, name, type, platform } = await req.json();
    if (!email || !type) return NextResponse.json({ error: "email and type required" }, { status: 400 });

    if (type === "rentura_welcome") {
      await sendEmail(email, "Welcome to Rentura™ — your landlord OS is ready", renturaWelcomeHtml(name || ""));
    } else if (type === "academy_welcome") {
      await sendEmail(email, "Welcome to PropertyVault Academy — your courses are ready", academyWelcomeHtml(name || ""));
    } else if (type === "subscription_confirm") {
      const amount = platform === "rentura" ? "£9.99" : "£14.99";
      await sendEmail(email, `Subscription confirmed — ${platform === "rentura" ? "Rentura™" : "PropertyVault Academy"}`, subscriptionConfirmHtml(name || "", platform || "academy", amount));
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[WELCOME EMAIL]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
