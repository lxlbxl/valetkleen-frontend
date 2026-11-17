import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap" style={{ minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          404
        </div>
        <h1 className="t">
          This page went out <em>with the laundry</em>.
        </h1>
        <p className="lead" style={{ margin: "16px auto 0" }}>
          The link may be old, or the order may belong to another account.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 30 }}>
          <Link className="btn p" href="/">
            Go home
          </Link>
          <Link className="btn g" href="/orders">
            Your orders
          </Link>
        </div>
      </div>
    </main>
  );
}
