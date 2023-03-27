import Company from "../components/Company";
import Navbar from "../components/Navbar";

export default function HomePage() {
	return (
		<div>
			{/* Title */}
			<h1 className="text-xs text-white/40 py-3 text-center">Início</h1>

			{/* Content */}
			<div className="mx-3">
				<Company
					key={1} id={1}
					name="Benny's" type="Mecânica"
					isOpen={true}
					avatar="https://steamuserimages-a.akamaihd.net/ugc/805425361414836245/1ED0151C55AA4B239ACA24C4F36C4DBA1DD55C04/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
				/>
				<Company
					key={2} id={2}
					name="The Emerald Bar" type="Restaurante"
					isOpen={false}
					avatar="https://wallpaperaccess.com/full/5749057.jpg"
				/>
			</div>

			{/* Navbar */}
			<Navbar />
		</div>
	)
}
