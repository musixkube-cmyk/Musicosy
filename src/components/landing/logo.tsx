import Link from "next/link";
import Image from "next/image";

/**
 * Musicosy logo lockup for the marketing surface.
 * Uses the existing logo-full-same-row.png asset so it matches the
 * logo used in the Ad Center sidebar — one brand, one asset.
 */
export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Musicosy home">
      <Image
        src="/logo-full-same-row.png"
        alt="Musicosy"
        width={140}
        height={28}
        className={`${className} w-auto`}
        priority
      />
    </Link>
  );
}
