import axios from "axios";
import EventEmitter from "eventemitter3";
import Swal from "sweetalert2/dist/sweetalert2.js";

const eventEmitter = new EventEmitter();

export const isDevEnv = () => !window.invokeNative && process.env.NODE_ENV === "development";

const getResourceName = () => {
	if (window.GetCurrentResourceName) return window.GetCurrentResourceName();
	return "companies-app";
};

const axiosInstance = axios.create({
	baseURL: `https://${getResourceName()}/`,
	timeout: 5000,
});

axiosInstance.interceptors.request.use(
	(request) => {
		if (isDevEnv()) {
			return {
				cancelToken: new axios.CancelToken((cancel) => cancel("Ambiente de desenvolvimento detectado. Request cancelado.")),
			};
		}

		return request;
	},
	(error) => Promise.reject(error),
);

export { eventEmitter, axiosInstance };

export const Modal = Swal.mixin({
	confirmButtonText: `<i class="fa-solid fa-check mr-1"></i> Confirmar`,
	cancelButtonText: `<i class="fa-solid fa-xmark mr-1"></i> Cancelar`,
});
	
let debugEnabled = false;
export function setDebugEnabled(status) {
	debugEnabled = status;
	warn("Debug status setted to", color(status, "yellow"));
}

export const debug = (...message) => {
	if (isDevEnv() || debugEnabled) console.info(color("[DEBUG]", "blue"), ...message);
};

export const warn = (...message) => {
	console.warn(color("[WARNING]", "yellow"), ...message);
};

export const error = (...message) => {
	console.error(color("[ERROR]", "red"), ...message);
};

const colors = {
	reset: "^0",
	red: "^1",
	green: "^2",
	yellow: "^3",
	blue: "^4",
};

export const color = (text, color) => {
	if (isDevEnv()) return text;
	if (!colors[color]) {
		error("Color missing: " + color);
		return text;
	}

	return colors[color] + text + colors.reset;
};
