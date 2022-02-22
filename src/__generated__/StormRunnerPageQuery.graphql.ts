/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type StormRunnerPageQueryVariables = {};
export type StormRunnerPageQueryResponse = {
    readonly map0: {
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
  map0: map(gameId: "DmxfMk0gebxmrBzC8GniCvpzocf") {
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
  map1: map(gameId: "ViILpz0CS0i87hUTjcZbDXOn_1c") {
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
  map2: map(gameId: "BbhSJcUjjJ_0BPsoPWpg6O8IUQk") {
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
  map3: map(gameId: "AX4ksxLixAo15Nwnnmahr7Cc3u7") {
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
  map4: map(gameId: "FP9_OxlDlTfOAtJ802IivbIT1B4") {
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
  map5: map(gameId: "kiL06IMGUEe0syqYfIH0sWC2w_b") {
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
  map6: map(gameId: "620n4zRgE8APuKiDrWepWIxdC49") {
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
  map7: map(gameId: "07EcTsJILmBI_2aeI4aG3PcL5_7") {
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
  map8: map(gameId: "42CFscE_gb68PNzDwgVWKQomYe5") {
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
    "value": "DmxfMk0gebxmrBzC8GniCvpzocf"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
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
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "login",
          "storageKey": null
        },
        (v1/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = [
  (v1/*: any*/),
  (v3/*: any*/)
],
v5 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "ViILpz0CS0i87hUTjcZbDXOn_1c"
  }
],
v6 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "BbhSJcUjjJ_0BPsoPWpg6O8IUQk"
  }
],
v7 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "AX4ksxLixAo15Nwnnmahr7Cc3u7"
  }
],
v8 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "FP9_OxlDlTfOAtJ802IivbIT1B4"
  }
],
v9 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "kiL06IMGUEe0syqYfIH0sWC2w_b"
  }
],
v10 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "620n4zRgE8APuKiDrWepWIxdC49"
  }
],
v11 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "07EcTsJILmBI_2aeI4aG3PcL5_7"
  }
],
v12 = [
  {
    "kind": "Literal",
    "name": "gameId",
    "value": "42CFscE_gb68PNzDwgVWKQomYe5"
  }
],
v13 = [
  (v1/*: any*/),
  (v3/*: any*/),
  (v2/*: any*/)
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
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"DmxfMk0gebxmrBzC8GniCvpzocf\")"
      },
      {
        "alias": "map1",
        "args": (v5/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"ViILpz0CS0i87hUTjcZbDXOn_1c\")"
      },
      {
        "alias": "map2",
        "args": (v6/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"BbhSJcUjjJ_0BPsoPWpg6O8IUQk\")"
      },
      {
        "alias": "map3",
        "args": (v7/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"AX4ksxLixAo15Nwnnmahr7Cc3u7\")"
      },
      {
        "alias": "map4",
        "args": (v8/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"FP9_OxlDlTfOAtJ802IivbIT1B4\")"
      },
      {
        "alias": "map5",
        "args": (v9/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"kiL06IMGUEe0syqYfIH0sWC2w_b\")"
      },
      {
        "alias": "map6",
        "args": (v10/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"620n4zRgE8APuKiDrWepWIxdC49\")"
      },
      {
        "alias": "map7",
        "args": (v11/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"07EcTsJILmBI_2aeI4aG3PcL5_7\")"
      },
      {
        "alias": "map8",
        "args": (v12/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": "map(gameId:\"42CFscE_gb68PNzDwgVWKQomYe5\")"
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
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"DmxfMk0gebxmrBzC8GniCvpzocf\")"
      },
      {
        "alias": "map1",
        "args": (v5/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"ViILpz0CS0i87hUTjcZbDXOn_1c\")"
      },
      {
        "alias": "map2",
        "args": (v6/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"BbhSJcUjjJ_0BPsoPWpg6O8IUQk\")"
      },
      {
        "alias": "map3",
        "args": (v7/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"AX4ksxLixAo15Nwnnmahr7Cc3u7\")"
      },
      {
        "alias": "map4",
        "args": (v8/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"FP9_OxlDlTfOAtJ802IivbIT1B4\")"
      },
      {
        "alias": "map5",
        "args": (v9/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"kiL06IMGUEe0syqYfIH0sWC2w_b\")"
      },
      {
        "alias": "map6",
        "args": (v10/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"620n4zRgE8APuKiDrWepWIxdC49\")"
      },
      {
        "alias": "map7",
        "args": (v11/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"07EcTsJILmBI_2aeI4aG3PcL5_7\")"
      },
      {
        "alias": "map8",
        "args": (v12/*: any*/),
        "concreteType": "Map",
        "kind": "LinkedField",
        "name": "map",
        "plural": false,
        "selections": (v13/*: any*/),
        "storageKey": "map(gameId:\"42CFscE_gb68PNzDwgVWKQomYe5\")"
      }
    ]
  },
  "params": {
    "cacheID": "6c7e69afb5a2bd55ae811c1cb25f5036",
    "id": null,
    "metadata": {},
    "name": "StormRunnerPageQuery",
    "operationKind": "query",
    "text": "query StormRunnerPageQuery {\n  map0: map(gameId: \"DmxfMk0gebxmrBzC8GniCvpzocf\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map1: map(gameId: \"ViILpz0CS0i87hUTjcZbDXOn_1c\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map2: map(gameId: \"BbhSJcUjjJ_0BPsoPWpg6O8IUQk\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map3: map(gameId: \"AX4ksxLixAo15Nwnnmahr7Cc3u7\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map4: map(gameId: \"FP9_OxlDlTfOAtJ802IivbIT1B4\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map5: map(gameId: \"kiL06IMGUEe0syqYfIH0sWC2w_b\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map6: map(gameId: \"620n4zRgE8APuKiDrWepWIxdC49\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map7: map(gameId: \"07EcTsJILmBI_2aeI4aG3PcL5_7\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n  map8: map(gameId: \"42CFscE_gb68PNzDwgVWKQomYe5\") {\n    name\n    records {\n      rank\n      player {\n        id\n        login\n        name\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '0148ff6363d5d230f22dd9d13f22f205';
export default node;
