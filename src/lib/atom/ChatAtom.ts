import {
	type Chat,
	type ChatCount,
	fetchChatMessages,
	getChatAllCount,
	getChatCountByCharacterIdWithResponse,
	sendChatMessage,
} from "@/lib/domain/ChatQuery";
import { atom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";

export const chatAtom = atom<Chat[]>([]);

const chatCountAllAtomAsync = atomWithRefresh<Promise<number>>(async () => {
	const count = await getChatAllCount();
	return count;
});

const chatCountByCharacterIdAtomAsync = atomWithRefresh<Promise<ChatCount[]>>(
	async () => {
		const counts = await getChatCountByCharacterIdWithResponse();
		return counts;
	},
);

export const chatCountAllAtomLoadable = loadable(chatCountAllAtomAsync);
export const chatCountByCharacterIdAtomLoadable = loadable(
	chatCountByCharacterIdAtomAsync,
);

export const fetchChatAtom = atom(null, async (_, set, characterId: string) => {
	const history = await fetchChatMessages(characterId);
	set(chatAtom, history);
	set(chatCountAllAtomAsync);
	set(chatCountByCharacterIdAtomAsync);
});

export const sendChatAtom = atom(
	null,
	async (
		get,
		set,
		{ characterId, message }: { characterId: string; message: Chat },
	) => {
		const currentChats = get(chatAtom);

		try {
			const outputMessage = await sendChatMessage(
				characterId,
				message,
				currentChats,
			);
			set(chatAtom, [...currentChats, outputMessage]);
		} catch (error) {
			console.error("メッセージ送信中にエラーが発生しました:", error);
			set(chatAtom, [
				...currentChats,
				{
					role: "system",
					content: "メッセージの送信に失敗しました。もう一度お試しください。",
				},
			]);
		} finally {
			set(chatCountAllAtomAsync);
			set(chatCountByCharacterIdAtomAsync);
		}
	},
);
