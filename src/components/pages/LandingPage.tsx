import { Box, Button, Heading } from "@chakra-ui/react";
import type React from "react";
import { useNavigate } from "react-router";

import Header from "@/components/organisms/Header";

const LandingPage: React.FC = () => {
	const navigate = useNavigate();

	const handleRegisterRedirect = () => {
		navigate("/register");
	};

	const handleLoginRedirect = () => {
		navigate("/login");
	};

	return (
		<Box>
			<Header />
			<Box textAlign="center" py={10} px={6}>
				<Heading as="h1" size="2xl" mb={4}>
					LPページ
				</Heading>
				<Button colorScheme="teal" onClick={handleRegisterRedirect}>
					アカウント作成画面へ
				</Button>
				<Button colorScheme="blue" onClick={handleLoginRedirect}>
					ログイン画面へ
				</Button>
			</Box>
		</Box>
	);
};

export default LandingPage;
