import connectDB from "@/lib/dbConnect";
import { auth } from "@/app/api/auth/auth";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {

    await connectDB();

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

    const id = user.id;

    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, {
            isAcceptingMessages: acceptMessages,
        });

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Error updating accept messages",
            }, {
                status: 500,
            });
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated",
        }, {
            status: 200,
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error updating accept messages",
            error: error,
        }, {
            status: 500,
        });
    }
}

export async function GET(req: Request) {

    await connectDB();

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

    const id = user.id;

    try {
        const user = await UserModel.findById(id);

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
            message: "Message acceptance status fetched",
            isAcceptingMessages: user.isAcceptingMessages,
        }, {
            status: 200,
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching message acceptance status",
            error: error,
        }, {
            status: 500,
        });
    }
}