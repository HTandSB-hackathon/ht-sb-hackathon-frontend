import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleUserRegister = () => {
        return;
    };

    const handleTutorialRedirect = () => {
        navigate('/tutorial');
    };

    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h1" size="2xl" mb={4}>
                アカウント作成画面
            </Heading>
            <Button colorScheme="teal" onClick={handleUserRegister}>
                ユーザーを登録する
            </Button>
            <Button colorScheme="blue" onClick={handleTutorialRedirect}>
                チュートリアル画面へ
            </Button>
        </Box>
    );
};

export default RegisterPage;
