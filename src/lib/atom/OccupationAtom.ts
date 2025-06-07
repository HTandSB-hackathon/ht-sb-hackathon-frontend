import { atomWithRefresh, loadable } from "jotai/utils";

import { type Occupation, getOccupations } from "@/lib/domain/OccupationQuery";

export const occupationsAtomAsync = atomWithRefresh<Promise<Occupation[]>>(
	async () => {
		try {
			const response = await getOccupations();
			return response;
		} catch (error) {
			console.error("Error fetching occupations:", error);
			return [];
		}
	},
);

export const occupationsAtomLoadable = loadable(occupationsAtomAsync);
