import type { Character } from "@/lib/domain/CharacterQuery";
import {
	type Municipality,
	type MunicipalityFascinating,
	getMunicipalities,
	getMunicipalityFascinating,
} from "@/lib/domain/CityQuery";
import { atom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";
import { characterAtomAsync } from "./CharacterAtom";

export const municipalityAtomAsync = atomWithRefresh(async () => {
	try {
		const response = await getMunicipalities({ prefecture_id: 7 });
		return response;
	} catch (error) {
		console.error("Error fetching municipalities:", error);
		return [];
	}
});

export const municipalityFascinatingAtomAsync = atomWithRefresh(async () => {
	try {
		const response = await getMunicipalityFascinating({
			prefecture_id: 7,
		});
		return response;
	} catch (error) {
		console.error("Error fetching municipality fascinating data:", error);
		return [];
	}
});

export const municipalityAtomLoadable = loadable(municipalityAtomAsync);
export const municipalityFascinatingAtomLoadable = loadable(
	municipalityFascinatingAtomAsync,
);

interface MunicipalityWithCharacters {
	municipality: Municipality;
	characters: Character[] | [];
}

export const municipalityWithCharactersAtom = atom<
	Promise<MunicipalityWithCharacters[]>
>(async (get) => {
	const municipalities = await get(municipalityAtomAsync);
	const characters = await get(characterAtomAsync);
	return municipalities.map((municipality) => {
		const charactersData = characters.filter(
			(c) => c.municipalityId === municipality.id,
		);
		console.log(
			"Municipality:",
			municipality.name,
			"Characters:",
			charactersData,
		);
		return {
			municipality: municipality,
			characters: charactersData || [],
		};
	});
});
