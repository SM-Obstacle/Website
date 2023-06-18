import * as tools from './toolbox.js'

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
                    cps_number.innerText = `${cpsNumber} cp${cpsNumber > 1 ? 's':''}`
                }
                tools.set_content(mapper_span, [data.map.player.name, data.map.player.login], 'player')
                tools.generate_title(data.map.name, [cps_number, mapper_span, tools.get_mx_button(data.map.gameId)])
            }
        )
    },
    
    storm: () => {
        tools.get_campaign_times_callback([
            'AJUMu8dNAI9fXkHaaodLRQWb0i5',
            'VTDeDSyoLphHbg4xpKgJPjCULu2',
            'm94pYMVmW7fdnVdpBbK8ns7j__d',
            'wVdm82BaI4zrD7PUT9GgLsElCl6',
            'wi5t9nsWrFsUdW9TVrpNkOHZVEh',
            'p4ZBFCtaFT_LQscpCi3J0IZqiG2',
            'Wg_ueBq7ovovY1z2PGJsguwNf_9',
            'IyyNms4JhN1BCvoltgli4tgllL6',
            'LPOsdLqT5NKvefQT6y_vzZXsf23',
            'bveb4HoqLZSW1nsmyGRYe1a6I4c'
        ], data => {
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
                        'text': 'Map Finiched',
                        'type': 'fraction'
                    },
                    {
                        'name': 'worst_rank',
                        'text': 'Worst Rank',
                        'type': 'number'
                    }
                ],
                data.map(d => [
                    [d.rank, [d.name, d.login], d.score, [d.maps_finished, d.ranks.length], d.worst.rank],
                    ...d.ranks.map(r => [[r.rank, r.last_rank], [r.map, r.map_id, 'map']])
                ])
            ))
        })
    },

    edit: () => {
        const content = document.createElement('div')
        content.innerHTML = '<h1>L\'obstacle c\'est génial!</h1><p>pew pew et puis zoooom</p>'
        content.contentEditable = true
        tools.generate_content(content)
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
        <a href="https://discord.gg/R4ZS23aS9c" target="_blank">Obstacle Discord</a>: Active community of players, mappers, and people gathered around Obstacle
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

    give_token: () => {
        const content = document.createElement('div')
        content.innerHTML = `<h1 class="status-msg">Loading...</h1>`
        tools.generate_content(content)

        const loading = document.querySelector('h1.status-msg');

        const params = document.location.hash.slice(1).split('&').reduce((acc, cur) => {
            const [key, value] = cur.split('=');
            acc[key] = value;
            return acc;
        }, {});

        fetch('http://192.168.1.30:3001/player/give_token', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        }).then(async res => {
            if (res.ok) {
                loading.innerText = 'You are all set! You can close this tab now.'
                const response = await res.json();
                localStorage.setItem('__obs_web_token_login', response.login)
                localStorage.setItem('__obs_web_token_value', response.token)
            } else {
                loading.innerText = 'Something went wrong. Please contact the developers (e.g. @ahmadbky or @MiLTanT on discord).'
                console.log(await res.text())
            }
        })
    }
}

function navigate (path) {
    const current_page = path.split('/')
    
    try {
        routes[current_page[1]](...current_page.slice(2))
    } catch (TypeError) {
        if (current_page[1] === 'maps')
            tools.generate_404(`The /maps/ route is outdated, please try <a href="/map/${path.replace('/maps', '/map')}">/map/</a> instead.`)
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

function document_updated_hook (chunk) {
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
