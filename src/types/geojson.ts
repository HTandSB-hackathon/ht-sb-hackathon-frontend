export interface GeoJSONFeature {
	type: "Feature";
	geometry: {
		type: "Polygon" | "MultiPolygon";
		coordinates: number[][][] | number[][][][];
	};
	properties: {
		N03_001?: string; // 都道府県名
		N03_002?: string; // 支庁・振興局名
		N03_003?: string; // 郡・政令都市名
		N03_004: string; // 市区町村名
		N03_005?: string; // その他
		N03_007?: string; // 行政区域コード
		[key: string]: string | number | undefined;
	};
}

export interface GeoJSONData {
	type: "FeatureCollection";
	name: string;
	features: GeoJSONFeature[];
}

export interface Municipality {
	name: string;
	path: string;
	center: { x: number; y: number };
}
