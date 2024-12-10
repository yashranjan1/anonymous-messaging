import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { auth } from "@/app/api/auth/auth";
import mongoose from "mongoose";

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

    const id = new mongoose.Types.ObjectId(user.id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: id,
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: {
                    "messages.createdAt": -1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages",
                    },
                },
            }
        ]);

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404,
            });
        }

        return Response.json({
            success: true,
            message: "Messages fetched",
            messages: user[0].messages,
        }, {
            status: 200,
        });

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error fetching messages",
            error: error,
        }, {
            status: 500,
        });
    }
}   