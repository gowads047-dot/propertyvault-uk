"use client";

import { useRef, useState } from "react";

interface SignatureBlockProps {
  signerLabel?: string;
  signerName?: string;
  witnessLabel?: string;
  showWitness?: boolean;
  date?: string;
}

interface PadProps {
  label: string;
  name: string;
  onSign: (dataUrl: string) => void;
  signed: string;
  onClear: () => void;
}

function SignaturePad({ label, name, onSign, signed, onClear }: PadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  function getPos(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    drawing.current = true;
    const canvas = canvasRef.current!;
    const pos = getPos(e.nativeEvent, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e.nativeEvent, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#0f1b36";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    e.preventDefault();
  }

  function stopDraw() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current!;
    onSign(canvas.toDataURL());
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  }

  return (
    <div>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      {signed ? (
        <div style={{ position: "relative", border: "1.5px solid #0f1b36", borderRadius: 8, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from the signature canvas, rendered into a printable document; next/image cannot handle data URLs */}
          <img src={signed} alt="signature" style={{ width: "100%", height: 80, objectFit: "contain", background: "white" }} />
          <button onClick={clear} style={{ position: "absolute", top: 4, right: 4, fontSize: 10, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>Clear</button>
        </div>
      ) : (
        <div style={{ border: "1.5px dashed #d1d5db", borderRadius: 8, overflow: "hidden", touchAction: "none" }}>
          <canvas
            ref={canvasRef}
            width={400}
            height={80}
            style={{ width: "100%", height: 80, cursor: "crosshair", display: "block", background: "#fafafa" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          <p style={{ textAlign: "center", fontSize: 10, color: "#9ca3af", paddingBottom: 4 }}>Draw your signature above</p>
        </div>
      )}
      <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36", marginTop: 4 }}>{name || "_______________"}</p>
    </div>
  );
}

export function SignatureBlock({
  signerLabel = "Signed (Landlord / Agent)",
  signerName = "",
  witnessLabel = "Witness",
  showWitness = true,
  date = "",
}: SignatureBlockProps) {
  const [signerSig, setSignerSig] = useState("");
  const [witnessSig, setWitnessSig] = useState("");
  const [witnessName, setWitnessName] = useState("");

  const fmtDate = date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: showWitness ? "1fr 1fr" : "1fr", gap: 24 }}>
        <SignaturePad
          label={signerLabel}
          name={signerName}
          signed={signerSig}
          onSign={setSignerSig}
          onClear={() => setSignerSig("")}
        />

        {showWitness && (
          <div>
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{witnessLabel} (full name)</p>
            <input
              value={witnessName}
              onChange={e => setWitnessName(e.target.value)}
              placeholder="Witness full name"
              className="no-print"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "4px 8px", fontSize: 12, marginBottom: 6, fontFamily: "inherit" }}
            />
            <SignaturePad
              label="Witness signature"
              name={witnessName}
              signed={witnessSig}
              onSign={setWitnessSig}
              onClear={() => setWitnessSig("")}
            />
          </div>
        )}
      </div>
      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 12 }}>Date: {fmtDate || "_______________"}</p>
    </div>
  );
}

interface ShareToolbarProps {
  docTitle: string;
  pageUrl?: string;
  recipientEmail?: string;
  onPrint?: () => void;
}

export function ShareToolbar({ docTitle, pageUrl, recipientEmail = "", onPrint }: ShareToolbarProps) {
  const [emailTo, setEmailTo] = useState(recipientEmail);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const url = pageUrl || (typeof window !== "undefined" ? window.location.href : "");

  const waText = encodeURIComponent(
    `Hi, please find the document below:\n\n${docTitle}\n\n${url}\n\nKind regards`
  );

  const mailtoHref = `mailto:${emailTo}?subject=${encodeURIComponent(docTitle)}&body=${encodeURIComponent(
    `Hi,\n\nPlease find your document at the link below:\n\n${url}\n\nKind regards`
  )}`;

  return (
    <div className="no-print mt-4 flex flex-wrap gap-3 items-center">
      {onPrint && (
        <button onClick={onPrint} className="btn-primary text-sm">
          🖨️ Print / PDF
        </button>
      )}

      <a
        href={`https://wa.me/?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "#25D366" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        Send via WhatsApp
      </a>

      {showEmailInput ? (
        <div className="flex gap-2 items-center">
          <input
            type="email"
            value={emailTo}
            onChange={e => setEmailTo(e.target.value)}
            placeholder="Enter email address"
            className="px-3 py-2 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            style={{ minWidth: 220 }}
          />
          <a href={mailtoHref}
            className="btn-secondary text-sm !py-2 !px-4"
            onClick={() => setShowEmailInput(false)}>
            Send →
          </a>
          <button onClick={() => setShowEmailInput(false)} className="text-navy-400 text-sm hover:text-navy-700">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setShowEmailInput(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-navy-200 text-navy-700 bg-white hover:bg-navy-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send via Email
        </button>
      )}
    </div>
  );
}
