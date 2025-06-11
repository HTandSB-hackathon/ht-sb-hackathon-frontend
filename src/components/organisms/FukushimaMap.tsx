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
        // まず複数のパスを試す
        const possiblePaths = [
          "/ht-sb/N03-20240101_07.geojson",
          "/N03-20240101_07.geojson",
          "/public/N03-20240101_07.geojson",
          "./N03-20240101_07.geojson",
        ];

        let response: Response | null = null;
        let lastError: Error | null = null;

        for (const path of possiblePaths) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              response = res;
              console.log(`GeoJSONファイルが見つかりました: ${path}`);
              break;
            }
          } catch (err) {
            lastError = err as Error;
            continue;
          }
        }

        if (!response) {
          throw new Error(`GeoJSONファイルが見つかりません。最後のエラー: ${lastError?.message}`);
        }

        const geojsonData = await response.json();
        console.log("読み込まれたGeoJSONデータ:", geojsonData);

        // GeoJSONデータの検証（featuresが空でも警告のみ）
        if (!geojsonData.features) {
          throw new Error("GeoJSONにfeaturesプロパティが含まれていません");
        }

        if (geojsonData.features.length === 0) {
          console.warn("GeoJSONのfeaturesが空です。フォールバックデータを使用します。");
          throw new Error("GeoJSONのfeaturesが空です");
        }

        const convertedMunicipalities = convertGeoJSONToMunicipalities(geojsonData);
        setMunicipalities(convertedMunicipalities);
        console.log("変換完了:", convertedMunicipalities);
      } catch (error) {
        console.error("GeoJSONの読み込みに失敗しました:", error);
        console.warn("フォールバックデータを使用します");

        // フォールバックとして既存のデータを使用
        setMunicipalities([
          { name: "福島市", path: "M120,60 L130,70 L125,90 L115,85 Z", center: { x: 123, y: 78 } },
          { name: "会津若松市", path: "M90,110 L105,120 L100,135 L85,130 Z", center: { x: 97, y: 123 } },
          { name: "郡山市", path: "M140,100 L155,110 L150,125 L135,120 Z", center: { x: 145, y: 115 } },
          { name: "いわき市", path: "M180,130 L195,140 L190,155 L175,150 Z", center: { x: 185, y: 145 } },
          { name: "白河市", path: "M130,140 L145,150 L140,165 L125,160 Z", center: { x: 135, y: 155 } },
          { name: "須賀川市", path: "M135,120 L150,125 L145,140 L130,135 Z", center: { x: 140, y: 130 } },
          { name: "喜多方市", path: "M80,90 L95,100 L90,115 L75,110 Z", center: { x: 87, y: 103 } },
          { name: "相馬市", path: "M170,60 L185,65 L180,80 L165,75 Z", center: { x: 175, y: 70 } },
          { name: "二本松市", path: "M125,90 L140,95 L135,110 L120,105 Z", center: { x: 130, y: 100 } },
          { name: "田村市", path: "M155,110 L170,115 L165,130 L150,125 Z", center: { x: 160, y: 120 } },
          { name: "南相馬市", path: "M185,65 L200,70 L195,85 L180,80 Z", center: { x: 190, y: 75 } },
          { name: "伊達市", path: "M130,70 L145,75 L140,95 L125,90 Z", center: { x: 135, y: 80 } },
          { name: "本宮市", path: "M135,110 L150,115 L145,130 L130,125 Z", center: { x: 140, y: 120 } },
          { name: "桑折町", path: "M145,75 L160,80 L155,95 L140,95 Z", center: { x: 150, y: 85 } },
          { name: "国見町", path: "M160,80 L175,85 L170,100 L155,95 Z", center: { x: 165, y: 90 } },
          { name: "川俣町", path: "M140,95 L155,95 L150,110 L135,110 Z", center: { x: 145, y: 100 } },
          { name: "大玉村", path: "M120,105 L135,110 L130,125 L115,120 Z", center: { x: 125, y: 115 } },
          { name: "鏡石町", path: "M130,135 L145,140 L140,155 L125,150 Z", center: { x: 135, y: 145 } },
          { name: "天栄村", path: "M125,160 L140,165 L135,180 L120,175 Z", center: { x: 130, y: 170 } },
          { name: "下郷町", path: "M100,135 L115,140 L110,155 L95,150 Z", center: { x: 105, y: 145 } },
          { name: "檜枝岐村", path: "M85,170 L100,175 L95,190 L80,185 Z", center: { x: 90, y: 180 } },
          { name: "只見町", path: "M70,150 L85,155 L80,170 L65,165 Z", center: { x: 75, y: 160 } },
          { name: "南会津町", path: "M95,150 L110,155 L105,170 L90,165 Z", center: { x: 100, y: 160 } },
          { name: "北塩原村", path: "M75,110 L90,115 L85,130 L70,125 Z", center: { x: 80, y: 120 } },
          { name: "西会津町", path: "M60,120 L75,125 L70,140 L55,135 Z", center: { x: 65, y: 130 } },
          { name: "磐梯町", path: "M95,100 L110,105 L105,120 L90,115 Z", center: { x: 100, y: 110 } },
          { name: "猪苗代町", path: "M110,105 L125,110 L120,125 L105,120 Z", center: { x: 115, y: 115 } },
          { name: "会津坂下町", path: "M85,130 L100,135 L95,150 L80,145 Z", center: { x: 90, y: 140 } },
          { name: "湯川村", path: "M100,120 L115,125 L110,140 L95,135 Z", center: { x: 105, y: 130 } },
          { name: "柳津町", path: "M80,145 L95,150 L90,165 L75,160 Z", center: { x: 85, y: 155 } },
          { name: "三島町", path: "M65,135 L80,140 L75,155 L60,150 Z", center: { x: 70, y: 145 } },
          { name: "金山町", path: "M60,150 L75,155 L70,170 L55,165 Z", center: { x: 65, y: 160 } },
          { name: "昭和村", path: "M75,160 L90,165 L85,180 L70,175 Z", center: { x: 80, y: 170 } },
          { name: "会津美里町", path: "M110,120 L125,125 L120,140 L105,135 Z", center: { x: 115, y: 130 } },
          { name: "西郷村", path: "M145,150 L160,155 L155,170 L140,165 Z", center: { x: 150, y: 160 } },
          { name: "泉崎村", path: "M125,150 L140,155 L135,170 L120,165 Z", center: { x: 130, y: 160 } },
          { name: "中島村", path: "M140,155 L155,160 L150,175 L135,170 Z", center: { x: 145, y: 165 } },
          { name: "矢吹町", path: "M155,160 L170,165 L165,180 L150,175 Z", center: { x: 160, y: 170 } },
          { name: "棚倉町", path: "M170,165 L185,170 L180,185 L165,180 Z", center: { x: 175, y: 175 } },
          { name: "矢祭町", path: "M185,170 L200,175 L195,190 L180,185 Z", center: { x: 190, y: 180 } },
          { name: "塙町", path: "M200,175 L215,180 L210,195 L195,190 Z", center: { x: 205, y: 185 } },
          { name: "鮫川村", path: "M215,180 L230,185 L225,200 L210,195 Z", center: { x: 220, y: 190 } },
          { name: "石川町", path: "M165,130 L180,135 L175,150 L160,145 Z", center: { x: 170, y: 140 } },
          { name: "玉川村", path: "M180,135 L195,140 L190,155 L175,150 Z", center: { x: 185, y: 145 } },
          { name: "平田村", path: "M195,140 L210,145 L205,160 L190,155 Z", center: { x: 200, y: 150 } },
          { name: "浅川町", path: "M210,145 L225,150 L220,165 L205,160 Z", center: { x: 215, y: 155 } },
          { name: "古殿町", path: "M225,150 L240,155 L235,170 L220,165 Z", center: { x: 230, y: 160 } },
          { name: "三春町", path: "M150,125 L165,130 L160,145 L145,140 Z", center: { x: 155, y: 135 } },
          { name: "小野町", path: "M165,145 L180,150 L175,165 L160,160 Z", center: { x: 170, y: 155 } },
          { name: "広野町", path: "M195,85 L210,90 L205,105 L190,100 Z", center: { x: 200, y: 95 } },
          { name: "楢葉町", path: "M210,90 L225,95 L220,110 L205,105 Z", center: { x: 215, y: 100 } },
          { name: "富岡町", path: "M225,95 L240,100 L235,115 L220,110 Z", center: { x: 230, y: 105 } },
          { name: "川内村", path: "M240,100 L255,105 L250,120 L235,115 Z", center: { x: 245, y: 110 } },
          { name: "大熊町", path: "M255,105 L270,110 L265,125 L250,120 Z", center: { x: 260, y: 115 } },
          { name: "双葉町", path: "M270,110 L285,115 L280,130 L265,125 Z", center: { x: 275, y: 120 } },
          { name: "浪江町", path: "M285,115 L300,120 L295,135 L280,130 Z", center: { x: 290, y: 125 } },
          { name: "葛尾村", path: "M295,135 L310,140 L305,155 L290,150 Z", center: { x: 300, y: 145 } },
          { name: "新地町", path: "M200,70 L215,75 L210,90 L195,85 Z", center: { x: 205, y: 80 } },
          { name: "飯舘村", path: "M215,75 L230,80 L225,95 L210,90 Z", center: { x: 220, y: 85 } },
        ]);
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