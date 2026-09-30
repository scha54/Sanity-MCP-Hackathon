import { createClient } from '@sanity/client';
import { INITIAL_UNIVERSE } from '../src/lib/sanity/universeData';

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.log('⚠️ SANITY_PROJECT_ID or SANITY_API_TOKEN not set.');
  console.log('Skipping remote Sanity seed. Using local memory universe fallback.');
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

async function seed() {
  console.log('🚀 Seeding Sanity dataset with CanonKeeper initial universe lore...');

  // 1. Seed Sources
  for (const src of INITIAL_UNIVERSE.sources) {
    await client.createOrReplace({
      _id: src._id,
      _type: 'source',
      title: src.title,
      sourceType: src.sourceType,
      edition: src.edition,
      author: src.author,
      publicationDate: src.publicationDate,
      authorityLevel: src.authorityLevel,
      notes: src.notes,
    });
    console.log(`  ✓ Source: ${src.title}`);
  }

  // 2. Seed Characters
  for (const char of INITIAL_UNIVERSE.characters) {
    await client.createOrReplace({
      _id: char._id,
      _type: 'character',
      name: char.name,
      aliases: char.aliases,
      description: char.description,
    });
    console.log(`  ✓ Character: ${char.name}`);
  }

  // 3. Seed Events
  for (const evt of INITIAL_UNIVERSE.events) {
    await client.createOrReplace({
      _id: evt._id,
      _type: 'event',
      title: evt.title,
      description: evt.description,
      chronology: evt.chronology,
    });
    console.log(`  ✓ Event: ${evt.title}`);
  }

  // 4. Seed Locations
  for (const loc of INITIAL_UNIVERSE.locations) {
    await client.createOrReplace({
      _id: loc._id,
      _type: 'location',
      name: loc.name,
      description: loc.description,
    });
    console.log(`  ✓ Location: ${loc.name}`);
  }

  // 5. Seed Claims
  for (const claim of INITIAL_UNIVERSE.claims) {
    await client.createOrReplace({
      _id: claim._id,
      _type: 'claim',
      statement: claim.statement,
      subject: claim.subject,
      predicate: claim.predicate,
      object: claim.object,
      source: { _type: 'reference', _ref: claim.sourceId },
      sourceLocation: claim.sourceLocation,
      canonStatus: claim.canonStatus,
      timeline: claim.timeline,
      confidence: claim.confidence,
      notes: claim.notes,
      contradicts: claim.contradictIds?.map(id => ({ _type: 'reference', _ref: id, _key: id })),
      corroborates: claim.corroborateIds?.map(id => ({ _type: 'reference', _ref: id, _key: id })),
      supersedes: claim.supersedeIds?.map(id => ({ _type: 'reference', _ref: id, _key: id })),
    });
    console.log(`  ✓ Claim: ${claim.statement.substring(0, 35)}...`);
  }

  console.log('🎉 Sanity seeding completed successfully!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
