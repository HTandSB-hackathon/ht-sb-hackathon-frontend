import { ProtectedRoute } from "@/lib/route/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router";

import CallbackPage from "@/components/pages/CallbackPage";
import LoginPage from "@/components/pages/LoginPage";
import MainPage from "@/components/pages/MainPage";
import { CharactersPage } from "@/components/pages/CharactersPage";
import { CharacterDetailPage } from "@/components/pages/CharacterDetailPage";

function App() {
	return (
		<BrowserRouter basename="/ht-sb">
			<Routes>
				<Route path="/" element={<MainPage />} />

				{/* ログイン関係のルート */}
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/callback" element={<CallbackPage />} />
				<Route path="/characters" element={<CharactersPage />} />
				<Route path="/character/:id" element={<CharacterDetailPage />} />


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
