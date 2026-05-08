import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ subscription });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  const subscription = await db.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      stripeSubscriptionId: `local_sub_${Date.now()}`,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: end,
    },
    update: {
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: end,
    },
  });

  return NextResponse.json({
    message: "Suscripción activada en modo local.",
    subscription,
  });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const subscription = await db.subscription.update({
    where: { userId: session.user.id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({
    message: "Suscripción cancelada.",
    subscription,
  });
}
