import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const TutorialPage: React.FC = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                チュートリアル画面
            </Heading>
        </Box>
    );
};

export default TutorialPage;
