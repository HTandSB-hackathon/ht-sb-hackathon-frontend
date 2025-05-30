import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const LandingPage: React.FC = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                LPページ
            </Heading>
        </Box>
    );
};

export default LandingPage;
