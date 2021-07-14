/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PlayerComponent_player = {
    readonly name: string;
    readonly " $refType": "PlayerComponent_player";
};
export type PlayerComponent_player$data = PlayerComponent_player;
export type PlayerComponent_player$key = {
    readonly " $data"?: PlayerComponent_player$data;
    readonly " $fragmentRefs": FragmentRefs<"PlayerComponent_player">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PlayerComponent_player",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Player",
  "abstractKey": null
};
(node as any).hash = '92c6d6ee78ef3c48897532d3dbf4db60';
export default node;
