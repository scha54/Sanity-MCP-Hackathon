export interface AnalyzedQuestion {
  rawQuestion: string;
  entities: string[];
  relationship?: string;
  timeConstraint?: string;
  requiresConflictAnalysis: boolean;
  scenarioKey?: 'retcon_arin_valemont' | 'retcon_arin_lyra' | 'multihop_starfire' | 'disputed_crown' | 'canon_treaty' | 'general';
}

export function analyzeQuestion(question: string): AnalyzedQuestion {
  const qLower = question.toLowerCase();
  const entities: string[] = [];

  if (qLower.includes('arin')) entities.push('Arin Shadowstrider');
  if (qLower.includes('lyra')) entities.push('Lyra Frostweaver');
  if (qLower.includes('valemont')) entities.push('Valemont Citadel');
  if (qLower.includes('northreach')) entities.push('Northreach Keep');
  if (qLower.includes('morvath')) entities.push('Archmage Morvath');
  if (qLower.includes('crown') || qLower.includes('sunken crown')) entities.push('Sunken Crown of Eldoria');
  if (qLower.includes('starfire') || qLower.includes('blade')) entities.push('Starfire Blade');
  if (qLower.includes('treaty')) entities.push('Treaty of Eldoria');

  let scenarioKey: AnalyzedQuestion['scenarioKey'] = 'general';

  if (qLower.includes('meet') && qLower.includes('lyra')) {
    scenarioKey = 'retcon_arin_lyra';
  } else if (qLower.includes('enter') || qLower.includes('734') || (qLower.includes('arin') && qLower.includes('valemont') && !qLower.includes('lyra'))) {
    scenarioKey = 'retcon_arin_valemont';
  } else if (qLower.includes('starfire') || qLower.includes('blade') || (qLower.includes('possess') && qLower.includes('siege'))) {
    scenarioKey = 'multihop_starfire';
  } else if (qLower.includes('forged') || qLower.includes('sunken crown') || qLower.includes('crown')) {
    scenarioKey = 'disputed_crown';
  } else if (qLower.includes('treaty') || qLower.includes('present') || qLower.includes('sign')) {
    scenarioKey = 'canon_treaty';
  }

  let relationship = undefined;
  if (qLower.includes('meet')) relationship = 'met';
  else if (qLower.includes('enter') || qLower.includes('arrived')) relationship = 'entered';
  else if (qLower.includes('possess') || qLower.includes('wield')) relationship = 'possessed';
  else if (qLower.includes('forge')) relationship = 'forged';
  else if (qLower.includes('sign') || qLower.includes('present')) relationship = 'attended';

  let timeConstraint = undefined;
  if (qLower.includes('before book 4') || qLower.includes('before the siege')) timeConstraint = 'before Siege of Valemont';
  else if (qLower.includes('734')) timeConstraint = 'Winter 734';
  else if (qLower.includes('735')) timeConstraint = 'Spring 735';

  return {
    rawQuestion: question,
    entities: Array.from(new Set(entities)),
    relationship,
    timeConstraint,
    requiresConflictAnalysis: true,
    scenarioKey
  };
}
