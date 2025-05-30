import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleChatsRedirect = () => {
        navigate('/chats');
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                ホーム画面
            </Heading>
            <Button colorScheme="blue" onClick={handleChatsRedirect}>
                会話画面一覧へ
            </Button>
        </Box>
    );
};

export default HomePage;
