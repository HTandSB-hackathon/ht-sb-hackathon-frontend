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
	Input,
	Progress,
	Spacer,
	Stack,
	Text,
	VStack,
	useBreakpointValue,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaComment } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { selectedCharacterDetailAtom } from "../../lib/atom/CharacterAtom";

// --- モックAPI ---
type Message = {
	id: string;
	text: string;
	sender: "user" | "character";
	timestamp: string;
};

const mockMessages: Message[] = [
	{
		id: "1",
		text: "あらまあ、こんにちは！よく来てくれましたね",
		sender: "character",
		timestamp: new Date().toISOString(),
	},
];

const mockApi = {
	async fetchMessages(characterId: string): Promise<Message[]> {
		await new Promise((r) => setTimeout(r, 200));
		return mockMessages;
	},
	async sendMessage(
		characterId: string,
		text: string,
		prev: Message[],
	): Promise<Message[]> {
		await new Promise((r) => setTimeout(r, 400));
		return [
			...prev,
			{
				id: Date.now().toString(),
				text,
				sender: "user",
				timestamp: new Date().toISOString(),
			},
			{
				id: (Date.now() + 1).toString(),
				text: "今日はいい天気ですね！",
				sender: "character",
				timestamp: new Date().toISOString(),
			},
		];
	},
};
// --- モックAPIここまで ---

const MotionCard = motion(Card);

export const ChatPage: React.FC = () => {
	const { characterId } = useParams<{ characterId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const [characterDetail] = useAtom(selectedCharacterDetailAtom);

	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);

	const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
	const cardBg = useColorModeValue("white", "gray.800");
	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50, pink.50)",
		"linear(to-br, gray.900, purple.900, blue.900)",
	);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (characterId) {
			mockApi.fetchMessages(characterId).then(setMessages);
		}
	}, [characterId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || !characterId) return;
		setIsSending(true);
		try {
			const newMessages = await mockApi.sendMessage(
				characterId,
				input,
				messages,
			);
			setMessages(newMessages);
			setInput("");
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

	const trustLevel = characterDetail?.relationship?.trustLevel ?? 1;
	const trustPoints = characterDetail?.relationship?.trustPoints ?? 0;
	const nextLevelPoints = characterDetail?.relationship?.nextLevelPoints ?? 1;
	const trustProgress = (trustPoints / nextLevelPoints) * 100;

	return (
		<Box
			minH="100dvh"
			h="100dvh"
			bgGradient={bgGradient}
			position="relative"
			w="100vw"
		>
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
									src={characterDetail?.profileImage}
									name={characterDetail?.name}
									mr={2}
								/>
								<Box>
									<Heading size="md" color="gray.800" noOfLines={1}>
										{characterDetail?.name}
									</Heading>
									<Text fontSize="sm" color="gray.500">
										{characterDetail?.city}・{characterDetail?.occupation}・
										{characterDetail?.age}歳
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
								{messages.map((msg) => (
									<Flex
										key={msg.id}
										justify={msg.sender === "user" ? "flex-end" : "flex-start"}
									>
										<Box
											bg={msg.sender === "user" ? "blue.400" : "gray.100"}
											color={msg.sender === "user" ? "white" : "gray.800"}
											px={4}
											py={2}
											borderRadius="2xl"
											maxW="70%"
											boxShadow="sm"
										>
											{msg.text}
										</Box>
									</Flex>
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
								<Input
									ref={inputRef}
									placeholder="メッセージを入力..."
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSend();
									}}
									isDisabled={isSending}
									bg="gray.50"
									borderRadius="full"
								/>
								<Button
									colorScheme="purple"
									leftIcon={<FaComment />}
									onClick={handleSend}
									isLoading={isSending}
									borderRadius="full"
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
