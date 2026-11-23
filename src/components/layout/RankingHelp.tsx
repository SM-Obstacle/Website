"use client";

import { CircleHelp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const RANKINGS = {
  players: {
    title: "How the player ranking works",
    description: "Updated every week, from the records set during that week.",
    sections: [
      {
        heading: "Weekly score",
        paragraphs: [
          "Each time you set a record on a map, you earn points. Two things decide how many points a record earns: how high you placed on that map, and how many people played it.",
          "Placing near the top is worth much more than placing in the middle, and doing well on a popular map, where you beat lots of players, is worth more than winning a map only a few people tried.",
          "Your weekly score is all the points from your records that week added up. Even a last-place finish earns a few points, so every map you play helps.",
        ],
      },
      {
        heading: "Order of the ranking",
        paragraphs: [
          "Everyone who set a record during the week is ranked first, in order of their weekly score. Players who didn't play that week still appear in the ranking, below all the active players, in order of their all-time score.",
          "The all-time score is calculated the same way but counts every record you've ever set, and it's updated from time to time.",
          "If you play this week, you'll be ranked above everyone who didn't. If you take a break, your past results decide where you stand.",
        ],
      },
    ],
  },
  maps: {
    title: "How the map ranking works",
    description: "Updated every week, from the records set during that week.",
    sections: [
      {
        heading: "Weekly score",
        paragraphs: [
          "Every record set on a map earns points, and a map's weekly score is all the points earned on it that week added up.",
          "Records earn more points when more people play the map, so maps that draw lots of players get a much higher score. Top placements earn the most points, so maps where players fight for the best times stand out the most.",
        ],
      },
      {
        heading: "Order of the ranking",
        paragraphs: [
          "Every map that got a record during the week is ranked first, in order of its weekly score. Maps that nobody played that week still appear in the ranking, below all the active maps, in order of their all-time score.",
          "The all-time score is calculated the same way but counts every record ever set on the map, and it's updated from time to time.",
          "The ranking shows which maps are popular right now, and past popularity decides the order of the rest.",
        ],
      },
    ],
  },
} as const;

/**
 * A "?" button for the title bar that explains how a ranking is computed.
 *
 * A dialog rather than a tooltip: the text runs to several paragraphs, and a
 * tooltip has no hover to open it on a phone.
 */
export default function RankingHelp({
  ranking,
}: {
  ranking: keyof typeof RANKINGS;
}) {
  const { title, description, sections } = RANKINGS[ranking];

  return (
    <Dialog>
      <DialogTrigger
        aria-label={title}
        title={title}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary sm:size-10"
      >
        <CircleHelp className="size-5 sm:size-6" aria-hidden />
      </DialogTrigger>

      <DialogContent className="max-h-[85dvh] gap-inset rounded-block bg-popover p-inset sm:max-w-xl">
        <DialogHeader className="px-3 pe-10 pt-2">
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 rounded-panel">
          <div className="flex flex-col gap-5 px-3 pb-3 text-base leading-relaxed">
            {sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2">
                <h2 className="m-0 text-lg font-bold">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="m-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
