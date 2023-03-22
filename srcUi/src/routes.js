import { HashRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";

export default function AppRouter() {
	return (
		<HashRouter>
			<Routes>
				<Route index element={<HomePage />} />
				
				{/* Not found */}
				<Route path="*" element={
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
						<p className="text-2xl">😢</p>
						<div className="text-white/70 text-sm">
							Página não encontrada!
						</div>

						<div className="mt-4">
							<Link to="/" className="bg-primary rounded-lg py-1 px-4 text-xs">
								Voltar
							</Link>
						</div>
					</div>
				} />
			</Routes>
		</HashRouter>
	)
}
