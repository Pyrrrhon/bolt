import { atom } from "recoil";

export const serverResponseAtom = atom<string[]>({
  key: "serverResponseState",
  default: [],
});
