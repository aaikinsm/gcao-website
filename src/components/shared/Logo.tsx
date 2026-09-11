import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  href?: string;
}

export function Logo({
  size = 48,
  showText = true,
  className = "",
  textClassName = "",
  href = "/",
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.jpg"
        alt="GCAO logo"
        width={size}
        height={size}
        className="rounded-full object-cover"
        priority
      />
      {showText && (
        <div className={textClassName}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            Ghanaian-Canadian
          </p>
          <p className="text-sm font-bold leading-tight">Association of Ontario</p>
        </div>
      )}
    </Link>
  );
}
