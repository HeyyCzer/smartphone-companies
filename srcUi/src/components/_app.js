import FunctionsComponent from "../functions";
import Navbar from "./Navbar";

export default function App({ children }) {
	return (
		<>
			<FunctionsComponent />

			<div className="animate__animated animate__fadeIn h-full overflow-auto pb-[44px]">
				{children}
			</div>

			<Navbar />
		</>
	)
}
