import { createAxiosClient } from "../infrastructure/AxiosClient";

export class Chat {
	constructor(
		public role: string,
		public content: string,
	) {}
}

export class ChatCount {
	constructor(
		public characterId: number,
		public count: number,
		public lastChatDate: Date, // デフォルト値を設定
	) {}
}

interface ChatMessage {
	role: string;
	content: string;
}

interface ChatRequest {
	role: string;
	response: string;
	history: ChatMessage[];
}

interface ChatResponse {
	role: string;
	response: string;
}

interface ChatCountResponse {
	character_id: number;
	count: number;
	last_chat_date: string; // ISO 8601形式の文字列
}

function createChat(res: ChatResponse): Chat {
	return new Chat(res.role, res.response);
}
function createChatCount(res: ChatCountResponse): ChatCount {
	return new ChatCount(
		res.character_id,
		res.count,
		new Date(res.last_chat_date),
	);
}

function fetchChat(res: ChatMessage): Chat {
	return new Chat(res.role, res.content);
}

export async function fetchChatMessages(characterId: string): Promise<Chat[]> {
	const client = createAxiosClient();
	const response = await client.get<ChatMessage[]>(
		`/tasuki/chat/${characterId}`,
	);
	return response.data.map(fetchChat);
}

export async function sendChatMessage(
	characterId: string,
	message: ChatMessage,
	history: ChatMessage[],
): Promise<Chat> {
	const client = createAxiosClient();

	const response = await client.post<ChatRequest, ChatResponse>(
		`/tasuki/chat/${characterId}`,
		{
			role: message.role,
			response: message.content,
			history: history,
		},
	);

	return createChat(response.data);
}

export async function getChatAllCount(): Promise<number> {
	const client = createAxiosClient();
	const response = await client.get<number>("/tasuki/chat/count/all");
	return response.data;
}

export async function getChatCountByCharacterId(
	characterId: string,
): Promise<number> {
	const client = createAxiosClient();
	const response = await client.get<number>(
		`/tasuki/chat/count/character/${characterId}`,
	);
	return response.data;
}

export async function getChatCountByCharacterIdWithResponse(): Promise<
	ChatCount[]
> {
	const client = createAxiosClient();
	const response = await client.get<ChatCountResponse[]>(
		"/tasuki/chat/count/all_by_characters",
	);
	return response.data.map(createChatCount);
}
