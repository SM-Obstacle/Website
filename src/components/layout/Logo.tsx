import { cn } from "@/lib/utils";

/**
 * The mark is a single-colour glyph, so it is painted as a mask over the
 * current text colour rather than drawn as an image: white where it sits on
 * the dark theme, ink on the light one, out of the one file.
 */
export default function Logo({
  width = 50,
  height = 50,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="ShootMania Obstacle logo"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width,
        height,
        maskImage: 'url("/img/obs_logo.svg")',
        WebkitMaskImage: 'url("/img/obs_logo.svg")',
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
