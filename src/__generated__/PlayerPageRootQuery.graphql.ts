/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type PlayerPageRootQueryVariables = {
    login: string;
};
export type PlayerPageRootQueryResponse = {
    readonly player: {
        readonly login: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly time: number;
            readonly map: {
                readonly gameId: string;
                readonly name: string;
            };
            readonly respawnCount: number;
            readonly tryCount: number;
            readonly flags: number;
        }>;
    };
};
export type PlayerPageRootQuery = {
    readonly response: PlayerPageRootQueryResponse;
    readonly variables: PlayerPageRootQueryVariables;
};



/*
query PlayerPageRootQuery(
  $login: String!
) {
  player(login: $login) {
    login
    name
    records {
      rank
      time
      map {
        gameId
        name
        id
      }
      respawnCount
      tryCount
      flags
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "login"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "login"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "time",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "gameId",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "respawnCount",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tryCount",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "flags",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PlayerPageRootQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Player",
        "kind": "LinkedField",
        "name": "player",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "RankedRecord",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Map",
                "kind": "LinkedField",
                "name": "map",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PlayerPageRootQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Player",
        "kind": "LinkedField",
        "name": "player",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "RankedRecord",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Map",
                "kind": "LinkedField",
                "name": "map",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v3/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5729ed3fa9b39cf105340c1ae6b944f3",
    "id": null,
    "metadata": {},
    "name": "PlayerPageRootQuery",
    "operationKind": "query",
    "text": "query PlayerPageRootQuery(\n  $login: String!\n) {\n  player(login: $login) {\n    login\n    name\n    records {\n      rank\n      time\n      map {\n        gameId\n        name\n        id\n      }\n      respawnCount\n      tryCount\n      flags\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '55b69f6f3c644c659588d73981e73f51';
export default node;
