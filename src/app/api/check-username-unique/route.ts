import {z} from "zod";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameSchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {

    await connectDB();

    try {
        const { searchParams } = new URL(request.url);

        const queryParam = {
            username: searchParams.get("username")
        }

        // validate query param
        const result = usernameSchema.safeParse(queryParam);

        if (!result.success) {

            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors[0] : "Invalid username",
            }, {
                status: 400,
            });
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username, 
            isVerified: true
         });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "User with this username already exists",
            }, {
                status: 400,
            });
        }

        return Response.json({
            success: true,
            message: "Username is unique",
        }, {
            status: 200,
        });

    } catch (error) {
        console.log(error);
        console.log("Error checking username unique");
        return Response.json({
            success: false,
            message: "Error checking username unique",
        }, {
            status: 500,
        });
    }
}