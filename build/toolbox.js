export const generate_content = (elements) => {
    const dom_parent = document.querySelector('main')
    dom_parent.innerHTML = ''

    if (Array.isArray(elements))
        elements.forEach(e => dom_parent.appendChild(e))
    else
        dom_parent.appendChild(elements)

    return dom_parent
}

export const generate_error = (explanation, error) => {
    document.title += ' - Error ' + error

    const dom_h1 = document.createElement('h1')
    dom_h1.innerText = 'Error ' + error

    const dom_p = document.createElement('p')

    if (explanation != null) {
        dom_p.innerText = explanation
    }
    generate_content([dom_h1, dom_p])
}

export const generate_404 = (explanation) => {
    return generate_error(explanation, '404 - Not Found')
}

export const generate_title = (title, toolbar = []) => {
    const toolbar_wrapper = document.createElement('div')
    toolbar_wrapper.id = 'toolbar_wrapper'

    const dom_h1_404 = document.createElement('h1')
    dom_h1_404.innerHTML = window.MPStyle.Parser.toHTML(title, { disableLinks: true, darkBackground: true })
    toolbar_wrapper.appendChild(dom_h1_404)

    toolbar.forEach(e => toolbar_wrapper.appendChild(e))

    const dom_parent = document.querySelector('main')
    dom_parent.insertBefore(toolbar_wrapper, dom_parent.firstChild)
}

export const generate_table = (columns, content) => {
    const dom_table = document.createElement('table')
    const dom_thead = document.createElement('thead')
    const dom_tbody = document.createElement('tbody')

    dom_table.appendChild(dom_thead)
    dom_table.appendChild(dom_tbody)

    const dom_row = document.createElement('tr')
    columns.forEach(element => {
        const cell = document.createElement('th')
        cell.classList.add(...element.name.split(' '))
        const words = element.text.split(' ')

        words.forEach((word, i) => {
            const span = document.createElement('span')
            span.innerText = word + (i === words.length - 1 ? '' : ' ')
            cell.appendChild(span)
        })

        dom_row.appendChild(cell)
    })
    dom_thead.appendChild(dom_row)

    content.forEach((row, main_row_i) => {
        row.forEach((sub_row, sub_row_i) => {
            const dom_row = document.createElement('tr')
            if (sub_row_i === 0) {
                dom_row.addEventListener('click', debounce(e => {
                    const stay_folded = dom_row.classList.contains('unfolded') || window.getSelection().type === 'Range'
                    const main_rows = document.querySelectorAll('tr:not(.additional)')
                        ;[...main_rows].forEach(r => r.classList.remove('unfolded'))
                    if (!stay_folded)
                        dom_row.classList.add('unfolded')
                }, 100))

                if (row.length === 1)
                    dom_row.tabIndex = 0

                if (main_row_i % 2 === 0) {
                    dom_row.classList.add('light')
                } else {
                    dom_row.classList.add('dark')
                }
            } else {
                dom_row.classList.add('additional')
            }

            sub_row.forEach((element, i) => {
                const cell = document.createElement('td')
                cell.classList.add(...columns[i].name.split(' '))
                set_content(cell, element, columns[i].type)

                dom_row.appendChild(cell)
            })
            dom_tbody.appendChild(dom_row)
        })
    })

    return generate_content(dom_table)
}

export const get_mx_button = uid => {
    const button = document.createElement('input')
    button.type = 'image'
    button.src = '/img/planet_mx_logo.png'

    button.addEventListener('click', e => {
        if (e.target.dataset.exchange_url !== undefined) {
            window.open(e.target.dataset.exchange_url, '_blank')
        } else {
            fetch('https://sm.mania.exchange/api/maps/get_map_info/multi/' + uid)
                .then(res => res.json())
                .then(map => {
                    if (map.length > 0) {
                        e.target.dataset.exchange_url = 'https://sm.mania-exchange.com/maps/' + map[0].TrackID
                        window.open(e.target.dataset.exchange_url, '_blank')
                    } else {
                        e.target.disabled = true
                        alert('this map does not seem to be uploaded to sm.mania.exchange')
                    }
                })
        }
    })

    return button
}

export const get_mx_mappack = async uid => {
    try {
        const response = await fetch('https://sm.mania.exchange/api/mappack/get_mappack_tracks/' + uid)
        const maps = await response.json()

        if (maps.length > 0) {
            return maps.map(m => m.TrackUID)
        } else {
            throw new Error('An error occurred fetching the maps on mania.exchange.')
        }
    } catch (error) {
        alert(error.message)
        throw error
    }
}

export const graphql_callback = (query, callback, variables = {}) => {
    fetch('https://obstacle.titlepack.io/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            variables: variables,
            query: query
        })
    })
        .then(r => r.json())
        .then(json => callback(json.data))
        .catch(err => generate_error(err.message, '- ' + err.name))
}

export const get_campaign_times_callback = (playlist, callback) => {
    const str = `query {
        ${playlist.map((id, i) =>
        `map${i}: map(gameId: "${sanitize_graphql_string(id)}") { gameId, name, records { rank, player { id, login, name } } }`
    ).join('\n')}
    }`

    graphql_callback(
        str, data => {
            const players = []

            // Get all the unique players of each map
            for (const map_id in data) {
                for (const record of data[map_id].records) {
                    const idx = players.findIndex((p) => p.login === record.player.login)
                    if (idx === -1) {
                        players.push({
                            login: record.player.login,
                            name: record.player.name,
                            ranks: [],
                            score: 0,
                            maps_finished: 0,
                            rank: 0
                        })
                    }
                }
            }

            let map_number = 1
            for (const map_id in data) {
                const last_rank = data[map_id].records.length > 0 ? data[map_id].records[data[map_id].records.length - 1].rank : 99

                for (const record of data[map_id].records) {
                    let idx = players.findIndex((p) => p.login === record.player.login)
                    players[idx].ranks.push({ rank: record.rank, last_rank: last_rank, map: data[map_id].name, map_id: data[map_id].gameId })
                    ++players[idx].maps_finished
                }

                for (const player in players) {
                    if (players[player].ranks.length < map_number) {
                        players[player].ranks.push({ rank: last_rank + 1, last_rank: last_rank, map: data[map_id].name, map_id: data[map_id].gameId })
                    }
                }
                ++map_number
            }
            --map_number

            for (const player in players) {
                if (players[player].ranks.length < map_number - 1) {
                    console.error(player, players[player])
                }

                const ranks = players[player].ranks.sort((a, b) => (a.rank / a.last_rank - b.rank / b.last_rank) + (a.rank - b.rank) / 1000)
                players[player].worst = ranks.reduce((a, b) => a.rank > b.rank ? a : b)
                players[player].score = ranks.reduce((acc, rank) => acc + rank.rank, 0) / ranks.length
            }

            players.sort((a, b) => {
                if (a.maps_finished !== b.maps_finished) {
                    return b.maps_finished - a.maps_finished
                } else {
                    return a.score - b.score
                }
            })

            let rank = 0
            let old_score = 0
            let old_finishes = 0
            let old_rank = 0
            for (const player of players) {
                rank += 1

                player.rank = old_score === player.score && old_finishes === player.map_finishes ? old_rank : rank

                old_score = player.score
                old_finishes = player.map_finishes
                old_rank = player.rank
            }

            callback(players);
        }
    )
}

export const sanitize_graphql_string = str => {
    return str.replace('"', '\\"')
        .replace('\n', '\\n')
        .replace('\\', '\\\\')
}

export const format_time = time => {
    const ms = Math.floor(time % 1000) / 10
    let sec = Math.floor(time / 1000)
    let min = Math.floor(sec / 60)
    let hor = Math.floor(min / 60)
    sec = sec % 60
    min = min % 60

    const str = hor.toString().padStart(2, '0')
        + ':'
        + min.toString().padStart(2, '0')
        + ':'
        + sec.toString().padStart(2, '0')
        + '.'
        + ms.toString().padStart(2, '0')

    return str
}

export const trim_mpformating = formated => {
    return formated.replace(/\$([lhp](\[([^\]]*\])?)?|[ioswnzmg<>]|[0123456789abcdef]{1,3})/gi, '');
}

export const set_content = (node, content, type = 'string') => {
    switch (type) {
        case 'duration':
            node.innerText = format_time(content)
            break
        case 'date':
            const date = new Date(content)
            node.innerText = date.toLocaleDateString()
            node.title = date.toLocaleString()
            break
        case 'player':
        case 'map':
            const link = document.createElement('a')
            const unformated_content = trim_mpformating(content[0])

            if (/^\s*$/.test(unformated_content)) {
                link.innerHTML = content[1]
                link.title = content[1]
            } else {
                link.innerHTML = window.MPStyle.Parser.toHTML(content[0], { disableLinks: true, darkBackground: true })
                link.title = unformated_content
            }

            link.href = `/${content[2] ?? type}/${content[1]}`
            link.classList.add('mpstring')
            node.appendChild(link)
            break
        case 'fraction':
            if (content.length === 2) {
                const numerator = document.createElement('span')
                const denominator = document.createElement('small')
                numerator.innerText = content[0]
                denominator.innerText = `/${content[1]}`
                numerator.appendChild(denominator)
                node.appendChild(numerator)
                break
            }
        default:
            node.innerText = content
            break
    }
}


/** From underscore.js */
export const debounce = (func, wait, immediate) => {
    var timeout, previous, args, result, context;

    const later = function () {
        const passed = Date.now() - previous;
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            if (!timeout) args = context = null;
        }
    };
    const restArguments = function (func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function () {
            const length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length);
            var index = 0;
            for (; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
                case 2: return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++) {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    }

    const debounced = restArguments(function (_args) {
        context = this;
        args = _args;
        previous = Date.now();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    });

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}
