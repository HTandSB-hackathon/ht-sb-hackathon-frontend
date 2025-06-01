import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterGrid } from '../molecules/CharacterGrid';
import { CharacterQuery } from '../../lib/domain/CharacterQuery';
import {
  charactersAtom,
  characterRelationshipsAtom,
  characterFilterAtom,
  characterSortByAtom,
  charactersLoadingAtom,
  charactersErrorAtom,
  favoriteCharacterIdsAtom,
  availableCitiesAtom,
  newlyUnlockedCharacterIdsAtom,
  sortedCharactersAtom,
  characterCountByTrustLevelAtom,
  charactersTotalAtom
} from '../../lib/atom/CharacterAtom';
import type { CharacterFilter, CharacterSortBy } from '../../lib/types/character';

/**
 * キャラクター一覧ページ
 * 福島県の魅力を表現する洗練されたスマホファーストデザイン
 */
export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useAtom(charactersAtom);
  const [relationships, setRelationships] = useAtom(characterRelationshipsAtom);
  const [filter, setFilter] = useAtom(characterFilterAtom);
  const [sortBy, setSortBy] = useAtom(characterSortByAtom);
  const [isLoading, setIsLoading] = useAtom(charactersLoadingAtom);
  const [error, setError] = useAtom(charactersErrorAtom);
  const [favoriteIds, setFavoriteIds] = useAtom(favoriteCharacterIdsAtom);
  const [availableCities, setAvailableCities] = useAtom(availableCitiesAtom);
  const [, setTotal] = useAtom(charactersTotalAtom);
  
  const sortedCharacters = useAtomValue(sortedCharactersAtom);
  const newCharacterIds = useAtomValue(newlyUnlockedCharacterIdsAtom);
  const countByTrustLevel = useAtomValue(characterCountByTrustLevelAtom);

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [currentSeason, setCurrentSeason] = React.useState('spring'); // 春、夏、秋、冬

  // 季節の取得
  React.useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason('spring');
    else if (month >= 6 && month <= 8) setCurrentSeason('summer');
    else if (month >= 9 && month <= 11) setCurrentSeason('autumn');
    else setCurrentSeason('winter');
  }, []);

  // 初回データ取得
  React.useEffect(() => {
    loadCharacters();
    loadCities();
  }, []);

  // フィルターまたはソート変更時の再読み込み
  React.useEffect(() => {
    loadCharacters();
  }, [filter, sortBy]);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await CharacterQuery.getCharacters({
        filter,
        sortBy
      });
      
      setCharacters(data.characters);
      setRelationships(data.relationships);
      setTotal(data.total);
      
      // お気に入り情報を取得
      const favoriteCharacters = await CharacterQuery.getFavoriteCharacters();
      setFavoriteIds(new Set(favoriteCharacters.map(c => c.id)));
    } catch (err) {
      console.error('キャラクター読み込みエラー:', err);
      setError('キャラクターの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const cities = await CharacterQuery.getAvailableCities();
      setAvailableCities(cities);
    } catch (err) {
      console.error('都市情報読み込みエラー:', err);
    }
  };

  const handleFavoriteToggle = async (characterId: string, isFavorite: boolean) => {
    try {
      await CharacterQuery.toggleFavorite(characterId, isFavorite);
      
      if (isFavorite) {
        setFavoriteIds(new Set([...favoriteIds, characterId]));
      } else {
        const newIds = new Set(favoriteIds);
        newIds.delete(characterId);
        setFavoriteIds(newIds);
      }
    } catch (err) {
      console.error('お気に入り更新エラー:', err);
    }
  };

  // フィルターチップの削除
  const removeFilter = (key: keyof CharacterFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    setFilter(newFilter);
  };

  const activeFilterCount = Object.keys(filter).length;

  // 季節に応じた背景とテーマ
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
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                福島のこころ
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-600 mt-1 flex items-center gap-2"
              >
                <span>{theme.emoji}</span>
                <span>{theme.name}の福島で出会う、あたたかい人々</span>
              </motion.p>
            </div>
            
            {/* 季節インジケーター */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${theme.accent} text-white text-sm font-medium shadow-lg`}
            >
              {theme.emoji} {theme.name}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 統計カード（リデザイン） */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-xl"/>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-gray-800">{characters.length}</div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>👥</span>
                <span>出会った人</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200/50 to-transparent rounded-full blur-xl"/>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-gray-800">{countByTrustLevel[5] || 0}</div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>💖</span>
                <span>家族同然</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/50 to-transparent rounded-full blur-xl"/>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-gray-800">{availableCities.length}</div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>🏔️</span>
                <span>訪問地域</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl"/>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-gray-800">{favoriteIds.size}</div>
              <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <span>⭐</span>
                <span>お気に入り</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* フィルター・ソートバー（リデザイン） */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky top-[120px] z-20 backdrop-blur-xl bg-white/60 border-y border-white/50"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`
                  px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg
                  ${isFilterOpen 
                    ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg` 
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                  }
                  ${activeFilterCount > 0 ? 'relative' : ''}
                `}
              >
                <span className="flex items-center gap-2">
                  <span>🔍</span>
                  <span>フィルター</span>
                  {activeFilterCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-1"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </span>
              </motion.button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as CharacterSortBy)}
                className="px-4 py-3 text-sm bg-white/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-lg border border-white/50 font-medium"
              >
                <option value="trustLevel">💕 信頼度順</option>
                <option value="lastConversation">💬 最近の会話</option>
                <option value="name">📝 名前順</option>
                <option value="city">🏘️ 地域順</option>
              </select>
            </div>
          </div>

          {/* アクティブフィルター */}
          {activeFilterCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {filter.city && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl text-sm font-medium shadow-md"
                >
                  <span>🏘️ {filter.city}</span>
                  <motion.button 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => removeFilter('city')}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✕
                  </motion.button>
                </motion.span>
              )}
              {filter.trustLevel && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-2xl text-sm font-medium shadow-md"
                >
                  <span>💕 Lv.{filter.trustLevel}</span>
                  <motion.button 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => removeFilter('trustLevel')}
                    className="text-green-500 hover:text-green-700"
                  >
                    ✕
                  </motion.button>
                </motion.span>
              )}
            </motion.div>
          )}
        </div>

        {/* フィルターパネル（リデザイン） */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/50 bg-white/40 backdrop-blur-sm"
            >
              <div className="p-6 space-y-6">
                {/* 地域フィルター */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
                    <span>🏘️</span>
                    <span>地域で探す</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeFilter('city')}
                      className={`px-4 py-2 text-sm rounded-2xl transition-all font-medium shadow-md ${
                        !filter.city 
                          ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg` 
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                    >
                      🌸 すべて
                    </motion.button>
                    {availableCities.map(city => (
                      <motion.button
                        key={city}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter({ ...filter, city })}
                        className={`px-4 py-2 text-sm rounded-2xl transition-all font-medium shadow-md ${
                          filter.city === city 
                            ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg` 
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                      >
                        🏔️ {city}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 信頼レベルフィルター */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center gap-2">
                    <span>💕</span>
                    <span>信頼レベル</span>
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map(level => (
                      <motion.button
                        key={level}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter({ ...filter, trustLevel: level as any })}
                        className={`px-4 py-2 text-sm rounded-2xl transition-all whitespace-nowrap font-medium shadow-md ${
                          filter.trustLevel === level 
                            ? `bg-gradient-to-r ${theme.accent} text-white shadow-lg` 
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {'⭐'.repeat(level)} Lv.{level}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* エラー表示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">😞</span>
            <div>
              <p className="text-red-700 font-medium">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadCharacters}
                className="mt-2 text-sm text-red-600 underline font-medium"
              >
                🔄 再読み込み
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* キャラクターグリッド */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // 美しいスケルトンローダー
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 h-64 shadow-xl border border-white/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full animate-pulse"/>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-3xl animate-pulse" />
                    <div>
                      <div className="h-5 w-24 bg-gray-200 rounded-full mb-2 animate-pulse" />
                      <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
              </motion.div>
            ))
          ) : sortedCharacters.length === 0 ? (
            // 美しい空の状態
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl mb-6"
              >
                {theme.emoji}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {filter && Object.keys(filter).length > 0
                  ? 'この条件の方は見つかりませんでした'
                  : 'まだ誰とも出会っていません'}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {filter && Object.keys(filter).length > 0
                  ? '別の条件で検索してみてください'
                  : '福島を旅して、素敵な人々と出会いましょう'}
              </p>
            </motion.div>
          ) : (
            // キャラクターカード
            sortedCharacters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <CharacterCard
                  character={character}
                  relationship={relationships[character.id]}
                  isNew={newCharacterIds.has(character.id)}
                  animationDelay={0}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* フローティングアクションボタン（福島マップ） */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br ${theme.accent} text-white rounded-3xl shadow-2xl flex items-center justify-center z-30 border-4 border-white/50`}
      >
        <motion.span 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl"
        >
          🗾
        </motion.span>
      </motion.button>

      {/* 福島アピールバナー */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 left-8 right-24 bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50 z-20"
      >
        <div className="flex items-center gap-3">
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🍑
          </motion.span>
          <div>
            <p className="font-bold text-gray-800 text-sm">福島の魅力を発見しよう</p>
            <p className="text-xs text-gray-600">豊かな自然と温かい人々があなたを待っています</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
