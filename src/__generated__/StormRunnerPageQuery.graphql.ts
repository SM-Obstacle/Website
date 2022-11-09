/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type StormRunnerPageQueryVariables = {};
export type StormRunnerPageQueryResponse = {
    readonly map0: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map1: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map2: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map3: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map4: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map5: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map6: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map7: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map8: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
    readonly map9: {
        readonly gameId: string;
        readonly name: string;
        readonly records: ReadonlyArray<{
            readonly rank: number;
            readonly player: {
                readonly id: string;
                readonly login: string;
                readonly name: string;
            };
        }>;
    };
};
export type StormRunnerPageQuery = {
    readonly response: StormRunnerPageQueryResponse;
    readonly variables: StormRunnerPageQueryVariables;
};



/*
query StormRunnerPageQuery {
  map0: map(gameId: "hUcGBFdXJTA03VFZnLrrpoOEGgc") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map1: map(gameId: "8qYEIn3yGy4icr6q2ia8naZ6Xce") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map2: map(gameId: "3xMI2Myl3fIumVwGdv8ye7Q3tf3") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map3: map(gameId: "wVdm82BaI4zrD7PUT9GgLsElCl6") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map4: map(gameId: "Oz_nFUwrWKYxqqh7wqwuZ87B78a") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map5: map(gameId: "NRb9oc0GXy7v3Np7JKu8e7JiKcl") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map6: map(gameId: "Wg_ueBq7ovovY1z2PGJsguwNf_9") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map7: map(gameId: "IyyNms4JhN1BCvoltgli4tgllL6") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map8: map(gameId: "bveb4HoqLZSW1nsmyGRYe1a6I4c") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
  map9: map(gameId: "Zgx3JW9sICQaw_ZTwa_akbSb597") {
    gameId
    name
    records {
      rank
      player {
        id
        login
        name
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "hUcGBFdXJTA03VFZnLrrpoOEGgc"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "gameId",
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "RankedRecord",
  "kind": "LinkedField",
  "name": "records",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rank",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Player",
      "kind": "LinkedField",
      "name": "player",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "login",
          "storageKey": null
        },
        (v2/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v4/*: any*/)
],
v6 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "8qYEIn3yGy4icr6q2ia8naZ6Xce"
  }
],
v7 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "3xMI2Myl3fIumVwGdv8ye7Q3tf3"
  }
],
v8 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "wVdm82BaI4zrD7PUT9GgLsElCl6"
  }
],
v9 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "Oz_nFUwrWKYxqqh7wqwuZ87B78a"
  }
],
v10 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "NRb9oc0GXy7v3Np7JKu8e7JiKcl"
  }
],
v11 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "Wg_ueBq7ovovY1z2PGJsguwNf_9"
  }
],
v12 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "IyyNms4JhN1BCvoltgli4tgllL6"
  }
],
v13 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "bveb4HoqLZSW1nsmyGRYe1a6I4c"
  }
],
v14 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "Zgx3JW9sICQaw_ZTwa_akbSb597"
  }
],
v15 = [
  (v1/*: any*/),
  (v2/*: any*/),
  (v4/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "StormRunnerPageQuery",
    "selections": [
      {
        "alias": "map0",
        "args": (v0/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"hUcGBFdXJTA03VFZnLrrpoOEGgc\")"
      },
      {
        "alias": "map1",
        "args": (v6/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"8qYEIn3yGy4icr6q2ia8naZ6Xce\")"
      },
      {
        "alias": "map2",
        "args": (v7/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"3xMI2Myl3fIumVwGdv8ye7Q3tf3\")"
      },
      {
        "alias": "map3",
        "args": (v8/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"wVdm82BaI4zrD7PUT9GgLsElCl6\")"
      },
      {
        "alias": "map4",
        "args": (v9/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"Oz_nFUwrWKYxqqh7wqwuZ87B78a\")"
      },
      {
        "alias": "map5",
        "args": (v10/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"NRb9oc0GXy7v3Np7JKu8e7JiKcl\")"
      },
      {
        "alias": "map6",
        "args": (v11/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"Wg_ueBq7ovovY1z2PGJsguwNf_9\")"
      },
      {
        "alias": "map7",
        "args": (v12/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"IyyNms4JhN1BCvoltgli4tgllL6\")"
      },
      {
        "alias": "map8",
        "args": (v13/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"bveb4HoqLZSW1nsmyGRYe1a6I4c\")"
      },
      {
        "alias": "map9",
        "args": (v14/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "map(gameId:\"Zgx3JW9sICQaw_ZTwa_akbSb597\")"
      }
    ],
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "StormRunnerPageQuery",
    "selections": [
      {
        "alias": "map0",
        "args": (v0/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"hUcGBFdXJTA03VFZnLrrpoOEGgc\")"
      },
      {
        "alias": "map1",
        "args": (v6/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"8qYEIn3yGy4icr6q2ia8naZ6Xce\")"
      },
      {
        "alias": "map2",
        "args": (v7/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"3xMI2Myl3fIumVwGdv8ye7Q3tf3\")"
      },
      {
        "alias": "map3",
        "args": (v8/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"wVdm82BaI4zrD7PUT9GgLsElCl6\")"
      },
      {
        "alias": "map4",
        "args": (v9/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"Oz_nFUwrWKYxqqh7wqwuZ87B78a\")"
      },
      {
        "alias": "map5",
        "args": (v10/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"NRb9oc0GXy7v3Np7JKu8e7JiKcl\")"
      },
      {
        "alias": "map6",
        "args": (v11/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"Wg_ueBq7ovovY1z2PGJsguwNf_9\")"
      },
      {
        "alias": "map7",
        "args": (v12/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"IyyNms4JhN1BCvoltgli4tgllL6\")"
      },
      {
        "alias": "map8",
        "args": (v13/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"bveb4HoqLZSW1nsmyGRYe1a6I4c\")"
      },
      {
        "alias": "map9",
        "args": (v14/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v15/*: any*/),
        "storageKey": "map(gameId:\"Zgx3JW9sICQaw_ZTwa_akbSb597\")"
      }
    ]
  },
  "params": {
    "cacheID": "fc958e74ae975efa434a870046b62398",
    "id": null,
    "metadata": {},
    "name": "StormRunnerPageQuery",
    "operationKind": "query",
    "text": "query StormRunnerPageQuery {\n  map0: map(gameId: \"hUcGBFdXJTA03VFZnLrrpoOEGgc\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map1: map(gameId: \"8qYEIn3yGy4icr6q2ia8naZ6Xce\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map2: map(gameId: \"3xMI2Myl3fIumVwGdv8ye7Q3tf3\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map3: map(gameId: \"wVdm82BaI4zrD7PUT9GgLsElCl6\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map4: map(gameId: \"Oz_nFUwrWKYxqqh7wqwuZ87B78a\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map5: map(gameId: \"NRb9oc0GXy7v3Np7JKu8e7JiKcl\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map6: map(gameId: \"Wg_ueBq7ovovY1z2PGJsguwNf_9\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map7: map(gameId: \"IyyNms4JhN1BCvoltgli4tgllL6\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map8: map(gameId: \"bveb4HoqLZSW1nsmyGRYe1a6I4c\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map9: map(gameId: \"Zgx3JW9sICQaw_ZTwa_akbSb597\") {\n    gameId\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '3ad5aec7fe3a1722927675225e69147f';
export default node;
