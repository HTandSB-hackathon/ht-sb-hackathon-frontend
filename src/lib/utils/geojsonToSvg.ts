interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    N03_004: string; // 市町村名
    N03_007?: string; // 行政区域コード
    [key: string]: any;
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface Municipality {
  name: string;
  path: string;
  center: { x: number; y: number };
}

// 緯度経度をSVG座標に変換
function projectToSVG(lon: number, lat: number, bounds: {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}, svgBounds: { width: number; height: number; offsetX: number; offsetY: number }): [number, number] {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * svgBounds.width + svgBounds.offsetX;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * svgBounds.height + svgBounds.offsetY;
  return [x, y];
}

// 座標データの正規化と検証
function normalizeCoordinates(coordinates: any): number[][][] | null {
  if (!Array.isArray(coordinates)) return null;
  
  const result: number[][][] = [];
  
  for (const ring of coordinates) {
    if (!Array.isArray(ring)) continue;
    
    const normalizedRing: number[][] = [];
    
    for (let i = 0; i < ring.length; i++) {
      const point = ring[i];
      
      // 座標ペアをチェック
      if (Array.isArray(point) && point.length >= 2) {
        const [lon, lat] = point;
        if (typeof lon === 'number' && typeof lat === 'number') {
          normalizedRing.push([lon, lat]);
        }
      } else if (typeof point === 'number' && i + 1 < ring.length && typeof ring[i + 1] === 'number') {
        // 連続する数値を座標ペアとして扱う
        normalizedRing.push([point, ring[i + 1]]);
        i++; // 次の要素をスキップ
      }
    }
    
    if (normalizedRing.length >= 3) { // ポリゴンには最低3点必要
      result.push(normalizedRing);
    }
  }
  
  return result.length > 0 ? result : null;
}

// 福島県の境界を取得
function getBounds(features: GeoJSONFeature[]): {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
} {
  let minLon = Infinity, maxLon = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  
  for (const feature of features) {
    const normalizedCoords = normalizeCoordinates(feature.geometry.coordinates);
    if (!normalizedCoords) continue;
    
    for (const ring of normalizedCoords) {
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }
  
  if (minLon === Infinity || maxLon === -Infinity || minLat === Infinity || maxLat === -Infinity) {
    throw new Error("No valid coordinate bounds found");
  }
  
  return { minLon, maxLon, minLat, maxLat };
}

// ポリゴンの重心を計算
function calculateCentroid(coordinates: number[][][]): [number, number] {
  let totalX = 0;
  let totalY = 0;
  let totalPoints = 0;
  
  // 全てのリングの座標を使用
  for (const ring of coordinates) {
    for (const [lon, lat] of ring) {
      totalX += lon;
      totalY += lat;
      totalPoints++;
    }
  }
  
  if (totalPoints === 0) {
    throw new Error("No valid coordinate points found");
  }
  
  return [totalX / totalPoints, totalY / totalPoints];
}

// GeoJSONをSVGパスに変換
export function convertGeoJSONToMunicipalities(geojsonData: GeoJSONData): Municipality[] {
  // 有効な座標を持つfeatureを除外
  const validFeatures = geojsonData.features.filter(feature => {
    if (!feature.geometry.coordinates) return false;
    
    const normalizedCoords = normalizeCoordinates(feature.geometry.coordinates);
    return normalizedCoords !== null;
  });
  
  if (validFeatures.length === 0) {
    throw new Error("有効なgeometry座標を持つfeatureが見つかりません");
  }
  
  const bounds = getBounds(validFeatures);
  const svgBounds = { width: 260, height: 140, offsetX: 40, offsetY: 40 };
  
  // 市町村名でグループ化して重複を統合
  const municipalityMap = new Map<string, {
    name: string;
    paths: string[];
    centroids: [number, number][];
  }>();
  
  for (const feature of validFeatures) {
    const name = feature.properties.N03_004;
    if (!name) continue;
    
    const normalizedCoords = normalizeCoordinates(feature.geometry.coordinates);
    if (!normalizedCoords) continue;
    
    try {
      // SVGパスを生成
      let pathData = "";
      for (const ring of normalizedCoords) {
        if (ring.length < 3) continue; // ポリゴンには最低3点必要
        
        const svgPoints = ring.map(([lon, lat]) => 
          projectToSVG(lon, lat, bounds, svgBounds)
        );
        
        pathData += `M${svgPoints[0][0]},${svgPoints[0][1]}`;
        for (let i = 1; i < svgPoints.length; i++) {
          pathData += `L${svgPoints[i][0]},${svgPoints[i][1]}`;
        }
        pathData += "Z";
      }
      
      if (pathData === "") continue; // 有効なパスが生成されなかった場合はスキップ
      
      // 重心を計算
      const [centroidLon, centroidLat] = calculateCentroid(normalizedCoords);
      
      if (!municipalityMap.has(name)) {
        municipalityMap.set(name, {
          name,
          paths: [],
          centroids: []
        });
      }
      
      const municipality = municipalityMap.get(name)!;
      municipality.paths.push(pathData);
      municipality.centroids.push([centroidLon, centroidLat]);
    } catch (error) {
      console.warn(`市町村 ${name} の処理中にエラーが発生しました:`, error);
      continue;
    }
  }
  
  // 統合されたデータからMunicipalityオブジェクトを作成
  return Array.from(municipalityMap.values()).map(({ name, paths, centroids }) => {
    // 複数のパスを結合
    const combinedPath = paths.join(" ");
    
    // 重心の平均を計算
    const avgLon = centroids.reduce((sum, [lon]) => sum + lon, 0) / centroids.length;
    const avgLat = centroids.reduce((sum, [, lat]) => sum + lat, 0) / centroids.length;
    const [centerX, centerY] = projectToSVG(avgLon, avgLat, bounds, svgBounds);
    
    return {
      name,
      path: combinedPath,
      center: { x: Math.round(centerX), y: Math.round(centerY) }
    };
  });
}

