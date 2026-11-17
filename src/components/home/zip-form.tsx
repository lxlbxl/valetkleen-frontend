"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ZipForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [zip, setZip] = useState(initial);
  const [error, setError] = useState("");

  return (
    <>
      <form
        className="zip"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\d{5}$/.test(zip)) return setError("Enter a 5-digit ZIP code.");
          setError("");
          router.push(`/check?zip=${zip}`);
        }}
      >
        <label htmlFor="hero-zip" className="sr-only">
          Your ZIP code
        </label>
        <input
          id="hero-zip"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Your ZIP code"
          maxLength={5}
          aria-invalid={!!error}
          aria-describedby={error ? "hero-zip-err" : undefined}
        />
        <button className="btn s" type="submit" style={{ border: 0 }}>
          Check my address →
        </button>
      </form>
      {error && (
        <p id="hero-zip-err" role="alert" className="zh" style={{ color: "#ff9b93" }}>
          {error}
        </p>
      )}
    </>
  );
}
