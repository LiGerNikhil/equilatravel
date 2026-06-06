import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'equilatravel@gmail.com',
    pass: 'kfoxqybtmvkfzbum',
  },
});

export async function sendVendorStatusEmail({
  to,
  name,
  status,
}: {
  to: string;
  name: string;
  status: 'active' | 'inactive';
}) {
  const isApproved = status === 'active';

  const info = await transporter.sendMail({
    from: '"Equila Travel" <equilatravel@gmail.com>',
    to,
    subject: isApproved
      ? 'Your Vendor Registration has been Approved'
      : 'Your Vendor Registration has been Rejected',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #f9f9f9; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 28px;">Equila Travel</h1>
          <p style="color: #666; margin: 4px 0 0;">Vendor Portal</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          ${
            isApproved
              ? `<p style="color: #333; font-size: 16px; line-height: 1.6;">
                   Congratulations! Your vendor registration has been <strong style="color: #10b981;">approved</strong>.
                 </p>
                 <p style="color: #333; font-size: 16px; line-height: 1.6;">
                   You can now log in to your vendor dashboard, submit your documents for verification, and start adding cars to the Equila Travel fleet.
                 </p>`
              : `<p style="color: #333; font-size: 16px; line-height: 1.6;">
                   We regret to inform you that your vendor registration has been <strong style="color: #ef4444;">rejected</strong>.
                 </p>
                 <p style="color: #333; font-size: 16px; line-height: 1.6;">
                   If you believe this was a mistake or would like more information, please contact us at <a href="mailto:equilatravel@gmail.com" style="color: #c9a84c;">equilatravel@gmail.com</a>.
                 </p>`
          }
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Equila Travel — Your trusted travel partner<br />
              <a href="https://equilatravel.com" style="color: #c9a84c;">equilatravel.com</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });

  console.log('Vendor status email sent:', info.messageId);
}

