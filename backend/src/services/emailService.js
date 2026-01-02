const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Modern email template wrapper
const emailTemplate = (content, preheader = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GearGuard</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f3f4f6;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .preheader {
      display: none;
      max-width: 0;
      max-height: 0;
      overflow: hidden;
      font-size: 1px;
      line-height: 1px;
      color: #ffffff;
      opacity: 0;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <span class="preheader">${preheader}</span>
  
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table class="email-container" role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                ⚙️ GearGuard
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">
                Maintenance Management System
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          ${content}
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                This is an automated message from GearGuard.<br>
                Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} GearGuard. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

// OTP Email Template
const otpEmailContent = (userName, otp) => `
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">
          Password Reset Request
        </h2>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Use the verification code below to complete the process:
        </p>
        
        <!-- OTP Box -->
        <table role="presentation" style="width: 100%; margin: 32px 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px 48px; border-radius: 12px; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                <p style="margin: 0 0 8px 0; color: #e0e7ff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Verification Code
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </p>
              </div>
            </td>
          </tr>
        </table>
        
        <!-- Warning Box -->
        <table role="presentation" style="width: 100%; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 24px 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                <strong>⏱️ Important:</strong> This code will expire in <strong>10 minutes</strong>.
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </td>
    </tr>
  `;

// Welcome Email Template
const welcomeEmailContent = (userName) => `
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">
          Welcome to GearGuard! 🎉
        </h2>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          Thank you for joining GearGuard! Your account has been successfully created.
        </p>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          You can now start managing your maintenance requests, equipment, and teams efficiently.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" style="margin: 32px 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                Get Started
              </a>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </td>
    </tr>
  `;

// Password Changed Confirmation
const passwordChangedContent = (userName) => `
    <tr>
      <td style="padding: 40px 30px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; line-height: 64px; font-size: 32px;">
            ✅
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600; text-align: center;">
          Password Successfully Changed
        </h2>
        <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
          Your password has been successfully changed. You can now log in with your new password.
        </p>
        
        <!-- Security Notice -->
        <table role="presentation" style="width: 100%; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 24px 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                🔒 Security Tip
              </p>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                If you didn't make this change, please contact our support team immediately.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

// Send OTP Email
exports.sendOTPEmail = async (email, userName, otp) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"GearGuard" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Password Reset - Verification Code',
            html: emailTemplate(
                otpEmailContent(userName, otp),
                `Your verification code is ${otp}. Valid for 10 minutes.`,
            ),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

// Send Welcome Email
exports.sendWelcomeEmail = async (email, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"GearGuard" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Welcome to GearGuard!',
            html: emailTemplate(
                welcomeEmailContent(userName),
                'Welcome to GearGuard - Start managing your maintenance efficiently',
            ),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw error for welcome email, it's not critical
        return { success: false, error: error.message };
    }
};

// Send Password Changed Email
exports.sendPasswordChangedEmail = async (email, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"GearGuard" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Password Successfully Changed',
            html: emailTemplate(
                passwordChangedContent(userName),
                'Your GearGuard password has been changed',
            ),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password changed email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password changed email:', error);
        return { success: false, error: error.message };
    }
};
