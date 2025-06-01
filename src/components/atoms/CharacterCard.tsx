import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import type { Character, CharacterRelationship } from '../../lib/types/character';
import { TRUST_LEVELS } from '../../lib/types/character';

interface CharacterCardProps {
  character: Character;
  relationship?: CharacterRelationship;
  isNew?: boolean;
  animationDelay?: number;
  onFavoriteToggle?: (characterId: string, isFavorite: boolean) => void;
}

/**
 * キャラクターカードコンポーネント
 * 福島の魅力を表現する洗練されたスマホ最適化デザイン
 */
export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  relationship,
  isNew = false,
  animationDelay = 0,
  onFavoriteToggle
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!character.isLocked) {
      navigate(`/character/${character.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!character.isLocked && onFavoriteToggle) {
      setIsFavorite(!isFavorite);
      onFavoriteToggle(character.id, !isFavorite);
    }
  };

  // 最後の会話からの経過時間を計算
  const getLastConversationText = () => {
    if (!relationship?.lastConversationAt) return 'まだ会話していません';
    
    const lastDate = new Date(relationship.lastConversationAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日会話しました';
    if (diffDays === 1) return '昨日会話しました';
    if (diffDays < 7) return `${diffDays}日前`;
    return `しばらく会話していません`;
  };

  // 季節感を表現する背景色
  const getSeasonalBackground = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'from-pink-50/50 to-rose-100/50'; // 春
    if (month >= 6 && month <= 8) return 'from-green-50/50 to-emerald-100/50'; // 夏
    if (month >= 9 && month <= 11) return 'from-amber-50/50 to-orange-100/50'; // 秋
    return 'from-blue-50/50 to-indigo-100/50'; // 冬
  };

  // 福島の地域色を表現
  const getCityTheme = (city: string) => {
    const themes: Record<string, { color: string; emoji: string; bg: string }> = {
      '福島市': { color: 'rose', emoji: '🌸', bg: 'from-rose-100 to-pink-100' },
      '郡山市': { color: 'blue', emoji: '🏞️', bg: 'from-blue-100 to-cyan-100' },
      'いわき市': { color: 'orange', emoji: '🌊', bg: 'from-orange-100 to-amber-100' },
      '会津若松市': { color: 'green', emoji: '🏯', bg: 'from-green-100 to-emerald-100' },
      '須賀川市': { color: 'purple', emoji: '🍇', bg: 'from-purple-100 to-violet-100' },
      '白河市': { color: 'indigo', emoji: '⛰️', bg: 'from-indigo-100 to-blue-100' },
      '三春町': { color: 'pink', emoji: '🌸', bg: 'from-pink-100 to-rose-100' },
      '中島村': { color: 'teal', emoji: '🌾', bg: 'from-teal-100 to-green-100' }
    };
    return themes[city] || { color: 'gray', emoji: '🏔️', bg: 'from-gray-100 to-slate-100' };
  };

  const trustLevel = relationship?.trustLevel || 1;
  const trustInfo = TRUST_LEVELS[trustLevel as keyof typeof TRUST_LEVELS];
  const progress = relationship ? (relationship.trustPoints / relationship.nextLevelPoints) * 100 : 0;
  const cityTheme = getCityTheme(character.city);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        type: "spring",
        stiffness: 120,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.03,
        rotateY: 5,
        z: 50,
        transition: { duration: 0.3 }
      }}
      whileTap={!character.isLocked ? { 
        scale: 0.98,
        rotateY: -2,
        transition: { duration: 0.2 }
      } : undefined}
      className="relative perspective-1000"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* メインカード */}
      <div className={`
        relative overflow-hidden rounded-3xl cursor-pointer
        bg-white/90 backdrop-blur-sm
        shadow-2xl hover:shadow-3xl
        transition-all duration-500
        border border-white/60
        ${character.isLocked ? 'grayscale opacity-70' : ''}
        group
      `}>
        {/* 背景デコレーション */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 福島の季節感を表現する背景グラデーション */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getSeasonalBackground()}`} />
          
          {/* 都市テーマの背景 */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cityTheme.bg} opacity-30 rounded-full blur-2xl transform translate-x-8 -translate-y-8`} />
          
          {/* 動的な光の効果 */}
          <motion.div
            animate={isHovered ? {
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-xl"
          />
          
          {/* 福島の山々をイメージした装飾 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20">
            <svg viewBox="0 0 300 50" className="w-full h-full">
              <path d="M0,50 L0,30 L50,15 L100,25 L150,10 L200,20 L250,5 L300,15 L300,50 Z" 
                    fill="currentColor" className={`text-${cityTheme.color}-300`}/>
            </svg>
          </div>
        </div>

        {/* NEW バッジ */}
        {isNew && !character.isLocked && (
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 45 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: animationDelay + 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-4 right-4 z-20"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-lg border border-white/50"
            >
              ✨ NEW
            </motion.div>
          </motion.div>
        )}

        {/* コンテンツ */}
        <div className="relative z-10 p-6">
          {/* 上部：アバターと基本情報 */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* アバター */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <div className={`
                  w-20 h-20 rounded-3xl overflow-hidden
                  ${character.isLocked ? 'opacity-50' : ''}
                  ring-4 ring-offset-2 ring-offset-transparent
                  ${trustInfo ? `ring-${trustInfo.color}-400` : 'ring-gray-400'}
                  shadow-xl
                `}>
                  {character.isLocked ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center relative">
                      <motion.span 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl"
                      >
                        🔒
                      </motion.span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={character.profileImage}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                  )}
                </div>
                
                {/* 地域アイコン */}
                {!character.isLocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-white to-${cityTheme.color}-50 rounded-full border-2 border-white shadow-lg flex items-center justify-center`}
                  >
                    <span className="text-sm">{cityTheme.emoji}</span>
                  </motion.div>
                )}

                {/* オンラインステータス */}
                {relationship && !character.isLocked && new Date().getTime() - new Date(relationship.lastConversationAt || '').getTime() < 86400000 && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </motion.div>

              {/* 名前と情報 */}
              <div className="flex-1">
                <motion.h3 
                  className="font-bold text-gray-900 text-lg mb-1"
                  animate={isHovered ? { scale: 1.05 } : {}}
                >
                  {character.isLocked ? '???' : character.name}
                </motion.h3>
                <p className={`text-sm font-medium mb-1 ${
                  character.isLocked ? 'text-gray-400' : `text-${cityTheme.color}-600`
                }`}>
                  {character.isLocked ? '未解放' : character.occupation}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{cityTheme.emoji}</span>
                  <span>{!character.isLocked && character.city}</span>
                </div>
              </div>
            </div>

            {/* お気に入りボタン */}
            {!character.isLocked && (
              <motion.button
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleFavoriteClick}
                className="p-2 rounded-2xl transition-all duration-300 hover:bg-white/50"
              >
                <motion.div
                  animate={isFavorite ? {
                    scale: [1, 1.4, 1],
                    rotate: [0, 20, -20, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isFavorite ? (
                    <span className="text-3xl drop-shadow-lg">❤️</span>
                  ) : (
                    <motion.span 
                      className="text-3xl opacity-30 hover:opacity-100 transition-opacity filter drop-shadow-sm"
                      whileHover={{ 
                        scale: 1.1,
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                      }}
                    >
                      🤍
                    </motion.span>
                  )}
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* 中部：信頼度情報 */}
          {relationship && !character.isLocked && (
            <motion.div 
              className="mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.span 
                    className={`text-sm font-bold text-${trustInfo.color}-600 px-3 py-1 rounded-full bg-${trustInfo.color}-50 border border-${trustInfo.color}-200`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {trustInfo.name}
                  </motion.span>
                  <span className="text-xs text-gray-400 font-medium">
                    Lv.{trustLevel}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {relationship.trustPoints}/{relationship.nextLevelPoints}
                </span>
              </div>
              
              {/* プログレスバー（福島らしいデザイン） */}
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: animationDelay + 0.7, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${trustInfo.color}-400 via-${trustInfo.color}-500 to-${trustInfo.color}-600 rounded-full shadow-lg`}
                />
                <motion.div
                  animate={{
                    x: [`${Math.max(0, progress - 10)}%`, `${progress}%`],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-y-0 w-4 bg-white/40 rounded-full blur-sm"
                />
              </div>
            </motion.div>
          )}

          {/* ロック時の条件表示 */}
          {character.isLocked && character.unlockCondition && (
            <motion.div 
              className="mb-4 p-4 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs text-gray-600 flex items-center gap-2 font-medium">
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  🔓
                </motion.span>
                <span>{character.unlockCondition}</span>
              </p>
            </motion.div>
          )}

          {/* 下部：ステータス */}
          {!character.isLocked && (
            <motion.div 
              className="flex items-center justify-between text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-1 text-gray-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg">💬</span>
                  <span className="font-medium">{relationship?.totalConversations || 0}</span>
                </motion.div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium">
                  {getLastConversationText()}
                </span>
              </div>
            </motion.div>
          )}

          {/* ホバー時の詳細情報 */}
          <AnimatePresence>
            {isHovered && !character.isLocked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4 pt-4 border-t border-gray-200/50"
              >
                <motion.p 
                  className="text-xs text-gray-600 line-clamp-3 leading-relaxed"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {character.introduction}
                </motion.p>
                
                {/* 趣味・特技 */}
                {(character.hobbies?.length > 0 || character.specialties?.length > 0) && (
                  <motion.div 
                    className="flex flex-wrap gap-1 mt-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {character.hobbies?.slice(0, 2).map((hobby, index) => (
                      <span key={index} className={`text-xs px-2 py-1 bg-${cityTheme.color}-50 text-${cityTheme.color}-600 rounded-full border border-${cityTheme.color}-200 font-medium`}>
                        {hobby}
                      </span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ボトムライン（地域カラー） */}
        {!character.isLocked && (
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-${cityTheme.color}-400 via-${cityTheme.color}-500 to-${cityTheme.color}-600`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        )}

        {/* クリック時のリップル効果 */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          whileTap={{
            background: [
              "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
              "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
              "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)"
            ]
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};
