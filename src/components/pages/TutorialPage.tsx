import { Box, Button, Heading } from "@chakra-ui/react";
import type React from "react";
import { useNavigate } from "react-router";

import Header from "@/components/organisms/Header";

const TutorialPage: React.FC = () => {
	const navigate = useNavigate();

	const handleStartTutorial = () => {
		return;
	};

	const handleHomeRedirect = () => {
		navigate("/home");
	};

	return (
		<Box>
			<Header />
			<Box textAlign="center" py={10} px={6}>
				<Heading as="h1" size="2xl" mb={4}>
					チュートリアル画面
				</Heading>
				<Button colorScheme="teal" onClick={handleStartTutorial}>
					チュートリアルを開始する
				</Button>
				<Button colorScheme="blue" onClick={handleHomeRedirect}>
					ホーム画面へ
				</Button>
			</Box>
		</Box>
	);
};

export default TutorialPage;
