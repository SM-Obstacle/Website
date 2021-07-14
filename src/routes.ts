import JSResource from './JSResource';
import { loadQuery } from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';

const routes = [
    {
        component: JSResource('Root', () => import('./Root')),
        prepare: params => {
            return {};
        },
        routes: [
            {
                path: '/',
                exact: true,
                /**
                 * A lazy reference to the component for the home route. Note that we intentionally don't
                 * use React.lazy here: that would start loading the component only when it's rendered.
                 * By using a custom alternative we can start loading the code instantly. This is
                 * especially useful with nested routes, where React.lazy would not fetch the
                 * component until its parents code/data had loaded.
                 */
                component: JSResource('LatestRecordsPage', () => import('./LatestRecordsPage')),
                /**
                 * A function to prepare the data for the `component` in parallel with loading
                 * that component code. The actual data to fetch is defined by the component
                 * itself - here we just reference a description of the data - the generated
                 * query.
                 */
                prepare: params => {
                    const LatestRecordsQuery = require('./__generated__/LatestRecordsPageQuery.graphql');
                    return {
                        latestRecordsQuery: loadQuery(
                            RelayEnvironment,
                            LatestRecordsQuery,
                            {},
                            // The fetchPolicy allows us to specify whether to render from cached
                            // data if possible (store-or-network) or only fetch from network
                            // (network-only).
                            { fetchPolicy: 'store-or-network' },
                        ),
                    };
                },
            },
            {
                path: '/player/:login',
                component: JSResource('PlayerPageRoot', () => import('./PlayerPageRoot')),
                prepare: params => {
                    const PlayerPageQuery = require('./__generated__/PlayerPageRootQuery.graphql');
                    return {
                        playerQuery: loadQuery(
                            RelayEnvironment,
                            PlayerPageQuery,
                            {
                                login: params.login,
                            },
                            { fetchPolicy: 'store-or-network' },
                        ),
                    };
                },
            },
            {
                path: '/map/:gameId',
                component: JSResource('MapPageRoot', () => import('./MapPageRoot')),
                prepare: params => {
                    const MapPageQuery = require('./__generated__/MapPageRootQuery.graphql');
                    return {
                        mapQuery: loadQuery(
                            RelayEnvironment,
                            MapPageQuery,
                            {
                                gameId: params.gameId,
                            },
                            { fetchPolicy: 'store-or-network' },
                        ),
                    };
                },
            },
        ],
    },
];

export default routes;
