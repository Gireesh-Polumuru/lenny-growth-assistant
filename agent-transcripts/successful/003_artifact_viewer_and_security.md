# Successful Pattern 003: Claude-Style Artifact Viewer & Sandboxed Isolation

## Objective
Enable live rendering of AI-generated interactive HTML/CSS tools (calculators, frameworks, dashboards) and Markdown documents alongside the chat canvas while preventing XSS or data leakage.

## Security Architecture
1. **Isolated Iframe Sandbox:** 
   - Rendered using `<iframe sandbox="allow-scripts" srcdoc="..."></iframe>`.
   - **`allow-same-origin` is omitted**, creating an opaque unique origin that prevents access to host `localStorage`, session cookies, or backend API tokens.
2. **Content Security Policy (CSP):**
   - Injected `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; connect-src 'none';">`.
   - Blocks outbound network requests from generated code.
3. **Multi-Tab Interface:**
   - Tabs for **Preview** (live interactive execution), **Code** (syntax inspection), and direct export buttons (Download `.html`/`.md`, Copy code).
