import { chatAtom, fetchChatAtom, sendChatAtom } from "@/lib/atom/ChatAtom";
import { municipalityAtomLoadable } from "@/lib/atom/CityAtom";
import {
	type Relationship,
	getRelationship,
} from "@/lib/domain/CharacterQuery";
import type { Chat } from "@/lib/domain/ChatQuery";
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
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaComment } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import {
	charactersAtomLoadable,
	checkLevelUpRelationshipAtom,
} from "../../lib/atom/CharacterAtom";

const MotionCard = motion(Card);

export const ChatPage: React.FC = () => {
	const { characterId } = useParams<{ characterId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const characters = useLoadableAtom(charactersAtomLoadable);
	const [relationship, setRelationship] = useState<Relationship>();
	const municipalities = useLoadableAtom(municipalityAtomLoadable);
	const checkLevelUp = useSetAtom(checkLevelUpRelationshipAtom);

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
	const inputRef = useRef<HTMLInputElement>(null);

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
									<Flex
										key={index}
										justify={msg.role === "user" ? "flex-end" : "flex-start"}
									>
										<Box
											bg={msg.role === "user" ? "blue.400" : "gray.100"}
											color={msg.role === "user" ? "white" : "gray.800"}
											px={4}
											py={2}
											borderRadius="2xl"
											maxW="70%"
											boxShadow="sm"
										>
											{msg.content}
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
