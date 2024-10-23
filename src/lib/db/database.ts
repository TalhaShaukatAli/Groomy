import type { cookie, existingUser, newUser, user } from "$lib/types";
import { getDB } from "./mongo";

let db = getDB()

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

export const AddCookie = async (cookie: string) => {
	await db.collection("cookie").insertOne({cookie:cookie, expireTime: (Date.now() + 3600*1000)})
}

export const RemoveCookie = async (cookie: string) => {
	await db.collection("cookie").deleteOne({cookie:cookie})
}

export const GetCookie = async (cookie: string):Promise<cookie> => {
	let result = await db.collection("cookie").findOne({cookie:cookie})
	return result
}

export const UpdateCookie = async (cookie: string) => {
	let updateDoc = {$set: {expireTime: Date.now() + 3600*1000}}
	
	await db.collection("cookie").updateOne({cookie:cookie},updateDoc)

}