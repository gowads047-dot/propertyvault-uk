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
          <button onClick={clear} style={{ position: "absolute", top: 4, right: 4, fontSize: 10, background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>Clear</button>
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
            <input aria-label="Witness full name"
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
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Send via WhatsApp
      </a>

      {showEmailInput ? (
        <div className="flex gap-2 items-center">
          <input aria-label="Enter email address"
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
