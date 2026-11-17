"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: report to Sentry once it is set up.
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="wrap" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <h1 className="t">
          Something went <em>wrong</em>.
        </h1>
        <p className="lead" style={{ margin: "16px auto 0" }}>
          Please try again. If it keeps happening, text us and we will sort it out.
        </p>
        <button className="btn p" style={{ marginTop: 28 }} onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
