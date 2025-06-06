import { soundEnabledAtom } from "@/lib/atom/BaseAtom";
import { Box, type BoxProps } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useCallback, useRef } from "react";

interface ClickSoundProps extends BoxProps {
	/** 再生する音声ファイルのパス */
	soundPath?: string;
	/** 音量 (0.0 - 1.0) */
	volume?: number;
	/** 音声を無効化するかどうか */
	disabled?: boolean;
	children: React.ReactNode;
}

export const ClickSound: React.FC<ClickSoundProps> = ({
	soundPath = "/sounds/click.mp3",
	volume = 0.3,
	disabled = false,
	children,
	onClick,
	...boxProps
}) => {
	const [soundEnabled] = useAtom(soundEnabledAtom);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playSound = useCallback(() => {
		if (!soundEnabled || disabled) return;

		try {
			// 前の音声があれば停止
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}

			// 新しい音声を作成・再生
			const audio = new Audio(import.meta.env.BASE_URL + soundPath);
			audio.volume = Math.max(0, Math.min(1, volume));
			audio.play().catch((error) => {
				console.warn("Click sound playback failed:", error);
			});

			audioRef.current = audio;
		} catch (error) {
			console.warn("Failed to create audio element:", error);
		}
	}, [soundEnabled, disabled, soundPath, volume]);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			playSound();
			onClick?.(event);
		},
		[playSound, onClick],
	);

	return (
		<Box onClick={handleClick} cursor="pointer" {...boxProps}>
			{children}
		</Box>
	);
};
