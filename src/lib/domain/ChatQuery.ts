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

export class ChatVoice {
	private audio: HTMLAudioElement | null = null;
	private audioUrl: string | null = null;

	constructor(
		public text: string,
		public audioBlob: Blob,
		public characterId: string,
	) {}

	async play(): Promise<void> {
		// Blobが有効かチェック
		if (!this.audioBlob || this.audioBlob.size === 0) {
			throw new Error("音声データが無効です");
		}

		return new Promise((resolve, reject) => {
			try {
				this.audioUrl = URL.createObjectURL(this.audioBlob);
				this.audio = new Audio(this.audioUrl);

				this.audio.onended = () => {
					this.cleanup();
					resolve();
				};

				this.audio.onerror = (error) => {
					this.cleanup();
					console.error("音声再生中にエラーが発生しました:", error);
					reject(
						new Error(
							`音声再生に失敗しました: ${this.audio?.error?.message || "不明なエラー"}`,
						),
					);
				};

				this.audio.onabort = () => {
					this.cleanup();
					reject(new Error("音声再生が中断されました"));
				};

				this.audio
					.play()
					.then(() => {
						// 再生開始成功
					})
					.catch((playError) => {
						this.cleanup();
						reject(playError);
					});
			} catch (error) {
				this.cleanup();
				reject(error);
			}
		});
	}

	pause(): void {
		if (this.audio && !this.audio.paused) {
			this.audio.pause();
		}
	}

	resume(): void {
		if (this.audio?.paused) {
			this.audio.play().catch((error) => {
				console.error("音声再生の再開に失敗しました:", error);
			});
		}
	}

	stop(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
		this.cleanup();
	}

	isPlaying(): boolean {
		return this.audio ? !this.audio.paused : false;
	}

	isPaused(): boolean {
		return this.audio ? this.audio.paused : false;
	}

	getCurrentTime(): number {
		return this.audio?.currentTime || 0;
	}

	getDuration(): number {
		return this.audio?.duration || 0;
	}

	private cleanup(): void {
		if (this.audioUrl) {
			URL.revokeObjectURL(this.audioUrl);
			this.audioUrl = null;
		}
		this.audio = null;
	}

	download(filename?: string): void {
		const audioUrl = URL.createObjectURL(this.audioBlob);
		const link = document.createElement("a");
		link.href = audioUrl;
		link.download = filename || `voice_${this.characterId}_${Date.now()}.mp3`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(audioUrl);
	}

	createObjectURL(): string {
		return URL.createObjectURL(this.audioBlob);
	}
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

interface ChatVoiceRequest {
	text: string;
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

// 音声合成のレスポンス型（Blob）
interface VoiceResponse extends Blob {}

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

function createChatVoice(
	text: string,
	audioBlob: Blob,
	characterId: string,
): ChatVoice {
	return new ChatVoice(text, audioBlob, characterId);
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

export async function generateVoice(
	characterId: string,
	text: string,
): Promise<ChatVoice> {
	const client = createAxiosClient();
	const response = await client.postBlob<ChatVoiceRequest, VoiceResponse>(
		`/tasuki/chat/${characterId}/voice_reader`,
		{ text: text },
	);
	return createChatVoice(text, response.data, characterId);
}
