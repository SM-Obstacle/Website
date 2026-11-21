import type { CSSProperties } from "react";

/**
 * The look an event edition's banner gets, shared by the cards on /events and
 * the header of the edition they open into.
 *
 * `bg-clip-padding` keeps the banner out from under the border, which the
 * vignette does not reach: left there it draws a hard ring of raw image around
 * the card.
 */
export const bannerClassName =
  "bg-(--banner-scrim) bg-cover bg-clip-padding bg-center shadow-[inset_0_0_7em_var(--banner-edge)]";

/**
 * The banner itself, where the edition has one. Where it has none the class
 * above stands in for it with the scrim as a flat colour, so the card reads as
 * a plain one in the theme's own tone rather than as a dark slab.
 *
 * The scrim has to be laid down as a gradient layer rather than as the
 * `background-color` it reads like: a background colour paints *behind* the
 * image, so it would only ever tint the transparent parts of the artwork and
 * leave the text sitting on the raw photo. It sweeps left to right because the
 * text is all down the left edge — solid under the title and the badges, gone
 * by the far side, which keeps the artwork readable as a picture instead of
 * washing the whole thing out.
 */
export function bannerStyle(
  bannerImgUrl: string | null | undefined,
): CSSProperties | undefined {
  if (!bannerImgUrl) return undefined;

  return {
    backgroundImage:
      "linear-gradient(to right, var(--banner-scrim) 0%," +
      " var(--banner-scrim) 35%, var(--banner-scrim-fade) 100%)," +
      ` url(${bannerImgUrl})`,
  };
}
