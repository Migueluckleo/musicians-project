import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { StepIdentidad } from "@/components/wizard/steps/StepIdentidad";
import { StepCategorias } from "@/components/wizard/steps/StepCategorias";
import { StepDuraciones } from "@/components/wizard/steps/StepDuraciones";
import { StepRepertorio } from "@/components/wizard/steps/StepRepertorio";
import { StepDemos } from "@/components/wizard/steps/StepDemos";
import { StepPrecios } from "@/components/wizard/steps/StepPrecios";
import { StepContactos } from "@/components/wizard/steps/StepContactos";
import { StepPreview } from "@/components/wizard/steps/StepPreview";

const STEPS = [
  "identidad",
  "categorias",
  "duraciones",
  "repertorio",
  "demos",
  "precios",
  "contactos",
  "preview",
];

export default async function WizardStepPage({
  params,
}: {
  params: { step: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/iniciar-sesion");

  const { step } = params;
  if (!STEPS.includes(step)) notFound();

  const stepIndex = STEPS.indexOf(step);

  const profile = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      genres: { include: { genre: true } },
      eventTypes: { include: { eventType: true } },
      contactPoints: true,
      repertoireSongs: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!profile) redirect("/dashboard");

  const stepProps = {
    profile,
    stepIndex,
    totalSteps: STEPS.length,
    prevStep: stepIndex > 0 ? `/wizard/${STEPS[stepIndex - 1]}` : "/dashboard",
    nextStep:
      stepIndex < STEPS.length - 1
        ? `/wizard/${STEPS[stepIndex + 1]}`
        : "/dashboard",
  };

  return (
    <>
      {step === "identidad" && <StepIdentidad {...stepProps} />}
      {step === "categorias" && <StepCategorias {...stepProps} />}
      {step === "duraciones" && <StepDuraciones {...stepProps} />}
      {step === "repertorio" && <StepRepertorio {...stepProps} />}
      {step === "demos" && <StepDemos {...stepProps} />}
      {step === "precios" && <StepPrecios {...stepProps} />}
      {step === "contactos" && <StepContactos {...stepProps} />}
      {step === "preview" && <StepPreview {...stepProps} />}
    </>
  );
}
