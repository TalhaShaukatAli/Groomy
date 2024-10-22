import { getDB } from "./mongo";

let db = getDB()

export const test = async() => {
	let data = await db.collection("users").findOne({})
	return data
}