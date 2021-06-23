import { usePreloadedQuery } from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import React from 'react';

/**
 * The root component for the home route.
 */
export default function HomeRoot(props: any) {
  // Defines *what* data the component needs via a query. The responsibility of
  // actually fetching this data belongs to the route definition: it calls
  // preloadQuery() with the query and variables, and the result is passed
  // on props.prepared.issuesQuery - see src/routes.js
  const data : any = usePreloadedQuery(
    graphql`
      query HomeRootTestQuery {
        node(id: "v0:Player:2") {
          id
        }
      }
    `,
    props.prepared.issuesQuery,
  );
  const { node } = data;

  return <p>{ node?.id }</p>;
}