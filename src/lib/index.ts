/**
 * Generates a random string of specified length using alphanumeric characters.
 *
 * @param length - The desired length of the random string. Must be a positive integer.
 * @returns A randomly generated string containing uppercase letters, lowercase letters, and numbers.
 *
 * @example
 * // Returns a random 10-character string like "a7Bx9Qm2Tz"
 * const randomId = generateRandomString(10);
 *
 * @throws {Error} If length is less than or equal to 0.
 */
export function generateRandomString(length: number) {
	if (length <= 0) {
		throw new Error('Length must be a positive integer');
	}

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}

/**
 * Combines a date and time string into milliseconds since the Unix epoch.
 *
 * @param date - A date string in a format parseable by Date.parse() (e.g., "2023-06-15")
 * @param startTime - A time string in 24-hour format (e.g., "14:30")
 * @returns The number of milliseconds since the Unix epoch for the combined date and time.
 *
 * @example
 * // Returns milliseconds for June 15, 2023, at 2:30 PM
 * const timestamp = DateTimeCombiner("2023-06-15", "14:30");
 *
 * @throws {Error} If the date or time strings are in an invalid format.
 */
export function DateTimeCombiner(date: string, startTime: string): number {
	const milliseconds = `${date}T${startTime}`;
	const parsedTime = Date.parse(milliseconds);

	return parsedTime;
}
