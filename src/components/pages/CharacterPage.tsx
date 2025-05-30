import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';

const CharacterPage: React.FC = () => {
    const handleChat = () => {
        return;
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                各会話
            </Heading>
            <Button colorScheme="teal" onClick={handleChat}>
                チャットする
            </Button>
        </Box>
    );
};

export default CharacterPage;
