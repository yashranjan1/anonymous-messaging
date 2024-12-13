import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";


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

        const user = await UserModel.findOne({ 
            username, 
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            });
        }

        if (user.isVerified) {
            return Response.json({
                success: false,
                message: "User already verified",
            }, {
                status: 400,
            });
        }

        else {
            return Response.json({
                success: true,
                message: "User not verified",
            }, {
                status: 200,
            });
        }


    } catch (error) {
        console.log(error);
        console.log("Error verifying user");
        return Response.json({
            success: false,
            message: "Error verifying user",
        }, {
            status: 500,
        });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, code } = await request.json();

        decodeURIComponent(username);

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpires) > new Date();

        if (isCodeValid && isCodeExpired) { 
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified",
            }, {
                status: 200,
            });
        }
        else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid verification code",
            }, {
                status: 400,
            });
        }
        else if (isCodeExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired",
            }, {
                status: 400,
            });
        }
        

    } catch (error) {
        console.log(error);
        console.log("Error verifying user");
        return Response.json({
            success: false,
            message: "Error verifying user",
        }, {
            status: 500,
        });
    }
}       