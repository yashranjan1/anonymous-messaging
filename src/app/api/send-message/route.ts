import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {

    await connectDB();

    const { username, content } = await req.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            });
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            }, {
                status: 403,
            });
        }

        const message: Message = {
            content,
            createdAt: new Date(),
        } as Message;

        user.messages.push(message);

        await user.save();

        return Response.json({
            success: true,
            message: "Message sent",
        }, {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error sending message",
            error: error,
        }, {
            status: 500,
        });
    }

}