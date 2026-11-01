import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg" | "xl";
  subtitle?: string;
  href?: string;
}

export function BrandLogo({
  className,
  showText = true,
  textSize = "md",
  subtitle,
  href = "/",
}: BrandLogoProps) {
  const textClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }[textSize];

  const content = (
    <div className={cn("group flex items-center space-x-2.5", className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/90 p-1 shadow-md shadow-primary/20 ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-105 dark:bg-card">
        <Image
          src="/wellspace-logo.png"
          alt="WellSpace Logo"
          width={36}
          height={36}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent leading-tight",
              textClasses
            )}
          >
            Well<span className="text-primary">Space</span>
          </span>
          {subtitle && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

