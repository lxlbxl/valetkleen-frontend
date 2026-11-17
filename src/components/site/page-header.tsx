import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Style D page header (.phd) with the framed photo that drifts on scroll. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  back,
  photo,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label?: string };
  photo?: { src: string; caption: string; position?: string };
  children?: ReactNode;
}) {
  return (
    <header className={photo ? "phd hp" : "phd"}>
      {photo && (
        <figure className="hpic" data-par="-50">
          <Image src={photo.src} alt="" fill sizes="290px" style={{ objectFit: "cover", objectPosition: photo.position }} />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      )}
      <div className="wrap">
        {back && (
          <Link className="back" href={back.href}>
            ‹ {back.label ?? "Back"}
          </Link>
        )}
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="t">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
