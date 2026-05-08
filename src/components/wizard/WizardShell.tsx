"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WizardShellProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  prevStep: string;
  nextStep?: string;
  onNext?: () => void;
  nextLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function WizardShell({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  prevStep,
  onNext,
  nextLabel = "Siguiente",
  loading = false,
  children,
}: WizardShellProps) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-airbnb-gray">
            Paso {stepIndex + 1} de {totalSteps}
          </span>
          <span className="text-xs font-semibold text-airbnb-red">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-airbnb-border rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-airbnb-red to-[#E31C5F] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-airbnb-dark">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-airbnb-gray">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-airbnb-border">
        <Link
          href={prevStep}
          className="flex items-center gap-1.5 text-sm font-semibold text-airbnb-dark underline hover:no-underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </Link>

        {onNext && (
          <Button
            onClick={onNext}
            loading={loading}
            size="md"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
