import { ProtectedRoute } from "@/lib/route/ProtectedRoute";
import { useAtom, useSetAtom } from "jotai";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import {
	isLevelUpModalOpenAtom,
	isNewCharacterModalOpenAtom,
	isNewStoryModalOpenAtom,
} from "./lib/atom/BaseAtom";

import { LevelUpModal } from "./components/organisms/LevelUpModal";

import CallbackPage from "@/components/pages/CallbackPage";
import { CharacterDetailPage } from "@/components/pages/CharacterDetailPage";
import { CharactersPage } from "@/components/pages/CharactersPage";
import ChatPage from "@/components/pages/ChatPage";
import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/pages/LoginPage";
import PrivacyPolicyPage from "@/components/pages/PrivacyPolicyPage";
import ProfilePage from "@/components/pages/ProfilePage";
import RegisterPage from "@/components/pages/RegisterPage";
import SettingsPage from "@/components/pages/SettingsPage";
import TermsOfServicePage from "@/components/pages/TermsOfServicePage";
import TutorialPage from "@/components/pages/TutorialPage";
import { useEffect } from "react";
import { NewCharacterOpenModal } from "./components/organisms/NewCharacterOpenModal";
import { NewStoryOpenModal } from "./components/organisms/NewStoryOpenModal";
import LandingPage from "./components/pages/LandingPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import {
	levelUpCharacterDetailAtom,
	newCharacterRelationshipAtom,
	newStoryAtom,
	newlyUnlockedCharacterIdsAtom,
} from "./lib/atom/CharacterAtom";

import { BGMManagerProvider } from "./lib/provider/BGMProvider";

function App() {
	const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useAtom(
		isLevelUpModalOpenAtom,
	);
	const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useAtom(
		isNewCharacterModalOpenAtom,
	);
	const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useAtom(
		isNewStoryModalOpenAtom,
	);
	const setLevelUpCharacterDetail = useSetAtom(levelUpCharacterDetailAtom);
	const setNewCharacterRelationship = useSetAtom(newCharacterRelationshipAtom);
	const setNewCharacterIds = useSetAtom(newlyUnlockedCharacterIdsAtom);
	const setNewStory = useSetAtom(newStoryAtom);

	useEffect(() => {
		setIsLevelUpModalOpen(false);
		setIsNewCharacterModalOpen(false);
		setLevelUpCharacterDetail(null);
		setNewCharacterRelationship(null);
		setNewCharacterIds(new Set([]));
		setIsNewStoryModalOpen(false);
		setNewStory(null);
	}, []);

	return (
		<div>
			<BrowserRouter basename="/ht-sb">
				<BGMManagerProvider />
				<Routes>
					<Route path="" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/tutorial" element={<TutorialPage />} />
					<Route path="/privacy" element={<PrivacyPolicyPage />} />
					<Route path="/terms" element={<TermsOfServicePage />} />

					{/* ログイン関係のルート */}
					<Route path="/auth/login" element={<LoginPage />} />
					<Route path="/auth/callback" element={<CallbackPage />} />

					{/* ルートが存在しない場合の404ページ */}
					{/* 認証が必要なルート */}
					<Route element={<ProtectedRoute />}>
						<Route path="/home" element={<HomePage />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="/characters" element={<CharactersPage />} />
						<Route path="/characters/:id" element={<CharacterDetailPage />} />
						<Route path="/chats/:characterId" element={<ChatPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
					{/* キャッチオールルート - 定義されていないパスは全てランディングページにリダイレクト */}
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
			{isLevelUpModalOpen && (
				<LevelUpModal
					onClose={() => setIsLevelUpModalOpen(false)}
					isOpen={isLevelUpModalOpen}
				/>
			)}
			{isNewCharacterModalOpen && (
				<NewCharacterOpenModal
					isOpen={isNewCharacterModalOpen}
					onClose={() => setIsNewCharacterModalOpen(false)}
				/>
			)}
			{isNewStoryModalOpen && (
				<NewStoryOpenModal
					isOpen={isNewStoryModalOpen}
					onClose={() => setIsNewStoryModalOpen(false)}
				/>
			)}
		</div>
	);
}

export default App;
