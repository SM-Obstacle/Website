/**
 * The explanations behind the "?" button of the ranked lists, in Markdown with
 * `$…$` / `$$…$$` math (rendered by KaTeX on the server, see `RankingDoc`).
 *
 * `String.raw`, so the TeX backslashes don't need escaping.
 */

/**
 * Split over three lines with `aligned`, so it fits a phone-width dialog. The
 * first bracket spans a line break, which `\left…\right` can't, so it is sized
 * by hand with `\Bigl…\Bigr`.
 */
const MAP_VALUE = String.raw`$$
\begin{aligned}
M_v = {} & \Bigl[ \log_{10}\!\left(1000 \cdot n^2\right) \\
& \quad + \log_{10}\!\left(\max\left(0,\ \bar{t} - t\right)^2 + 1\right) \Bigr] \\
& \cdot \left[ \log_{10}\!\left(\frac{n}{r} + 1\right) \right]^3
\end{aligned}
$$`;

const FINAL_SCORE = String.raw`$$
S =
\begin{cases}
S_{\text{week}} + \max S_{\text{global}} + 1 & \text{if } S_{\text{week}} > 0 \\
S_{\text{global}} & \text{otherwise}
\end{cases}
$$`;

const PLAYERS = String.raw`The player ranking is updated every week, and it's based on the records set during that week.

Each time you set a record on a map, you earn points. Three things decide how many points a record earns: how high you placed on that map, how many people played it, and how much faster than the average your time is. Placing near the top is worth much more than placing in the middle, and doing well on a popular map, where you beat lots of players, is worth more than winning a map only a few people tried. Beating the map's average time earns bonus points, and the further below the average you are, the more you get. Your weekly score is all the points from your records that week added up. Even a last-place finish earns a few points, so every map you play helps.

Everyone who set a record during the week is ranked first, in order of their weekly score. Players who didn't play that week still appear in the ranking, below all the active players, in order of their all-time score. The all-time score is calculated the same way but counts every record you've ever set, and it's updated from time to time. If you play this week, you'll be ranked above everyone who didn't. If you take a break, your past results decide where you stand.

### The exact formula

For each map you set a record on during the week, your record is worth:

${MAP_VALUE}

where:

- $t$ is your record time on the map, in seconds
- $n$ is the total number of records set on the map this week
- $r$ is your position on the map's leaderboard this week (1 for the best time)
- $\bar{t}$ is the average record time on the map this week
- $M_v$ is the map value for you

In plain words:

- $\log_{10}(1000 \cdot n^2)$ is the **popularity part**: the more people played the map, the bigger it gets.
- $\log_{10}(\max(0, \bar{t} - t)^2 + 1)$ is the **time part**. $\max(0, \bar{t} - t)$ is how many seconds faster than the average your time is, or 0 if you're at or slower than the average. So this part is 0 for any time at or above the average, since $\log_{10}(0 + 1) = 0$, and grows the further your time is below the average.
- $\left[\log_{10}(n / r + 1)\right]^3$ is the **placement part**: it's largest for 1st place and shrinks quickly as you go down the leaderboard. Because it's cubed, top spots are worth far more than the rest.

Your weekly score is the sum of your map values:

$$
S_{\text{week}} = \sum_{\text{maps played this week}} M_v
$$

Your final ranking score is:

${FINAL_SCORE}

where $S_{\text{global}}$ is your all-time score, calculated with the same formulas over every record you've ever set, and $\max S_{\text{global}}$ is the highest all-time score among all players. Adding it keeps every active player above every inactive one.
`;

const MAPS = String.raw`The map ranking is updated every week, and it's based on the records set during that week.

Every record set on a map earns points, and a map's weekly score is all the points earned on it that week added up. Records earn more points when more people play the map, so maps that draw lots of players get a much higher score. Top placements earn the most points, and so do times well below the map's average, so maps where players fight for the best times stand out the most.

Every map that got a record during the week is ranked first, in order of its weekly score. Maps that nobody played that week still appear in the ranking, below all the active maps, in order of their all-time score. The all-time score is calculated the same way but counts every record ever set on the map, and it's updated from time to time. The ranking shows which maps are popular right now, and past popularity decides the order of the rest.

### The exact formula

Each record set on the map during the week is worth:

${MAP_VALUE}

where:

- $t$ is the record time, in seconds
- $n$ is the total number of records set on the map this week
- $r$ is the record's position on the map's leaderboard this week (1 for the best time)
- $\bar{t}$ is the average record time on the map this week
- $M_v$ is the value of that record

In plain words:

- $\log_{10}(1000 \cdot n^2)$ is the **popularity part**: the more people played the map, the bigger it gets.
- $\log_{10}(\max(0, \bar{t} - t)^2 + 1)$ is the **time part**. $\max(0, \bar{t} - t)$ is how many seconds faster than the average the record is, or 0 if it's at or slower than the average. So this part is 0 for any time at or above the average, since $\log_{10}(0 + 1) = 0$, and grows the further the record is below the average.
- $\left[\log_{10}(n / r + 1)\right]^3$ is the **placement part**: it's largest for 1st place and shrinks quickly down the leaderboard. Because it's cubed, top spots are worth far more than the rest.

The map's weekly score is the sum of the values of all its records that week:

$$
S_{\text{week}} = \sum_{\text{records on the map this week}} M_v
$$

The map's final ranking score is:

${FINAL_SCORE}

where $S_{\text{global}}$ is the map's all-time score, calculated with the same formulas over every record ever set on it, and $\max S_{\text{global}}$ is the highest all-time score among all maps. Adding it keeps every map played this week above every map that wasn't.
`;

export const RANKING_DOCS = {
  players: { title: "How the player ranking works", body: PLAYERS },
  maps: { title: "How the map ranking works", body: MAPS },
} as const;

export type RankingKind = keyof typeof RANKING_DOCS;
