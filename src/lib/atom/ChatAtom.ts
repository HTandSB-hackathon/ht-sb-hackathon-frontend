import {
	type Chat,
	fetchChatMessages,
	sendChatMessage,
} from "@/lib/domain/ChatQuery";
import { atom } from "jotai";

export const chatAtom = atom<Chat[]>([]);

export const fetchChatAtom = atom(null, async (_, set, characterId: string) => {
	const history = await fetchChatMessages(characterId);
	set(chatAtom, history);
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
		}
	},
);
