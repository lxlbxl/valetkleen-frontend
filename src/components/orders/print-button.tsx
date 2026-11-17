"use client";

export function PrintButton() {
  return (
    <button className="btn g" style={{ marginTop: 20 }} onClick={() => window.print()}>
      Print or save as PDF
    </button>
  );
}
