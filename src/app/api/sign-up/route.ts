import connectDB from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import sendVerificationEmails from "@/helpers/sendVerificationEmails";  
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await connectDB();

    try {
        const { username, email, password } = await req.json();

        const verifiedExistingUser = await UserModel.findOne({ 
            username,
            isVerified: true
         });

        if (verifiedExistingUser) {
            return Response.json({
                success: false,
                message: "User with this username already exists",
            }, {
                status: 400,
            });
        }

        const existingUserByEmail = await UserModel.findOne({ 
            email
        });

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User with this email already exists",
                }, {
                    status: 400,
                });
            }
            else {
                const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

                const hashedPassword = await bcrypt.hash(password, 10);

                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getHours() + 1);

                existingUserByEmail.password = hashedPassword;  
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpires = expiryDate;

                await existingUserByEmail.save();
                
                return Response.json({
                    success: true,
                    message: "User created successfully",
                }, {
                    status: 201,
                });
            }
        }
        else {

            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode, 
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();

            const emailResponse = await sendVerificationEmails(username, email, verifyCode);

            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, {
                    status: 500,
                });
            }

            return Response.json({
                success: true,
                message: "User created successfully",
            }, {
                status: 201,
            });
        }

    } catch (error) {
        console.log(error);
        console.log("Error signing up");
        return Response.json({
            success: false,
            message: "Error signing up",
        }, {
            status: 500,
        });
    }
}