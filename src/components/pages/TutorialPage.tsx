import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const TutorialPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStartTutorial = () => {
        return;
    };

    const handleHomeRedirect = () => {
        navigate('/home');
    };

    return (
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
    );
};

export default TutorialPage;
