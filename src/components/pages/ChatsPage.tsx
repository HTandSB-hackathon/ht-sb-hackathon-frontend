import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

import Header from "@/components/organisms/Header";

const ChatsPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCharacterRedirect = () => {
        navigate('/chats/characterId');
    };

    return (
        <Box>
            <Header />
            <Box textAlign="center" py={10} px={6}>
                <Heading as="h1" size="2xl" mb={4}>
                    会話画面一覧
                </Heading>
                <Button colorScheme="teal" onClick={handleCharacterRedirect}>
                    各会話へ
                </Button>
            </Box>
        </Box>
    );
};

export default ChatsPage;
