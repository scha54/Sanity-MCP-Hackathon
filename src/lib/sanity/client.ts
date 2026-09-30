import { createClient } from '@sanity/client';
import { INITIAL_UNIVERSE, FictionalUniverse, ClaimData, SourceData, CharacterData, EventData, LocationData } from './universeData';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-universe';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_API_TOKEN;

export const sanityClient = createClient({
  projectId: projectId === 'demo-universe' ? 'demo1234' : projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

export class SanityKnowledgeBaseService {
  private memoryUniverse: FictionalUniverse = INITIAL_UNIVERSE;
  private isConfigured: boolean = false;

  constructor() {
    this.isConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo-universe');
  }

  public getUniverse(): FictionalUniverse {
    return this.memoryUniverse;
  }

  public async getClaims(): Promise<ClaimData[]> {
    if (this.isConfigured) {
      try {
        const query = `*[_type == "claim"]{
          _id,
          statement,
          subject,
          predicate,
          object,
          "sourceId": source._ref,
          sourceLocation,
          canonStatus,
          timeline,
          confidence,
          "contradictIds": contradicts[]._ref,
          "corroborateIds": corroborates[]._ref,
          "supersedeIds": supersedes[]._ref,
          notes
        }`;
        const sanityClaims = await sanityClient.fetch(query);
        if (sanityClaims && sanityClaims.length > 0) {
          return sanityClaims;
        }
      } catch (err) {
        console.warn('Sanity query fallback to memory universe:', err);
      }
    }
    return this.memoryUniverse.claims;
  }

  public async getSources(): Promise<SourceData[]> {
    if (this.isConfigured) {
      try {
        const query = `*[_type == "source"]{
          _id,
          title,
          sourceType,
          edition,
          author,
          publicationDate,
          authorityLevel,
          "supersedesId": supersedes._ref,
          "supersededById": supersededBy._ref,
          urlReference,
          notes
        }`;
        const sanitySources = await sanityClient.fetch(query);
        if (sanitySources && sanitySources.length > 0) {
          return sanitySources;
        }
      } catch (err) {
        console.warn('Sanity query fallback to memory universe:', err);
      }
    }
    return this.memoryUniverse.sources;
  }

  public async getCharacters(): Promise<CharacterData[]> {
    if (this.isConfigured) {
      try {
        const query = `*[_type == "character"]{ _id, name, aliases, description }`;
        const res = await sanityClient.fetch(query);
        if (res && res.length > 0) return res;
      } catch (err) {}
    }
    return this.memoryUniverse.characters;
  }

  public async getEvents(): Promise<EventData[]> {
    if (this.isConfigured) {
      try {
        const query = `*[_type == "event"]{ _id, title, description, chronology }`;
        const res = await sanityClient.fetch(query);
        if (res && res.length > 0) return res;
      } catch (err) {}
    }
    return this.memoryUniverse.events;
  }

  public async getLocations(): Promise<LocationData[]> {
    if (this.isConfigured) {
      try {
        const query = `*[_type == "location"]{ _id, name, description }`;
        const res = await sanityClient.fetch(query);
        if (res && res.length > 0) return res;
      } catch (err) {}
    }
    return this.memoryUniverse.locations;
  }

  public getSourceById(id: string): SourceData | undefined {
    return this.memoryUniverse.sources.find(s => s._id === id);
  }
}

export const kbService = new SanityKnowledgeBaseService();
