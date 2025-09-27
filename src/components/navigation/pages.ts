import type { GetEventListQuery } from "@/app/__generated__/graphql";
import type { DiscriminatedUnion } from "@/lib/utils";

type NormalPage = {
  label: string;
  path: string;
};

export type Page = DiscriminatedUnion<
  "type",
  {
    normal: NormalPage;
    dropdown: {
      label: string;
      menu: Record<string, NormalPage>;
    };
    separator: Record<string, never>;
  }
>;

function cleanUpHandle(eventHandle: string) {
  return eventHandle
    .split("_")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getPages(events: GetEventListQuery): Record<string, Page> {
  return {
    home: {
      type: "normal",
      label: "Home",
      path: "/latest",
    },
    events: {
      type: "dropdown",
      label: "Events",
      menu: Object.fromEntries(
        events.events.map((event) => [
          `${event.handle}_${event.lastEdition?.id}`,
          {
            label: cleanUpHandle(event.handle),
            path: `/event/${event.handle}/${event.lastEdition?.id}`,
          },
        ]),
      ),
    },
    separator: {
      type: "separator",
    } as Page,
    resources: {
      type: "normal",
      label: "Resources",
      path: "/links",
    },
  };
}
