import { getUserAtom, isUserLoadingAtom, userAtom } from "@/lib/atom/UserAtom";
import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	Grid,
	GridItem,
	Heading,
	Spacer,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { FiEdit2, FiMapPin, FiUser } from "react-icons/fi";

import Header from "@/components/organisms/Header";

export default function ProfilePage() {
	const user = useAtomValue(userAtom);
	const isLoading = useAtomValue(isUserLoadingAtom);
	const fetchUser = useSetAtom(getUserAtom);

	useEffect(() => {
		if (!user) {
			fetchUser();
		}
	}, [user, fetchUser]);

	if (isLoading) {
		return (
			<Box>
				<Header />
				<Flex justify="center" align="center" h="50vh">
					<Spinner size="lg" />
				</Flex>
			</Box>
		);
	}

	return (
		<Box>
			<Header />
			<Box maxW="6xl" mx="auto" p={6}>
				<Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={6}>
					{/* プロフィール情報 */}
					<GridItem>
						<Card>
							<CardHeader>
								<Flex align="center">
									<Heading size="md">プロフィール</Heading>
									<Spacer />
									<Button size="sm" leftIcon={<FiEdit2 />} variant="outline">
										編集
									</Button>
								</Flex>
							</CardHeader>
							<CardBody>
								<VStack spacing={4} align="stretch">
									<Flex align="center">
										<Avatar size="xl" name={user?.name || "ユーザー"} />
										<Box ml={4}>
											<Text fontSize="xl" fontWeight="bold">
												{user?.name || "ユーザー名"}
											</Text>
											<Text color="gray.600">{user?.email}</Text>
										</Box>
									</Flex>

									{user?.prefecture && (
										<Flex align="center">
											<FiMapPin />
											<Text ml={2}>{user.prefecture}</Text>
										</Flex>
									)}

									<Box>
										<Text fontSize="sm" color="gray.600" mb={2}>
											アカウント情報
										</Text>
										<Text fontSize="sm">
											登録日: {new Date().toLocaleDateString("ja-JP")}
										</Text>
									</Box>
								</VStack>
							</CardBody>
						</Card>
					</GridItem>

					{/* アクティビティ情報 */}
					<GridItem>
						<VStack spacing={4} align="stretch">
							{/* つながり統計 */}
							<Card>
								<CardHeader>
									<Heading size="md">つながり統計</Heading>
								</CardHeader>
								<CardBody>
									<Grid templateColumns="repeat(3, 1fr)" gap={4}>
										<Box textAlign="center">
											<Text fontSize="2xl" fontWeight="bold" color="green.500">
												3
											</Text>
											<Text fontSize="sm" color="gray.600">
												出会った人数
											</Text>
										</Box>
										<Box textAlign="center">
											<Text fontSize="2xl" fontWeight="bold" color="blue.500">
												48
											</Text>
											<Text fontSize="sm" color="gray.600">
												総会話数
											</Text>
										</Box>
										<Box textAlign="center">
											<Text fontSize="2xl" fontWeight="bold" color="purple.500">
												2
											</Text>
											<Text fontSize="sm" color="gray.600">
												最高信頼レベル
											</Text>
										</Box>
									</Grid>
								</CardBody>
							</Card>

							{/* 実績 */}
							<Card>
								<CardHeader>
									<Heading size="md">実績</Heading>
								</CardHeader>
								<CardBody>
									<VStack spacing={3} align="stretch">
										<Flex justify="space-between" align="center">
											<Text>初めての出会い</Text>
											<Badge colorScheme="green">達成</Badge>
										</Flex>
										<Flex justify="space-between" align="center">
											<Text>信頼レベル2達成</Text>
											<Badge colorScheme="green">達成</Badge>
										</Flex>
										<Flex justify="space-between" align="center">
											<Text>10回会話達成</Text>
											<Badge colorScheme="green">達成</Badge>
										</Flex>
										<Flex justify="space-between" align="center">
											<Text>友達紹介</Text>
											<Badge colorScheme="gray">未達成</Badge>
										</Flex>
										<Flex justify="space-between" align="center">
											<Text>贈り物を受け取る</Text>
											<Badge colorScheme="gray">未達成</Badge>
										</Flex>
									</VStack>
								</CardBody>
							</Card>

							{/* お気に入りの人 */}
							<Card>
								<CardHeader>
									<Heading size="md">お気に入りの人</Heading>
								</CardHeader>
								<CardBody>
									<VStack spacing={3}>
										<Flex w="full" justify="space-between" align="center">
											<Flex align="center">
												<Avatar size="sm" />
												<Box ml={3}>
													<Text fontWeight="medium">佐藤花子さん</Text>
													<Text fontSize="sm" color="gray.600">
														須賀川市・農家
													</Text>
												</Box>
											</Flex>
											<Badge colorScheme="green">Lv.2</Badge>
										</Flex>
										<Flex w="full" justify="space-between" align="center">
											<Flex align="center">
												<Avatar size="sm" />
												<Box ml={3}>
													<Text fontWeight="medium">田中一郎さん</Text>
													<Text fontSize="sm" color="gray.600">
														三春町・農家
													</Text>
												</Box>
											</Flex>
											<Badge colorScheme="blue">Lv.1</Badge>
										</Flex>
									</VStack>
								</CardBody>
							</Card>
						</VStack>
					</GridItem>
				</Grid>
			</Box>
		</Box>
	);
}
