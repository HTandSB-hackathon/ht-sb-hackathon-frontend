import { ProtectedRoute } from "@/lib/route/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router";

import CallbackPage from "@/components/pages/CallbackPage";
import ChatsPage from "@/components/pages/ChatsPage";
import CharacterPage from "@/components/pages/CharacterPage";
import HomePage from "@/components/pages/HomePage";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "@/components/pages/LoginPage";
import MainPage from "@/components/pages/MainPage";
import RegisterPage from "@/components/pages/RegisterPage";
import TutorialPage from "@/components/pages/TutorialPage";

function App() {
	return (
		<BrowserRouter basename="/ht-sb">
			<Routes>
				<Route path="/" element={<MainPage />} />

				<Route path="" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/tutorial" element={<TutorialPage />} />
				<Route path="/home" element={<HomePage />} />	
				<Route path="/chats" element={<ChatsPage />} />	
				<Route path="/chats/:characterId" element={<CharacterPage />} />	

				{/* ログイン関係のルート */}
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/callback" element={<CallbackPage />} />

				{/* ルートが存在しない場合の404ページ */}
				{/* 認証が必要なルート */}
				<Route element={<ProtectedRoute />}>
					<Route path="/main" element={<MainPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
