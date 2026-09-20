import type { ImgHTMLAttributes } from "react";

type AumorexLogoVariant = "primary" | "reversed" | "light" | "monochrome";

const logoSources: Record<AumorexLogoVariant, string> = {
  primary: "/brand/aumorex/svg/logo-complete-primary.svg",
  reversed: "/brand/aumorex/svg/logo-complete-reversed.svg",
  light: "/brand/aumorex/svg/logo-complete-light.svg",
  monochrome: "/brand/aumorex/svg/logo-complete-monochrome.svg",
};

type AumorexLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  variant?: AumorexLogoVariant;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function AumorexLogo({
  variant = "primary",
  className,
  width = 208,
  height = 120,
  alt = "AUMOREX TRANSPORT",
  ...props
}: AumorexLogoProps) {
  return <img {...props} className={className} src={logoSources[variant]} alt={alt} width={width} height={height} />;
}
