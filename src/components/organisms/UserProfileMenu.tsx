import { authTokenAtom } from "@/lib/atom/AuthAtom";
import { userAtom } from "@/lib/atom/UserAtom";
import {
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import type React from "react";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";

export interface UserProfileMenuProps {
	user: { name?: string | null; avatarUrl?: string | null } | null | undefined;
	cardBg: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
	user,
	cardBg,
}) => {
	const navigate = useNavigate();

	const setAuthToken = useSetAtom(authTokenAtom);
	const setUser = useSetAtom(userAtom);

	return (
		<Box position="fixed" top={4} right={4} zIndex="1000">
			<Menu>
				<MenuButton
					as={IconButton}
					icon={
						<Avatar
							size="lg"
							name={user?.name ?? "ユーザー"}
							bg="purple.500"
							color="white"
							shadow="lg"
							border="3px solid"
							borderColor="white"
							cursor="pointer"
							_hover={{
								transform: "scale(1.05)",
								shadow: "xl",
							}}
							transition="all 0.2s"
							src={user?.avatarUrl ?? undefined}
						/>
					}
					variant="ghost"
					aria-label="メニュー"
					bg="transparent"
					p={0}
					minW="auto"
					h="auto"
					borderRadius="full"
				/>
				<MenuList
					bg={cardBg}
					borderRadius="xl"
					shadow="2xl"
					border="1px solid"
					borderColor="gray.200"
					p={2}
					minW="240px"
				>
					<MenuItem
						icon={<FaUser />}
						borderRadius="lg"
						p={3}
						_hover={{ bg: "purple.50" }}
						onClick={() => navigate("/profile")}
					>
						<VStack align="start" spacing={0}>
							<Text fontWeight="bold">プロフィール</Text>
							<Text fontSize="sm" color="gray.500">
								個人情報の編集
							</Text>
						</VStack>
					</MenuItem>
					<MenuDivider />
					<MenuItem
						icon={<FaCog />}
						borderRadius="lg"
						p={3}
						_hover={{ bg: "gray.50" }}
						onClick={() => navigate("/settings")}
					>
						設定
					</MenuItem>
					<MenuItem
						icon={<FaSignOutAlt />}
						borderRadius="lg"
						p={3}
						_hover={{ bg: "red.50" }}
						color="red.600"
						onClick={() => {
							// トークンとユーザー情報をクリア
							setAuthToken(null);
							setUser(null);
							navigate("/login");
						}}
					>
						ログアウト
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};
