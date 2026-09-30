export const characterSchema = {
  name: 'character',
  title: 'Character',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'aliases', title: 'Aliases', type: 'array', of: [{ type: 'string' }] },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'firstAppearance', title: 'First Appearance', type: 'reference', to: [{ type: 'source' }] },
    { 
      name: 'relationships', 
      title: 'Relationships', 
      type: 'array', 
      of: [
        {
          type: 'object',
          fields: [
            { name: 'targetCharacter', title: 'Character', type: 'reference', to: [{ type: 'character' }] },
            { name: 'relationType', title: 'Relation Type', type: 'string' },
            { name: 'details', title: 'Details', type: 'string' }
          ]
        }
      ] 
    },
    { name: 'associatedEvents', title: 'Associated Events', type: 'array', of: [{ type: 'reference', to: [{ type: 'event' }] }] },
    { name: 'sourceReferences', title: 'Source References', type: 'array', of: [{ type: 'reference', to: [{ type: 'source' }] }] }
  ]
};

export const eventSchema = {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'chronology', title: 'Chronology / Date', type: 'string' },
    { name: 'location', title: 'Location', type: 'reference', to: [{ type: 'location' }] },
    { name: 'participants', title: 'Participants', type: 'array', of: [{ type: 'reference', to: [{ type: 'character' }] }] },
    { name: 'precedingEvents', title: 'Preceding Events', type: 'array', of: [{ type: 'reference', to: [{ type: 'event' }] }] },
    { name: 'followingEvents', title: 'Following Events', type: 'array', of: [{ type: 'reference', to: [{ type: 'event' }] }] },
    { name: 'sourceReferences', title: 'Source References', type: 'array', of: [{ type: 'reference', to: [{ type: 'source' }] }] }
  ]
};

export const locationSchema = {
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'associatedCharacters', title: 'Associated Characters', type: 'array', of: [{ type: 'reference', to: [{ type: 'character' }] }] },
    { name: 'associatedEvents', title: 'Associated Events', type: 'array', of: [{ type: 'reference', to: [{ type: 'event' }] }] },
    { name: 'sourceReferences', title: 'Source References', type: 'array', of: [{ type: 'reference', to: [{ type: 'source' }] }] }
  ]
};

export const sourceSchema = {
  name: 'source',
  title: 'Source Document',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { 
      name: 'sourceType', 
      title: 'Source Type', 
      type: 'string',
      options: {
        list: [
          { title: 'Novel / Book', value: 'NOVEL' },
          { title: 'Chronicle / Official History', value: 'CHRONICLE' },
          { title: 'Original Manuscript / Journal', value: 'MANUSCRIPT' },
          { title: 'Bardic Song / Folklore', value: 'BARDIC_SONG' },
          { title: 'Official Ledger', value: 'LEDGER' }
        ]
      }
    },
    { name: 'edition', title: 'Edition / Publication', type: 'string' },
    { name: 'author', title: 'Author / Creator', type: 'string' },
    { name: 'publicationDate', title: 'Publication Date', type: 'string' },
    { 
      name: 'authorityLevel', 
      title: 'Authority Level', 
      type: 'string',
      options: {
        list: [
          { title: 'Primary Canon', value: 'PRIMARY_CANON' },
          { title: 'Official Secondary', value: 'OFFICIAL_SECONDARY' },
          { title: 'Reference Material', value: 'REFERENCE' },
          { title: 'Community / Folklore', value: 'COMMUNITY' },
          { title: 'Unknown', value: 'UNKNOWN' }
        ]
      }
    },
    { name: 'supersedes', title: 'Supersedes Source', type: 'reference', to: [{ type: 'source' }] },
    { name: 'supersededBy', title: 'Superseded By Source', type: 'reference', to: [{ type: 'source' }] },
    { name: 'urlReference', title: 'URL Reference', type: 'string' },
    { name: 'notes', title: 'Notes', type: 'text' }
  ]
};

export const claimSchema = {
  name: 'claim',
  title: 'Claim',
  type: 'document',
  fields: [
    { name: 'statement', title: 'Statement', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'subject', title: 'Subject Entity', type: 'string' },
    { name: 'predicate', title: 'Predicate / Action', type: 'string' },
    { name: 'object', title: 'Object / Target', type: 'string' },
    { name: 'source', title: 'Source Document', type: 'reference', to: [{ type: 'source' }], validation: (Rule: any) => Rule.required() },
    { name: 'sourceLocation', title: 'Source Location (Chapter/Page)', type: 'string' },
    { 
      name: 'canonStatus', 
      title: 'Canon Status', 
      type: 'string',
      options: {
        list: [
          { title: 'Canon', value: 'CANON' },
          { title: 'Retconned', value: 'RETCONNED' },
          { title: 'Disputed', value: 'DISPUTED' },
          { title: 'Ambiguous', value: 'AMBIGUOUS' },
          { title: 'Non-Canon', value: 'NON_CANON' },
          { title: 'Unknown', value: 'UNKNOWN' }
        ]
      }
    },
    { name: 'timeline', title: 'Timeline / Chronology', type: 'string' },
    { name: 'confidence', title: 'Confidence Score (0-100)', type: 'number' },
    { name: 'contradicts', title: 'Contradicts Claims', type: 'array', of: [{ type: 'reference', to: [{ type: 'claim' }] }] },
    { name: 'corroborates', title: 'Corroborates Claims', type: 'array', of: [{ type: 'reference', to: [{ type: 'claim' }] }] },
    { name: 'supersedes', title: 'Supersedes Claims', type: 'array', of: [{ type: 'reference', to: [{ type: 'claim' }] }] },
    { name: 'relatedClaims', title: 'Related Claims', type: 'array', of: [{ type: 'reference', to: [{ type: 'claim' }] }] },
    { name: 'notes', title: 'Notes', type: 'text' }
  ]
};

export const schemaTypes = [characterSchema, eventSchema, locationSchema, sourceSchema, claimSchema];
