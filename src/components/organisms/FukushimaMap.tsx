import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { convertGeoJSONToMunicipalities } from "../../lib/utils/geojsonToSvg";

// FukushimaWeek 型を受け取るための型定義
export interface FukushimaWeek {
  municipality: string;
  // ...他のプロパティ...
  [key: string]: any;
}

interface Municipality {
  name: string;
  path: string;
  center: { x: number; y: number };
}

interface FukushimaMapProps {
  fukushimaWeeks?: FukushimaWeek[];
}

export const FukushimaMap: React.FC<FukushimaMapProps> = ({ fukushimaWeeks }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);

  // 季節カラー推定
  const getSeasonColor = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return { base: "#fff5f7", stroke: "#fbb6ce", highlight: "#ed64a6", highlightStroke: "#b83280" }; // pink
    if (month >= 6 && month <= 8) return { base: "#fffff0", stroke: "#faf089", highlight: "#ecc94b", highlightStroke: "#b7791f" }; // yellow
    if (month >= 9 && month <= 11) return { base: "#fffaf0", stroke: "#f6ad55", highlight: "#ed8936", highlightStroke: "#c05621" }; // orange
    return { base: "#ebf8ff", stroke: "#90cdf4", highlight: "#4299e1", highlightStroke: "#2b6cb0" }; // blue
  };
  const seasonColor = getSeasonColor();

  // 強調する市町村名リストをメモ化
  const highlightedMunicipalities = useMemo(
    () =>
      fukushimaWeeks
        ? new Set(fukushimaWeeks.map((w) => w.municipality))
        : new Set<string>(),
    [fukushimaWeeks]
  );

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/ht-sb/N03-20240101_07.json");
        
        if (!response.ok) {
          throw new Error(`GeoJSONファイルの読み込みに失敗しました: ${response.status}`);
        }

        const geojsonData = await response.json();

        if (!geojsonData.features || geojsonData.features.length === 0) {
          throw new Error("有効なGeoJSONデータが見つかりません");
        }

        const convertedMunicipalities = convertGeoJSONToMunicipalities(geojsonData);
        setMunicipalities(convertedMunicipalities);
      } catch (error) {
        console.error("GeoJSONの読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, []);

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

  return (
    <Box
      width="100%"
      maxW="600px"
      mx="auto"
      mt={-6}
      mb={6}
      bg="white"
      borderRadius="lg"
      p={4}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <svg
        viewBox="40 40 260 135"
        width="80%" // 幅を80%に縮小
        style={{
          display: "block",
          height: "auto",
          aspectRatio: "260 / 160",
          margin: "0 auto",
        }}
      >
        {/* 地図パスを先に描画 */}
        {municipalities.map((m, index) => {
          const isHovered = hovered === m.name;
          const isHighlighted =
            !hovered && highlightedMunicipalities.has(m.name);

          // 見やすい色合い（Chakra UI v2のカラーパレットを参考に濃いめに調整）
          // 春: pink, 夏: yellow, 秋: orange, 冬: blue
          const month = new Date().getMonth() + 1;
          let baseFill = "#e53e3e"; // default: red.500
          let baseStroke = "#c53030"; // default: red.600
          let highlightFill = "#d53f8c"; // default: pink.500
          let highlightStroke = "#97266d"; // default: pink.800
          let labelColor = "#97266d";
          let labelShadow = "#d53f8c";
          if (month >= 3 && month <= 5) {
            // 春: pink
            baseFill = "#ed64a6"; // pink.400
            baseStroke = "#b83280"; // pink.700
            highlightFill = "#d53f8c"; // pink.500
            highlightStroke = "#97266d"; // pink.800
            labelColor = "#97266d";
            labelShadow = "#d53f8c";
          } else if (month >= 6 && month <= 8) {
            // 夏: yellow
            baseFill = "#ecc94b"; // yellow.400
            baseStroke = "#b7791f"; // yellow.700
            highlightFill = "#f6e05e"; // yellow.300
            highlightStroke = "#b7791f"; // yellow.700
            labelColor = "#b7791f";
            labelShadow = "#ecc94b";
          } else if (month >= 9 && month <= 11) {
            // 秋: orange
            baseFill = "#ed8936"; // orange.400
            baseStroke = "#c05621"; // orange.700
            highlightFill = "#dd6b20"; // orange.500
            highlightStroke = "#7b341e"; // orange.900
            labelColor = "#7b341e";
            labelShadow = "#ed8936";
          } else {
            // 冬: blue
            baseFill = "#4299e1"; // blue.400
            baseStroke = "#2b6cb0"; // blue.700
            highlightFill = "#3182ce"; // blue.500
            highlightStroke = "#2a4365"; // blue.900
            labelColor = "#2a4365";
            labelShadow = "#4299e1";
          }

          const fill = isHovered || isHighlighted ? highlightFill : baseFill;
          const stroke = isHovered || isHighlighted ? highlightStroke : baseStroke;
          const strokeWidth = isHovered || isHighlighted ? 2.5 : 1;
          const filter = undefined;

          return (
            <g
              key={`${m.name}-${index}`}
              onMouseEnter={() => setHovered(m.name)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
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