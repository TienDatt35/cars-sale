import { Resend } from "resend";

export interface LeadEmailData {
  id: string;
  type: string;
  name: string;
  phone: string;
  car: string;
  payment: string;
  createdAt: Date;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // silently skip if not configured

  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@fordautostar.vn";

  if (!toEmail) return;

  const resend = new Resend(apiKey);

  const subject =
    lead.type === "Lái thử"
      ? `[Lái thử] ${lead.name} - ${lead.car}`
      : `[Báo giá] ${lead.name} - ${lead.car}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #003478; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">Yêu cầu mới từ khách hàng</h2>
        <p style="margin: 8px 0 0; opacity: 0.85;">FORD AUTO STAR</p>
      </div>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 160px;">Loại yêu cầu</td>
            <td style="padding: 8px 0; font-weight: 600; color: ${lead.type === "Lái thử" ? "#2563eb" : "#7c3aed"};">${lead.type}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Họ và tên</td>
            <td style="padding: 8px 0; font-weight: 600;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Số điện thoại</td>
            <td style="padding: 8px 0;">
              <a href="tel:${lead.phone}" style="color: #2563eb; font-weight: 600;">${lead.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Dòng xe</td>
            <td style="padding: 8px 0; font-weight: 600;">${lead.car}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Thanh toán</td>
            <td style="padding: 8px 0;">${lead.payment}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Thời gian</td>
            <td style="padding: 8px 0;">${new Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(lead.createdAt)}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin"
             style="background: #003478; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Xem trong Admin Panel →
          </a>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    html,
  });
}
