import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Badge,
  Progress,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Spacer,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Center,
  useToast,
  Tooltip,
  Divider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Stack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaShare, 
  FaHeart, 
  FaComment,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGift,
  FaStar,
  FaLock,
  FaUnlock
} from 'react-icons/fa';
import { 
  MdLocationCity, 
  MdPerson, 
  MdBook, 
  MdFavorite,
  MdChat,
  MdCake,
  MdWork
} from 'react-icons/md';

import { CharacterQuery } from '../../lib/domain/CharacterQuery';
import {
  selectedCharacterDetailAtom,
  characterDetailLoadingAtom
} from '../../lib/atom/CharacterAtom';
import { TRUST_LEVELS } from '../../lib/types/character';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

/**
 * キャラクター詳細ページ - 最高のデザイン
 */
export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [characterDetail, setCharacterDetail] = useAtom(selectedCharacterDetailAtom);
  const [isLoading, setIsLoading] = useAtom(characterDetailLoadingAtom);
  const [error, setError] = React.useState<string | null>(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const toast = useToast();

  // レスポンシブデザイン
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const avatarSize = useBreakpointValue({ base: '2xl', md: '3xl' });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

  // カラーテーマ
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  // 地域テーマ
  const getCityTheme = (city: string) => {
    const themes: Record<string, { 
      color: string; 
      emoji: string; 
      gradient: string;
      specialty: string;
    }> = {
      '須賀川市': { 
        color: 'purple', 
        emoji: '🍇', 
        gradient: 'linear(to-r, purple.400, pink.400)',
        specialty: 'ウルトラマンの故郷'
      },
      '三春町': { 
        color: 'pink', 
        emoji: '🌸', 
        gradient: 'linear(to-r, pink.400, rose.400)',
        specialty: '滝桜で有名'
      },
      '中島村': { 
        color: 'green', 
        emoji: '🌾', 
        gradient: 'linear(to-r, green.400, teal.400)',
        specialty: '豊かな田園風景'
      },
    };
    return themes[city] || { 
      color: 'gray', 
      emoji: '🏔️', 
      gradient: 'linear(to-r, gray.400, gray.500)',
      specialty: '自然の恵み'
    };
  };

  const cityTheme = characterDetail ? getCityTheme(characterDetail.city) : null;

  // データ取得
  React.useEffect(() => {
    if (id) {
      loadCharacterDetail(id);
    }
  }, [id]);

  const loadCharacterDetail = async (characterId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const detail = await CharacterQuery.getCharacterDetail(characterId);
      setCharacterDetail(detail);
    } catch (err) {
      console.error('キャラクター詳細読み込みエラー:', err);
      setError('キャラクター情報の読み込みに失敗しました');
      toast({
        title: 'エラー',
        description: 'データの読み込みに失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = () => {
    if (characterDetail) {
      navigate(`/chat/${characterDetail.id}`);
    }
  };

  const handleBack = () => {
    navigate('/characters');
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'お気に入りから削除' : 'お気に入りに追加',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // ローディング表示
  if (isLoading) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} position="relative">
        <Container maxW="6xl" p={containerPadding}>
          <VStack spacing={8} align="stretch" py={8}>
            {/* ヘッダースケルトン */}
            <Card bg={cardBg} borderRadius="2xl" shadow="xl">
              <CardBody p={6}>
                <HStack spacing={4}>
                  <Skeleton borderRadius="full" boxSize="50px" />
                  <VStack align="start" spacing={2} flex={1}>
                    <SkeletonText noOfLines={1} width="150px" />
                    <SkeletonText noOfLines={1} width="100px" />
                  </VStack>
                </HStack>
              </CardBody>
            </Card>

            {/* プロフィールスケルトン */}
            <Card bg={cardBg} borderRadius="2xl" shadow="xl">
              <CardBody p={8}>
                <VStack spacing={6}>
                  <SkeletonCircle size="150px" />
                  <SkeletonText noOfLines={3} width="80%" textAlign="center" />
                  <Skeleton height="40px" width="200px" borderRadius="2xl" />
                </VStack>
              </CardBody>
            </Card>

            {/* コンテンツスケルトン */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} bg={cardBg} borderRadius="xl" shadow="lg">
                  <CardBody>
                    <SkeletonText noOfLines={5} />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  // エラー表示
  if (error || !characterDetail) {
    return (
      <Box minH="100vh" bgGradient={bgGradient} display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md">
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            bg={cardBg}
            borderRadius="2xl"
            shadow="2xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={6}>
              <Text fontSize="6xl">😞</Text>
              <Heading size="lg" color="gray.600">
                読み込みエラー
              </Heading>
              <Text color="gray.500">
                {error || 'キャラクター情報が見つかりませんでした'}
              </Text>
              <HStack spacing={4}>
                <Button
                  colorScheme="purple"
                  onClick={() => id && loadCharacterDetail(id)}
                  leftIcon={<Icon as={FaArrowLeft} />}
                >
                  再読み込み
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  一覧に戻る
                </Button>
              </HStack>
            </VStack>
          </MotionCard>
        </Container>
      </Box>
    );
  }

  const trustLevel = characterDetail.relationship?.trustLevel || 1;
  const trustInfo = TRUST_LEVELS[trustLevel as keyof typeof TRUST_LEVELS];
  const progress = characterDetail.relationship 
    ? (characterDetail.relationship.trustPoints / characterDetail.relationship.nextLevelPoints) * 100 
    : 0;

  return (
    <Box minH="100vh" bgGradient={bgGradient} position="relative">
      {/* 背景装飾 */}
      <Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
        <MotionBox
          position="absolute"
          top="-20%"
          right="-20%"
          width="40%"
          height="40%"
          bgGradient="radial(circle, purple.200 0%, transparent 70%)"
          opacity="0.4"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </Box>

      <Container maxW="6xl" p={containerPadding} position="relative" zIndex="1">
        <VStack spacing={8} align="stretch">
          {/* ヘッダー */}
          <MotionCard
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            bg={headerBg}
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            shadow="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <CardBody p={6}>
              <Flex align="center" gap={4}>
                <Button
                  leftIcon={<FaArrowLeft />}
                  variant="ghost"
                  onClick={handleBack}
                  borderRadius="xl"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  戻る
                </Button>

                <Spacer />

                {cityTheme && (
                  <Badge
                    colorScheme={cityTheme.color}
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {cityTheme.emoji} {characterDetail.city}
                  </Badge>
                )}

                <Tooltip label="シェア">
                  <IconButton
                    aria-label="share"
                    icon={<FaShare />}
                    variant="ghost"
                    borderRadius="full"
                    _hover={{ bg: "whiteAlpha.200" }}
                  />
                </Tooltip>
              </Flex>
            </CardBody>
          </MotionCard>

          {/* メインプロフィール */}
          <MotionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            bg={cardBg}
            borderRadius="2xl"
            shadow="2xl"
            overflow="hidden"
          >
            {/* カバー画像 */}
            <Box
              height="200px"
              bgGradient={cityTheme?.gradient || 'linear(to-r, gray.400, gray.500)'}
              position="relative"
            >
              {characterDetail.coverImage && (
                <Image
                  src={characterDetail.coverImage}
                  alt=""
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              )}
              <Box
                position="absolute"
                inset="0"
                bgGradient="linear(to-t, blackAlpha.600, transparent)"
              />
            </Box>

            <CardBody p={8} mt={-16} position="relative">
              <VStack spacing={6} align="center">
                {/* アバター */}
                <Box position="relative">
                  <Avatar
                    size={avatarSize}
                    src={characterDetail.profileImage}
                    name={characterDetail.name}
                    border="6px solid white"
                    shadow="2xl"
                  />
                  <Box
                    position="absolute"
                    bottom="2"
                    right="2"
                    bg="white"
                    borderRadius="full"
                    p="2"
                    border="2px solid"
                    borderColor={`${cityTheme?.color}.400`}
                    fontSize="lg"
                  >
                    {cityTheme?.emoji}
                  </Box>
                </Box>

                {/* 基本情報 */}
                <VStack spacing={3} textAlign="center">
                  <Heading size={headerSize} color="gray.800" noOfLines={1}>
                    {characterDetail.name}
                  </Heading>
                  <Text fontSize="lg" color="gray.500" fontWeight="medium" noOfLines={1}>
                    {characterDetail.nameKana}
                  </Text>
                  
                  {/* スマホ表示最適化: 縦並びレイアウト */}
                  <VStack 
                    spacing={2} 
                    display={{ base: "flex", md: "none" }}
                    fontSize="sm" 
                    color="gray.600"
                  >
                    <HStack spacing={2}>
                      <Icon as={MdCake} color="purple.500" />
                      <Text fontWeight="medium">{characterDetail.age}歳</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={MdWork} color="blue.500" />
                      <Text fontWeight="medium" noOfLines={1}>{characterDetail.occupation}</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FaMapMarkerAlt} color="green.500" />
                      <Text fontWeight="medium">{characterDetail.city}</Text>
                    </HStack>
                  </VStack>
                  
                  {/* デスクトップ表示: 横並びレイアウト */}
                  <HStack 
                    spacing={4} 
                    fontSize="sm" 
                    color="gray.600" 
                    wrap="wrap" 
                    justify="center"
                    display={{ base: "none", md: "flex" }}
                  >
                    <HStack>
                      <Icon as={MdCake} color="purple.500" />
                      <Text>{characterDetail.age}歳</Text>
                    </HStack>
                    <HStack>
                      <Icon as={MdWork} color="blue.500" />
                      <Text>{characterDetail.occupation}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="green.500" />
                      <Text>{characterDetail.city}</Text>
                    </HStack>
                  </HStack>
                </VStack>

                {/* 信頼度 */}
                {characterDetail.relationship && (
                  <Card bg="gray.50" borderRadius="xl" w="full" maxW="md">
                    <CardBody p={4}>
                      <VStack spacing={3}>
                        <HStack justify="space-between" w="full">
                          <Badge
                            colorScheme={trustInfo.color}
                            variant="subtle"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            <HStack spacing={1}>
                              <FaStar />
                              <Text>{trustInfo.name}</Text>
                            </HStack>
                          </Badge>
                          <Text fontSize="sm" color="gray.600">
                            Lv.{trustLevel} ({characterDetail.relationship.trustPoints}/{characterDetail.relationship.nextLevelPoints})
                          </Text>
                        </HStack>
                        <Progress
                          value={progress}
                          colorScheme={trustInfo.color}
                          size="lg"
                          borderRadius="full"
                          w="full"
                          hasStripe
                          isAnimated
                        />
                      </VStack>
                    </CardBody>
                  </Card>
                )}

                {/* アクションボタン */}
                <Stack 
                  direction={{ base: "column", sm: "row" }} 
                  spacing={4} 
                  w={{ base: "full", sm: "auto" }}
                  align="center"
                >
                  <Button
                    colorScheme="purple"
                    size={{ base: "md", md: "lg" }}
                    leftIcon={<FaComment />}
                    onClick={handleStartConversation}
                    borderRadius="2xl"
                    px={{ base: 6, md: 8 }}
                    w={{ base: "full", sm: "auto" }}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    会話を始める
                  </Button>
                  <IconButton
                    aria-label="favorite"
                    icon={isFavorite ? <FaHeart /> : <FaHeart />}
                    colorScheme={isFavorite ? "red" : "gray"}
                    variant={isFavorite ? "solid" : "outline"}
                    size={{ base: "md", md: "lg" }}
                    borderRadius="2xl"
                    onClick={handleFavoriteToggle}
                    _hover={{
                      transform: "scale(1.1)",
                    }}
                  />
                </Stack>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* タブセクション */}
          <MotionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            bg={cardBg}
            borderRadius="2xl"
            shadow="xl"
          >
            <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" isLazy>
              <TabList borderBottom="none" bg="gray.50" borderTopRadius="2xl" overflowX="auto">
                <Tab
                  flex="1"
                  _selected={{ bg: cardBg, borderColor: "gray.200" }}
                  borderRadius="xl"
                  m={2}
                  fontWeight="bold"
                  minW={{ base: "120px", md: "auto" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <VStack spacing={1} display={{ base: "flex", sm: "none" }}>
                    <Icon as={MdPerson} boxSize={4} />
                    <Text>プロフィール</Text>
                  </VStack>
                  <HStack display={{ base: "none", sm: "flex" }}>
                    <Icon as={MdPerson} />
                    <Text>プロフィール</Text>
                  </HStack>
                </Tab>
                <Tab
                  flex="1"
                  _selected={{ bg: cardBg, borderColor: "gray.200" }}
                  borderRadius="xl"
                  m={2}
                  fontWeight="bold"
                  minW={{ base: "120px", md: "auto" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <VStack spacing={1} display={{ base: "flex", sm: "none" }}>
                    <Icon as={MdLocationCity} boxSize={4} />
                    <Text>地域の魅力</Text>
                  </VStack>
                  <HStack display={{ base: "none", sm: "flex" }}>
                    <Icon as={MdLocationCity} />
                    <Text>地域の魅力</Text>
                  </HStack>
                </Tab>
                <Tab
                  flex="1"
                  _selected={{ bg: cardBg, borderColor: "gray.200" }}
                  borderRadius="xl"
                  m={2}
                  fontWeight="bold"
                  minW={{ base: "120px", md: "auto" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <VStack spacing={1} display={{ base: "flex", sm: "none" }}>
                    <Icon as={MdBook} boxSize={4} />
                    <Text>ストーリー</Text>
                  </VStack>
                  <HStack display={{ base: "none", sm: "flex" }}>
                    <Icon as={MdBook} />
                    <Text>ストーリー</Text>
                  </HStack>
                </Tab>
                <Tab
                  flex="1"
                  _selected={{ bg: cardBg, borderColor: "gray.200" }}
                  borderRadius="xl"
                  m={2}
                  fontWeight="bold"
                  minW={{ base: "120px", md: "auto" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <VStack spacing={1} display={{ base: "flex", sm: "none" }}>
                    <Icon as={FaGift} boxSize={4} />
                    <Text>つながり</Text>
                  </VStack>
                  <HStack display={{ base: "none", sm: "flex" }}>
                    <Icon as={FaGift} />
                    <Text>つながり</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* プロフィールタブ */}
                <TabPanel p={8}>
                  <VStack spacing={8} align="stretch">
                    {/* 自己紹介 */}
                    <Box>
                      <Heading size="md" mb={4} color="gray.700">
                        💭 自己紹介
                      </Heading>
                      <Text color="gray.600" lineHeight="tall" fontSize="lg">
                        {characterDetail.introduction}
                      </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      {/* 性格 */}
                      <Box>
                        <Heading size="sm" mb={4} color="gray.700">
                          ✨ 性格
                        </Heading>
                        <Wrap>
                          {characterDetail.personality.map((trait, index) => (
                            <WrapItem key={index}>
                              <Tag colorScheme="green" size="lg" borderRadius="full">
                                <TagLabel>{trait}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>

                      {/* 趣味 */}
                      <Box>
                        <Heading size="sm" mb={4} color="gray.700">
                          🎯 趣味
                        </Heading>
                        <Wrap>
                          {characterDetail.hobbies.map((hobby, index) => (
                            <WrapItem key={index}>
                              <Tag colorScheme="blue" size="lg" borderRadius="full">
                                <TagLabel>{hobby}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>

                      {/* 得意なこと */}
                      <Box>
                        <Heading size="sm" mb={4} color="gray.700">
                          🏆 得意なこと
                        </Heading>
                        <Wrap>
                          {characterDetail.specialties.map((specialty, index) => (
                            <WrapItem key={index}>
                              <Tag colorScheme="purple" size="lg" borderRadius="full">
                                <TagLabel>{specialty}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>

                      {/* 地域の特産品 */}
                      <Box>
                        <Heading size="sm" mb={4} color="gray.700">
                          🏞️ 地域の特産品
                        </Heading>
                        <SimpleGrid columns={2} spacing={4}>
                          {characterDetail.localSpecialties.map((specialty) => (
                            <MotionBox
                              key={specialty.id}
                              whileHover={{ scale: 1.05 }}
                              cursor="pointer"
                            >
                              <Card size="sm" borderRadius="xl" overflow="hidden">
                                <Image
                                  src={specialty.imageUrl}
                                  alt={specialty.name}
                                  height="100px"
                                  objectFit="cover"
                                />
                                <CardBody p={3}>
                                  <Text fontWeight="bold" fontSize="sm" textAlign="center">
                                    {specialty.name}
                                  </Text>
                                  {specialty.season && (
                                    <Text fontSize="xs" color="gray.500" textAlign="center">
                                      旬: {specialty.season}
                                    </Text>
                                  )}
                                </CardBody>
                              </Card>
                            </MotionBox>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                {/* 地域の魅力タブ */}
                <TabPanel p={8}>
                  <VStack spacing={8}>
                    <Box textAlign="center">
                      <Heading size="lg" mb={4}>
                        {cityTheme?.emoji} {characterDetail.city}の魅力
                      </Heading>
                      <Text color="gray.600" fontSize="lg">
                        {cityTheme?.specialty}
                      </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                      <MotionCard
                        whileHover={{ y: -5 }}
                        bg="blue.50"
                        borderRadius="xl"
                        textAlign="center"
                        p={6}
                      >
                        <Text fontSize="4xl" mb={4}>🏞️</Text>
                        <Heading size="md" mb={2}>観光スポット</Heading>
                        <Text color="gray.600">
                          美しい自然と歴史的建造物が織りなす絶景
                        </Text>
                      </MotionCard>

                      <MotionCard
                        whileHover={{ y: -5 }}
                        bg="orange.50"
                        borderRadius="xl"
                        textAlign="center"
                        p={6}
                      >
                        <Text fontSize="4xl" mb={4}>🍜</Text>
                        <Heading size="md" mb={2}>ご当地グルメ</Heading>
                        <Text color="gray.600">
                          地元食材を使った心温まる絶品料理
                        </Text>
                      </MotionCard>

                      <MotionCard
                        whileHover={{ y: -5 }}
                        bg="green.50"
                        borderRadius="xl"
                        textAlign="center"
                        p={6}
                      >
                        <Text fontSize="4xl" mb={4}>🎭</Text>
                        <Heading size="md" mb={2}>伝統文化</Heading>
                        <Text color="gray.600">
                          受け継がれる伝統と現代の融合
                        </Text>
                      </MotionCard>
                    </SimpleGrid>

                    <Center>
                      <Button
                        colorScheme="purple"
                        size="lg"
                        leftIcon={<FaComment />}
                        onClick={handleStartConversation}
                        borderRadius="2xl"
                      >
                        {characterDetail.name}さんと地域について語る
                      </Button>
                    </Center>
                  </VStack>
                </TabPanel>

                {/* ストーリータブ */}
                <TabPanel p={8}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" textAlign="center" color="gray.700">
                      📖 {characterDetail.name}さんのストーリー
                    </Heading>
                    
                    <VStack spacing={4}>
                      {characterDetail.stories.map((story) => (
                        <Card
                          key={story.id}
                          w="full"
                          borderRadius="xl"
                          shadow={story.isUnlocked ? "md" : "sm"}
                          opacity={story.isUnlocked ? 1 : 0.6}
                          bg={story.isUnlocked ? "white" : "gray.50"}
                        >
                          <CardBody p={6}>
                            <HStack justify="space-between" mb={3}>
                              <Heading size="sm">
                                {story.isUnlocked ? story.title : '???'}
                              </Heading>
                              <HStack>
                                <Icon 
                                  as={story.isUnlocked ? FaUnlock : FaLock} 
                                  color={story.isUnlocked ? "green.500" : "gray.400"}
                                />
                                <Badge colorScheme={story.isUnlocked ? "green" : "gray"}>
                                  Lv.{story.requiredTrustLevel}必要
                                </Badge>
                              </HStack>
                            </HStack>
                            <Text color="gray.600">
                              {story.isUnlocked 
                                ? story.content 
                                : `信頼レベルを${story.requiredTrustLevel}まで上げると解放されます`
                              }
                            </Text>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </VStack>
                </TabPanel>

                {/* つながりタブ */}
                <TabPanel p={8}>
                  <VStack spacing={8}>
                    <Heading size="md" textAlign="center" color="gray.700">
                      💕 {characterDetail.name}さんとのつながり
                    </Heading>

                    {characterDetail.relationship && (
                      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
                        <Stat textAlign="center">
                          <StatLabel>
                            <Icon as={FaCalendarAlt} mr={2} />
                            初回出会い
                          </StatLabel>
                          <StatNumber fontSize="md">
                            {new Date(characterDetail.relationship.firstMetAt).toLocaleDateString('ja-JP')}
                          </StatNumber>
                        </Stat>

                        <Stat textAlign="center">
                          <StatLabel>
                            <Icon as={FaComment} mr={2} />
                            会話回数
                          </StatLabel>
                          <StatNumber>{characterDetail.relationship.totalConversations}</StatNumber>
                          <StatHelpText>回</StatHelpText>
                        </Stat>

                        <Stat textAlign="center">
                          <StatLabel>
                            <Icon as={FaStar} mr={2} />
                            信頼度
                          </StatLabel>
                          <StatNumber>{characterDetail.relationship.trustPoints}</StatNumber>
                          <StatHelpText>ポイント</StatHelpText>
                        </Stat>

                        <Stat textAlign="center">
                          <StatLabel>
                            <Icon as={FaGift} mr={2} />
                            贈り物
                          </StatLabel>
                          <StatNumber>{characterDetail.relationship.receivedGifts.length}</StatNumber>
                          <StatHelpText>個</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    )}

                    <Center>
                      <Text color="gray.500" fontStyle="italic">
                        更なる信頼関係を築いて、特別なストーリーを解放しましょう
                      </Text>
                    </Center>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionCard>
        </VStack>
      </Container>

      {/* フローティングアクションボタン */}
      <MotionBox
        position="fixed"
        bottom="8"
        right="8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        zIndex="1000"
      >
        <Tooltip label="会話を始める" placement="left">
          <IconButton
            aria-label="start conversation"
            icon={<FaComment />}
            colorScheme="purple"
            size="lg"
            borderRadius="2xl"
            boxSize="16"
            shadow="2xl"
            onClick={handleStartConversation}
            _hover={{
              transform: "scale(1.1) rotate(5deg)",
              boxShadow: "2xl",
            }}
          />
        </Tooltip>
      </MotionBox>
    </Box>
  );
};