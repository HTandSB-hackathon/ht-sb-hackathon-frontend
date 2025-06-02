import { motion } from "framer-motion";
import type React from "react";

interface CharacterAvatarProps {
	imageUrl: string;
	name: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	isLocked?: boolean;
	isOnline?: boolean;
	showBorder?: boolean;
	borderColor?: string;
	onClick?: () => void;
	className?: string;
}

/**
 * キャラクターアバターコンポーネント
 * プロフィール画像を円形で表示
 */
export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
	imageUrl,
	name,
	size = "md",
	isLocked = false,
	isOnline = false,
	showBorder = true,
	borderColor = "border-white",
	onClick,
	className = "",
}) => {
	// サイズ定義
	const sizeClasses = {
		xs: "w-8 h-8",
		sm: "w-12 h-12",
		md: "w-16 h-16",
		lg: "w-24 h-24",
		xl: "w-32 h-32",
	};

	const onlineIndicatorSizes = {
		xs: "w-2 h-2 border",
		sm: "w-3 h-3 border-2",
		md: "w-4 h-4 border-2",
		lg: "w-5 h-5 border-3",
		xl: "w-6 h-6 border-4",
	};

	const lockIconSizes = {
		xs: "text-xs",
		sm: "text-sm",
		md: "text-base",
		lg: "text-xl",
		xl: "text-2xl",
	};

	return (
		<motion.div
			whileHover={onClick ? { scale: 1.05 } : undefined}
			whileTap={onClick ? { scale: 0.95 } : undefined}
			className={`relative inline-block ${sizeClasses[size]} ${className}`}
			onClick={onClick}
			style={{ cursor: onClick ? "pointer" : "default" }}
		>
			{/* アバター画像 */}
			<div
				className={`
          ${sizeClasses[size]} rounded-full overflow-hidden
          ${showBorder ? `ring-4 ${borderColor}` : ""}
          ${isLocked ? "opacity-50" : ""}
          relative
        `}
			>
				{isLocked ? (
					<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
						<span className={`${lockIconSizes[size]} text-gray-600`}>🔒</span>
					</div>
				) : (
					<img
						src={imageUrl}
						alt={name}
						className="w-full h-full object-cover"
						onError={(e) => {
							// 画像読み込みエラー時のフォールバック
							e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22C55E&color=fff&rounded=true&bold=true`;
						}}
					/>
				)}
			</div>

			{/* オンラインインジケーター */}
			{isOnline && !isLocked && (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2 }}
					className={`
            absolute bottom-0 right-0
            ${onlineIndicatorSizes[size]}
            bg-green-500 rounded-full
            border-white
          `}
				>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
						className="w-full h-full bg-green-400 rounded-full opacity-75"
					/>
				</motion.div>
			)}

			{/* ホバーオーバーレイ */}
			{onClick && !isLocked && (
				<motion.div
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					className={`
            absolute inset-0 rounded-full
            bg-black bg-opacity-0 hover:bg-opacity-10
            transition-all duration-200
          `}
				/>
			)}
		</motion.div>
	);
};
