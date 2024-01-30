import * as tools from './toolbox.js'

const load_campaign = async (campaign) => {
    tools.graphql_callback(`{ mappack (mappackId: "${tools.sanitize_graphql_string(campaign)}") { maps { map mapId lastRank } scores { rank login name score worst { rank } ranks { rank mapIdx } mapsFinished } } }`,
    (data) => {
        document_updated_hook(tools.generate_table(
            [
                {
                    'name': 'rank',
                    'text': 'Rank',
                    'type': 'fraction'
                },
                {
                    'name': 'sr_player',
                    'text': 'Player',
                    'type': 'player'
                },
                {
                    'name': 'rank_avg',
                    'text': 'Rank Average',
                    'type': 'number'
                },
                {
                    'name': 'map_finished',
                    'text': 'Map Finished',
                    'type': 'fraction'
                },
                {
                    'name': 'worst_rank',
                    'text': 'Worst Rank',
                    'type': 'number'
                }
            ],
            data.mappack.scores.map(d => [
                [d.rank, [d.name, d.login], Math.round((d.score + Number.EPSILON) * 100) / 100, [d.mapsFinished, d.ranks.length], d.worst.rank],
                ...d.ranks.map(r => [[r.rank, data.mappack.maps[r.mapIdx].lastRank], [data.mappack.maps[r.mapIdx].map, data.mappack.maps[r.mapIdx].mapId, 'map']])
            ])
        ))
    })
}

const routes = {
    ['']: () => {
        tools.graphql_callback(
            `{ records { rank player { login name } map { gameId name } time recordDate } }`,
            (data) => {
                document_updated_hook(tools.generate_table(
                    [
                        {
                            'name': 'rank',
                            'text': 'Rank',
                            'type': 'number'
                        },
                        {
                            'name': 'preview player',
                            'text': 'Player',
                            'type': 'player'
                        },
                        {
                            'name': 'map',
                            'text': 'Map',
                            'type': 'map'
                        },
                        {
                            'name': 'time',
                            'text': 'Time',
                            'type': 'duration'
                        },
                        {
                            'name': 'date',
                            'text': 'Date',
                            'type': 'date'
                        }
                    ],
                    data.records.map(d => [[d.rank, [d.player.name, d.player.login], [d.map.name, d.map.gameId], d.time, d.recordDate]])
                ))
            }
        )
    },

    player: (player_id) => {
        tools.graphql_callback(
            `{ player (login: "${tools.sanitize_graphql_string(player_id)}") { login name zonePath role records { rank map { gameId name } recordDate time }} }`,
            (data) => {
                document_updated_hook(tools.generate_table(
                    [
                        {
                            'name': 'rank',
                            'text': 'Rank',
                            'type': 'number'
                        },
                        {
                            'name': 'map',
                            'text': 'Map',
                            'type': 'map'
                        },
                        {
                            'name': 'time',
                            'text': 'Time',
                            'type': 'duration'
                        },
                        {
                            'name': 'date',
                            'text': 'Date',
                            'type': 'date'
                        }
                    ],
                    data.player.records.map(d => [[d.rank, [d.map.name, d.map.gameId], d.time, d.recordDate]])
                ))
                const zone_path = document.createElement('span')
                const role = document.createElement('span')
                zone_path.innerText = data.player.zonePath
                role.innerText = data.player.role[0] + data.player.role.slice(1).toLowerCase()
                tools.generate_title(data.player.name, [zone_path, role])
            }
        )
    },

    map: (map_id) => {
        tools.graphql_callback(
            `{ map (gameId: "${tools.sanitize_graphql_string(map_id)}") { gameId cpsNumber name player { name, login } records { rank recordDate time player { login name } } } }`,
            (data) => {
                document_updated_hook(tools.generate_table(
                    [
                        {
                            'name': 'rank',
                            'text': 'Rank',
                            'type': 'number'
                        },
                        {
                            'name': 'player',
                            'text': 'Player',
                            'type': 'player'
                        },
                        {
                            'name': 'time',
                            'text': 'Time',
                            'type': 'duration'
                        },
                        {
                            'name': 'date',
                            'text': 'Date',
                            'type': 'date'
                        }
                    ],
                    data.map.records.map(d => [[d.rank, [d.player.name, d.player.login], d.time, d.recordDate]])
                ))
                const mapper_span = document.createElement('span')
                const cps_number = document.createElement('span')
                const cpsNumber = data.map.cpsNumber;
                if (cpsNumber !== null) {
                    cps_number.innerText = `${cpsNumber} cp${cpsNumber > 1 ? 's' : ''}`
                }
                tools.set_content(mapper_span, [data.map.player.name, data.map.player.login], 'player')
                tools.generate_title(data.map.name, [cps_number, mapper_span, tools.get_mx_button(data.map.gameId)])
            }
        )
    },

    storm: () => {
        load_campaign('storm')
    },

    campaign: (campaign_id) => {
        load_campaign(campaign_id)
    },

    links: () => {
        const content = document.createElement('div')
        content.innerHTML = `
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
</ul>`
        tools.generate_content(content)
    },

    latestnews: () => {
        const content = document.createElement('div')
        content.innerHTML = `
<h1>Obstacle 2.0 Release</h1>
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Qd3UzQ93aGE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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
<p>MiLTanT</p>`
        tools.generate_content(content)
    },

    give_token: () => {
        const content = document.createElement('div')
        const loading = document.createElement('h1');
        loading.innerText = `Loading...`
        content.appendChild(loading)
        tools.generate_content(content)

        const params = ((entries) => {
            const result = {}
            for (const [key, value] of entries)
                result[key] = value
            return result
        })(new URLSearchParams(document.location.search).entries())

        fetch('https://obstacle.titlepack.io/api/player/give_token', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(params),
        }).then(async res => {
            window.history.replaceState({}, "", "/")
            if (res.ok) {
                loading.innerText = 'You are all set! You can close this tab now.'
            } else {
                loading.innerText = 'Something went wrong. Please contact the developers (i.e. @ahmadbky or @MiLTanT on discord).'
                const err = await res.json()
                    .catch(_ => {
                        return {
                            err: 105,
                            message: "Error response not JSON",
                        }
                    })

                if (err.type === 207) { // InvalidMPCode type
                    const detail = document.createElement('h2')
                    detail.innerText = `It looks like you logged in with a different account than the one used in game.
Try to log out from the ManiaPlanet page, then retry with the correct account.`
                    content.appendChild(detail)
                }

                const error_msg = document.createElement('pre')
                error_msg.style.backgroundColor = "#333c"
                error_msg.innerText = `State: ${params.state}\n${JSON.stringify(err)}`
                content.appendChild(error_msg)
            }
        })
    }
}

function navigate(path) {
    const current_page = path.split('/')

    try {
        routes[current_page[1]](...current_page.slice(2))
    } catch (TypeError) {
        if (current_page[1] === 'maps')
            tools.generate_404(`The /maps/ route is outdated, please try <a href="${path.replace('/maps', '/map')}">/map/</a> instead.`)
        else
            tools.generate_404()
    }

    for (const link of document.querySelectorAll(`nav ul a`))
        link.classList.remove('active')

    for (const link of document.querySelectorAll(`nav ul a[href="${path}"]`)) {
        link.classList.add('active')
    }

    document.querySelector('tbody')?.addEventListener('scroll', _ => {
        chkbox_menu.checked = false
    })
    document.querySelector('tbody')?.addEventListener('touchmove', _ => {
        chkbox_menu.checked = false
    })
}

function document_updated_hook(chunk) {
    for (const link of chunk.querySelectorAll('a:not([target="_blank"])')) {
        link.addEventListener('click', event => {
            const pathname = (new URL(link.href)).pathname
            const document_title = (link.title || link.innerText)
            const title = 'Obstacle Leaderboards' + (pathname === '/' ? '' : ' - ' + document_title)

            history.pushState({ pathname: pathname, title: title }, title, link.href)
            document.title = title
            navigate(pathname)
            event.preventDefault()
        })
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    navigate(document.location.pathname)
    history.replaceState({ pathname: document.location.pathname, title: document.title }, document.title)
    document_updated_hook(document.body)

    const chkbox_menu = document.querySelector('#menu_opened')
    chkbox_menu.checked = false
    document.querySelector('nav').addEventListener('click', event => {
        event.stopPropagation()
    })
    document.addEventListener('click', _ => {
        chkbox_menu.checked = false
    })

    window.addEventListener('popstate', event => {
        navigate(event.state.pathname)
    })
})
