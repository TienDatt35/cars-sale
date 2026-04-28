import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/resend";
import { z } from "zod";

const leadSchema = z.object({
  type: z.enum(["Báo giá", "Lái thử"]),
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  car: z.string().min(1, "Vui lòng chọn dòng xe"),
  payment: z.enum(["Trả góp", "Trả thẳng", "Chưa rõ"]).default("Chưa rõ"),
});

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const lead = await prisma.lead.create({ data: result.data });

  // Send email notification (non-blocking — don't fail the request if email fails)
  sendLeadNotification(lead).catch(console.error);

  return NextResponse.json(lead, { status: 201 });
}
