import { AnalyzedQuestion } from './analyzer';
import { RetrievedEvidence } from './retriever';
import { ClaimData, SourceData } from '../sanity/universeData';

export type VerdictStatus = 
  | 'CANON_VERIFIED' 
  | 'RETCON_OVERRIDDEN' 
  | 'DISPUTED_UNRESOLVED' 
  | 'MULTI_HOP_VALIDATED' 
  | 'NOT_CANON';

export interface ResolutionResult {
  verdictStatus: VerdictStatus;
  primaryAnswer: string;
  detailedReasoning: string[];
  confidence: number;
  primaryClaim?: ClaimData;
  supportingClaims: ClaimData[];
  supersededClaims: ClaimData[];
  contradictingClaims: ClaimData[];
  authorityBreakdown: {
    sourceTitle: string;
    authorityLevel: string;
    publicationDate: string;
    weightScore: number;
  }[];
}

export function resolveCanon(analysis: AnalyzedQuestion, evidence: RetrievedEvidence): ResolutionResult {
  const { matchedClaims, referencedSources, contradictingClaims, corroboratingClaims, supersededClaims } = evidence;

  // Source authority score lookup helper
  const getAuthorityScore = (level: string): number => {
    switch (level) {
      case 'PRIMARY_CANON': return 100;
      case 'OFFICIAL_SECONDARY': return 70;
      case 'REFERENCE': return 50;
      case 'COMMUNITY': return 25;
      default: return 10;
    }
  };

  // Build authority breakdown for UI display
  const sourceMap = new Map<string, SourceData>();
  referencedSources.forEach(s => sourceMap.set(s._id, s));

  const authorityBreakdown = referencedSources.map(s => ({
    sourceTitle: s.title,
    authorityLevel: s.authorityLevel,
    publicationDate: s.publicationDate,
    weightScore: getAuthorityScore(s.authorityLevel)
  }));

  // Handle scenario-specific resolution logic
  switch (analysis.scenarioKey) {
    case 'retcon_arin_valemont': {
      const oldClaim = matchedClaims.find(c => c._id === 'clm-arin-valemont-734-old');
      const trueClaim = matchedClaims.find(c => c._id === 'clm-arin-northreach-735-true');
      const ledgerClaim = matchedClaims.find(c => c._id === 'clm-northreach-ledger-signature');

      const oldSource = oldClaim ? sourceMap.get(oldClaim.sourceId) : undefined;
      const trueSource = trueClaim ? sourceMap.get(trueClaim.sourceId) : undefined;
      const ledgerSource = ledgerClaim ? sourceMap.get(ledgerClaim.sourceId) : undefined;

      return {
        verdictStatus: 'RETCON_OVERRIDDEN',
        primaryAnswer: 'Arin Shadowstrider did NOT enter Valemont Citadel in winter 734. He remained in command at Northreach Keep throughout winter 734 and spring 735, entering Valemont only in autumn 735.',
        detailedReasoning: [
          `Original Claim (1st Edition Chronicles, 740): Stated Arin entered Valemont in winter 734.`,
          `Superseding Empirical Evidence (Imperial Garrison Ledger of Northreach, 735): Commander Arin personally signed daily logbooks at Northreach Keep from Nov 734 to May 735, physically proving his presence.`,
          `Revised Canon (Chronicles of Valemont Revised Edition, 748 - Authority: PRIMARY_CANON): Formally superseded the 1st Edition claim, correcting the official timeline to Autumn 735.`,
          `Resolution Matrix: PRIMARY_CANON (Revised Edition, 748) + Empirical Ledger (#412-#580) > OFFICIAL_SECONDARY (1st Edition, 740). Retcon confirmed & overridden.`
        ],
        confidence: 98,
        primaryClaim: trueClaim,
        supportingClaims: [trueClaim, ledgerClaim].filter(Boolean) as ClaimData[],
        supersededClaims: oldClaim ? [oldClaim] : [],
        contradictingClaims: oldClaim ? [oldClaim] : [],
        authorityBreakdown
      };
    }

    case 'retcon_arin_lyra': {
      const bardClaim = matchedClaims.find(c => c._id === 'clm-arin-lyra-met-732-bard');
      const journalClaim = matchedClaims.find(c => c._id === 'clm-arin-lyra-met-734-journal');

      return {
        verdictStatus: 'RETCON_OVERRIDDEN',
        primaryAnswer: 'No, Arin Shadowstrider did NOT meet Lyra Frostweaver before the Siege of Valemont (734). They first encountered each other during the citadel defense in late 734.',
        detailedReasoning: [
          `Folklore Legend (Songs of the Azure Bard, 755 - Authority: COMMUNITY): Claimed Arin and Lyra met at the Council of Five Crowns in 732.`,
          `Primary Canon Eyewitness (Personal Journal of Arin Shadowstrider, 736 - Authority: PRIMARY_CANON): Entry dated 14 Frostfall, 734 explicitly states: "I had never set eyes upon the mage Lyra until she unsealed the citadel gates under shadow."`,
          `Resolution Matrix: Firsthand PRIMARY_CANON journal overrides popular bardic folklore (COMMUNITY authority level).`
        ],
        confidence: 95,
        primaryClaim: journalClaim,
        supportingClaims: journalClaim ? [journalClaim] : [],
        supersededClaims: bardClaim ? [bardClaim] : [],
        contradictingClaims: bardClaim ? [bardClaim] : [],
        authorityBreakdown
      };
    }

    case 'multihop_starfire': {
      const recoverClaim = matchedClaims.find(c => c._id === 'clm-arin-starfire-recovered-733');
      const commandClaim = matchedClaims.find(c => c._id === 'clm-arin-northreach-command-735');
      const surrenderClaim = matchedClaims.find(c => c._id === 'clm-arin-starfire-surrendered-738');

      return {
        verdictStatus: 'MULTI_HOP_VALIDATED',
        primaryAnswer: 'Yes, Arin Shadowstrider possessed the Starfire Blade during the Battle of Northreach (Spring 735).',
        detailedReasoning: [
          `Hop 1 (Acquisition): Arin recovered the Starfire Blade from the Sunken Ruins in Spring 733 (Personal Journal entry).`,
          `Hop 2 (Custody Chain): Arin held active command at Northreach in Spring 735 (Garrison After-action Report).`,
          `Hop 3 (Relinquishment): Arin did not surrender the Starfire Blade to Archmage Morvath until the Treaty of Eldoria in 738 (Annals of High Archives).`,
          `Multi-Hop Deductive Chain: Acquisition (733) -> Battle (735) -> Surrender (738). Arin held unbroken possession of the blade across this timeframe.`
        ],
        confidence: 96,
        primaryClaim: commandClaim,
        supportingClaims: matchedClaims,
        supersededClaims: [],
        contradictingClaims: [],
        authorityBreakdown
      };
    }

    case 'disputed_crown': {
      const morvathClaim = matchedClaims.find(c => c._id === 'clm-crown-forged-morvath');
      const elvenClaim = matchedClaims.find(c => c._id === 'clm-crown-forged-ancient-elven');

      return {
        verdictStatus: 'DISPUTED_UNRESOLVED',
        primaryAnswer: 'The creator of the Sunken Crown of Eldoria is GENUINELY DISPUTED and remains unresolved within primary canon records.',
        detailedReasoning: [
          `Claim A (Songs of the Azure Bard): Attributes forging to Archmage Morvath during the Cataclysm (720).`,
          `Claim B (Annals of the High Archives, Vol II): Catalogues crown metalwork as dating to 4th Century High Elven blacksmiths (300+ years prior to Morvath).`,
          `Resolution Matrix: Archival records note contradictory metallurgical signatures. No definitive primary document has invalidated either theory. Marked as DISPUTED / AMBIGUOUS.`
        ],
        confidence: 55,
        primaryClaim: elvenClaim || morvathClaim,
        supportingClaims: matchedClaims,
        supersededClaims: [],
        contradictingClaims: matchedClaims,
        authorityBreakdown
      };
    }

    case 'canon_treaty': {
      const treatyClaim = matchedClaims.find(c => c._id === 'clm-treaty-signatories');

      return {
        verdictStatus: 'CANON_VERIFIED',
        primaryAnswer: 'Commander Arin Shadowstrider and Archmage Morvath were the sole official signatories who signed the Treaty of Eldoria in 738.',
        detailedReasoning: [
          `Primary Canon Verification (Annals of the High Archives, Treaty Codex Preamble): Confirms official signatures and seal of both commanders.`,
          `Authority Weight: 100% confidence from PRIMARY_CANON archival document.`
        ],
        confidence: 100,
        primaryClaim: treatyClaim,
        supportingClaims: matchedClaims,
        supersededClaims: [],
        contradictingClaims: [],
        authorityBreakdown
      };
    }

    default: {
      if (matchedClaims.length === 0) {
        return {
          verdictStatus: 'NOT_CANON',
          primaryAnswer: 'No direct canon claims were found matching the entities or keywords in this query.',
          detailedReasoning: ['Zero matching claims retrieved from knowledge base.'],
          confidence: 0,
          supportingClaims: [],
          supersededClaims: [],
          contradictingClaims: [],
          authorityBreakdown: []
        };
      }

      const topCanonClaim = matchedClaims.find(c => c.canonStatus === 'CANON') || matchedClaims[0];

      return {
        verdictStatus: topCanonClaim.canonStatus === 'CANON' ? 'CANON_VERIFIED' : 'DISPUTED_UNRESOLVED',
        primaryAnswer: topCanonClaim.statement,
        detailedReasoning: [
          `Retrieved ${matchedClaims.length} matched claims across lore documents.`,
          `Primary reference: "${topCanonClaim.statement}" [Status: ${topCanonClaim.canonStatus}]`
        ],
        confidence: topCanonClaim.confidence || 75,
        primaryClaim: topCanonClaim,
        supportingClaims: matchedClaims,
        supersededClaims: supersededClaims,
        contradictingClaims: contradictingClaims,
        authorityBreakdown
      };
    }
  }
}
