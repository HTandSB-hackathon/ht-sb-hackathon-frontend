import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { convertGeoJSONToMunicipalities } from "../../lib/utils/geojsonToSvg";

// FukushimaWeek 型を受け取るための型定義
export interface FukushimaWeek {
	municipality: string;
	date?: string;
	title?: string;
	url?: string;
	id?: string;
}

interface Municipality {
	name: string;
	path: string;
	center: { x: number; y: number };
}

interface FukushimaMapProps {
	fukushimaWeeks?: FukushimaWeek[];
	seasonInfo?: { color: string }; // 追加: 季節カラー
	hoveredMunicipality?: string | null;
	setHoveredMunicipality?: (name: string | null) => void;
}

export const FukushimaMap: React.FC<FukushimaMapProps> = ({
	fukushimaWeeks,
	seasonInfo,
	hoveredMunicipality,
	setHoveredMunicipality,
}) => {
	const [internalHovered, setInternalHovered] = useState<string | null>(null);
	const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
	const [loading, setLoading] = useState(true);

	// 強調する市町村名リストをメモ化
	const highlightedMunicipalities = useMemo(
		() =>
			fukushimaWeeks
				? new Set(fukushimaWeeks.map((w) => w.municipality))
				: new Set<string>(),
		[fukushimaWeeks],
	);

	useEffect(() => {
		const loadGeoJSON = async () => {
			try {
				const response = await fetch("/ht-sb/N03-20240101_07.json");

				if (!response.ok) {
					throw new Error(
						`GeoJSONファイルの読み込みに失敗しました: ${response.status}`,
					);
				}

				const geojsonData = await response.json();

				if (!geojsonData.features || geojsonData.features.length === 0) {
					throw new Error("有効なGeoJSONデータが見つかりません");
				}

				const convertedMunicipalities =
					convertGeoJSONToMunicipalities(geojsonData);
				setMunicipalities(convertedMunicipalities);
			} catch (error) {
				console.error("GeoJSONの読み込みに失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		loadGeoJSON();
	}, []);

	// Chakra UI カラーパレットに基づく色マップ
	const colorMap: Record<string, { base: string; highlight: string }> = {
		pink: { base: "#fed7e2", highlight: "#ed64a6" }, // pink.200, pink.400
		yellow: { base: "#fefcbf", highlight: "#ecc94b" }, // yellow.200, yellow.400
		orange: { base: "#fbd38d", highlight: "#ed8936" }, // orange.200, orange.400
		blue: { base: "#bee3f8", highlight: "#4299e1" }, // blue.200, blue.400
		green: { base: "#c6f6d5", highlight: "#38a169" }, // green.200, green.600
		purple: { base: "#e9d8fd", highlight: "#805ad5" }, // purple.100, purple.600
		teal: { base: "#b2f5ea", highlight: "#319795" }, // teal.200, teal.600
		gray: { base: "#e2e8f0", highlight: "#a0aec0" }, // gray.200, gray.400
		red: { base: "#fed7d7", highlight: "#e53e3e" }, // red.200, red.500
	};

	// 季節カラー取得
	const colorKey = seasonInfo?.color ?? "pink";
	const fillColors = colorMap[colorKey] || colorMap.pink;

	if (loading) {
		return (
			<Box
				width="100%"
				maxW="600px"
				mx="auto"
				my={8}
				bg="white"
				borderRadius="lg"
				boxShadow="md"
				p={4}
				display="flex"
				justifyContent="center"
				alignItems="center"
				minH="300px"
			>
				<Text>マップを読み込み中...</Text>
			</Box>
		);
	}

	// hovered: 外部props優先、なければ内部state
	const hovered = hoveredMunicipality ?? internalHovered;

	return (
		<Box
			width="100%"
			maxW="600px"
			mx="auto"
			mt={0}
			bg="white"
			borderRadius="lg"
			p={4}
			position="relative"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<svg
				viewBox="40 40 280 135"
				width="90%"
				aria-label="福島県市町村マップ"
				role="img"
				style={{
					display: "block",
					height: "auto",
					aspectRatio: "280 / 160",
					margin: "0 auto",
				}}
			>
				<title>福島県市町村マップ</title>
				{/* 地図パスを先に描画 */}
				{municipalities.map((m, index) => {
					const isHovered = hovered === m.name;
					const isHighlighted =
						!hovered && highlightedMunicipalities.has(m.name);

					// 線の色は従来通り
					const monthStroke = new Date().getMonth() + 1;
					let baseStroke = "#c53030";
					let highlightStroke = "#97266d";
					if (monthStroke >= 3 && monthStroke <= 5) {
						baseStroke = "#b83280";
						highlightStroke = "#97266d";
					} else if (monthStroke >= 6 && monthStroke <= 8) {
						baseStroke = "#b7791f";
						highlightStroke = "#b7791f";
					} else if (monthStroke >= 9 && monthStroke <= 11) {
						baseStroke = "#c05621";
						highlightStroke = "#7b341e";
					} else {
						baseStroke = "#2b6cb0";
						highlightStroke = "#2a4365";
					}

					// ふちを細く
					const strokeWidth = isHovered || isHighlighted ? 1.5 : 0.7;

					const fill =
						isHovered || isHighlighted ? fillColors.highlight : fillColors.base;
					const stroke =
						isHovered || isHighlighted ? highlightStroke : baseStroke;
					const filter = undefined;

					return (
						<g
							key={`${m.name}-${index}`}
							onMouseEnter={() => setInternalHovered(m.name)}
							onMouseLeave={() => setInternalHovered(null)}
							onFocus={() => setInternalHovered(m.name)}
							onBlur={() => setInternalHovered(null)}
							onPointerEnter={() => setHoveredMunicipality?.(m.name)}
							onPointerLeave={() => setHoveredMunicipality?.(null)}
							style={{ cursor: "default" }}
						>
							<title>{m.name}</title>
							<path
								d={m.path}
								fill={fill}
								stroke={stroke}
								strokeWidth={strokeWidth}
								style={{
									filter,
									transition: "all 0.2s",
								}}
							/>
						</g>
					);
				})}
				{/* 市町村名テキストを後から重ねて描画 */}
				{municipalities.map((m, index) => {
					const isHovered = hovered === m.name;
					const isHighlighted =
						!hovered && highlightedMunicipalities.has(m.name);
					if (!(isHovered || isHighlighted)) return null;

					// 文字色を黒に
					return (
						<text
							key={`label-${m.name}-${index}`}
							x={m.center.x}
							y={m.center.y}
							fontSize="12"
							fontWeight="bold"
							fill="#222"
							pointerEvents="none"
							textAnchor="middle"
							alignmentBaseline="middle"
							style={{
								textShadow: "0 2px 8px #fff, 0 0 2px #fff",
								userSelect: "none",
							}}
						>
							{m.name}
						</text>
					);
				})}
			</svg>
		</Box>
	);
};
