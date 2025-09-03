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
    <div style="background-color: #1E3A8A; padding: 20px 5vw; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 6vw; font-weight: bold; min-font-size:24px;">
        BlogChat
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 8vw 5vw; background-color: #ffffff; text-align: center;">
      <h2 style="color: #111827; font-size: 5vw; min-font-size:20px;">Verify your email address</h2>
      <p style="color: #374151; font-size: 4vw; line-height: 1.5; min-font-size:16px;">
        Thanks for signing up for <strong>BlogChat</strong>.<br/>
        Please enter the following verification code when prompted:
      </p>

      <div style="margin: 8vw 0;">
        <span style="font-size: 8vw; font-weight: bold; color: #1E3A8A; padding: 3vw 6vw; border: 2px dashed #1E3A8A; border-radius: 6px; display: inline-block; min-font-size:32px;">
          ${otp}
        </span>
      </div>

      <p style="color: #6B7280; font-size: 3vw; min-font-size:14px;">
        This code is valid for 10 minutes.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 5vw; background-color: #f9fafb; text-align: center; font-size: 2.5vw; color: #9CA3AF; min-font-size:12px;">
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
