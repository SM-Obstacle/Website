import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { typePolicies } from "@/lib/apollo-cache";
import { getGraphqlApiUrl } from "@/lib/utils";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: new HttpLink({
      uri: getGraphqlApiUrl(),
    }),
  });
});
