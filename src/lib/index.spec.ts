import { describe, it, expect } from 'vitest';
import { DateTimeCombiner, generateRandomString } from '$lib';

describe('Index Tests', () => {
	it('Generate Random String - 10 digit', () => {
		const length = 10;
		const randomString = generateRandomString(length);
		expect(randomString).toBeTypeOf('string');
		expect(randomString.length).toBe(length);
	});

	it('Generate Random String - 7 digit', () => {
		const length = 7;
		const randomString = generateRandomString(length);
		expect(randomString).toBeTypeOf('string');
		expect(randomString.length).toBe(length);
	});
});

describe('DateTimeCombiner Tests', () => {
	it('should correctly combine valid date and time', () => {
		const date = '2024-01-01';
		const time = '14:30:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBe(Date.parse('2024-01-01T14:30:00'));
	});

	it('should handle single-digit hours and minutes', () => {
		const date = '2024-01-01';
		const time = '09:05:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBe(Date.parse('2024-01-01T09:05:00'));
	});

	it('should handle midnight time', () => {
		const date = '2024-01-01';
		const time = '00:00:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBe(Date.parse('2024-01-01T00:00:00'));
	});

	it('should handle end of day time', () => {
		const date = '2024-01-01';
		const time = '23:59:59';
		const result = DateTimeCombiner(date, time);
		expect(result).toBe(Date.parse('2024-01-01T23:59:59'));
	});

	it('should handle leap year date', () => {
		const date = '2024-02-29';
		const time = '12:00:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBe(Date.parse('2024-02-29T12:00:00'));
	});

	it('should return NaN for invalid date', () => {
		const date = '2024-13-01'; // Invalid month
		const time = '12:00:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBeNaN();
	});

	it('should return NaN for invalid time', () => {
		const date = '2024-01-01';
		const time = '25:00:00'; // Invalid hour
		const result = DateTimeCombiner(date, time);
		expect(result).toBeNaN();
	});

	it('should return NaN for malformed date format', () => {
		const date = '01-01-2024'; // Wrong format
		const time = '12:00:00';
		const result = DateTimeCombiner(date, time);
		expect(result).toBeNaN();
	});
});
