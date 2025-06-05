import {
	Badge,
	Box,
	Container,
	Divider,
	Heading,
	Link,
	Text,
	VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";
import { FaShieldAlt } from "react-icons/fa";

const MotionBox = motion(Box);

/**
 * プライバシーポリシーページ
 * 福島のこころアプリのプライバシーポリシーを表示
 */
const PrivacyPolicyPage: React.FC = () => {
	const bgGradient =
		"linear(135deg, purple.50 0%, blue.50 25%, teal.50 50%, green.50 75%, pink.50 100%)";

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

			<Container maxW="container.lg" position="relative" zIndex="1" py={8}>
				{/* ヘッダー */}
				<MotionBox
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					textAlign="center"
					mb={10}
				>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						mb={4}
					>
						<FaShieldAlt size={48} color="purple" />
						<Heading
							size="3xl"
							bgGradient="linear(135deg, purple.600 0%, blue.600 50%, teal.500 100%)"
							bgClip="text"
							fontWeight="black"
							ml={4}
						>
							プライバシーポリシー
						</Heading>
					</Box>
					<Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
						福島のこころは、利用者のプライバシーを尊重し、個人情報の保護に努めています
					</Text>
				</MotionBox>

				{/* プライバシーポリシー内容 */}
				<MotionBox
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					bg="white"
					borderRadius="xl"
					p={8}
					shadow="xl"
					border="1px solid"
					borderColor="gray.200"
				>
					<VStack spacing={6} align="stretch">
						<Box>
							<Badge colorScheme="purple" fontSize="sm" mb={2}>
								最終更新日: 2025年6月5日
							</Badge>
						</Box>

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								1. 基本方針
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								福島テレビが提供する「福島のこころ」（以下「本サービス」）は、利用者の個人情報を適切に管理し、プライバシーの保護に努めます。本プライバシーポリシーは、本サービスにおける個人情報の取り扱いについて定めるものです。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								2. 収集する情報
							</Heading>
							<VStack align="start" spacing={3}>
								<Box>
									<Text fontWeight="bold" color="gray.800" mb={2}>
										2.1 アカウント情報
									</Text>
									<Text color="gray.700" lineHeight="1.8" pl={4}>
										• ユーザー名、メールアドレス
										<br />• プロフィール設定情報
										<br />• ログイン履歴
									</Text>
								</Box>
								<Box>
									<Text fontWeight="bold" color="gray.800" mb={2}>
										2.2 利用状況情報
									</Text>
									<Text color="gray.700" lineHeight="1.8" pl={4}>
										• キャラクターとの会話履歴
										<br />• アプリ内での行動履歴
										<br />• 信頼関係レベルの進捗状況
									</Text>
								</Box>
								<Box>
									<Text fontWeight="bold" color="gray.800" mb={2}>
										2.3 技術情報
									</Text>
									<Text color="gray.700" lineHeight="1.8" pl={4}>
										• IPアドレス、ブラウザ情報
										<br />• デバイス情報
										<br />• アクセス解析情報
									</Text>
								</Box>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								3. 情報の利用目的
							</Heading>
							<VStack align="start" spacing={2}>
								<Text color="gray.700" lineHeight="1.8">
									• サービスの提供および改善
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• ユーザーサポートの提供
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• パーソナライズされた体験の提供
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• セキュリティの確保
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 福島県の観光・農業情報の提供
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 統計データの作成（個人を特定できない形式）
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								4. 情報の共有・開示
							</Heading>
							<Text color="gray.700" lineHeight="1.8" mb={3}>
								収集した個人情報は、以下の場合を除き第三者に提供いたしません：
							</Text>
							<VStack align="start" spacing={2}>
								<Text color="gray.700" lineHeight="1.8">
									• 利用者の同意がある場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 法令に基づく場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 生命、身体または財産の保護のために必要な場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• サービス提供に必要な範囲で業務委託先に提供する場合
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								5. AI技術の利用について
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								本サービスでは、会話体験の向上のためにAI技術（TASUKI
								API）を利用しています。
								会話データは適切な匿名化処理を行った上で、AI
								モデルの学習・改善に利用される場合があります。
								個人を特定できる情報が学習データとして使用されることはありません。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								6. データの保存・削除
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								個人情報は、サービス提供に必要な期間保存し、その後適切に削除いたします。
								アカウント削除時には、法令で保存が義務付けられている情報を除き、
								すべての個人情報を削除いたします。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								7. セキュリティ
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								個人情報の安全性を確保するため、適切な技術的・組織的セキュリティ対策を実施しています。
								ただし、インターネット上の通信においては、完全なセキュリティを保証することはできません。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="purple.700" mb={4}>
								8. お問い合わせ
							</Heading>
							<Text color="gray.700" lineHeight="1.8" mb={3}>
								個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
							</Text>
							<VStack align="start" spacing={2}>
								<Text color="gray.700">福島テレビ つな農 運営事務局</Text>
								<Text color="gray.700">
									Email: tsunano-support@fukushima-tv.co.jp
								</Text>
								<Text color="gray.700">Tel: 024-536-8000</Text>
							</VStack>
						</Box>

						<Divider />

						<Box textAlign="center" pt={4}>
							<Text fontSize="sm" color="gray.500">
								本プライバシーポリシーは、必要に応じて改定される場合があります。
								重要な変更がある場合は、サービス内でお知らせいたします。
							</Text>
						</Box>
					</VStack>
				</MotionBox>

				{/* 戻るリンク */}
				<Box textAlign="center" mt={8}>
					<Link
						href="settings"
						color="purple.600"
						fontSize="lg"
						fontWeight="bold"
					>
						← 設定画面に戻る
					</Link>
				</Box>
			</Container>
		</Box>
	);
};

export default PrivacyPolicyPage;
