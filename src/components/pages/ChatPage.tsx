import { chatAtom, fetchChatAtom, sendChatAtom } from "@/lib/atom/ChatAtom";
import { municipalityAtomLoadable } from "@/lib/atom/CityAtom";
import { userAtom } from "@/lib/atom/UserAtom";
import {
	type Relationship,
	getRelationship,
} from "@/lib/domain/CharacterQuery";
import type { Chat } from "@/lib/domain/ChatQuery";
import { type ChatVoice, generateVoice } from "@/lib/domain/ChatQuery";
import type { Municipality } from "@/lib/domain/CityQuery";
import { useLoadableAtom } from "@/lib/hook/useLoadableAtom";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	Container,
	Flex,
	HStack,
	Heading,
	IconButton,
	Input,
	Progress,
	Spacer,
	Stack,
	Text,
	Textarea,
	Tooltip,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
	FaArrowLeft,
	FaComment,
	FaCopy,
	FaPause,
	FaPlay,
	FaStop,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import {
	charactersAtomLoadable,
	checkLevelUpRelationshipAtom,
} from "../../lib/atom/CharacterAtom";
import { UserProfileMenu } from "../organisms/UserProfileMenu";

const MotionCard = motion(Card);

// 音声再生の状態を管理する型
type VoiceState = "idle" | "playing" | "paused" | "loading";

// メッセージコンポーネント
interface MessageBubbleProps {
	message: Chat;
	characterId?: string;
	isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
	message,
	characterId,
	isUser,
}) => {
	const toast = useToast();
	const [voiceState, setVoiceState] = useState<VoiceState>("idle");
	const [currentVoice, setCurrentVoice] = useState<ChatVoice | null>(null);
	const voiceRef = useRef<ChatVoice | null>(null);

	// コンポーネントのクリーンアップ
	useEffect(() => {
		return () => {
			if (voiceRef.current) {
				voiceRef.current.stop();
			}
		};
	}, []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			toast({
				title: "コピーしました",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "コピーに失敗しました",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const handlePlayVoice = async () => {
		if (!characterId || isUser) return;

		try {
			setVoiceState("loading");

			// 新しい音声を生成
			const voiceGeneration = await generateVoice(characterId, message.content);
			setCurrentVoice(voiceGeneration);
			voiceRef.current = voiceGeneration;

			setVoiceState("playing");

			// 音声再生開始
			await voiceGeneration.play();

			// 再生完了後の処理
			setVoiceState("idle");
			setCurrentVoice(null);
			voiceRef.current = null;
		} catch (error) {
			console.error("Voice playback error:", error);
			toast({
				title: "音声再生に失敗しました",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			setVoiceState("idle");
			setCurrentVoice(null);
			voiceRef.current = null;
		}
	};

	const handlePauseVoice = () => {
		if (currentVoice && voiceState === "playing") {
			currentVoice.pause();
			setVoiceState("paused");
		}
	};

	const handleResumeVoice = () => {
		if (currentVoice && voiceState === "paused") {
			currentVoice.resume();
			setVoiceState("playing");
		}
	};

	const handleStopVoice = () => {
		if (currentVoice) {
			currentVoice.stop();
			setVoiceState("idle");
			setCurrentVoice(null);
			voiceRef.current = null;
		}
	};

	// 音声コントロールボタンのレンダリング
	const renderVoiceControls = () => {
		if (isUser) return null;

		switch (voiceState) {
			case "idle":
				return (
					<Tooltip label="音声再生" placement="top">
						<IconButton
							aria-label="音声を再生"
							icon={<FaPlay />}
							size="xs"
							variant="ghost"
							onClick={handlePlayVoice}
							_hover={{ bg: "gray.100" }}
							color="purple.500"
						/>
					</Tooltip>
				);

			case "loading":
				return (
					<Tooltip label="読み込み中..." placement="top">
						<IconButton
							aria-label="読み込み中"
							icon={<FaPlay />}
							size="xs"
							variant="ghost"
							isLoading={true}
							_hover={{ bg: "gray.100" }}
							color="purple.500"
						/>
					</Tooltip>
				);

			case "playing":
				return (
					<>
						<Tooltip label="一時停止" placement="top">
							<IconButton
								aria-label="音声を一時停止"
								icon={<FaPause />}
								size="xs"
								variant="ghost"
								onClick={handlePauseVoice}
								_hover={{ bg: "gray.100" }}
								color="orange.500"
							/>
						</Tooltip>
						<Tooltip label="停止" placement="top">
							<IconButton
								aria-label="音声を停止"
								icon={<FaStop />}
								size="xs"
								variant="ghost"
								onClick={handleStopVoice}
								_hover={{ bg: "gray.100" }}
								color="red.500"
							/>
						</Tooltip>
					</>
				);

			case "paused":
				return (
					<>
						<Tooltip label="再開" placement="top">
							<IconButton
								aria-label="音声を再開"
								icon={<FaPlay />}
								size="xs"
								variant="ghost"
								onClick={handleResumeVoice}
								_hover={{ bg: "gray.100" }}
								color="green.500"
							/>
						</Tooltip>
						<Tooltip label="停止" placement="top">
							<IconButton
								aria-label="音声を停止"
								icon={<FaStop />}
								size="xs"
								variant="ghost"
								onClick={handleStopVoice}
								_hover={{ bg: "gray.100" }}
								color="red.500"
							/>
						</Tooltip>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<Flex justify={isUser ? "flex-end" : "flex-start"} gap={2}>
			<Box
				bg={isUser ? "blue.400" : "gray.100"}
				color={isUser ? "white" : "gray.800"}
				px={4}
				py={2}
				borderRadius="2xl"
				maxW="70%"
				boxShadow="sm"
				position="relative"
				_hover={{
					".message-actions": {
						opacity: 1,
					},
				}}
			>
				{message.content}

				{/* 音声再生状態のインジケーター */}
				{voiceState === "playing" && (
					<Box
						position="absolute"
						top={-1}
						left={-1}
						w={2}
						h={2}
						bg="green.400"
						borderRadius="full"
						animation="pulse 2s infinite"
					/>
				)}

				{voiceState === "paused" && (
					<Box
						position="absolute"
						top={-1}
						left={-1}
						w={2}
						h={2}
						bg="orange.400"
						borderRadius="full"
					/>
				)}

				{/* アクションボタン */}
				<HStack
					className="message-actions"
					position="absolute"
					top={-2}
					right={isUser ? "auto" : -2}
					left={isUser ? -2 : "auto"}
					opacity={0}
					transition="opacity 0.2s"
					spacing={1}
					bg="white"
					borderRadius="lg"
					boxShadow="md"
					p={1}
				>
					<Tooltip label="コピー" placement="top">
						<IconButton
							aria-label="メッセージをコピー"
							icon={<FaCopy />}
							size="xs"
							variant="ghost"
							onClick={handleCopy}
							_hover={{ bg: "gray.100" }}
						/>
					</Tooltip>

					{renderVoiceControls()}
				</HStack>
			</Box>
		</Flex>
	);
};

export const ChatPage: React.FC = () => {
	const { characterId } = useParams<{ characterId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const characters = useLoadableAtom(charactersAtomLoadable);
	const [relationship, setRelationship] = useState<Relationship>();
	const municipalities = useLoadableAtom(municipalityAtomLoadable);
	const checkLevelUp = useSetAtom(checkLevelUpRelationshipAtom);
	const user = useAtomValue(userAtom);

	const getMunicipality = () => {
		if (!municipalities) return null;
		const municipality = municipalities.find(
			(m: Municipality) => m.id === getCharacter()?.municipalityId,
		);
		return municipality;
	};

	const getCharacter = () => {
		if (!characters) return null;

		return characters.find((character) => character.id === Number(characterId));
	};

	const [messages, setMessages] = useAtom<Chat[]>(chatAtom);
	const send = useSetAtom(sendChatAtom);
	const fetchChat = useSetAtom(fetchChatAtom);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);

	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
	const cardBg = useColorModeValue("white", "gray.800");
	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (characterId) {
			fetchChat(characterId);
		}
	}, [characterId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (characterId) {
			loadCharacterDetail(Number(characterId));
		}
	}, [characterId]);

	const loadCharacterDetail = async (characterId: number) => {
		try {
			const relationship = await getRelationship(characterId);
			setRelationship(relationship);
		} catch (err) {
			console.error("キャラクター詳細読み込みエラー:", err);
			toast({
				title: "エラー",
				description: "データの読み込みに失敗しました",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleSend = async () => {
		if (!input.trim() || !characterId) return;
		setIsSending(true);
		setMessages((prev) => [...prev, { role: "user", content: input }]);
		try {
			await send({ characterId, message: { role: "user", content: input } });
			setInput("");
			// テキストエリアの高さをリセット
			if (inputRef.current) {
				inputRef.current.style.height = "auto";
			}
			const relationship = await getRelationship(Number(characterId));
			await checkLevelUp(Number(characterId), relationship.trustLevelId).then(
				(updatedRelationship) => {
					// 信頼度の更新を反映
					setRelationship(updatedRelationship);
				},
			);
		} catch {
			toast({
				title: "送信エラー",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setIsSending(false);
		}
	};

	useEffect(() => {
		// メッセージ送信後に必ず入力欄へフォーカス
		if (!isSending) {
			inputRef.current?.focus();
		}
	}, [messages, isSending]);

	const handleBack = () => {
		navigate(`/characters/${characterId}`);
	};

	const trustLevel = relationship?.trustLevelId ?? 1;
	const trustPoints = relationship?.trustPoints ?? 0;
	const nextLevelPoints = relationship?.nextLevelPoints ?? 0;
	const trustProgress = (trustPoints / nextLevelPoints) * 100;

	return (
		<Box
			minH="100dvh"
			h="100dvh"
			bgGradient={bgGradient}
			position="relative"
			w="100vw"
		>
			<UserProfileMenu user={user} cardBg={cardBg} />
			<Container
				maxW="100vw"
				h="100%"
				minH="100dvh"
				p={containerPadding}
				display="flex"
				flexDirection="column"
			>
				<VStack
					spacing={4}
					align="stretch"
					w="100%"
					maxW="600px"
					mx="auto"
					flex={1}
					minH="0"
				>
					{/* ヘッダー */}
					<MotionCard
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="xl"
						mb={2}
					>
						<CardBody p={4}>
							<Flex align="center" gap={4}>
								<Button
									leftIcon={<FaArrowLeft />}
									variant="ghost"
									onClick={handleBack}
									borderRadius="xl"
									_hover={{ bg: "whiteAlpha.200" }}
								>
									戻る
								</Button>
								<Spacer />
								<Avatar
									size="md"
									src={getCharacter()?.profileImageUrl}
									name={getCharacter()?.name}
									mr={2}
								/>
								<Box>
									<Heading size="md" color="gray.800" noOfLines={1}>
										{getCharacter()?.name}
									</Heading>
									<Text fontSize="sm" color="gray.500">
										{getMunicipality()?.name}・{getCharacter()?.occupationId}・
										{getCharacter()?.age}歳
									</Text>
								</Box>
							</Flex>
						</CardBody>
					</MotionCard>

					{/* 信頼度バー */}
					<MotionCard
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="md"
						mb={2}
					>
						<CardBody py={3} px={4}>
							<HStack>
								<Text fontSize="sm" color="gray.600" minW="80px">
									信頼レベル: Lv.{trustLevel}
								</Text>
								<Progress
									value={trustProgress}
									colorScheme="purple"
									size="sm"
									borderRadius="full"
									flex={1}
									mx={2}
								/>
								<Text fontSize="xs" color="gray.500">
									{trustPoints}/{nextLevelPoints}
								</Text>
							</HStack>
						</CardBody>
					</MotionCard>

					{/* メッセージ履歴 */}
					<MotionCard
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="md"
						flex={1}
						minH="0"
						maxH="100%"
						overflowY="auto"
					>
						<CardBody p={4} h="100%" display="flex" flexDirection="column">
							<Stack spacing={4} flex={1} justify="flex-end">
								{messages.map((msg, index) => (
									<MessageBubble
										key={index}
										message={msg}
										characterId={characterId}
										isUser={msg.role === "user"}
									/>
								))}
								<div ref={messagesEndRef} />
							</Stack>
						</CardBody>
					</MotionCard>

					{/* 入力欄 */}
					<MotionCard
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						bg={cardBg}
						borderRadius="2xl"
						shadow="md"
					>
						<CardBody p={3}>
							<HStack spacing={2}>
								<Textarea
									ref={inputRef}
									placeholder="メッセージを入力..."
									value={input}
									onChange={(e) => {
										setInput(e.target.value);
										// 自動リサイズ
										const textarea = e.target as HTMLTextAreaElement;
										textarea.style.height = "auto";
										textarea.style.height = `${textarea.scrollHeight}px`;
									}}
									onInput={(e) => {
										// 直接入力時も自動リサイズ
										const textarea = e.currentTarget as HTMLTextAreaElement;
										textarea.style.height = "auto";
										textarea.style.height = `${textarea.scrollHeight}px`;
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleSend();
										}
									}}
									isDisabled={isSending}
									bg="gray.50"
									borderRadius="2xl"
									resize="none"
									rows={1}
									style={{
										overflow: "hidden",
										minHeight: "2.5em",
										maxHeight: "8em",
										lineHeight: "1.5",
									}}
								/>
								<Button
									colorScheme="purple"
									leftIcon={<FaComment />}
									onClick={handleSend}
									isLoading={isSending}
									borderRadius="2xl"
									px={6}
									disabled={!input.trim()}
								>
									送信
								</Button>
							</HStack>
						</CardBody>
					</MotionCard>
				</VStack>
			</Container>
		</Box>
	);
};

export default ChatPage;
