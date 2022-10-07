import { camelCase, snakeCase } from "lodash";

export type CaseOptions = {
	exclude?: string[];
	excludeValuesForKeys?: string[];
};

const getDefaultOptions = (): CaseOptions => ({
	exclude: [],
	excludeValuesForKeys: [],
});

export const toSnakeCase = (obj: any, options?: CaseOptions): any => {
	options = { ...getDefaultOptions(), ...options };
	if (Array.isArray(obj)) {
		return obj.map(v => toSnakeCase(v, options));
	} else if (obj !== null && obj !== undefined && obj.constructor === Object) {
		const snakeCasedObj: any = {};
		for (const key of Object.keys(obj)) {
			const newKey = options.exclude?.includes(key) ? key : snakeCase(key);
			snakeCasedObj[newKey] =
				options.exclude?.includes(key) ||
				options.excludeValuesForKeys?.includes(key)
					? obj[key]
					: toSnakeCase(obj[key], options);
		}
		return snakeCasedObj;
	}
	return obj;
};

export const camelizeKeys = (obj: any, options?: CaseOptions): any => {
	options = { ...getDefaultOptions(), ...options };
	if (Array.isArray(obj)) {
		return obj.map(v => camelizeKeys(v, options));
	} else if (obj !== null && obj !== undefined && obj.constructor === Object) {
		const camelizedObj: any = {};
		for (const key of Object.keys(obj)) {
			const newKey = options.exclude?.includes(key) ? key : camelCase(key);
			camelizedObj[newKey] =
				options.exclude?.includes(key) ||
				options.excludeValuesForKeys?.includes(key)
					? obj[key]
					: camelizeKeys(obj[key], options);
		}
		return camelizedObj;
	}
	return obj;
};

export function titleCase(s: string): string {
	return s
		.split(" ")
		.map(
			part =>
				part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase()
		)
		.join(" ");
}

/**
 *
 * @param s
 *
 * 'myInputString'
 * =>
 * 'My Input String'
 */
export function camelCaseToSpacedTitleCase(s: string): string {
	if (s.includes(" ")) {
		throw new Error(
			"camelCaseToSpacedTitleCase cannot take a string with a space in it!"
		);
	}

	return (
		s.substring(0, 1).toUpperCase() + s.substring(1).replace(/([A-Z])/, " $1")
	);
}
