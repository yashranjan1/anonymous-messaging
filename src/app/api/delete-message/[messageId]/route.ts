import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { auth } from "@/app/api/auth/auth";

interface Params {
    params: Promise<{
        messageId: string;
    }>
}


export async function DELETE(req: Request, { params }: Params) {

    await connectDB();

    const { messageId } = await params;  
    const session = await auth();
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
        }, {
            status: 401,
        });
    }

    try {
        const res = await UserModel.updateOne(
            { _id: user.id },
            {
                $pull: {
                    messages: {
                        _id: messageId,
                    },
                },
            }
        );
        
        if (!res.modifiedCount) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted",
            }, {
                status: 404,
            });
        }

        return Response.json({
            success: true,
            message: "Message deleted",
        }, {
            status: 200,
        });
    }
    catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error deleting message",
            error: error,
        }, {
            status: 500,
        });
    }
}