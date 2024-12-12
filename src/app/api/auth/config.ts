import { CredentialsSignin, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

class InvalidLoginError extends CredentialsSignin {
    code = "Invalid identifier or password"
}

class UserNotFoundError extends CredentialsSignin {
    code = "User not found"
}

class UserNotVerifiedError extends CredentialsSignin {
    code = "User not verified"
}

export const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                identifier: { type: "text", placeholder: "Email", label: "Email" },
                password: { type: "password", placeholder: "Password", label: "Password" },
            },
            id: "credentials",
            async authorize(credentials) : Promise<any> {
                await connectDB();
                
                try {

                    const user = await UserModel.findOne({ 
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new UserNotFoundError();
                    }

                    if (!user.isVerified) {
                        throw new UserNotVerifiedError();
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password?.toString() || "", user.password);

                    if (!isPasswordCorrect) {
                        throw new InvalidLoginError();
                    }

                    return user;
                } catch (error) {
                    if (error instanceof InvalidLoginError) {
                        throw new InvalidLoginError(error.code);
                    }
                    else if (error instanceof UserNotFoundError) {
                        throw new UserNotFoundError(error.code);
                    }
                    else if (error instanceof UserNotVerifiedError) {
                        throw new UserNotVerifiedError(error.code);
                    }
                    else {
                        throw new Error("Error authenticating user");
                    }
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

