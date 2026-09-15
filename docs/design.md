# UI/UX Design System & Workspace Specification
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering (FDE)  
**Date:** September 2026  
**Status:** Approved & Implemented  
**Version:** 2.0.0 (Linear/Notion-Inspired Workspace Redesign)

---

## 1. Design Direction & Aesthetic Philosophy

The Lenny Growth Assistant has been intentionally architected as a **calm, high-density Product Research Workspace** rather than a generic AI chatbot.

### Core Principles
1. **Restraint Over Decoration:** Zero glowing borders, neon badges, or rainbow gradients. The interface is visually quiet, allowing high-signal growth frameworks and podcast transcripts to remain the primary focus.
2. **Editorial Typography Hierarchy:** Built on an intentional font scale (Inter / Geist / system-ui) that differentiates headers, prose, metadata, and monospace identifiers cleanly.
3. **Research-Grade Provenance:** Sources are presented as structured academic citations with guest attribution, episode title, timecode stamps, and expandable transcript quotes.
4. **Contextual 3-Zone Workspace:**
   - **Left:** Workspace session navigation & indexed transcript metadata.
   - **Center:** Document-style conversation canvas (720px - 850px max width for optimal line-length reading).
   - **Right:** Contextual Artifact Workspace that seamlessly slides in when artifacts exist and collapses when not in use.
5. **Interactive Feedback:** Suggested actions and starter prompts populate into the composer for review and editing rather than triggering unprompted execution.

---

## 2. Design Tokens & Color System

The color palette adheres to a high-contrast, low-fatigue charcoal/zinc spectrum with a single purposeful indigo accent.

### Color Tokens
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `canvas-bg` | `#090d16` / `#0f172a` | Deep neutral background canvas |
| `sidebar-bg` | `#0b0f19` | Navigational sidebar surface |
| `panel-bg` | `#111827` | Card, composer, and panel surfaces |
| `panel-border` | `#1e293b` / `rgba(255,255,255,0.08)` | Subtle 1px structural dividing lines |
| `text-primary` | `#f8fafc` | High-contrast primary headings and answers |
| `text-secondary`| `#94a3b8` | Supporting explanations and quotes |
| `text-muted` | `#64748b` | Timestamps, metadata, and section labels |
| `accent-primary`| `#6366f1` | Primary action buttons and selected states |
| `status-emerald`| `#10b981` | Active local Ollama / live system indicator |
| `status-amber`  | `#f59e0b` | Provider configuration notices |

### Spacing & Radius Tokens
- **Padding / Margins:** Strict 4px scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`).
- **Border Radius:** Restrained rounded geometry (`4px` for pills/chips, `6px` for buttons, `8px` for panels). No oversized pill buttons.

---

## 3. Workspace Layout Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Lenny Growth Assistant 🚀                                                   Ollama · Llama 3.2 ▾ │
├─────────────────────┬────────────────────────────────────────────┬───────────────────────────────┤
│ CONVERSATIONS       │ MAIN RESEARCH CONVERSATION                 │ ARTIFACT WORKSPACE (Sliding)  │
│                     │                                            │                               │
│ + New conversation  │ User Question                              │ PMF Engine Calculator         │
│                     │ "How did Superhuman approach PMF?"         │ [Preview] [Code] [Markdown]   │
│ RECENT              │                                            │ ┌───────────────────────────┐ │
│ • Superhuman PMF    │ Assistant Response                         │ │ [Live Sandboxed Iframe]   │ │
│ • PQL Growth Loops  │ Document-style formatted Markdown...       │ │                           │ │
│ • Four Fits Review  │                                            │ │ Score: 58% (Strong PMF)   │ │
│                     │ Sources & Evidence (3)                     │ │                           │ │
│ KNOWLEDGE BASE      │ 1. Rahul Vohra · Superhuman (04:12-09:45)  │ └───────────────────────────┘ │
│ Lenny's Podcast     │ 2. Brian Balfour · Reforge (05:00-11:30)   │ Copy · Download · Fullscreen  │
│ 15+ Chunks Indexed  │ ┌────────────────────────────────────────┐ │                               │
│ Dense Retrieval     │ │ Ask a product or growth question...  ↑ │ │                               │
│                     │ └────────────────────────────────────────┘ │                               │
└─────────────────────┴────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 4. Component Hierarchy & Architecture

- `src/components/layout/AppShell.tsx`: Top-level flex container handling responsive viewports.
- `src/components/layout/Sidebar.tsx`: Session switcher, new chat action, and indexed knowledge base statistics.
- `src/components/layout/Header.tsx`: Minimal toolbar featuring conversation title, model selector dropdown, and mobile menu toggle.
- `src/components/model/ModelSelector.tsx`: Dropdown selector displaying Ollama local, Anthropic Claude, and Fast Mock engine statuses with diagnostic popover.
- `src/components/chat/ChatView.tsx`: Main scrollable conversation stream.
- `src/components/chat/EmptyState.tsx`: First-use view with mission summary and clickable example tasks.
- `src/components/chat/ChatMessage.tsx`: Document-style message renderer with Markdown typography.
- `src/components/sources/SourceReferences.tsx`: Accordion citations with guest names, timestamps, and quotes.
- `src/components/chat/ChatComposer.tsx`: Elastic textarea with suggested productivity actions and Enter/Shift+Enter shortcuts.
- `src/components/artifacts/ArtifactPanel.tsx`: Resilient artifact workspace with live sandboxed iframe, syntax-highlighted code inspector, and export tools.

---

## 5. Security & Untrusted Code Sandboxing

Artifacts containing generated HTML and JavaScript are rendered inside a secured `<iframe>` implementing:
1. **Attribute Restrictions:** `sandbox="allow-scripts"` (strictly excludes `allow-same-origin`, preventing DOM or cookie access to the parent application).
2. **Content Security Policy (CSP):** `default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';` preventing malicious external network requests.
3. **Blob URL Isolation:** Rendered via ephemeral `blob:` URLs to isolate the execution scope.

---

## 6. Accessibility & Responsive Verification

- **Keyboard Usability:** Full tab ordering across navigation, model selection, source popovers, and composer.
- **Screen Sizing:**
  - **1440px+ (Desktop):** 3-column split view with automatic artifact opening.
  - **1024px (Tablet):** Collapsible sidebar and flexible chat width.
  - **768px & 390px (Mobile):** Slide-out drawer navigation, full-width chat, and full-screen tabbed artifact viewer.
