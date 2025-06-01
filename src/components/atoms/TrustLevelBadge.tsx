import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_LEVELS, type TrustLevel } from '../../lib/types/character';

interface TrustLevelBadgeProps {
  level: TrustLevel;
  points?: number;
  nextLevelPoints?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  animate?: boolean;
}

/**
 * 信頼レベルバッジコンポーネント
 * キャラクターとの信頼度を視覚的に表現
 */
export const TrustLevelBadge: React.FC<TrustLevelBadgeProps> = ({
  level,
  points = 0,
  nextLevelPoints = 100,
  size = 'md',
  showProgress = false,
  animate = true
}) => {
  const trustLevel = TRUST_LEVELS[level];
  const progress = nextLevelPoints > 0 ? (points / nextLevelPoints) * 100 : 0;

  // サイズに応じたクラス
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // 信頼レベルに応じたアイコン
  const getLevelIcon = () => {
    switch (level) {
      case 1: return '👋';
      case 2: return '😊';
      case 3: return '🤝';
      case 4: return '💝';
      case 5: return '🏡';
      default: return '👋';
    }
  };

  return (
    <div className="inline-flex flex-col items-center">
      <motion.div
        initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`
          inline-flex items-center gap-1 rounded-full font-medium
          ${trustLevel.bgColor} ${trustLevel.borderColor} border-2
          ${sizeClasses[size]}
        `}
      >
        <motion.span
          key={level}
          initial={animate ? { rotate: -180, scale: 0 } : undefined}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={iconSizes[size]}
        >
          {getLevelIcon()}
        </motion.span>
        <span className={`text-${trustLevel.color}-700 font-bold`}>
          Lv.{level}
        </span>
        <span className={`text-${trustLevel.color}-600`}>
          {trustLevel.name}
        </span>
      </motion.div>

      {showProgress && level < 5 && (
        <motion.div
          initial={animate ? { width: 0, opacity: 0 } : undefined}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2 w-full"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={`h-full bg-gradient-to-r from-${trustLevel.color}-400 to-${trustLevel.color}-600`}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-[3rem] text-right">
              {points}/{nextLevelPoints}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
