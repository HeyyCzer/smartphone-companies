export const isDevEnv = () => !window.invokeNative && process.env.NODE_ENV === "development";

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
