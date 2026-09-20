import type { ImgHTMLAttributes } from "react";

type Variant = "primary" | "reversed" | "light" | "monochrome";

const sources: Record<Variant, string> = {
  primary: "/brand/aumorex/svg/02_aumorex_transport_primary_light_bg.svg",
  reversed: "/brand/aumorex/svg/01_aumorex_transport_primary_navy_bg.svg",
  light: "/brand/aumorex/svg/04_aumorex_transport_monochrome_offwhite_transparent.svg",
  monochrome: "/brand/aumorex/svg/03_aumorex_transport_monochrome_navy_transparent.svg",
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  variant?: Variant;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function AumorexLogo({
  variant = "primary",
  className,
  width = 96,
  height = 96,
  alt = "AUMOREX TRANSPORT",
  ...props
}: Props) {
  return <img {...props} className={className} src={sources[variant]} alt={alt} width={width} height={height} />;
}
