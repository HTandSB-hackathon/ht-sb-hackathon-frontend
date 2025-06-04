import { getMunicipalities } from "@/lib/domain/CityQuery";
import { atomWithRefresh, loadable } from "jotai/utils";

export const municipalityAtomAsync = atomWithRefresh(async () => {
	try {
		const response = await getMunicipalities({ prefecture_id: 7 });
		return response;
	} catch (error) {
		console.error("Error fetching municipalities:", error);
		return [];
	}
});

export const municipalityAtomLoadable = loadable(municipalityAtomAsync);
