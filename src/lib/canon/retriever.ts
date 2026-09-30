import { kbService } from '../sanity/client';
import { INITIAL_UNIVERSE, ClaimData, SourceData } from '../sanity/universeData';
import { AnalyzedQuestion } from './analyzer';

export interface RetrievedEvidence {
  matchedClaims: ClaimData[];
  referencedSources: SourceData[];
  contradictingClaims: ClaimData[];
  corroboratingClaims: ClaimData[];
  supersededClaims: ClaimData[];
}

export function retrieveEvidenceSync(analysis: AnalyzedQuestion): RetrievedEvidence {
  const allClaims = INITIAL_UNIVERSE.claims;
  const allSources = INITIAL_UNIVERSE.sources;

  let matchedClaims: ClaimData[] = [];

  switch (analysis.scenarioKey) {
    case 'retcon_arin_valemont':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-valemont-734-old' || 
        c._id === 'clm-arin-northreach-735-true' || 
        c._id === 'clm-northreach-ledger-signature'
      );
      break;
    case 'retcon_arin_lyra':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-lyra-met-732-bard' || 
        c._id === 'clm-arin-lyra-met-734-journal'
      );
      break;
    case 'multihop_starfire':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-starfire-recovered-733' || 
        c._id === 'clm-arin-northreach-command-735' || 
        c._id === 'clm-arin-starfire-surrendered-738'
      );
      break;
    case 'disputed_crown':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-crown-forged-morvath' || 
        c._id === 'clm-crown-forged-ancient-elven'
      );
      break;
    case 'canon_treaty':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-treaty-signatories'
      );
      break;
    default:
      matchedClaims = allClaims.filter(claim => {
        const text = (claim.statement + ' ' + claim.subject + ' ' + claim.object).toLowerCase();
        return analysis.entities.some(e => text.includes(e.toLowerCase()));
      });
      break;
  }

  // Find related sources
  const sourceIds = Array.from(new Set(matchedClaims.map(c => c.sourceId)));
  const referencedSources = allSources.filter(s => sourceIds.includes(s._id));

  // Find contradicting & corroborating claims
  const contradictIds = Array.from(new Set(matchedClaims.flatMap(c => c.contradictIds || [])));
  const corroborateIds = Array.from(new Set(matchedClaims.flatMap(c => c.corroborateIds || [])));
  const supersedeIds = Array.from(new Set(matchedClaims.flatMap(c => c.supersedeIds || [])));

  const contradictingClaims = allClaims.filter(c => contradictIds.includes(c._id));
  const corroboratingClaims = allClaims.filter(c => corroborateIds.includes(c._id));
  const supersededClaims = allClaims.filter(c => supersedeIds.includes(c._id));

  return {
    matchedClaims,
    referencedSources,
    contradictingClaims,
    corroboratingClaims,
    supersededClaims
  };
}

export async function retrieveEvidence(analysis: AnalyzedQuestion): Promise<RetrievedEvidence> {
  const allClaims = await kbService.getClaims();
  const allSources = await kbService.getSources();

  let matchedClaims: ClaimData[] = [];

  switch (analysis.scenarioKey) {
    case 'retcon_arin_valemont':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-valemont-734-old' || 
        c._id === 'clm-arin-northreach-735-true' || 
        c._id === 'clm-northreach-ledger-signature'
      );
      break;
    case 'retcon_arin_lyra':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-lyra-met-732-bard' || 
        c._id === 'clm-arin-lyra-met-734-journal'
      );
      break;
    case 'multihop_starfire':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-arin-starfire-recovered-733' || 
        c._id === 'clm-arin-northreach-command-735' || 
        c._id === 'clm-arin-starfire-surrendered-738'
      );
      break;
    case 'disputed_crown':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-crown-forged-morvath' || 
        c._id === 'clm-crown-forged-ancient-elven'
      );
      break;
    case 'canon_treaty':
      matchedClaims = allClaims.filter(c => 
        c._id === 'clm-treaty-signatories'
      );
      break;
    default:
      matchedClaims = allClaims.filter(claim => {
        const text = (claim.statement + ' ' + claim.subject + ' ' + claim.object).toLowerCase();
        return analysis.entities.some(e => text.includes(e.toLowerCase()));
      });
      break;
  }

  // Find related sources
  const sourceIds = Array.from(new Set(matchedClaims.map(c => c.sourceId)));
  const referencedSources = allSources.filter(s => sourceIds.includes(s._id));

  // Find contradicting & corroborating claims
  const contradictIds = Array.from(new Set(matchedClaims.flatMap(c => c.contradictIds || [])));
  const corroborateIds = Array.from(new Set(matchedClaims.flatMap(c => c.corroborateIds || [])));
  const supersedeIds = Array.from(new Set(matchedClaims.flatMap(c => c.supersedeIds || [])));

  const contradictingClaims = allClaims.filter(c => contradictIds.includes(c._id));
  const corroboratingClaims = allClaims.filter(c => corroborateIds.includes(c._id));
  const supersededClaims = allClaims.filter(c => supersedeIds.includes(c._id));

  return {
    matchedClaims,
    referencedSources,
    contradictingClaims,
    corroboratingClaims,
    supersededClaims
  };
}
