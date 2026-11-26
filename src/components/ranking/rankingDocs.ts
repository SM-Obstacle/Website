/**
 * The explanations behind the "?" button of the ranked lists, in Markdown with
 * `$…$` / `$$…$$` math (rendered by KaTeX on the server, see `RankingDoc`).
 *
 * `String.raw`, so the TeX backslashes don't need escaping.
 */

const MAP_VALUE = String.raw`$$
M_v = \left[ \log_{10}\!\left(1000 \cdot R_n^2\right) + \log_{10}\!\left(\left(t - \Delta t\right)^2 + 1\right) \right] \cdot \left[ \log_{10}\!\left(\frac{R_n}{R} + 1\right) \right]^3
$$`;

const TIME_PART = String.raw`$$
\log_{10}\!\left(\left(t - \Delta t\right)^2 + 1\right) =
\begin{cases}
\log_{10}\!\left(\left(t - \Delta t\right)^2 + 1\right) & \text{if } t > \Delta t \\
0 & \text{if } t \le \Delta t
\end{cases}
$$`;

const FINAL_SCORE = String.raw`$$
S =
\begin{cases}
S_{\text{week}} + \max S_{\text{global}} + 1 & \text{if } S_{\text{week}} > 0 \\
S_{\text{global}} & \text{otherwise}
\end{cases}
$$`;

const PLAYERS = String.raw`The player ranking is updated every week, and it's based on the records set during that week.

Each time you set a record on a map, you earn points. Two things decide how many points a record earns: how high you placed on that map, and how many people played it. Placing near the top is worth much more than placing in the middle, and doing well on a popular map, where you beat lots of players, is worth more than winning a map only a few people tried. Your weekly score is all the points from your records that week added up. Even a last-place finish earns a few points, so every map you play helps.

Everyone who set a record during the week is ranked first, in order of their weekly score. Players who didn't play that week still appear in the ranking, below all the active players, in order of their all-time score. The all-time score is calculated the same way but counts every record you've ever set, and it's updated from time to time. If you play this week, you'll be ranked above everyone who didn't. If you take a break, your past results decide where you stand.

### The exact formula

For each map you set a record on during the week, your record is worth:

${MAP_VALUE}

where:

- $t$ is your record time on the map, in seconds
- $R_n$ is the total number of records set on the map this week
- $R$ is your position on the map's leaderboard this week (1 for the best time)
- $\Delta t$ is the average record time on the map this week
- $M_v$ is the map value for you

In plain words:

- $\log_{10}(1000 \cdot R_n^2)$ is the **popularity part**: the more people played the map, the bigger it gets.
- $\log_{10}((t - \Delta t)^2 + 1)$ is the **time part**. It only counts when your time is slower than the average; otherwise it's 0:

${TIME_PART}

- $\left[\log_{10}(R_n / R + 1)\right]^3$ is the **placement part**: it's largest for 1st place and shrinks quickly as you go down the leaderboard. Because it's cubed, top spots are worth far more than the rest.

Your weekly score is the sum of your map values:

$$
S_{\text{week}} = \sum_{\text{maps played this week}} M_v
$$

Your final ranking score is:

${FINAL_SCORE}

where $S_{\text{global}}$ is your all-time score, calculated with the same formulas over every record you've ever set, and $\max S_{\text{global}}$ is the highest all-time score among all players. Adding it keeps every active player above every inactive one.
`;

const MAPS = String.raw`The map ranking is updated every week, and it's based on the records set during that week.

Every record set on a map earns points, and a map's weekly score is all the points earned on it that week added up. Records earn more points when more people play the map, so maps that draw lots of players get a much higher score. Top placements earn the most points, so maps where players fight for the best times stand out the most.

Every map that got a record during the week is ranked first, in order of its weekly score. Maps that nobody played that week still appear in the ranking, below all the active maps, in order of their all-time score. The all-time score is calculated the same way but counts every record ever set on the map, and it's updated from time to time. The ranking shows which maps are popular right now, and past popularity decides the order of the rest.

### The exact formula

Each record set on the map during the week is worth:

${MAP_VALUE}

where:

- $t$ is the record time, in seconds
- $R_n$ is the total number of records set on the map this week
- $R$ is the record's position on the map's leaderboard this week (1 for the best time)
- $\Delta t$ is the average record time on the map this week
- $M_v$ is the value of that record

In plain words:

- $\log_{10}(1000 \cdot R_n^2)$ is the **popularity part**: the more people played the map, the bigger it gets.
- $\log_{10}((t - \Delta t)^2 + 1)$ is the **time part**. It only counts when the record is slower than the average; otherwise it's 0:

${TIME_PART}

- $\left[\log_{10}(R_n / R + 1)\right]^3$ is the **placement part**: it's largest for 1st place and shrinks quickly down the leaderboard. Because it's cubed, top spots are worth far more than the rest.

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
