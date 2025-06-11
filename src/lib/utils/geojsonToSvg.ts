interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    N03_004: string; // 市町村名
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
function calculateCentroid(coordinates: number[][][]): [number, number] {
  let totalX = 0;
  let totalY = 0;
  const points = coordinates[0]; // 外周のみ使用
  
  for (const point of points) {
    const [lon, lat] = point;
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
    const coords = feature.geometry.type === "Polygon" 
      ? feature.geometry.coordinates 
      : feature.geometry.coordinates.flat();
      
    for (const ring of coords) {
      if (Array.isArray(ring[0])) {
        // ring is an array of [lon, lat] pairs
        for (const [lon, lat] of ring as number[][]) {
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      }
    }
  }
  
  return { minLon, maxLon, minLat, maxLat };
}

// GeoJSONをSVGパスに変換
export function convertGeoJSONToMunicipalities(geojsonData: GeoJSONData): Municipality[] {
  const bounds = getBounds(geojsonData.features);
  const svgBounds = { width: 260, height: 140, offsetX: 40, offsetY: 40 }; // viewBox="40 40 300 180"に合わせる
  
  return geojsonData.features.map(feature => {
    const name = feature.properties.N03_004;
    
    // Polygonの処理
    const coordinates = feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates
      : feature.geometry.coordinates[0]; // MultiPolygonの場合は最初のポリゴンを使用
    
    // SVGパスを生成
    let pathData = "";
    for (const ring of coordinates) {
      if (Array.isArray(ring) && Array.isArray(ring[0])) {
        const svgPoints = (ring as number[][]).map(([lon, lat]) =>
          projectToSVG(lon, lat, bounds, svgBounds)
        );

        pathData += `M${svgPoints[0][0]},${svgPoints[0][1]}`;
        for (let i = 1; i < svgPoints.length; i++) {
          pathData += `L${svgPoints[i][0]},${svgPoints[i][1]}`;
        }
        pathData += "Z";
      }
    }
    // 重心を計算
    const [centroidLon, centroidLat] = calculateCentroid(
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates as number[][][]
        : (feature.geometry.coordinates as number[][][][])[0]
    );
    const [centerX, centerY] = projectToSVG(centroidLon, centroidLat, bounds, svgBounds);
    
    return {
      name,
      path: pathData,
      center: { x: Math.round(centerX), y: Math.round(centerY) }
    };
  });
}

