/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PlayerComponent_player = {
    readonly nickname: string;
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
      "name": "nickname",
      "storageKey": null
    }
  ],
  "type": "Player",
  "abstractKey": null
};
(node as any).hash = '2cb04d42ba92a9f7b924cacaa022d24e';
export default node;
