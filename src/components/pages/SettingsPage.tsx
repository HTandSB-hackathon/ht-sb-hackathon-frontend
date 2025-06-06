import { soundEnabledAtom } from "@/lib/atom/BaseAtom";
import { updateUserAtom, userAtom } from "@/lib/atom/UserAtom";
import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Icon,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useState } from "react";
import {
	FaBell,
	FaEye,
	FaGlobe,
	FaInfo,
	FaLock,
	FaShieldAlt,
	FaTrash,
	FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface SettingsSectionProps {
	title: string;
	icon: React.ElementType;
	color: string;
	children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
	title,
	icon,
	color,
	children,
}) => {
	return (
		<MotionCard
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			shadow="lg"
			borderRadius="xl"
			overflow="hidden"
			border="1px solid"
			borderColor="gray.200"
			_hover={{ shadow: "xl" }}
		>
			<CardHeader bg={`${color}.50`} py={4}>
				<HStack spacing={3}>
					<Icon as={icon} color={`${color}.600`} boxSize={6} />
					<Heading size="lg" color={`${color}.700`}>
						{title}
					</Heading>
				</HStack>
			</CardHeader>
			<CardBody p={6}>{children}</CardBody>
		</MotionCard>
	);
};

interface SettingItemProps {
	label: string;
	description?: string;
	children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
	label,
	description,
	children,
}) => {
	return (
		<Flex justify="space-between" align="center" py={3}>
			<VStack align="start" spacing={1} flex="1">
				<Text fontWeight="medium" color="gray.700">
					{label}
				</Text>
				{description && (
					<Text fontSize="sm" color="gray.500">
						{description}
					</Text>
				)}
			</VStack>
			<Box>{children}</Box>
		</Flex>
	);
};

/**
 * 設定画面
 * ユーザーの個人設定、通知設定、プライバシー設定などを管理
 */
const SettingsPage: React.FC = () => {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = useAtomValue(userAtom);

	const userUpdate = useSetAtom(updateUserAtom);

	// 設定状態の管理
	const [settings, setSettings] = useState({
		displayName: user?.name || "",
		email: user?.email || "",
	});

	const [soundEnabled, setSoundEnabled] = useAtom(soundEnabledAtom);

	// 背景色の設定
	const bgGradient =
		"linear(135deg, purple.50 0%, blue.50 25%, teal.50 50%, green.50 75%, pink.50 100%)";

	const handleSettingChange = (key: string, value: boolean | string) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSaveProfile = async () => {
		try {
			await userUpdate({
				name: settings.displayName,
				email: settings.email,
			});
		} catch (error) {
			console.error("プロフィール更新エラー:", error);
		}
	};

	const handleDeleteAccount = () => {
		// アカウント削除処理
		console.log("アカウント削除処理");
		onClose();
	};

	const handleLogout = () => {
		// ログアウト処理
		localStorage.removeItem("authToken");
		navigate("/login");
	};

	return (
		<Box minH="100vh" bgGradient={bgGradient} position="relative">
			{/* 背景装飾 */}
			<Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
				<MotionBox
					position="absolute"
					top="-20%"
					right="-20%"
					width="60%"
					height="60%"
					bgGradient="radial(circle, purple.300 0%, blue.200 40%, transparent 70%)"
					opacity="0.3"
					animate={{ rotate: [0, 360] }}
					transition={{
						duration: 60,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</Box>

			<Container maxW="container.xl" position="relative" zIndex="1" py={8}>
				{/* ヘッダー */}
				<MotionBox
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					textAlign="center"
					mb={10}
				>
					<Heading
						size="3xl"
						bgGradient="linear(135deg, purple.600 0%, blue.600 50%, teal.500 100%)"
						bgClip="text"
						fontWeight="black"
						mb={4}
					>
						設定
					</Heading>
					<Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
						アプリの設定をカスタマイズして、より快適な福島のこころ体験をお楽しみください
					</Text>
				</MotionBox>

				{/* 設定セクション */}
				<VStack spacing={8} align="stretch">
					{/* プロフィール設定 */}
					<SettingsSection title="プロフィール設定" icon={FaUser} color="blue">
						<VStack spacing={6} align="stretch">
							<SettingItem label="表示名">
								<Input
									value={settings.displayName}
									onChange={(e) =>
										handleSettingChange("displayName", e.target.value)
									}
									maxW="300px"
									placeholder="表示名を入力"
								/>
							</SettingItem>
							<Divider />
							<SettingItem label="メールアドレス">
								<Input
									value={settings.email}
									onChange={(e) => handleSettingChange("email", e.target.value)}
									maxW="300px"
									placeholder="メールアドレスを入力"
									type="email"
								/>
							</SettingItem>
							<Divider />
							<Flex justify="center">
								<Button
									colorScheme="blue"
									onClick={handleSaveProfile}
									leftIcon={<FaUser />}
									size="lg"
								>
									プロフィールを保存
								</Button>
							</Flex>
						</VStack>
					</SettingsSection>

					{/* 通知設定 */}
					{/* <SettingsSection title="通知設定" icon={FaBell} color="green">
						<VStack spacing={4} align="stretch">
							<SettingItem
								label="レベルアップ通知"
								description="キャラクターとの信頼レベルが上がった時に通知します"
							>
								<Switch
									isChecked={settings.levelUpNotifications}
									onChange={(e) =>
										handleSettingChange(
											"levelUpNotifications",
											e.target.checked,
										)
									}
									colorScheme="green"
									size="lg"
								/>
							</SettingItem>
							<Divider />
							<SettingItem
								label="メッセージ通知"
								description="新しいメッセージが届いた時に通知します"
							>
								<Switch
									isChecked={settings.messageNotifications}
									onChange={(e) =>
										handleSettingChange(
											"messageNotifications",
											e.target.checked,
										)
									}
									colorScheme="green"
									size="lg"
								/>
							</SettingItem>
							<Divider />
							<SettingItem
								label="プッシュ通知"
								description="デバイスにプッシュ通知を送信します"
							>
								<Switch
									isChecked={settings.pushNotifications}
									onChange={(e) =>
										handleSettingChange("pushNotifications", e.target.checked)
									}
									colorScheme="green"
									size="lg"
								/>
							</SettingItem>
						</VStack>
					</SettingsSection> */}

					<SettingsSection title="サウンド設定" icon={FaGlobe} color="purple">
						<VStack spacing={4} align="stretch">
							<SettingItem
								label="BGMサウンド"
								description="アプリ内のBGMを有効にします"
							>
								<Switch
									isChecked={soundEnabled}
									onChange={(e) => setSoundEnabled(e.target.checked)}
									colorScheme="green"
									size="lg"
								/>
							</SettingItem>
						</VStack>
					</SettingsSection>

					{/* プライバシー設定 */}
					<SettingsSection
						title="プライバシー・セキュリティ"
						icon={FaShieldAlt}
						color="red"
					>
						<VStack spacing={4} align="stretch">
							<SettingItem
								label="パスワード変更"
								description="アカウントのセキュリティを強化"
							>
								<Button
									leftIcon={<FaLock />}
									colorScheme="blue"
									variant="outline"
								>
									パスワード変更
								</Button>
							</SettingItem>
							<Divider />
							{/* <SettingItem
								label="データエクスポート"
								description="あなたのデータをダウンロード"
							>
								<Button
									leftIcon={<FaEye />}
									colorScheme="teal"
									variant="outline"
								>
									データをエクスポート
								</Button>
							</SettingItem>
							<Divider /> */}
							<SettingItem
								label="アカウント削除"
								description="すべてのデータが永久に削除されます"
							>
								<Button
									leftIcon={<FaTrash />}
									colorScheme="red"
									variant="outline"
									onClick={onOpen}
								>
									アカウント削除
								</Button>
							</SettingItem>
						</VStack>
					</SettingsSection>

					{/* アプリ情報 */}
					<SettingsSection title="アプリ情報" icon={FaInfo} color="gray">
						<VStack spacing={4} align="stretch">
							<SettingItem label="バージョン">
								<Badge
									colorScheme="blue"
									fontSize="md"
									px={3}
									py={1}
									borderRadius="full"
								>
									{import.meta.env.VITE_APP_VERSION || "development"}
								</Badge>
							</SettingItem>
							<Divider />
							<SettingItem label="利用規約">
								<Button
									size="sm"
									variant="link"
									colorScheme="blue"
									onClick={() => navigate("/terms")}
								>
									確認する
								</Button>
							</SettingItem>
							<Divider />
							<SettingItem label="プライバシーポリシー">
								<Button
									size="sm"
									variant="link"
									colorScheme="blue"
									onClick={() => navigate("/privacy")}
								>
									確認する
								</Button>
							</SettingItem>
							<Divider />
							<SettingItem label="お問い合わせ">
								<Button size="sm" variant="link" colorScheme="blue">
									サポートに連絡
								</Button>
							</SettingItem>
						</VStack>
					</SettingsSection>

					{/* ログアウト */}
					<MotionCard
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						textAlign="center"
						py={8}
						border="2px dashed"
						borderColor="red.200"
						bg="red.50"
					>
						<VStack spacing={4}>
							<Heading size="lg" color="red.600">
								ログアウト
							</Heading>
							<Text color="red.500">アプリからログアウトします</Text>
							<Button colorScheme="red" size="lg" onClick={handleLogout}>
								ログアウト
							</Button>
						</VStack>
					</MotionCard>
				</VStack>
			</Container>

			{/* アカウント削除確認モーダル */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay bg="blackAlpha.700" />
				<ModalContent mx={4}>
					<ModalHeader color="red.600">アカウント削除の確認</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4} align="start">
							<Text>本当にアカウントを削除しますか？</Text>
							<Text fontSize="sm" color="red.500" fontWeight="bold">
								⚠️ この操作は取り消すことができません
							</Text>
							<Text fontSize="sm" color="gray.600">
								削除されるデータ：
							</Text>
							<VStack fontSize="sm" color="gray.600" align="start" pl={4}>
								<Text>• プロフィール情報</Text>
								<Text>• 会話履歴</Text>
								<Text>• キャラクターとの関係性</Text>
								<Text>• 設定情報</Text>
							</VStack>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							キャンセル
						</Button>
						<Button colorScheme="red" onClick={handleDeleteAccount}>
							削除する
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default SettingsPage;
