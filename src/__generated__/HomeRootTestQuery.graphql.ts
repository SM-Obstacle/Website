/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type HomeRootTestQueryVariables = {};
export type HomeRootTestQueryResponse = {
    readonly node: {
        readonly id: string;
    } | null;
};
export type HomeRootTestQuery = {
    readonly response: HomeRootTestQueryResponse;
    readonly variables: HomeRootTestQueryVariables;
};



/*
query HomeRootTestQuery {
  node(id: "v0:Player:2") {
    __typename
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "v0:Player:2"
  }
],
v1 = {
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
    "name": "HomeRootTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": "node(id:\"v0:Player:2\")"
      }
    ],
    "type": "QueryRoot",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HomeRootTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "node(id:\"v0:Player:2\")"
      }
    ]
  },
  "params": {
    "cacheID": "1127a336076117c7a627e34c8ce68558",
    "id": null,
    "metadata": {},
    "name": "HomeRootTestQuery",
    "operationKind": "query",
    "text": "query HomeRootTestQuery {\n  node(id: \"v0:Player:2\") {\n    __typename\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'dfecedec2684af3f269349deb199ab8d';
export default node;
