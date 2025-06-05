import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export const toastAtom = atomWithReset({ status: "", message: "" });

export const isLevelUpModalOpenAtom = atom(false);
export const isNewCharacterModalOpenAtom = atom(false);
export const isNewStoryModalOpenAtom = atom(false);
