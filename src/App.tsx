import { ProtectedRoute } from "@/lib/route/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router";

import CallbackPage from "@/components/pages/CallbackPage";
import { CharacterDetailPage } from "@/components/pages/CharacterDetailPage";
import { CharactersPage } from "@/components/pages/CharactersPage";
import ChatPage from "@/components/pages/ChatPage";
import ChatsPage from "@/components/pages/ChatsPage";
import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/pages/LoginPage";
import ProfilePage from "@/components/pages/ProfilePage";
import RegisterPage from "@/components/pages/RegisterPage";
import TutorialPage from "@/components/pages/TutorialPage";
import LandingPage from "./components/pages/LandingPage";

function App() {
	return (
		<BrowserRouter basename="/ht-sb">
			<Routes>
				<Route path="" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/tutorial" element={<TutorialPage />} />

				{/* ログイン関係のルート */}
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/callback" element={<CallbackPage />} />

				{/* ルートが存在しない場合の404ページ */}
				{/* 認証が必要なルート */}
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/characters" element={<CharactersPage />} />
					<Route path="/characters/:id" element={<CharacterDetailPage />} />
					<Route path="/chats" element={<ChatsPage />} />
					<Route path="/chats/:characterId" element={<ChatPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
