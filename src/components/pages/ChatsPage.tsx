import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const ChatsPage: React.FC = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                会話画面一覧
            </Heading>
        </Box>
    );
};

export default ChatsPage;
