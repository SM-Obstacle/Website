import React from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import routes from './routes';
import RoutingContext from './routing/RoutingContext';
import createRouter from './routing/createRouter';
import RouterRenderer from './routing/RouteRenderer';

import reportWebVitals from './reportWebVitals';

// Uses the custom router setup to define a router instanace that we can pass through context
const router: { cleanup: any, context: any } = createRouter(routes);

ReactDOM.render(
    <RelayEnvironmentProvider environment={RelayEnvironment}>
        <RoutingContext.Provider value={router.context}>
            {/* Render the active route */}
            <RouterRenderer />
        </RoutingContext.Provider>
    </RelayEnvironmentProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
