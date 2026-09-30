# 📖 CanonKeeper — Sanity Knowledge Graph & Canon Resolution Engine

**CanonKeeper** is an AI-powered Fictional Universe Lore & Canon Verification Engine built for the **Sanity MCP Hackathon**. It structures complex fictional world-building datasets using Sanity CMS schemas and evaluates claims against primary manuscripts, military garrison ledgers, and revised chronicles to automatically detect retcons, resolve timeline contradictions, and visualize evidence graphs.

---

## 🚀 Key Features

- **Timeline Retcon Override**: Automatically overrides superseded historical accounts when empirical evidence (such as signed military logbooks) and revised primary canon editions exist.
- **Source Authority Hierarchy Weighting**: Calculates confidence scores based on source authority levels:
  - `PRIMARY_CANON` (Weight: 100) — Eyewitness manuscripts, official archives, primary ledgers.
  - `OFFICIAL_SECONDARY` (Weight: 70) — Historical chronicles and official reference books.
  - `REFERENCE` (Weight: 50) — Relic catalogues and scholar notes.
  - `COMMUNITY` (Weight: 25) — Bardic folklore, songs, and popular ballads.
- **Multi-Hop Evidence Deduction**: Traces unbroken artifact custody and event timelines across multi-step acquisition, command, and treaty relinquishment records.
- **Interactive SVG Evidence Graph**: Renders a node-link network mapping questions, claims, sources, and canon verdicts with directional relationship edges (`retrieves`, `supported_by`, `contradicts`, `supersedes`, `resolves_to`).
- **Universe Lore Explorer**: Browse all structured Sanity documents across Claims, Sources, Characters, Events, and Locations with real-time search filtering.
- **Sanity CMS & MCP Integration**: Features a live GROQ query console and Sanity Model Context Protocol (MCP) server configuration (`https://mcp.sanity.io`).

---

## 🧩 Sanity Knowledge Graph Schemas

CanonKeeper defines 5 custom Sanity document schemas ([`src/lib/sanity/schemas/index.ts`](file:///c:/Build/Antigravity/Sanity%20MCP%20Hackathon/src/lib/sanity/schemas/index.ts)):

1. **`claim`**: Atomic lore statements with subject-predicate-object triples, source references, timeline markers, confidence scores, and arrays for `contradicts`, `corroborates`, and `supersedes` relations.
2. **`source`**: Documents with publication dates, edition details, author metadata, authority level tags, and `supersedes` / `supersededBy` references.
3. **`character`**: Character profiles with aliases, descriptions, first appearance references, and typed character relationships.
4. **`event`**: Chronological events with location references, participant arrays, and preceding/following event chains.
5. **`location`**: Places with descriptions and associated characters and events.

---

## 🎯 Verification Scenario Presets

CanonKeeper includes 5 pre-configured scenario tests in the UI:

| Preset Scenario | Category | Key Evidence Evaluated | Resolution Verdict |
| :--- | :--- | :--- | :--- |
| **Arin's Valemont Arrival** | Retcon | 1st Ed. Chronicles vs. Garrison Log Signatures & Revised Ed. | `RETCON_OVERRIDDEN` |
| **Meeting Lyra Frostweaver** | Retcon | Azure Bard Ballad (732) vs. Arin's Private Journal (734) | `RETCON_OVERRIDDEN` |
| **Starfire Blade Custody** | Multi-Hop | 733 Recovery -> 735 Battle Command -> 738 Treaty Surrender | `MULTI_HOP_VALIDATED` |
| **Sunken Crown Forging** | Disputed | Bardic Legend (Morvath) vs. High Archives Relic Catalogue | `DISPUTED_UNRESOLVED` |
| **Treaty Signatories** | Canon | Annals of Aethelgard Treaty Codex Preamble | `CANON_VERIFIED` |

---

## 📁 Repository Structure

```
Sanity MCP Hackathon/
├── .agents/
│   └── mcp_config.json          # Sanity MCP Server Configuration
├── scripts/
│   └── seed-sanity.ts           # Sanity CMS Dataset Seeding Script
├── src/
│   ├── app/
│   │   ├── globals.css          # TailwindCSS & Dark Fantasy Theme Utility Classes
│   │   ├── layout.tsx           # Next.js App Router Root Layout
│   │   └── page.tsx             # Interactive Main Application Page
│   ├── components/
│   │   ├── Header.tsx           # Top Navbar & Mode Indicator
│   │   ├── PresetQuerySelector.tsx # Quick Scenario Test Buttons
│   │   ├── QueryInput.tsx       # Search Input & Entity Recognizer
│   │   ├── VerdictBanner.tsx    # Definitive Verdict Display
│   │   ├── EvidenceGraphVisualizer.tsx # Interactive SVG Network Map
│   │   ├── ConflictBreakdown.tsx # Audit Matrix & Authority Breakdown
│   │   ├── UniverseExplorer.tsx # Lore Database Browser
│   │   └── SanitySchemaInspector.tsx # Sanity Schema & GROQ Simulator
│   └── lib/
│       ├── canon/
│       │   ├── analyzer.ts      # Question Parser & Scenario Matcher
│       │   ├── retriever.ts     # Evidence Retrieval Engine (Async & Sync)
│       │   ├── resolver.ts      # Canon Verdict & Authority Evaluator
│       │   └── graphBuilder.ts  # Evidence Graph Node & Edge Generator
│       └── sanity/
│           ├── client.ts        # Sanity Client & Memory Fallback Service
│           ├── schemas/         # Sanity Studio Schema Definitions
│           └── universeData.ts  # Initial Fictional Universe Knowledge Base
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. *(Optional)* Configure environment variables for live Sanity CMS connection in `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   ```
   > **Note**: If no Sanity environment variables are provided, CanonKeeper seamlessly defaults to its rich internal memory universe fallback.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. *(Optional)* Seed your live Sanity dataset with initial universe lore:
   ```bash
   npm run seed
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## ⚡ Model Context Protocol (MCP) Integration

CanonKeeper integrates with the Sanity Model Context Protocol (MCP) server:
- **Server URL**: `https://mcp.sanity.io`
- **Config**: Defined in `.agents/mcp_config.json`

This enables LLM agents to perform schema-aware queries and fetch structured lore documents directly via GROQ.

---

## 📜 License

MIT License. Built for the Sanity MCP Hackathon.
