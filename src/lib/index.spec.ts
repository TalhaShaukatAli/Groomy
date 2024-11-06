import { describe, it, expect, beforeAll, beforeEach, vi, afterEach, assert } from 'vitest';
import { generateRandomString } from '$lib';


describe("Index Tests", () => {
    it('Generate Random String - 10 digit', () => {
        let length = 10
        let randomString = generateRandomString(length)
        expect(randomString).toBeTypeOf("string")
        expect(randomString.length).toBe(length)
    })

    it('Generate Random String - 7 digit', ()=>{
        let length = 7
        let randomString = generateRandomString(length)
        expect(randomString).toBeTypeOf("string")
        expect(randomString.length).toBe(length)
    });
})