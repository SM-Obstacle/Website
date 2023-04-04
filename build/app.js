import * as tools from './toolbox.js'

const routes = {
    ['']: () => {
        tools.graphql_callback(
            `{ records { rank player { login name } map { gameId name } time updatedAt } }`,
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
                    data.records.map(d => [[d.rank, [d.player.name, d.player.login], [d.map.name, d.map.gameId], d.time, d.updatedAt]])
                ))
            }
        )
    },

    player: (player_id) => {
        tools.graphql_callback(
            `{ player (login: "${tools.sanitize_graphql_string(player_id)}") { login name records { rank map { gameId name } updatedAt time }} }`,
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
                    data.player.records.map(d => [[d.rank, [d.map.name, d.map.gameId], d.time, d.updatedAt]])
                ))
                tools.generate_title(data.player.name)
            }
        )
    },
    
    map: (map_id) => {
        tools.graphql_callback(
            `{ map (gameId: "${tools.sanitize_graphql_string(map_id)}") { gameId name records { rank updatedAt time player { login name } } } }`,
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
                    data.map.records.map(d => [[d.rank, [d.player.name, d.player.login], d.time, d.updatedAt]])
                ))
                tools.generate_title(data.map.name, [tools.get_mx_button(data.map.gameId)])
            }
        )
    },
    
    storm: () => {
        tools.get_campaign_times_callback([
            'VPrcyCFTEU9jBzTbZmQ8KZPdUb0',
            'rE6Wi7K8AJTMQUFdD2JU4KyyDR0',
            '5EuNcWHLBfrbeEuu70t9X0byNh0',
            'IE_Ik9kHsxlwsl5Meub2T10MoVh',
            '2Dbt3c0NsC_eUmQmEc_1n3lpfih'
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
<h1>Ressources</h1>
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
        <a href="https://aurel.obstacle.ovh/wordpress/" target="_blank">Aurel's blog</a>: Tutorials and ressources about Obstacle
    </li>
</ul>`
        tools.generate_content(content)
    }
}

function navigate (path) {
    const current_page = path.split('/')
    console.log(current_page)
    try {
        routes[current_page[1]](...current_page.slice(2))
    } catch (TypeError) {
        if (current_page[1] === 'maps')
            tools.generate_404('The /maps/ route is outdated, please try /map/ instead.')
        else
            tools.generate_404()
    }

    for (const link of document.querySelectorAll(`nav ul a`))
        link.classList.remove('active')
    
    for (const link of document.querySelectorAll(`nav ul a[href="${path}"]`)) {
        link.classList.add('active')
        console.log(link)
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