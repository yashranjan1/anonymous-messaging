import resend from "@/lib/resend";
import VerificationEmail from "@emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export default async function sendVerificationEmails(
    username: string, 
    email: string,
    otp: string
): Promise<ApiResponse<string>> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Next | Verify your account",
            react: VerificationEmail({ username, otp })
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error(error);
        console.log("Error sending verification email");
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
}
