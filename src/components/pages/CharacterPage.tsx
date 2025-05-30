import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const CharacterPage: React.FC = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                各会話
            </Heading>
        </Box>
    );
};

export default CharacterPage;
