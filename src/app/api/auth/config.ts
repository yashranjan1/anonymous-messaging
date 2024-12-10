import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "text", placeholder: "Email", label: "Email" },
                password: { type: "password", placeholder: "Password", label: "Password" },
            },
            id: "credentials",
            async authorize(credentials) : Promise<any> {
                await connectDB();
                
                try {
                    const user = await UserModel.findOne({ 
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                     });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("User not verified");
                    }

                    // const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    // if (!isPasswordCorrect) {
                    //     throw new Error("Incorrect password");
                    // }

                    return user;
                } catch (error) {
                    
                    throw new Error("Error authenticating user");

                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
        signOut: "/signout",
        error: "/error", // Error code passed in query string as ?error=
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // async signIn({ user, account, profile }) {
        //     return true;
        // },
        // async redirect({ url, baseUrl }) {
        //     return baseUrl;
        // },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;  
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
};

