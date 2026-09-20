import type { ImgHTMLAttributes } from "react";

type AumorexSymbolVariant = "primary" | "reversed" | "light" | "monochrome";

const symbolSources: Record<AumorexSymbolVariant, string> = {
  primary: "/brand/aumorex/svg/symbol-only-primary.svg",
  reversed: "/brand/aumorex/svg/symbol-only-reversed.svg",
  light: "/brand/aumorex/svg/symbol-only-reversed.svg",
  monochrome: "/brand/aumorex/svg/symbol-only-monochrome.svg",
};

type AumorexSymbolProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  variant?: AumorexSymbolVariant;
  className?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  "aria-label"?: string;
};

export function AumorexSymbol({
  variant = "primary",
  className,
  width = 135,
  height = 95,
  interactive = false,
  "aria-label": ariaLabel,
  ...props
}: AumorexSymbolProps) {
  return (
    <img
      {...props}
      className={className}
      src={symbolSources[variant]}
      alt=""
      aria-label={interactive ? ariaLabel || "AUMOREX TRANSPORT" : undefined}
      width={width}
      height={height}
    />
  );
}
