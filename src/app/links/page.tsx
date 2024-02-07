import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "RESOURCES",
};

type Resources = {
  title: React.ReactNode,
  list: React.ReactNode[]
}[];

const LinkLabelDetails = ({
  link,
  label,
  details,
}: {
  link: string,
  label: string,
  details: string,
}) => (
  <>
    <Link href={link} target="_blank">{label}</Link>: {details}
  </>
);

const IncludedItem = ({
  outdated,
  newVersion,
  link
}: {
  outdated: string,
  newVersion: string,
  link: string,
}) => (
  <>
    {outdated} (outdated) / {newVersion} available <Link href={link} target="_blank">here</Link>
  </>
);

// TODO: ajouter les infos d'aurel
// TODO: rendre ça générique (en se basant sur la BD)
const resources = [
  {
    title: <h1>Resources</h1>,
    list: [
      <LinkLabelDetails
        link="https://obstacle.fandom.com/wiki/ShootMania_Obstacle_Wiki"
        label="Obstacle Wiki"
        details="Explanations of moves and techniques"
      />,
      <LinkLabelDetails
        link="https://www.instagram.com/obstacle_sm/"
        label="Obstacle Instagram"
        details="News and sneak peeks of upcoming Obstacle content"
      />,
      <LinkLabelDetails
        link="https://discord.gg/w2j64wXpjb"
        label="Obstacle Discord"
        details="Active community of players, mappers, and people gathered around Obstacle"
      />,
      <LinkLabelDetails
        link="https://sm.mania-exchange.com/"
        label="ShootMania Exchange"
        details="Hosting of ShootMania maps"
      />,
      <LinkLabelDetails
        link="https://aurel.obstacle.ovh/wordpress/"
        label="Aurel's blog"
        details="Tutorials and resources about Obstacle"
      />,
    ],
  },
  {
    title: <h2>Items included in the Titlepack</h2>,
    list: [
      <IncludedItem
        outdated="Christmas 1.0"
        newVersion="Christmas 1.1"
        link="https://www.dropbox.com/s/ki6xben1zzslkyd/Christmas.zip?dl=1"
      />,
      <IncludedItem
        outdated="Essential 1.0"
        newVersion="Essential 1.1"
        link="https://www.dropbox.com/scl/fi/nlx2khfdt1owem4q9as0m/Essentialv1.1.zip?rlkey=dbl8pbyacyf9v0jr0ok66fixl&dl=1"
      />,
      <IncludedItem
        outdated="NoLimit 1.1"
        newVersion="NoLimit 1.2"
        link="https://www.dropbox.com/s/51iuxu83t2w3tqf/NoLimitv1.22.zip?dl=1"
      />,
      <IncludedItem
        outdated="Space 1.0"
        newVersion="Space 1.1"
        link="https://www.dropbox.com/s/0irv4an7a9eptxv/Space.zip?dl=1"
      />,
      <>
        <Link href="https://item.mania.exchange/set/view/10325" target="_blank">Slide Items Set</Link>
        {" "}(not yet included)
      </>,
    ]
  },
  {
    title: <h2>Mods included in the Titlepack</h2>,
    list: [
      "Snow_Storm",
      <IncludedItem
        outdated="Lunar 12/03/2023"
        newVersion="Lunar 14/11/2023"
        link="http://maniacdn.net/aurelamck/Mods/Lunar.zip"
      />,
    ],
  },
  {
    title: <h3>Not yet included:</h3>,
    list: [
      <Link href="http://www.maniapark.com/download/mods/B0%20Modified.zip" target="_blank">Old Storm B0 modified</Link>,
      <Link href="http://www.maniapark.com/download/mods/Frozen%20Storm.zip" target="_blank">Frozen</Link>,
    ],
  },
  {
    title: <h2>Blocks included in the Titlepack</h2>,
    list: [
      "Conductor",
      "LaunchNoWings",
      "Terrain Tools",
    ],
  },
  {
    title: <h2>Materials included in the Titlepack</h2>,
    list: [
      "ColorPalette",
      "Missing Materials",
    ],
  },
  {
    title: <h2>Packs included in the Titlepack</h2>,
    list: [
      "Tube_V1.0",
      "Wooden_Crates",
    ],
  },
  {
    title: <h2>Clips included in the Titlepack</h2>,
    list: [
      "Clip_Rain",
      <>
        <Link href="http://maniacdn.net/aurelamck/Clips/Coloring_Base.zip" target="_blank">
          Coloring_Base
        </Link>
        {" "}(not yet included)
      </>,
    ],
  },
] satisfies Resources;

export default function Links() {
  return (
    <div>
      {resources.map((resource, i) => (
        <React.Fragment key={`resource_${i}`}>
          {resource.title}
          <ul>
            {resource.list.map((node, j) => (
              <li key={`resouce_${i}_${j}`}>
                {node}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
}