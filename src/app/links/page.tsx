import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const oldTitle = (await parent).title?.absolute ?? "Obstacle Leaderboards";

  return {
    title: `${oldTitle} - RESOURCES`,
  };
}

// TODO: ajouter les infos d'aurel
// TODO: rendre ça générique (en se basant sur la BD)
export default function Links() {
  return (
    <div>
      <h1>Resources</h1>
      <ul>
        <li>
          <a href="https://obstacle.fandom.com/wiki/ShootMania_Obstacle_Wiki" target="_blank">Obstacle Wiki</a>: Explanations of moves and techniques
        </li>
        <li>
          <a href="https://www.instagram.com/obstacle_sm/" target="_blank">Obstacle Instagram</a>: News and sneak peeks of upcoming Obstacle content
        </li>
        <li>
          <a href="https://discord.gg/w2j64wXpjb" target="_blank">Obstacle Discord</a>: Active community of players, mappers, and people gathered around Obstacle
        </li>
        <li>
          <a href="https://sm.mania-exchange.com/" target="_blank">ShootMania Exchange</a>: Hosting of ShootMania maps
        </li>
        <li>
          <a href="https://aurel.obstacle.ovh/wordpress/" target="_blank">Aurel's blog</a>: Tutorials and resources about Obstacle
        </li>
      </ul>
    </div>
  );
}