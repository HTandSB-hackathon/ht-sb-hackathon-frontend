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
import { FaFileContract } from "react-icons/fa";

const MotionBox = motion(Box);

/**
 * 利用規約ページ
 * つながっぺうつくしみアプリの利用規約を表示
 */
const TermsOfServicePage: React.FC = () => {
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
						<FaFileContract size={48} color="blue" />
						<Heading
							size="3xl"
							bgGradient="linear(135deg, purple.600 0%, blue.600 50%, teal.500 100%)"
							bgClip="text"
							fontWeight="black"
							ml={4}
						>
							利用規約
						</Heading>
					</Box>
					<Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
						つながっぺうつくしみをご利用いただくための重要な規約です
					</Text>
				</MotionBox>

				{/* 利用規約内容 */}
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
							<Badge colorScheme="blue" fontSize="sm" mb={2}>
								最終更新日: 2025年6月5日
							</Badge>
						</Box>

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第1条（適用）
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								本利用規約（以下「本規約」）は、福島テレビが提供する「つながっぺうつくしみ」（以下「本サービス」）の利用に関して、
								本サービスを利用するお客様（以下「利用者」）と当社との間の権利義務関係を定めることを目的とし、
								利用者と当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第2条（利用登録）
							</Heading>
							<VStack align="start" spacing={3}>
								<Text color="gray.700" lineHeight="1.8">
									1.
									利用者は、本規約に同意の上、当社の定める方法によって利用登録を申請するものとします。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									2.
									当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
								</Text>
								<VStack align="start" spacing={2} pl={4}>
									<Text color="gray.700" lineHeight="1.8">
										• 利用登録の申請に際して虚偽の事項を届け出た場合
									</Text>
									<Text color="gray.700" lineHeight="1.8">
										• 本規約に違反したことがある者からの申請である場合
									</Text>
									<Text color="gray.700" lineHeight="1.8">
										•
										未成年者、成年被後見人、被保佐人または被補助人からの申請であり、
										法定代理人、後見人、保佐人または補助人の同意等を得ていない場合
									</Text>
									<Text color="gray.700" lineHeight="1.8">
										• その他、当社が利用登録を相当でないと判断した場合
									</Text>
								</VStack>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第3条（禁止事項）
							</Heading>
							<Text color="gray.700" lineHeight="1.8" mb={3}>
								利用者は、本サービスの利用にあたり、以下の行為をしてはなりません：
							</Text>
							<VStack align="start" spacing={2}>
								<Text color="gray.700" lineHeight="1.8">
									• 法令または公序良俗に違反する行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 犯罪行為に関連する行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 当社、他の利用者、または第三者の知的財産権を侵害する行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									•
									当社、他の利用者、または第三者の名誉、信用、プライバシーを侵害する行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 本サービスに過度の負荷をかける行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 本サービスの運営を妨害するおそれのある行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 不正アクセス等のサイバー攻撃に関する行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 他の利用者に成りすます行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• 反社会的勢力等への利益供与その他の協力行為
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• その他、当社が不適切と判断する行為
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第4条（本サービスの提供の停止等）
							</Heading>
							<Text color="gray.700" lineHeight="1.8" mb={3}>
								当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
							</Text>
							<VStack align="start" spacing={2}>
								<Text color="gray.700" lineHeight="1.8">
									•
									本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									•
									地震、落雷、火災、停電または天災等の不可抗力により、本サービスの提供が困難となった場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• コンピュータまたは通信回線等が事故により停止した場合
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									• その他、当社が本サービスの提供が困難と判断した場合
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第5条（知的財産権）
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								本サービスに関する知的財産権は、当社または当社にその利用を許諾した権利者に帰属します。
								利用者は、本サービスを利用することにより得られる情報を、当社の事前の書面による承諾なしに、
								複製、送信、譲渡、貸与、翻訳、翻案、改変、リバースエンジニアリング、
								逆コンパイル、逆アセンブル等をすることはできません。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第6条（AI技術の利用に関する特約）
							</Heading>
							<VStack align="start" spacing={3}>
								<Text color="gray.700" lineHeight="1.8">
									1.
									本サービスでは、より良い体験を提供するため、AI技術を活用した会話システムを利用しています。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									2.
									AIによる応答は機械学習に基づくものであり、完全性や正確性を保証するものではありません。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									3.
									利用者は、AIとの会話を通じて得られた情報について、自己の責任において判断し行動するものとします。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									4.
									当社は、AIによる応答に起因する損害について一切の責任を負いません。
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第7条（免責事項）
							</Heading>
							<VStack align="start" spacing={3}>
								<Text color="gray.700" lineHeight="1.8">
									1.
									当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									2.
									当社は、本サービスに起因して利用者に生じたあらゆる損害について、
									当社の故意または重過失による場合を除き、一切の責任を負いません。
								</Text>
								<Text color="gray.700" lineHeight="1.8">
									3.
									本サービスに関連して利用者と他の利用者または第三者との間において生じた取引、連絡または紛争等について、
									当社は一切責任を負いません。
								</Text>
							</VStack>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第8条（サービス内容の変更等）
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								当社は、利用者への事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、
								利用者はこれに同意するものとします。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第9条（利用規約の変更）
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								当社は以下の場合には、利用者の個別の同意を要することなく、本規約を変更することができるものとします。
								変更後の利用規約は、当社ウェブサイトに掲示された時点から効力を生じるものとします。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								第10条（準拠法・管轄裁判所）
							</Heading>
							<Text color="gray.700" lineHeight="1.8">
								本規約の解釈にあたっては、日本法を準拠法とします。
								本サービスに関して紛争が生じた場合には、福島地方裁判所を専属的合意管轄とします。
							</Text>
						</Box>

						<Divider />

						<Box>
							<Heading size="lg" color="blue.700" mb={4}>
								お問い合わせ
							</Heading>
							<Text color="gray.700" lineHeight="1.8" mb={3}>
								本規約に関するお問い合わせは、以下までご連絡ください：
							</Text>
							<VStack align="start" spacing={2}>
								<Text color="gray.700">福島テレビ つながっぺうつくしみ 運営事務局</Text>
								<Text color="gray.700">
									Email: tsunano-support@fukushima-tv.co.jp
								</Text>
								<Text color="gray.700">Tel: 024-536-8000</Text>
								<Text color="gray.700">〒960-8531 福島県福島市西中央1-1</Text>
							</VStack>
						</Box>

						<Divider />

						<Box textAlign="center" pt={4}>
							<Text fontSize="sm" color="gray.500">
								以上
							</Text>
						</Box>
					</VStack>
				</MotionBox>

				{/* 戻るリンク */}
				<Box textAlign="center" mt={8}>
					<Link
						href="settings"
						color="blue.600"
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

export default TermsOfServicePage;
