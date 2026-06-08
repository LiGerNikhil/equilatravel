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

export async function sendCarAssignedEmail({
  to,
  customerName,
  carName,
  carNumber,
  price,
  pickup,
  destination,
  date,
}: {
  to: string;
  customerName: string;
  carName: string;
  carNumber: string;
  price: number;
  pickup: string;
  destination: string;
  date: string;
}) {
  const info = await transporter.sendMail({
    from: '"Equila Travel" <equilatravel@gmail.com>',
    to,
    subject: 'Your Car has been Assigned — Booking Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #f9f9f9; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 28px;">Equila Travel</h1>
          <p style="color: #666; margin: 4px 0 0;">Booking Confirmation</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your car has been assigned and your booking is confirmed! Please find your vehicle details below.
          </p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #c9a84c; margin: 0 0 12px; font-size: 18px;">Assigned Vehicle</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Car</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${carName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Vehicle Number</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${carNumber}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Price</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">₹${price.toFixed(2)}/km</td>
              </tr>
            </table>
          </div>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #c9a84c; margin: 0 0 12px; font-size: 18px;">Trip Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Pickup</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${pickup || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Destination</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${destination || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-size: 14px;">Date</td>
                <td style="padding: 6px 0; color: #333; font-size: 14px; font-weight: 600;">${date || '—'}</td>
              </tr>
            </table>
          </div>
          <p style="color: #333; font-size: 14px; line-height: 1.6;">
            If you have any questions or need to make changes, please contact us at <a href="mailto:equilatravel@gmail.com" style="color: #c9a84c;">equilatravel@gmail.com</a> or call us.
          </p>
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

  console.log('Car assigned email sent:', info.messageId);
}

