import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

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
                status: 400,
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