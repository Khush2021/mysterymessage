import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { messageSchema } from "@/schemas/MessageSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 400 }
      );
    }
    const existingUserVerifiedEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
    if (existingUserVerifiedEmail) {
      if (existingUserVerifiedEmail.isVerified) {
        return Response.json({
          success: false,
          message: "user already exist with this email.",
        });
      } else {
        existingUserVerifiedEmail.password = hashedPassword;
        existingUserVerifiedEmail.verifyCode = verifyCode;
        existingUserVerifiedEmail.verifyCodeExpiry = verifyCodeExpiry;
        await existingUserVerifiedEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user ", error);
    Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
