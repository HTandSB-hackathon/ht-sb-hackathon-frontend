import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { convertGeoJSONToMunicipalities } from "../../lib/utils/geojsonToSvg";

interface Municipality {
  name: string;
  path: string;
  center: { x: number; y: number };
}

export const FukushimaMap = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/ht-sb/N03-20240101_07.geojson");
        
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
      my={8}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      position="relative"
    >
      <Text fontWeight="bold" fontSize="lg" mb={2} textAlign="center">
        福島県 市町村マップ
      </Text>
      <svg
        viewBox="40 40 300 180"
        width="100%"
        style={{ 
          display: "block",
          height: "auto",
          aspectRatio: "300 / 180"
        }}
      >
        {municipalities.map((m, index) => (
          <g
            key={`${m.name}-${index}`}
            onMouseEnter={() => setHovered(m.name)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          >
            <title>{m.name}</title>
            <path
              d={m.path}
              fill={hovered === m.name ? "#3182ce" : "#bee3f8"}
              stroke={hovered === m.name ? "#2b6cb0" : "#90cdf4"}
              strokeWidth={hovered === m.name ? 2.5 : 1}
              style={{
                filter:
                  hovered === m.name
                    ? "drop-shadow(0 0 6px #3182ce88)"
                    : undefined,
                transition: "all 0.2s",
              }}
            />
            {hovered === m.name && (
              <text
                x={m.center.x}
                y={m.center.y}
                fontSize="16"
                fontWeight="bold"
                fill="#2b6cb0"
                pointerEvents="none"
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{
                  textShadow: "0 2px 8px #fff, 0 0 2px #3182ce",
                  userSelect: "none",
                }}
              >
                {m.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </Box>
  );
};