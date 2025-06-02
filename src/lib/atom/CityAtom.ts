import { getMunicipalities } from "@/lib/domain/CityQuery";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

const municipalityAtomAsync = atom(async () => {
	try {
		const response = await getMunicipalities({ prefecture_id: 7 });
		return response;
	} catch (error) {
		console.error("Error fetching municipalities:", error);
		return [];
	}
});

export const municipalityAtomLoadable = loadable(municipalityAtomAsync);
