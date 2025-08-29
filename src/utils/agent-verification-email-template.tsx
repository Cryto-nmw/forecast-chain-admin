export function generateVerificationEmail({
  agentName,
  verificationLink,
}: {
  agentName: string;
  verificationLink: string;
}) {
  return {
    subject: "Verify Your Email Address",
    text: `Hello ${agentName},

Thank you for registering with our platform.

Please click the link below to verify your email address:
${verificationLink}

If you did not request this verification, you can safely ignore this email.

Best regards,
Your Platform Team
`,

    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2c3e50;">Verify Your Email Address</h2>
      <p>Hello <strong>${agentName}</strong>,</p>
      <p>Thank you for registering with our platform. Please click the button below to verify your email address:</p>
      <p style="text-align: center;">
        <a href="${verificationLink}" 
           style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #0078d4; text-decoration: none; border-radius: 6px;">
           Verify Email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #555;">${verificationLink}</p>
      <p>If you did not request this verification, you can safely ignore this email.</p>
      <p>Best regards,<br/>Your Platform Team</p>
    </div>
  </body>
</html>
    `,
  };
}
