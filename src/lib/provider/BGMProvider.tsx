import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { soundEnabledAtom } from "../atom/BaseAtom";

const bgmMap: Record<string, string> = {
	"/home": "/sounds/home.mp3",
	"/characters": "/sounds/home.mp3",
	"/about": "/assets/about.mp3",
	// 他のルートも追加可能
};

export const BGMManagerProvider = () => {
	const location = useLocation();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const fadeAnimRef = useRef<number | null>(null);

	const soundEnabled = useAtomValue(soundEnabledAtom);

	useEffect(() => {
		const currentPath = location.pathname;
		const bgmSrc = bgmMap[currentPath];

		// 現在の BGM の再生中のものがbgmSrcと異なる場合は停止
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		if (fadeAnimRef.current) {
			cancelAnimationFrame(fadeAnimRef.current);
			fadeAnimRef.current = null;
		}

		if (bgmSrc && soundEnabled) {
			const audio = new Audio(import.meta.env.BASE_URL + bgmSrc);
			audio.loop = true;
			audio.volume = 0.5;
			audio.play().catch((e) => console.error("再生エラー:", e));
			audioRef.current = audio;

			const fadeDuration = 7000; // ms
			const startVolume = 0.5;
			let startTime: number | null = null;
			const fadingAudio = audioRef.current;

			const fade = (now: number) => {
				if (!fadingAudio || audioRef.current !== fadingAudio) return;
				if (startTime === null) startTime = now;
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / fadeDuration, 1);
				fadingAudio.volume = startVolume * (1 - progress);
				if (progress < 1) {
					fadeAnimRef.current = requestAnimationFrame(fade);
				} else {
					fadingAudio.volume = 0;
					fadingAudio.pause();
					if (audioRef.current === fadingAudio) {
						audioRef.current = null;
					}
				}
			};
			fadeAnimRef.current = requestAnimationFrame(fade);
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
			if (fadeAnimRef.current) {
				cancelAnimationFrame(fadeAnimRef.current);
				fadeAnimRef.current = null;
			}
		};
	}, [location.pathname, soundEnabled]);

	return null;
};
