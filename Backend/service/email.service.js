import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationMail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Verify your email address - BlogChat",
      text: `Your BlogChat verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; width: 100%; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #1E3A8A; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
        BlogChat
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px; background-color: #ffffff; text-align: center;">
      <h2 style="color: #111827;">Verify your email address</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.5;">
        Thanks for signing up for <strong>BlogChat</strong>.<br/>
        Please enter the following verification code when prompted:
      </p>

      <div style="margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #1E3A8A; padding: 10px 20px; border: 2px dashed #1E3A8A; border-radius: 6px; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p style="color: #6B7280; font-size: 14px;">
        This code is valid for 10 minutes.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #9CA3AF;">
      &copy; 2025 BlogChat. All rights reserved.
    </div>
  </div>
`,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (err) {
    console.error("Error sending verification email:", err.message);
    throw err;
  }
};
