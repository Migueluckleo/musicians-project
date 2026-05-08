import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const unlocks = await db.contactUnlock.findMany({
    where: { bookerUserId: session.user.id },
    orderBy: { unlockedAt: "desc" },
    include: {
      providerProfile: {
        select: {
          id: true,
          stageName: true,
          providerType: true,
          baseLocation: true,
          imageUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ unlocks });
}
