import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export const toastAtom = atomWithReset({ status: "", message: "" });

export const isLevelUpModalOpenAtom = atom(false);
