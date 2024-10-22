import type { existingUser, newUser, user } from "$lib/types";
import { getDB } from "./mongo";

let db = getDB()

export const test = async() => {
	let data = await db.collection("users").findOne({})
	return data
}

export const AddNewUser = async (user: newUser) => {
	await db.collection("users").insertOne(user)
}

export const GetUserByEmail = async (email: string):Promise<existingUser | undefined> => {
	let returnData = await db.collection("users").findOne({email:email})
	if(returnData != null){
		return <existingUser>returnData
	} else {
		return undefined
	}
}