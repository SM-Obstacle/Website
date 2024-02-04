import { ServerProps } from "@/lib/server-props";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import React from "react";

export async function generateMetadata(
  props: ServerProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute ?? "Obstacle Leaderboards";

  return {
    title: `${oldTitle} - RESOURCES`,
  };
}

type Resources = {
  title: string,
  list: ({
    link: string,
    label: string,
    details: string,
  } | string)[]
}[];

// TODO: ajouter les infos d'aurel
// TODO: rendre ça générique (en se basant sur la BD)
const resources = [
  {
    title: "Resources",
    list: [
      {
        link: "https://obstacle.fandom.com/wiki/ShootMania_Obstacle_Wiki",
        label: "Obstacle Wiki",
        details: "Explanations of moves and techniques",
      },
      {
        link: "https://www.instagram.com/obstacle_sm/",
        label: "Obstacle Instagram",
        details: "News and sneak peeks of upcoming Obstacle content",
      },
      {
        link: "https://discord.gg/w2j64wXpjb",
        label: "Obstacle Discord",
        details: "Active community of players, mappers, and people gathered around Obstacle",
      },
      {
        link: "https://sm.mania-exchange.com/",
        label: "ShootMania Exchange",
        details: "Hosting of ShootMania maps",
      },
      {
        link: "https://aurel.obstacle.ovh/wordpress/",
        label: "Aurel's blog",
        details: "Tutorials and resources about Obstacle",
      },
    ],
  },
] satisfies Resources;

export default function Links() {
  return (
    <div>
      {resources.map((resource) => (
        <React.Fragment key={resource.title}>
          <h1>{resource.title}</h1>
          <ul>
            {resource.list.map((link) => typeof link === "string" ? (
              <li key={link}>{link}</li>
            ) : (
              <li key={link.link}>
                <Link href={link.link} target="_blank">{link.label}</Link>: {link.details}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
}