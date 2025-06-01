import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterFilter, CharacterSortBy, TrustLevel } from '../../lib/types/character';
import { TRUST_LEVELS } from '../../lib/types/character';

interface FilterSortBarProps {
  filter: CharacterFilter;
  sortBy: CharacterSortBy;
  availableCities: string[];
  characterCounts: {
    total: number;
    byTrustLevel: Record<number, number>;
  };
  onFilterChange: (filter: CharacterFilter) => void;
  onSortChange: (sortBy: CharacterSortBy) => void;
}

/**
 * フィルター・ソートバーコンポーネント
 * キャラクター一覧の絞り込みと並び替え機能
 */
export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  filter,
  sortBy,
  availableCities,
  characterCounts,
  onFilterChange,
  onSortChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // フィルターチップの削除
  const removeFilter = (key: keyof CharacterFilter) => {
    const newFilter = { ...filter };
    delete newFilter[key];
    onFilterChange(newFilter);
  };

  // アクティブなフィルター数を計算
  const activeFilterCount = Object.keys(filter).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            出会った人たち
          </h2>
          <span className="text-sm text-gray-500">
            {characterCounts.total}人
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* ソートドロップダウン */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CharacterSortBy)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="trustLevel">信頼度順</option>
            <option value="lastConversation">最近の会話順</option>
            <option value="name">名前順</option>
            <option value="city">地域順</option>
          </select>

          {/* フィルターボタン */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              relative px-4 py-1.5 text-sm font-medium rounded-lg
              transition-colors duration-200
              ${isFilterOpen ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            <span className="flex items-center gap-2">
              <span>🔍</span>
              <span>フィルター</span>
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </span>
          </motion.button>
        </div>
      </div>

      {/* アクティブフィルター表示 */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filter.city && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              <span>📍 {filter.city}</span>
              <button
                onClick={() => removeFilter('city')}
                className="ml-1 hover:text-blue-900"
              >
                ✕
              </button>
            </motion.span>
          )}
          {filter.trustLevel && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              <span>⭐ {TRUST_LEVELS[filter.trustLevel].name}</span>
              <button
                onClick={() => removeFilter('trustLevel')}
                className="ml-1 hover:text-green-900"
              >
                ✕
              </button>
            </motion.span>
          )}
          {filter.gender && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              <span>{filter.gender === 'male' ? '👨' : '👩'} {filter.gender === 'male' ? '男性' : '女性'}</span>
              <button
                onClick={() => removeFilter('gender')}
                className="ml-1 hover:text-purple-900"
              >
                ✕
              </button>
            </motion.span>
          )}
          {filter.isLocked !== undefined && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              <span>{filter.isLocked ? '🔒 未解放' : '🔓 解放済み'}</span>
              <button
                onClick={() => removeFilter('isLocked')}
                className="ml-1 hover:text-gray-900"
              >
                ✕
              </button>
            </motion.span>
          )}
        </div>
      )}

      {/* フィルターパネル */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 space-y-4">
              {/* 地域フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地域で絞り込み
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => removeFilter('city')}
                    className={`
                      px-3 py-1 text-sm rounded-full transition-colors
                      ${!filter.city ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    すべて
                  </button>
                  {availableCities.map(city => (
                    <button
                      key={city}
                      onClick={() => onFilterChange({ ...filter, city })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.city === city ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* 信頼レベルフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  信頼レベル
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => removeFilter('trustLevel')}
                    className={`
                      px-3 py-1 text-sm rounded-full transition-colors
                      ${!filter.trustLevel ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    すべて
                  </button>
                  {([1, 2, 3, 4, 5] as TrustLevel[]).map(level => (
                    <button
                      key={level}
                      onClick={() => onFilterChange({ ...filter, trustLevel: level })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-1
                        ${filter.trustLevel === level ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      <span>{TRUST_LEVELS[level].name}</span>
                      <span className="text-xs opacity-75">
                        ({characterCounts.byTrustLevel[level] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* その他のフィルター */}
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    性別
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFilter('gender')}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${!filter.gender ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => onFilterChange({ ...filter, gender: 'male' })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.gender === 'male' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      👨 男性
                    </button>
                    <button
                      onClick={() => onFilterChange({ ...filter, gender: 'female' })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.gender === 'female' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      👩 女性
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状態
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFilter('isLocked')}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.isLocked === undefined ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => onFilterChange({ ...filter, isLocked: false })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.isLocked === false ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      🔓 解放済み
                    </button>
                    <button
                      onClick={() => onFilterChange({ ...filter, isLocked: true })}
                      className={`
                        px-3 py-1 text-sm rounded-full transition-colors
                        ${filter.isLocked === true ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      `}
                    >
                      🔒 未解放
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
