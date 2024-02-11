import css from "../links/style.module.css";

export default function LatestNews() {
  return (
    <div className={css.resources}>
      <div>
        <h1>Obstacle 2.0 Release</h1>
        <iframe
          style={{ borderRadius: "10px" }}
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/Qd3UzQ93aGE"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        <p>Obstacle 2.0 is out! It brings a lot of new content, including:</p>
        <ul>
          <li>
            <p><b>Summer 2023</b>: a new campaign with 25 new maps! Each map has 4 medals. Can you get the Master Medal? :p</p>
            <p>The maps were made by Aurel, Ben, errorcat, Buggz, HasCrashed, Inner Peace, James, Khass, Kiwi, and Pixou.</p>
            <p>Many thanks to Khass for managing the mappers, and to unmecrandom, Kiwi, and Hippe for testing the maps and establishing the medal times.</p>
          </li>
          <li>
            <p><b>Titlepack menus</b>: A complete redesign made by ZenyoX and implemented by MiLTanT!</p>
            <p>It should be clearer and more welcoming, and the new code should be more stable and maintainable coming forward. Some features are still a work in progress, but we think it's worth it to make the change now.</p>
            <p>We hope you like it, suggestions appreciated :)</p>
          </li>
          <li>
            <p><b>Database and Website</b>: <a href="https://obstacle.titlepack.io">obstacle.titlepack.io</a> is the new official home of Obstacle.</p>
            <p>But actually, this is just the surface of an impressive work that ahmad accomplished over the last few months. The API and database have been rethought so that many features and security measures will be easier to implement in the future, as well as a better error reporting.</p>
            <p>Starting now, you will sometimes be prompted to authentificate yourself via Maniaplanet services when entering the titlepack. This should ensure that nobody is posting records in your name (which, if they raise cheating concerns in your own name, could get <i>you</i> banned).</p>
            <p>Informations like checkpoint times are now also stored in the database for future use.</p>
          </li>
          <li>
            <p><b>New Content!</b></p>
            <p>The titlepack now embeds many new Items and Blocks made primarily by Aurel and Inner Peace:</p>
            <ul>
              <li>Space items: asteroids, stars, and custom grounds to pair up with...</li>
              <li>Lunar Mod: A texture pack made specifically to work on openplanet void maps.</li>
              <li>LaunchNoWings: A new launcher design with a design close to nadeo's but without those anoying wings :D</li>
              <li>Conductor and Terrain Tools: Helper blocks to help with conducting the bases color and voiding the ground.</li>
            </ul>
          </li>
        </ul>
        <p>Looking forward to see you in-game,</p>
        <p>MiLTanT</p>
      </div>
      <span className={css.lastUpdate}>Last update: 30/06/2023</span>
    </div>
  );
}