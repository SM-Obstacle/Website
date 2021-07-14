/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type MapPageRootQueryVariables = {
    gameId: string;
};
export type MapPageRootQueryResponse = {
    readonly map: {
        readonly name: string;
        readonly player: {
            readonly name: string;
        };
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly login: string;
                readonly name: string;
            };
            readonly time: number;
            readonly respawnCount: number;
            readonly tryCount: number;
            readonly flags: number;
        }>;
    };
};
export type MapPageRootQuery = {
    readonly response: MapPageRootQueryResponse;
    readonly variables: MapPageRootQueryVariables;
};



/*
query MapPageRootQuery(
  $gameId: String!
) {
  map(gameId: $gameId) {
    name
    player {
      name
      id
    }
    records {
      rank
      player {
        login
        name
        id
      }
      time
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
    "name": "gameId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "gameId",
    "variableName": "gameId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
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
  "name": "respawnCount",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tryCount",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "flags",
  "storageKey": null
},
v9 = {
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
    "name": "MapPageRootQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Player",
            "kind": "LinkedField",
            "name": "player",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "RankedRecord",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Player",
                "kind": "LinkedField",
                "name": "player",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
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
    "name": "MapPageRootQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Player",
            "kind": "LinkedField",
            "name": "player",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "RankedRecord",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Player",
                "kind": "LinkedField",
                "name": "player",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1f2d49f1c97ff9f88ffc9c07a27bcf3e",
    "id": null,
    "metadata": {},
    "name": "MapPageRootQuery",
    "operationKind": "query",
    "text": "query MapPageRootQuery(\n  $gameId: String!\n) {\n  map(gameId: $gameId) {\n    name\n    player {\n      name\n      id\n    }\n    records {\n      rank\n      player {\n        login\n        name\n        id\n      }\n      time\n      respawnCount\n      tryCount\n      flags\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'f2609340b5066a9b7abdcc74ec613657';
export default node;
