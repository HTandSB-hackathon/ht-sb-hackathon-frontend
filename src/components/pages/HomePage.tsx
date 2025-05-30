import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const HomePage: React.FC = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                ホーム画面
            </Heading>
        </Box>
    );
};

export default HomePage;
