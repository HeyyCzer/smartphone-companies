import { useEffect, useState } from "react";
import Company from "../../components/Company";
import App from "../../components/_app";
import { axiosInstance, isDevEnv } from "../../utils";
import LoadingPage from "../_Loading";

export default function HomePage() {
	const filters = ["Restaurantes", "Mecânicas", "Outros"];

	const [loading, setLoading] = useState(!isDevEnv());
	const [currentFilter, setCurrentFilter] = useState(null);
	const [companies, setCompanies] = useState(isDevEnv() ? [
		{
			id: 1,
			name: "The Emerald Bar",
			type: "Restaurante",
			avatar: "https://wallpaperaccess.com/full/5749057.jpg",
			isOpen: true,
		}
	] : []);

	useEffect(() => {
		axiosInstance.post("/getCompanies")
			.then(({ data }) => {
				setCompanies(data);
				setLoading(false);
			});
	}, []);

	if (loading)
		return <LoadingPage />

	return (
		<App>
			{/* Title */}
			<h1 className="text-xs text-white/70 py-4 text-center">Início</h1>

			{/* Content */}
			<div className="mx-3">
				<div className="mb-4 text-center text-2xs text-white/60">
					Filtrar por
					<div className={"grid grid-cols-3 bg-gray-500 rounded-lg"}>
						{filters.map(filter => (
							<button
								key={filter}
								type="button"
								className={`transition-colors ${currentFilter === filter ? "bg-primary text-white" : "hover:bg-primary/60"} first:rounded-l-lg last:rounded-r-lg`}
								onClick={() => setCurrentFilter(filter === currentFilter ? null : filter)}
							>
								{filter}
							</button>
						))}
					</div>
				</div>

				{
					companies.filter(item => !currentFilter || item.type + "s" === currentFilter).map((company, index) => (
						<Company
							key={index} id={company.id}
							name={company.name} type={company.type}
							isOpen={company.isOpen}
							avatar={company.avatar}
						/>
					))					
				}
			</div>
		</App>
	)
}
