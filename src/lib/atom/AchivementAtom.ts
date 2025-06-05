import {
	type Achivement,
	fetchLockedAchivements,
	fetchUnlockedAchivements,
} from "@/lib/domain/AchivementQuery";
import { atomWithRefresh, loadable } from "jotai/utils";

export const achievementsAtomAsync = atomWithRefresh<Promise<Achivement[]>>(
	async () => {
		try {
			const response = await fetchUnlockedAchivements();
			return response;
		} catch (error) {
			console.error("Error fetching unlocked achievements:", error);
			return [];
		}
	},
);

export const lockedAchievementsAtomAsync = atomWithRefresh<
	Promise<Achivement[]>
>(async () => {
	try {
		const response = await fetchLockedAchivements();
		return response;
	} catch (error) {
		console.error("Error fetching locked achievements:", error);
		return [];
	}
});

export const achievementsAtomLoadable = loadable(achievementsAtomAsync);
export const lockedAchievementsAtomLoadable = loadable(
	lockedAchievementsAtomAsync,
);
