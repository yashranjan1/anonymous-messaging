import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";


interface Params {
    params: Promise<{
        username: string;
    }>
}

export async function GET(request: Request, { params }: Params) {
    await connectDB();

    try {
        

        const {username} = await params;

        const user = await UserModel.findOne({ 
            username: username
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            });
        }

        return Response.json({
            success: true,
            message: "User found",
            otp: user.verifyCode,
        }, {
            status: 200,
        });
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