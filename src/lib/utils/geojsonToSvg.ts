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

// ポリゴンの重心を計算
function calculateCentroid(coordinates: number[][]): [number, number] {
  let totalX = 0;
  let totalY = 0;
  const points = coordinates[0]; // 外周のみ使用
  
  for (const [lon, lat] of points) {
    totalX += lon;
    totalY += lat;
  }
  
  return [totalX / points.length, totalY / points.length];
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
    if (feature.geometry.coordinates.length === 0) continue;
    
    const coords = feature.geometry.type === "Polygon" 
      ? feature.geometry.coordinates 
      : feature.geometry.coordinates.flat();
      
    for (const ring of coords) {
      if (ring.length === 0) continue;
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }
  
  return { minLon, maxLon, minLat, maxLat };
}

// GeoJSONをSVGパスに変換
export function convertGeoJSONToMunicipalities(geojsonData: GeoJSONData): Municipality[] {
  // 空の座標を持つfeatureを除外
  const validFeatures = geojsonData.features.filter(feature => 
    feature.geometry.coordinates.length > 0 && 
    feature.geometry.coordinates[0].length > 0
  );
  
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
    
    const coordinates = feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates
      : feature.geometry.coordinates[0];
    
    if (coordinates.length === 0 || coordinates[0].length === 0) continue;
    
    // SVGパスを生成
    let pathData = "";
    for (const ring of coordinates) {
      if (ring.length === 0) continue;
      const svgPoints = ring.map(([lon, lat]) => 
        projectToSVG(lon, lat, bounds, svgBounds)
      );
      
      pathData += `M${svgPoints[0][0]},${svgPoints[0][1]}`;
      for (let i = 1; i < svgPoints.length; i++) {
        pathData += `L${svgPoints[i][0]},${svgPoints[i][1]}`;
      }
      pathData += "Z";
    }
    
    // 重心を計算
    const [centroidLon, centroidLat] = calculateCentroid(coordinates);
    
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

