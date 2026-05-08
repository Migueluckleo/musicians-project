/**
 * Contact detection utility
 * Enforces BR-007, BR-008, BR-018, BR-019
 *
 * Detects phone numbers, emails, URLs, and social handles
 * in public text fields to prevent accidental contact exposure.
 */

const PATTERNS = {
  // Phone numbers: +52 55 1234 5678 / (55) 1234-5678 / 5512345678
  phone: /(\+?[\d\s\-().]{7,20}\d)/g,
  // Email addresses
  email: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  // URLs: http/https or www.
  url: /(https?:\/\/[^\s]+|www\.[^\s]+)/g,
  // Social handles: @username
  handle: /@[a-zA-Z0-9_.]{2,}/g,
};

export type DetectionResult = {
  hasContact: boolean;
  matches: {
    type: "phone" | "email" | "url" | "handle";
    value: string;
  }[];
};

/**
 * Scans text for contact information patterns.
 * Returns whether contact data was found and which matches.
 */
export function detectContactInfo(text: string): DetectionResult {
  const matches: DetectionResult["matches"] = [];

  for (const [type, pattern] of Object.entries(PATTERNS)) {
    const found = text.match(pattern);
    if (found) {
      for (const value of found) {
        matches.push({ type: type as DetectionResult["matches"][0]["type"], value });
      }
    }
  }

  return {
    hasContact: matches.length > 0,
    matches,
  };
}

/**
 * Returns a human-readable warning message in Spanish
 * when contact information is detected.
 */
export function getContactWarningMessage(result: DetectionResult): string | null {
  if (!result.hasContact) return null;

  const types = Array.from(new Set(result.matches.map((m) => m.type)));
  const typeLabels: Record<string, string> = {
    phone: "número de teléfono",
    email: "correo electrónico",
    url: "enlace",
    handle: "usuario de red social",
  };

  const detected = types.map((t) => typeLabels[t]).join(", ");

  return `Detectamos información de contacto en este campo (${detected}). Para proteger tu privacidad y la integridad del servicio, esta información debe ir en la sección de "Puntos de contacto", no en campos públicos.`;
}
