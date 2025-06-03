import { createAxiosClient } from "../infrastructure/AxiosClient";

export class Chat {
	constructor(
		public role: string,
		public content: string,
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

function createChat(res: ChatResponse): Chat {
	return new Chat(res.role, res.response);
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
