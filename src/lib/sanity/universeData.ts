export interface SourceData {
  _id: string;
  title: string;
  sourceType: string;
  edition?: string;
  author: string;
  publicationDate: string;
  authorityLevel: 'PRIMARY_CANON' | 'OFFICIAL_SECONDARY' | 'REFERENCE' | 'COMMUNITY' | 'UNKNOWN';
  supersedesId?: string;
  supersededById?: string;
  urlReference?: string;
  notes?: string;
}

export interface CharacterData {
  _id: string;
  name: string;
  aliases: string[];
  description: string;
  firstAppearanceId?: string;
  relationships?: { targetCharacterId: string; relationType: string; details: string }[];
  associatedEventIds?: string[];
  sourceReferenceIds?: string[];
}

export interface EventData {
  _id: string;
  title: string;
  description: string;
  chronology: string;
  locationId?: string;
  participantIds?: string[];
  precedingEventIds?: string[];
  followingEventIds?: string[];
  sourceReferenceIds?: string[];
}

export interface LocationData {
  _id: string;
  name: string;
  description: string;
  associatedCharacterIds?: string[];
  associatedEventIds?: string[];
  sourceReferenceIds?: string[];
}

export interface ClaimData {
  _id: string;
  statement: string;
  subject: string;
  predicate: string;
  object: string;
  sourceId: string;
  sourceLocation: string;
  canonStatus: 'CANON' | 'RETCONNED' | 'DISPUTED' | 'AMBIGUOUS' | 'NON_CANON' | 'UNKNOWN';
  timeline: string;
  confidence: number;
  contradictIds?: string[];
  corroborateIds?: string[];
  supersedeIds?: string[];
  relatedClaimIds?: string[];
  notes?: string;
}

export interface FictionalUniverse {
  sources: SourceData[];
  characters: CharacterData[];
  locations: LocationData[];
  events: EventData[];
  claims: ClaimData[];
}

export const INITIAL_UNIVERSE: FictionalUniverse = {
  sources: [
    {
      _id: "src-chronicles-1st",
      title: "Chronicles of Valemont (First Edition)",
      sourceType: "CHRONICLE",
      edition: "1st Edition (First Printing)",
      author: "Cassian Elderwood",
      publicationDate: "740",
      authorityLevel: "OFFICIAL_SECONDARY",
      supersededById: "src-chronicles-revised",
      notes: "Early historical account published before the opening of the Imperial Archives of Northreach."
    },
    {
      _id: "src-chronicles-revised",
      title: "Chronicles of Valemont (Revised & Restored Edition)",
      sourceType: "CHRONICLE",
      edition: "Revised Imperial Edition",
      author: "Cassian Elderwood",
      publicationDate: "748",
      authorityLevel: "PRIMARY_CANON",
      supersedesId: "src-chronicles-1st",
      notes: "Definitive imperial history incorporating verified ledgers from Northreach Keep. Corrects earlier timeline errors."
    },
    {
      _id: "src-arin-journal",
      title: "The Personal Journal of Arin Shadowstrider",
      sourceType: "MANUSCRIPT",
      edition: "Original Manuscript",
      author: "Arin Shadowstrider",
      publicationDate: "736",
      authorityLevel: "PRIMARY_CANON",
      notes: "Firsthand journal entries written directly by Commander Arin Shadowstrider."
    },
    {
      _id: "src-annals-archives",
      title: "Annals of the High Archives of Aethelgard",
      sourceType: "CHRONICLE",
      edition: "Volume IV",
      author: "Archmage Morvath & Scholars",
      publicationDate: "750",
      authorityLevel: "PRIMARY_CANON",
      notes: "Official repository of ancient artifacts, diplomatic treaties, and magical lore."
    },
    {
      _id: "src-azure-song",
      title: "Songs of the Azure Bard",
      sourceType: "BARDIC_SONG",
      edition: "Popular Folksong Collection",
      author: "Anonymous Wanderer",
      publicationDate: "755",
      authorityLevel: "COMMUNITY",
      notes: "Popular heroic ballads celebrating Arin and Lyra. Highly romanticized and historically unverified."
    },
    {
      _id: "src-northreach-ledger",
      title: "The Imperial Garrison Ledger of Northreach",
      sourceType: "LEDGER",
      edition: "Official Military Record",
      author: "High Warden Kaelen",
      publicationDate: "735",
      authorityLevel: "PRIMARY_CANON",
      notes: "Military logs recording daily troop movements and commander signatures during 734-735."
    }
  ],

  characters: [
    {
      _id: "char-arin",
      name: "Arin Shadowstrider",
      aliases: ["The Ranger of Valemont", "Blade of the Silver Spire"],
      description: "High Elven Ranger Commander who led northern defenses during the War of the Five Crowns.",
      firstAppearanceId: "src-arin-journal",
      relationships: [
        { targetCharacterId: "char-lyra", relationType: "Ally & Companion", details: "Fought alongside Lyra in defense of Valemont." },
        { targetCharacterId: "char-kaelen", relationType: "Superior Officer", details: "Served under High Warden Kaelen at Northreach." },
        { targetCharacterId: "char-morvath", relationType: "Rival / Ally", details: "Surrendered the Starfire Blade to Morvath at the Treaty of Eldoria." }
      ],
      associatedEventIds: ["evt-siege-valemont", "evt-battle-northreach", "evt-retrieval-starfire", "evt-treaty-eldoria"],
      sourceReferenceIds: ["src-arin-journal", "src-chronicles-revised", "src-northreach-ledger"]
    },
    {
      _id: "char-lyra",
      name: "Lyra Frostweaver",
      aliases: ["First Mage of the Azure Circle"],
      description: "Master elementalist who fortified Valemont Citadel against darkness.",
      firstAppearanceId: "src-chronicles-revised",
      relationships: [
        { targetCharacterId: "char-arin", relationType: "Comrade", details: "Met Arin during the defense of Valemont Citadel." }
      ],
      associatedEventIds: ["evt-siege-valemont", "evt-council-crowns"],
      sourceReferenceIds: ["src-chronicles-revised", "src-azure-song"]
    },
    {
      _id: "char-kaelen",
      name: "High Warden Kaelen",
      aliases: ["Shield of Northreach"],
      description: "Veteran commander who held Northreach Keep against the obsidian forces.",
      firstAppearanceId: "src-northreach-ledger",
      associatedEventIds: ["evt-battle-northreach"],
      sourceReferenceIds: ["src-northreach-ledger"]
    },
    {
      _id: "char-morvath",
      name: "Archmage Morvath",
      aliases: ["Keeper of the Obsidian Tower"],
      description: "Enigmatic scholar and powerful wizard who brokered the Treaty of Eldoria.",
      firstAppearanceId: "src-annals-archives",
      associatedEventIds: ["evt-treaty-eldoria"],
      sourceReferenceIds: ["src-annals-archives"]
    },
    {
      _id: "char-cassian",
      name: "Cassian Elderwood",
      aliases: ["High Chronican"],
      description: "Imperial historian who penned both editions of the Chronicles of Valemont.",
      firstAppearanceId: "src-chronicles-1st",
      sourceReferenceIds: ["src-chronicles-1st", "src-chronicles-revised"]
    }
  ],

  locations: [
    {
      _id: "loc-valemont",
      name: "Valemont Citadel",
      description: "Ancient stone fortress standing at the gateway of the High Reaches.",
      associatedCharacterIds: ["char-arin", "char-lyra"],
      associatedEventIds: ["evt-siege-valemont"],
      sourceReferenceIds: ["src-chronicles-revised"]
    },
    {
      _id: "loc-northreach",
      name: "Northreach Keep",
      description: "Northern border outpost guarding against frost incursions.",
      associatedCharacterIds: ["char-arin", "char-kaelen"],
      associatedEventIds: ["evt-battle-northreach"],
      sourceReferenceIds: ["src-northreach-ledger"]
    },
    {
      _id: "loc-eldoria-ruins",
      name: "Sunken Ruins of Eldoria",
      description: "Submerged ruins containing relics of the ancient First Era.",
      associatedCharacterIds: ["char-arin", "char-morvath"],
      associatedEventIds: ["evt-retrieval-starfire"],
      sourceReferenceIds: ["src-annals-archives", "src-arin-journal"]
    }
  ],

  events: [
    {
      _id: "evt-council-crowns",
      title: "Council of the Five Crowns",
      description: "Grand diplomatic summit held in 730 to unite the realms.",
      chronology: "730",
      locationId: "loc-valemont",
      participantIds: ["char-lyra", "char-morvath"],
      sourceReferenceIds: ["src-annals-archives"]
    },
    {
      _id: "evt-retrieval-starfire",
      title: "Retrieval of the Starfire Blade",
      description: "Arin Shadowstrider braved the sunken vaults to recover the ancient sword.",
      chronology: "Spring 733",
      locationId: "loc-eldoria-ruins",
      participantIds: ["char-arin"],
      sourceReferenceIds: ["src-arin-journal"]
    },
    {
      _id: "evt-siege-valemont",
      title: "Siege of Valemont",
      description: "The major confrontation where Valemont Citadel was besieged by shadow forces.",
      chronology: "Winter 734 - Autumn 735",
      locationId: "loc-valemont",
      participantIds: ["char-arin", "char-lyra"],
      sourceReferenceIds: ["src-chronicles-revised", "src-arin-journal"]
    },
    {
      _id: "evt-battle-northreach",
      title: "Battle of Northreach",
      description: "Crucial defense of the northern fortress while Valemont was under siege.",
      chronology: "Spring 735",
      locationId: "loc-northreach",
      participantIds: ["char-arin", "char-kaelen"],
      sourceReferenceIds: ["src-northreach-ledger"]
    },
    {
      _id: "evt-treaty-eldoria",
      title: "Treaty of Eldoria",
      description: "Peace agreement ending the War of the Five Crowns.",
      chronology: "738",
      locationId: "loc-eldoria-ruins",
      participantIds: ["char-arin", "char-morvath"],
      sourceReferenceIds: ["src-annals-archives"]
    }
  ],

  claims: [
    // ----------------------------------------------------
    // Scenario 1: Retcon & Timeline Contradiction (Arin's arrival at Valemont)
    // ----------------------------------------------------
    {
      _id: "clm-arin-valemont-734-old",
      statement: "Arin Shadowstrider arrived and entered Valemont Citadel during the winter of 734.",
      subject: "Arin Shadowstrider",
      predicate: "entered",
      object: "Valemont Citadel in winter 734",
      sourceId: "src-chronicles-1st",
      sourceLocation: "Volume I, Chapter 12, Page 142",
      canonStatus: "RETCONNED",
      timeline: "Winter 734",
      confidence: 60,
      supersedeIds: [],
      notes: "Claim from 1st Edition of Chronicles. Superseded by official military ledgers and Revised Edition."
    },
    {
      _id: "clm-arin-northreach-735-true",
      statement: "Arin Shadowstrider remained in active command at Northreach Keep throughout winter 734 and spring 735, entering Valemont only in autumn 735.",
      subject: "Arin Shadowstrider",
      predicate: "commanded at",
      object: "Northreach Keep during winter 734 - spring 735",
      sourceId: "src-chronicles-revised",
      sourceLocation: "Volume I (Revised), Chapter 14, Page 188",
      canonStatus: "CANON",
      timeline: "Winter 734 - Autumn 735",
      confidence: 98,
      contradictIds: ["clm-arin-valemont-734-old"],
      supersedeIds: ["clm-arin-valemont-734-old"],
      corroborateIds: ["clm-northreach-ledger-signature"],
      notes: "Revised Edition canon based on verified military logs from High Warden Kaelen."
    },
    {
      _id: "clm-northreach-ledger-signature",
      statement: "Commander Arin Shadowstrider personally signed daily garrison logs at Northreach Keep from November 734 until May 735.",
      subject: "Arin Shadowstrider",
      predicate: "signed garrison logs at",
      object: "Northreach Keep (Nov 734 - May 735)",
      sourceId: "src-northreach-ledger",
      sourceLocation: "Logbook Entry #412 - #580",
      canonStatus: "CANON",
      timeline: "Nov 734 - May 735",
      confidence: 100,
      corroborateIds: ["clm-arin-northreach-735-true"],
      contradictIds: ["clm-arin-valemont-734-old"],
      notes: "Primary empirical document confirming Arin's physical presence at Northreach in 734-735."
    },

    // ----------------------------------------------------
    // Scenario 2: Retcon (Did Arin meet Lyra before the Siege of Valemont?)
    // ----------------------------------------------------
    {
      _id: "clm-arin-lyra-met-732-bard",
      statement: "Arin Shadowstrider first met Lyra Frostweaver at the Council of the Five Crowns in 732 before the Siege of Valemont.",
      subject: "Arin Shadowstrider",
      predicate: "met",
      object: "Lyra Frostweaver in 732",
      sourceId: "src-azure-song",
      sourceLocation: "Stanza IV, 'The Maiden & The Blade'",
      canonStatus: "RETCONNED",
      timeline: "732",
      confidence: 45,
      notes: "Folklore ballad claim. Contradicted by Arin's private journal and official archives."
    },
    {
      _id: "clm-arin-lyra-met-734-journal",
      statement: "Arin Shadowstrider first encountered Lyra Frostweaver during the defense of Valemont Citadel in late 734 / 735.",
      subject: "Arin Shadowstrider",
      predicate: "first met",
      object: "Lyra Frostweaver during Valemont siege (734/735)",
      sourceId: "src-arin-journal",
      sourceLocation: "Journal Entry dated 14 Frostfall, 734",
      canonStatus: "CANON",
      timeline: "Late 734",
      confidence: 95,
      contradictIds: ["clm-arin-lyra-met-732-bard"],
      supersedeIds: ["clm-arin-lyra-met-732-bard"],
      notes: "Arin explicitly wrote: 'I had never set eyes upon the mage Lyra until she unsealed the citadel gates under shadow.'"
    },

    // ----------------------------------------------------
    // Scenario 3: Multi-Hop (Did Arin possess Starfire Blade during Siege of Northreach?)
    // ----------------------------------------------------
    {
      _id: "clm-arin-starfire-recovered-733",
      statement: "Arin Shadowstrider recovered the Starfire Blade from the Sunken Ruins of Eldoria in spring 733.",
      subject: "Arin Shadowstrider",
      predicate: "recovered",
      object: "Starfire Blade in spring 733",
      sourceId: "src-arin-journal",
      sourceLocation: "Journal Entry dated 4 Sunheight, 733",
      canonStatus: "CANON",
      timeline: "Spring 733",
      confidence: 95,
      notes: "Establishes when Arin first acquired the sword."
    },
    {
      _id: "clm-arin-northreach-command-735",
      statement: "Arin Shadowstrider wielded his personal weapons while commanding the Battle of Northreach in spring 735.",
      subject: "Arin Shadowstrider",
      predicate: "commanded",
      object: "Battle of Northreach in spring 735",
      sourceId: "src-northreach-ledger",
      sourceLocation: "After-action report, Page 12",
      canonStatus: "CANON",
      timeline: "Spring 735",
      confidence: 98,
      corroborateIds: ["clm-arin-starfire-surrendered-738"],
      notes: "Direct evidence of Arin at Northreach in 735."
    },
    {
      _id: "clm-arin-starfire-surrendered-738",
      statement: "Arin Shadowstrider surrendered the Starfire Blade to Archmage Morvath at the Treaty of Eldoria in 738.",
      subject: "Arin Shadowstrider",
      predicate: "surrendered",
      object: "Starfire Blade to Archmage Morvath in 738",
      sourceId: "src-annals-archives",
      sourceLocation: "Treaty Codex, Section IX",
      canonStatus: "CANON",
      timeline: "738",
      confidence: 99,
      notes: "Establishes that Arin held continuous possession of the blade from 733 until 738."
    },

    // ----------------------------------------------------
    // Scenario 4: Genuinely Unresolved / Disputed (Who forged the Sunken Crown?)
    // ----------------------------------------------------
    {
      _id: "clm-crown-forged-morvath",
      statement: "The Sunken Crown of Eldoria was forged by Archmage Morvath using dark alchemy during the Great Cataclysm.",
      subject: "Sunken Crown of Eldoria",
      predicate: "forged by",
      object: "Archmage Morvath",
      sourceId: "src-azure-song",
      sourceLocation: "Ballad of the Fallen Crown",
      canonStatus: "DISPUTED",
      timeline: "720 (Cataclysm)",
      confidence: 50,
      contradictIds: ["clm-crown-forged-ancient-elven"],
      notes: "Popular rumor attributing the crown to Morvath."
    },
    {
      _id: "clm-crown-forged-ancient-elven",
      statement: "The Sunken Crown of Eldoria predates Archmage Morvath by three centuries and was forged by ancient High Elven smiths.",
      subject: "Sunken Crown of Eldoria",
      predicate: "forged by",
      object: "Ancient High Elven Smiths (4th Century)",
      sourceId: "src-annals-archives",
      sourceLocation: "Volume II, Relic Catalogue #88",
      canonStatus: "AMBIGUOUS",
      timeline: "4th Century",
      confidence: 65,
      contradictIds: ["clm-crown-forged-morvath"],
      notes: "Archival records note conflicting metalwork marks, leaving exact authorship unresolved."
    },

    // ----------------------------------------------------
    // Scenario 5: Straightforward Canon (Who attended Treaty of Valemont/Eldoria?)
    // ----------------------------------------------------
    {
      _id: "clm-treaty-signatories",
      statement: "Commander Arin Shadowstrider and Archmage Morvath were the sole official signatories present at the Treaty of Eldoria in 738.",
      subject: "Treaty of Eldoria",
      predicate: "signed by",
      object: "Arin Shadowstrider and Archmage Morvath",
      sourceId: "src-annals-archives",
      sourceLocation: "Treaty Codex, Preamble",
      canonStatus: "CANON",
      timeline: "738",
      confidence: 100,
      notes: "Primary diplomatic document verified by the High Archives."
    }
  ]
};
