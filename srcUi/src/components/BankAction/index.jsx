import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import moment from "moment";

export default function BankAction({ author, action, amount, date }) {
	const formatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 })

	date = moment(new Date(date));

	return (
		<div className="border-b border-black/10 py-2">
			<div>
				<Tippy content={date.calendar()} className="text-xs" offset={[0, 5]}>
					<span className="text-xs font-light text-black/60 dark:text-white/60"><span className="font-semibold text-black dark:text-white">{author}</span> {date.fromNow()}</span>
				</Tippy>
			</div>
			<div className="text-xs">
				{
					action === "withdraw" ?
						<span className="text-red-600"><FontAwesomeIcon icon={faMinus} /> $ {formatter.format(amount)}</span> :
						<span className="text-green-600"><FontAwesomeIcon icon={faPlus} /> $ {formatter.format(amount)}</span>
				}
			</div>
		</div>
	)
}