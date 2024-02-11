import { Medal } from "@/app/__generated__/graphql";
import { cmpMedals } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

import css from "./medal.module.css";

const getImg = (medal: string) => `/Medals/${medal}.png`;

const MedalImg = ({ medal, ...rest }: { medal: string } & Omit<ImageProps, "src" | "alt">) => (
  <Image
    {...rest}
    src={getImg(medal)}
    alt={`${medal.charAt(0).toUpperCase() + medal.slice(1)} medal`}
    width={20}
    height={20}
    className={`${rest.className} ${css.medal}`}
  />
)

export default function MedalImage({
  medal,
}: {
  medal: Medal | null,
}) {
  return (
    <span className={css.medalSpan}>
      {cmpMedals(medal, Medal.Bronze) > 0 && (
        <>
          <MedalImg medal="bronze" style={{ right: 0 }} />
          {cmpMedals(medal, Medal.Silver) > 0 && (
            <>
              <MedalImg medal="silver" style={{ right: "10px" }} />
              {cmpMedals(medal, Medal.Gold) > 0 && (
                <>
                  <MedalImg medal="gold" style={{ right: "20px" }} />
                  {cmpMedals(medal, Medal.Champion) >= 0 && (
                    <MedalImg medal="champion" style={{ right: "30px" }} />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </span>
  );
}