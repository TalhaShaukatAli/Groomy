import { Auth_AddNewUser, Auth_GetUserByEmail, Customer_AddNewCustomer } from "$lib/db/database";
import type { newCustomerRecord, newUser } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data:newUser = await request.json();
        
		const user = await Auth_GetUserByEmail(data.email);

        if(user == undefined){
            return json({ success: false, message: "User with email already exists" }, { status: 201 });
        } 

        let result = await Auth_AddNewUser(data);

        if(result.acknowledged){
            return json({ success: true, message: "Success" }, { status: 201 });
        } else {
            return json({ success: false, message: "Error creating account. Try again later." }, { status: 201 });
        }
    } catch (error) {
        return json({ success: false, message: "Server Error" }, { status: 500 });

    }
};