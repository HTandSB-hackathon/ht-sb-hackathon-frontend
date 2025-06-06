import { levelUpCharacterDetailAtom } from "@/lib/atom/CharacterAtom";
import { TRUST_LEVELS } from "@/lib/types/character";
import {
	Avatar,
	Box,
	Button,
	Center,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { FaStar } from "react-icons/fa";

interface LevelUpModalProps {
	isOpen: boolean;
	onClose: () => void;
	unlockedDesc?: string;
}

// 星のきらめきエフェクト
const Sparkle = ({
	size = 18,
	color = "yellow.300",
	style = {},
}: { size?: number; color?: string; style?: React.CSSProperties }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
		animate={{
			opacity: [0.7, 1, 0.7],
			scale: [0.7, 1.2, 0.7],
			rotate: [0, 360, 0],
		}}
		transition={{
			duration: 1.6 + Math.random(),
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
			delay: Math.random(),
		}}
		style={{
			position: "absolute",
			...style,
			pointerEvents: "none",
			zIndex: 1,
		}}
	>
		<Box
			as={FaStar}
			color={color}
			fontSize={`${size}px`}
			filter="drop-shadow(0 0 8px #fde68a)"
			opacity={0.85}
		/>
	</motion.div>
);

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
	isOpen,
	onClose,
	unlockedDesc = "",
}) => {
	const cardBg = useColorModeValue("white", "gray.800");
	const accent = useColorModeValue("purple.400", "purple.300");
	const starColor = "yellow.400";
	const [levelUpCharacterDetail, setLevelUpCharacterDetail] = useAtom(
		levelUpCharacterDetailAtom,
	);
	const level = levelUpCharacterDetail?.relationship?.trustLevelId || 1; // デフォルト値を設定

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose;
				setLevelUpCharacterDetail(null);
			}} // モーダルを閉じるときに状態をリセット
			isCentered
			size="xl" // 横幅のみ広げる
			closeOnOverlayClick={false}
		>
			<ModalOverlay bg="blackAlpha.700" />
			<ModalContent
				bg={cardBg}
				borderRadius="2xl"
				shadow="2xl"
				px={8}
				py={6}
				maxW="700px" // 横幅を広げる
				minW="480px"
				as={motion.div}
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				position="relative"
				overflow="visible"
			>
				{/* 星エフェクトを配置 */}
				{isOpen && (
					<>
						<Sparkle size={22} style={{ top: "10%", left: "18%", zIndex: 1 }} />
						<Sparkle
							size={16}
							style={{ top: "18%", right: "20%", zIndex: 1 }}
						/>
						<Sparkle size={14} style={{ top: "38%", left: "8%", zIndex: 1 }} />
						<Sparkle
							size={20}
							style={{ top: "60%", right: "12%", zIndex: 1 }}
						/>
						<Sparkle
							size={18}
							style={{ bottom: "18%", left: "22%", zIndex: 1 }}
						/>
						<Sparkle
							size={14}
							style={{ bottom: "12%", right: "18%", zIndex: 1 }}
						/>
						<Sparkle size={12} style={{ top: "7%", right: "40%", zIndex: 1 }} />
						<Sparkle
							size={12}
							style={{ bottom: "8%", left: "40%", zIndex: 1 }}
						/>
					</>
				)}
				<ModalBody>
					<Center mb={4} position="relative">
						<motion.div
							initial={{ scale: 0.8, rotate: 0 }}
							animate={{
								scale: [1.1, 1, 1.1],
								rotate: [0, 360, 0],
							}}
							transition={{
								duration: 2.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
							style={{
								position: "absolute",
								inset: 0,
								zIndex: 0,
								pointerEvents: "none",
							}}
						>
							<Box
								bgGradient="radial(yellow.200 30%, transparent 85%)"
								w="90px"
								h="90px"
								borderRadius="full"
								filter="blur(1px)"
								mx="auto"
								opacity={0.5}
							/>
						</motion.div>
						<Avatar
							size="xl"
							src={levelUpCharacterDetail?.character?.profileImageUrl}
							name={levelUpCharacterDetail?.character?.name}
							border={`3px solid ${accent}`}
							boxShadow="lg"
							zIndex={1}
						/>
					</Center>
					<Stack spacing={3} align="center">
						<motion.div
							initial={{ scale: 0.7, rotate: -20 }}
							animate={{
								scale: [1.2, 1, 1.2],
								rotate: [0, 20, -20, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
							style={{ color: starColor, fontSize: "2.5rem", zIndex: 1 }}
						>
							<FaStar />
						</motion.div>
						<Heading
							size="lg"
							color={accent}
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							maxW="90%" // 横幅に合わせて調整
						>
							レベルアップ！
						</Heading>
						<Text
							fontWeight="bold"
							fontSize="lg"
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							maxW="90%"
						>
							{levelUpCharacterDetail?.character?.name}
							さんとの信頼度が上がりました！
						</Text>
						<motion.div
							initial={{ scale: 0.7 }}
							animate={{ scale: [1.2, 1, 1.2] }}
							transition={{
								duration: 1.2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							<Text fontSize="2xl" color={accent} fontWeight="extrabold">
								Lv.{levelUpCharacterDetail?.relationship?.trustLevelId}{" "}
								{TRUST_LEVELS[level as keyof typeof TRUST_LEVELS]?.name}
							</Text>
						</motion.div>
						{(unlockedDesc ?? "") && (
							<Box
								bg={useColorModeValue("purple.50", "purple.900")}
								color={accent}
								px={4}
								py={2}
								borderRadius="xl"
								fontWeight="medium"
								fontSize="md"
								textAlign="center"
								mt={2}
								as={motion.div}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
							>
								{unlockedDesc ?? ""}
							</Box>
						)}
					</Stack>
				</ModalBody>
				<ModalFooter zIndex={2} position="relative">
					<Button
						colorScheme="purple"
						size="lg"
						w="full"
						borderRadius="full"
						onClick={onClose}
						as={motion.button}
						whileHover={{ scale: 1.05, boxShadow: "0 0 0 2px #a78bfa" }}
						zIndex={2}
						position="relative"
					>
						もっと話す
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
