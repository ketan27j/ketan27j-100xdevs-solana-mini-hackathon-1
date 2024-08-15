import { atom } from "recoil";

export const messageAtom = atom<string>({
  key: "messageAtom",
  default: "",
});