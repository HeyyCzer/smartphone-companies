import FunctionsComponent from "../functions";
import Navbar from "./Navbar";

export default function App({ children }) {
	return (
		<>
			<FunctionsComponent />

			<div className="animate__animated animate__fadeIn h-full overflow-auto pb-[48px]">
				{children}
			</div>

			<Navbar />
		</>
	)
}
