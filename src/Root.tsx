import graphql from 'babel-plugin-relay/macro';
import React from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';

import * as RootQuery from './__generated__/RootQuery.graphql'

const { Suspense } = React;

export default function Root(props) {
  // Defines *what* data the component needs via a query. The responsibility of
  // actually fetching this data belongs to the route definition: it calls
  // preloadQuery() with the query and variables, and the result is passed
  // on props.prepared.issuesQuery - see src/routes.js
  const data = usePreloadedQuery<RootQuery.RootQuery>(
    graphql`
      query RootQuery {
        node(id: "v0:Player:1") {
          id
        }
      }
    `,
    props.prepared.rootQuery,
  );
  const { node } = data;

  return (
    <div className="root">
      <header className="header">
        { node?.id }
      </header>
      <section className="content">
        {/* Wrap the child in a Suspense boundary to allow rendering the
        layout even if the main content isn't ready */}
        <Suspense fallback={'Loading...'}>{props.children}</Suspense>
      </section>
    </div>
  );
}