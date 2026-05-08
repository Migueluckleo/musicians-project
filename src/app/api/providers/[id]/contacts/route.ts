import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/providers/:id/contacts
// Returns contact details only if authorized: subscription OR prior unlock
// BR-016, BR-022, BR-024, BR-025, BR-026
// AC-CON-008-2, AC-MON-001-4, AC-MON-002-1, AC-MON-004-1

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Debes iniciar sesión para ver esta información.",
          code: "UNAUTHENTICATED",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check 1: Active subscription (BR-025)
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    const hasActiveSubscription =
      subscription?.status === "ACTIVE" &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > new Date();

    // Check 2: Prior one-time unlock (BR-024)
    const unlock = await db.contactUnlock.findUnique({
      where: {
        bookerUserId_providerProfileId: {
          bookerUserId: userId,
          providerProfileId: params.id,
        },
      },
    });

    if (!hasActiveSubscription && !unlock) {
      // Neither subscribed nor unlocked — return payment options
      return NextResponse.json(
        {
          code: "PAYMENT_REQUIRED",
          message: "Desbloquea el contacto de este proveedor para continuar.",
          options: {
            oneTime: {
              label: "Pago único",
              description: "Accede al contacto de este proveedor",
              price: 1.0,
              currency: "USD",
            },
            subscription: {
              label: "Suscripción mensual",
              description: "Accede al contacto de todos los proveedores",
              price: 9.99,
              currency: "USD",
              period: "month",
            },
          },
        },
        { status: 402 }
      );
    }

    // Authorized: return contact points (BR-016)
    const contacts = await db.contactPoint.findMany({
      where: { providerProfileId: params.id },
      select: {
        id: true,
        type: true,
        value: true,
        label: true,
      },
    });

    return NextResponse.json({
      contacts,
      accessType: hasActiveSubscription ? "subscription" : "one_time_unlock",
    });
  } catch (error) {
    console.error("[GET /api/providers/:id/contacts]", error);
    return NextResponse.json(
      { error: "Error al obtener los contactos." },
      { status: 500 }
    );
  }
}
