import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterProfile } from '../molecules/CharacterProfile';
import { CharacterQuery } from '../../lib/domain/CharacterQuery';
import {
  selectedCharacterDetailAtom,
  characterDetailLoadingAtom
} from '../../lib/atom/CharacterAtom';

/**
 * キャラクター詳細ページ
 * 福島の魅力を表現する美しく洗練されたデザイン
 */
export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [characterDetail, setCharacterDetail] = useAtom(selectedCharacterDetailAtom);
  const [isLoading, setIsLoading] = useAtom(characterDetailLoadingAtom);
  const [error, setError] = React.useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = React.useState('spring');
  const [activeTab, setActiveTab] = React.useState('profile');

  // 季節の取得
  React.useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason('spring');
    else if (month >= 6 && month <= 8) setCurrentSeason('summer');
    else if (month >= 9 && month <= 11) setCurrentSeason('autumn');
    else setCurrentSeason('winter');
  }, []);

  // キャラクター詳細データの取得
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

  // 季節テーマ
  const seasonThemes = {
    spring: {
      bg: 'from-pink-50 via-rose-50 to-orange-50',
      accent: 'from-pink-400 to-rose-500',
      emoji: '🌸',
      name: '春'
    },
    summer: {
      bg: 'from-green-50 via-emerald-50 to-teal-50',
      accent: 'from-green-400 to-teal-500',
      emoji: '🌿',
      name: '夏'
    },
    autumn: {
      bg: 'from-amber-50 via-orange-50 to-red-50',
      accent: 'from-amber-400 to-orange-500',
      emoji: '🍁',
      name: '秋'
    },
    winter: {
      bg: 'from-slate-50 via-blue-50 to-indigo-50',
      accent: 'from-blue-400 to-indigo-500',
      emoji: '❄️',
      name: '冬'
    }
  };

  const theme = seasonThemes[currentSeason as keyof typeof seasonThemes];

  // 福島の地域色を表現
  const getCityTheme = (city: string) => {
    const themes: Record<string, { color: string; emoji: string; bg: string; specialty: string }> = {
      '福島市': { color: 'rose', emoji: '🌸', bg: 'from-rose-100 to-pink-100', specialty: '桃とりんご' },
      '郡山市': { color: 'blue', emoji: '🏞️', bg: 'from-blue-100 to-cyan-100', specialty: '猪苗代湖' },
      'いわき市': { color: 'orange', emoji: '🌊', bg: 'from-orange-100 to-amber-100', specialty: 'アクアマリン' },
      '会津若松市': { color: 'green', emoji: '🏯', bg: 'from-green-100 to-emerald-100', specialty: '鶴ヶ城' },
      '須賀川市': { color: 'purple', emoji: '🍇', bg: 'from-purple-100 to-violet-100', specialty: 'ウルトラマン' },
      '白河市': { color: 'indigo', emoji: '⛰️', bg: 'from-indigo-100 to-blue-100', specialty: '小峰城' },
      '三春町': { color: 'pink', emoji: '🌸', bg: 'from-pink-100 to-rose-100', specialty: '滝桜' },
      '中島村': { color: 'teal', emoji: '🌾', bg: 'from-teal-100 to-green-100', specialty: '豊かな田園' }
    };
    return themes[city] || { color: 'gray', emoji: '🏔️', bg: 'from-gray-100 to-slate-100', specialty: '自然の恵み' };
  };

  const cityTheme = characterDetail ? getCityTheme(characterDetail.city) : null;

  // ローディング表示
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center relative overflow-hidden`}>
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="inline-block text-6xl mb-6"
          >
            {theme.emoji}
          </motion.div>
          <motion.p 
            className="text-gray-600 text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            福島のこころを読み込み中...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // エラー表示
  if (error || !characterDetail) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center relative overflow-hidden`}>
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-6 relative z-10 border border-white/50"
        >
          <div className="text-center">
            <motion.span 
              className="text-8xl block mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              😢
            </motion.span>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              読み込みエラー
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {error || 'キャラクター情報が見つかりませんでした'}
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => id && loadCharacterDetail(id)}
                className={`px-6 py-3 bg-gradient-to-r ${theme.accent} text-white rounded-2xl hover:shadow-lg transition-all font-medium`}
              >
                🔄 再読み込み
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all font-medium"
              >
                📋 一覧に戻る
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl"
        />
        
        {/* 福島の山々のシルエット */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-200/30 to-transparent">
          <svg viewBox="0 0 1200 200" className="w-full h-full">
            <path d="M0,200 L0,120 L200,60 L400,100 L600,40 L800,80 L1000,20 L1200,60 L1200,200 Z" 
                  fill="currentColor" className="text-gray-300/50"/>
          </svg>
        </div>
      </div>

      {/* ヘッダー */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/50"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-white/60 rounded-2xl transition-all font-medium"
            >
              <motion.span 
                className="text-2xl"
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span>福島のこころへ戻る</span>
            </motion.button>

            <div className="flex items-center gap-4">
              {/* 地域バッジ */}
              {cityTheme && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`px-4 py-2 rounded-full bg-gradient-to-r from-${cityTheme.color}-400 to-${cityTheme.color}-500 text-white text-sm font-medium shadow-lg flex items-center gap-2`}
                >
                  <span>{cityTheme.emoji}</span>
                  <span>{characterDetail.city}</span>
                </motion.div>
              )}

              {/* シェアボタン */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:bg-white/60 rounded-2xl transition-all"
                title="この人を共有"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 8.048c.533.552.854 1.306.854 2.146 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.84.321-1.594.854-2.146M15 7.5a3 3 0 11-6 0 3 3 0 016 0zm3 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* メインコンテンツ */}
      <div className="px-6 py-8 relative z-10">
        {/* プロフィールセクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CharacterProfile
            character={characterDetail}
            onStartConversation={handleStartConversation}
          />
        </motion.div>

        {/* タブナビゲーション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/50">
            <div className="flex gap-2">
              {[
                { id: 'profile', name: '詳細情報', emoji: '👤' },
                { id: 'local', name: '地域の魅力', emoji: cityTheme?.emoji || '🏔️' },
                { id: 'stories', name: 'ストーリー', emoji: '📖' },
                { id: 'connection', name: 'つながり', emoji: '💕' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-white/60'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* タブコンテンツ */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 基本情報カード */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>👤</span>
                  <span>基本情報</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">お名前</label>
                      <p className="text-lg font-semibold text-gray-800">{characterDetail.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">年齢</label>
                      <p className="text-lg text-gray-700">{characterDetail.age}歳</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">お仕事</label>
                      <p className="text-lg text-gray-700">{characterDetail.occupation}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">出身地</label>
                      <p className="text-lg text-gray-700 flex items-center gap-2">
                        <span>{cityTheme?.emoji}</span>
                        <span>{characterDetail.city}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">趣味</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {characterDetail.hobbies?.map((hobby, index) => (
                          <span key={index} className={`px-3 py-1 bg-${cityTheme?.color}-50 text-${cityTheme?.color}-600 rounded-full text-sm font-medium border border-${cityTheme?.color}-200`}>
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 自己紹介カード */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💭</span>
                  <span>自己紹介</span>
                </h3>
                <p className="text-gray-700 leading-relaxed">{characterDetail.introduction}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'local' && cityTheme && (
            <motion.div
              key="local"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 地域の魅力セクション */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>{cityTheme.emoji}</span>
                  <span>{characterDetail.city}の魅力</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 観光スポット */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`text-center p-6 bg-gradient-to-br ${cityTheme.bg} rounded-2xl border border-white/50 shadow-lg`}
                  >
                    <motion.span 
                      className="text-4xl block mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🏞️
                    </motion.span>
                    <h4 className="font-bold text-gray-800 mb-2">観光スポット</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      美しい自然と歴史的建造物が織りなす絶景を楽しめます
                    </p>
                  </motion.div>

                  {/* グルメ */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`text-center p-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl border border-white/50 shadow-lg`}
                  >
                    <motion.span 
                      className="text-4xl block mb-4"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      🍜
                    </motion.span>
                    <h4 className="font-bold text-gray-800 mb-2">ご当地グルメ</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      地元の食材を使った心温まる絶品料理をご堪能ください
                    </p>
                  </motion.div>

                  {/* 特産品 */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border border-white/50 shadow-lg`}
                  >
                    <motion.span 
                      className="text-4xl block mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      🎭
                    </motion.span>
                    <h4 className="font-bold text-gray-800 mb-2">特産品</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cityTheme.specialty}など、その土地ならではの魅力がいっぱい
                    </p>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {characterDetail.name}さんと一緒に、{characterDetail.city}の魅力を探してみませんか？
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartConversation}
                    className={`px-8 py-4 bg-gradient-to-r ${theme.accent} text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-3 mx-auto`}
                  >
                    <span>💬</span>
                    <span>今すぐ会話を始める</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>📖</span>
                  <span>ストーリー</span>
                </h3>
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🚧
                  </motion.div>
                  <p className="text-gray-600">この機能は準備中です</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'connection' && (
            <motion.div
              key="connection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>💕</span>
                  <span>つながり</span>
                </h3>
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🤝
                  </motion.div>
                  <p className="text-gray-600">関係性機能は準備中です</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* フローティングアクションボタン */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStartConversation}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br ${theme.accent} text-white rounded-3xl shadow-2xl flex items-center justify-center z-30 border-4 border-white/50`}
      >
        <motion.span 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl"
        >
          💬
        </motion.span>
      </motion.button>
    </div>
  );
};
