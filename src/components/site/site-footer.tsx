import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <Image src="/brand/logo-white.png" alt="ValetKleen" width={132} height={20} />
      <span className="sp" />
      <span>Metro Atlanta, GA</span>
      <Link href="/prices">Prices</Link>
      <Link href="/help">Help</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/privacy">Privacy</Link>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}
