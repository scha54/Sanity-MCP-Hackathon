import { ClaimData, SourceData } from '../sanity/universeData';

export interface GraphNode {
  id: string;
  label: string;
  type: 'question' | 'claim' | 'source' | 'verdict';
  status?: string;
  authority?: string;
  subtitle?: string;
  details?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: 'retrieves' | 'supported_by' | 'contradicts' | 'corroborates' | 'supersedes' | 'resolves_to';
  status?: 'active' | 'retconned' | 'disputed';
}

export interface EvidenceGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildEvidenceGraph(
  rawQuestion: string,
  claims: ClaimData[],
  sources: SourceData[],
  verdictStatus: string
): EvidenceGraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const uniqueClaims = Array.from(new Map(claims.map(c => [c._id, c])).values());

  // Question node
  nodes.push({
    id: 'node-q',
    label: 'Canon Question',
    subtitle: rawQuestion.length > 35 ? rawQuestion.substring(0, 35) + '...' : rawQuestion,
    type: 'question'
  });

  // Source nodes map
  const sourceMap = new Map<string, SourceData>();
  sources.forEach(s => sourceMap.set(s._id, s));

  // Add claim nodes and edges
  uniqueClaims.forEach((c) => {
    const claimNodeId = `node-${c._id}`;
    const src = sourceMap.get(c.sourceId);

    nodes.push({
      id: claimNodeId,
      label: `Claim (${c.canonStatus})`,
      subtitle: c.statement.length > 40 ? c.statement.substring(0, 40) + '...' : c.statement,
      type: 'claim',
      status: c.canonStatus,
      details: c
    });

    // Question -> Claim Edge
    edges.push({
      id: `edge-q-${c._id}`,
      source: 'node-q',
      target: claimNodeId,
      label: 'retrieves'
    });

    // Source Node & Edge
    if (src) {
      const srcNodeId = `node-${src._id}`;
      if (!nodes.some(n => n.id === srcNodeId)) {
        nodes.push({
          id: srcNodeId,
          label: src.title,
          subtitle: `[${src.authorityLevel}] (${src.publicationDate})`,
          type: 'source',
          authority: src.authorityLevel,
          details: src
        });
      }

      edges.push({
        id: `edge-${c._id}-src`,
        source: claimNodeId,
        target: srcNodeId,
        label: 'supported_by'
      });
    }

    // Inter-claim edges
    if (c.contradictIds) {
      c.contradictIds.forEach(targetId => {
        if (claims.some(tc => tc._id === targetId)) {
          edges.push({
            id: `edge-contradict-${c._id}-${targetId}`,
            source: claimNodeId,
            target: `node-${targetId}`,
            label: 'contradicts',
            status: 'disputed'
          });
        }
      });
    }

    if (c.supersedeIds) {
      c.supersedeIds.forEach(targetId => {
        if (claims.some(tc => tc._id === targetId)) {
          edges.push({
            id: `edge-supersede-${c._id}-${targetId}`,
            source: claimNodeId,
            target: `node-${targetId}`,
            label: 'supersedes',
            status: 'retconned'
          });
        }
      });
    }
  });

  // Verdict node
  nodes.push({
    id: 'node-verdict',
    label: `Verdict: ${verdictStatus}`,
    subtitle: 'Canon Resolution',
    type: 'verdict',
    status: verdictStatus
  });

  // Connect primary claims to verdict
  claims.filter(c => c.canonStatus === 'CANON' || c.canonStatus === 'DISPUTED' || c.canonStatus === 'AMBIGUOUS').forEach(c => {
    edges.push({
      id: `edge-verdict-${c._id}`,
      source: `node-${c._id}`,
      target: 'node-verdict',
      label: 'resolves_to'
    });
  });

  return { nodes, edges };
}
