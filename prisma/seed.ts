/**
 * Seed script — populates master lists for genres and event types
 * Run with: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genres = [
  { slug: "regional-mexicano", name: "Regional Mexicano" },
  { slug: "mariachi", name: "Mariachi" },
  { slug: "norteno", name: "Norteño" },
  { slug: "banda", name: "Banda" },
  { slug: "pop", name: "Pop" },
  { slug: "rock", name: "Rock" },
  { slug: "jazz", name: "Jazz" },
  { slug: "clasica", name: "Música Clásica" },
  { slug: "salsa", name: "Salsa" },
  { slug: "cumbia", name: "Cumbia" },
  { slug: "reggaeton", name: "Reggaetón" },
  { slug: "versatil", name: "Versátil" },
  { slug: "electronica", name: "Electrónica" },
  { slug: "acustica", name: "Acústica" },
  { slug: "blues", name: "Blues" },
  { slug: "tropical", name: "Tropical" },
  { slug: "grupero", name: "Grupero" },
  { slug: "otro", name: "Otro" },
];

const eventTypes = [
  { slug: "boda", name: "Boda" },
  { slug: "quinceañera", name: "Quinceañera" },
  { slug: "cumpleanos", name: "Cumpleaños" },
  { slug: "evento-corporativo", name: "Evento Corporativo" },
  { slug: "bar-restaurante", name: "Bar o Restaurante" },
  { slug: "serenata", name: "Serenata" },
  { slug: "fiesta-privada", name: "Fiesta Privada" },
  { slug: "festival", name: "Festival" },
  { slug: "evento-religioso", name: "Evento Religioso" },
  { slug: "graduacion", name: "Graduación" },
  { slug: "aniversario", name: "Aniversario" },
  { slug: "hotel", name: "Hotel" },
  { slug: "otro", name: "Otro" },
];

async function main() {
  console.log("🌱 Seeding genres...");
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: { name: genre.name },
      create: genre,
    });
  }

  console.log("🌱 Seeding event types...");
  for (const eventType of eventTypes) {
    await prisma.eventType.upsert({
      where: { slug: eventType.slug },
      update: { name: eventType.name },
      create: eventType,
    });
  }

  console.log(`✅ Seeded ${genres.length} genres and ${eventTypes.length} event types.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
