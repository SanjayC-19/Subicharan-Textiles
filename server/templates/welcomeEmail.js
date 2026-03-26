export const generateWelcomeHTML = ({ name }) => {
  const safeName = (name || 'Customer').trim();

  return `
    <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden;">
        <tr>
          <td style="background: #1f2937; color: #ffffff; padding: 20px 24px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Subitcharan Tex</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; color: #111827; line-height: 1.6;">
            <p style="margin-top: 0;">Hi ${safeName},</p>
            <p>Thank you for creating your account with Subitcharan Tex.</p>
            <p>You can now log in and start exploring our textile collections.</p>
            <p style="margin-bottom: 0;">Regards,<br/>Subitcharan Tex Team</p>
          </td>
        </tr>
      </table>
    </div>
  `;
};
