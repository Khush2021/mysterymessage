import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string,
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from : 'onboarding@resend.dev',
            to : email,
            subject : "Mystery Message | Verification Code",
            react : VerificationEmail({username, otp : verifyCode})
        })
        return {success : true, message : "verification email send successfully"};
    } catch (emailError) {
        console.error("error sending verification email ", emailError);
        return {success : false, message : "failed to send verification email"};
    }
}