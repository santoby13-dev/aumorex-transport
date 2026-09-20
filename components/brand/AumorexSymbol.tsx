import type { ImgHTMLAttributes } from "react";

type Variant = "primary" | "reversed" | "light" | "monochrome";

const sources: Record<Variant, string> = {
  primary: "/brand/aumorex/svg/06_aumorex_symbol_primary_light_bg.svg",
  reversed: "/brand/aumorex/svg/05_aumorex_symbol_primary_navy_bg.svg",
  light: "/brand/aumorex/svg/08_aumorex_symbol_monochrome_offwhite_transparent.svg",
  monochrome: "/brand/aumorex/svg/07_aumorex_symbol_monochrome_navy_transparent.svg",
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  variant?: Variant;
  className?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  "aria-label"?: string;
};

export function AumorexSymbol({
  variant = "primary",
  className,
  width = 96,
  height = 96,
  interactive = false,
  "aria-label": ariaLabel,
  ...props
}: Props) {
  return <img {...props} className={className} src={sources[variant]} alt="" aria-label={interactive ? ariaLabel || "AUMOREX TRANSPORT" : undefined} width={width} height={height} />;
}
