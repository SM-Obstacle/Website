/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LatestRecordsPageQueryVariables = {};
export type LatestRecordsPageQueryResponse = {
    readonly records: ReadonlyArray<{
        readonly rank: number;
        readonly player: {
            readonly login: string;
            readonly name: string;
        };
        readonly map: {
            readonly name: string;
            readonly gameId: string;
        };
        readonly time: number;
        readonly respawnCount: number;
        readonly tryCount: number;
        readonly updatedAt: unknown;
        readonly flags: number;
    }>;
};
export type LatestRecordsPageQuery = {
    readonly response: LatestRecordsPageQueryResponse;
    readonly variables: LatestRecordsPageQueryVariables;
};



/*
query LatestRecordsPageQuery {
  records {
    rank
    player {
      login
      name
      id
    }
    map {
      name
      gameId
      id
    }
    time
    respawnCount
    tryCount
    updatedAt
    flags
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
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
  "name": "gameId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "time",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "respawnCount",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tryCount",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LatestRecordsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RankedRecord",
        "kind": "LinkedField",
        "name": "records",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Player",
            "kind": "LinkedField",
            "name": "player",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Map",
            "kind": "LinkedField",
            "name": "map",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LatestRecordsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RankedRecord",
        "kind": "LinkedField",
        "name": "records",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Player",
            "kind": "LinkedField",
            "name": "player",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Map",
            "kind": "LinkedField",
            "name": "map",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a4acc601e055443f2cf698911d4f0c0d",
    "id": null,
    "metadata": {},
    "name": "LatestRecordsPageQuery",
    "operationKind": "query",
    "text": "query LatestRecordsPageQuery {\n  records {\n    rank\n    player {\n      login\n      name\n      id\n    }\n    map {\n      name\n      gameId\n      id\n    }\n    time\n    respawnCount\n    tryCount\n    updatedAt\n    flags\n  }\n}\n"
  }
};
})();
(node as any).hash = '8ad9d0a14543fadb594b1ae8dce9a701';
export default node;
