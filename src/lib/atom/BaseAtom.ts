import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";

export const toastAtom = atomWithReset({ status: "", message: "" });

export const isLevelUpModalOpenAtom = atom(false);
export const isNewCharacterModalOpenAtom = atom(false);
export const isNewStoryModalOpenAtom = atom(false);

/** 音声効果が有効かどうかの状態 */
export const soundEnabledAtom = atomWithStorage("ht-sb-sound-enabled", false);

/** 音声の全体的な音量設定 */
export const soundVolumeAtom = atomWithStorage("ht-sb-sound-volume", 0.5);
