import re
import time
from typing import List, Dict, Any, Optional
from app.llm.base import BaseLLMProvider, LLMResponse

class MockLLMProvider(BaseLLMProvider):
    """High-fidelity deterministic local engine for testing and zero-setup demonstration."""
    def __init__(self, model_name: str = "mock-pm-engine"):
        self.model_name = model_name

    async def is_available(self) -> bool:
        return True

    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
        model_name: Optional[str] = None
    ) -> LLMResponse:
        start_time = time.time()
        last_message = messages[-1].get("content", "") if messages else ""
        sys_prompt = system_prompt or ""
        
        # Check intent from prompt context
        content = ""
        if "SHIP 30 FOR 30" in sys_prompt.upper() or "essay" in last_message.lower():
            content = self._generate_ship30_mock(last_message, sys_prompt)
        elif "ARTIFACT" in sys_prompt.upper() or "html" in last_message.lower() or "calculator" in last_message.lower():
            content = self._generate_artifact_mock(last_message, sys_prompt)
        elif "NO RELEVANT TRANSCRIPT EVIDENCE FOUND" in sys_prompt:
            content = "I could not find sufficient support in the available Lenny's Podcast transcripts to answer that question reliably. Please try asking about Product-Market Fit (Superhuman), B2B PLG (Elena Verna), the Four Fits Framework (Brian Balfour), or task prioritization (Shreyas Doshi)."
        else:
            content = self._generate_grounded_qa_mock(last_message, sys_prompt)
            
        latency = round((time.time() - start_time) * 1000 + 120, 2)
        
        return LLMResponse(
            content=content,
            provider="mock",
            model=model_name or self.model_name,
            prompt_tokens=len(sys_prompt.split()) + len(last_message.split()),
            completion_tokens=len(content.split()),
            latency_ms=latency
        )

    def _generate_grounded_qa_mock(self, query: str, context: str) -> str:
        q_lower = query.lower()
        if "superhuman" in q_lower or "pmf" in q_lower or "rahul" in q_lower:
            return (
                "Based on Rahul Vohra's interview on Lenny's Podcast (*'How Superhuman Built An Engine To Find Product-Market Fit'*), "
                "Superhuman operationalized product-market fit using a quantitative, survey-driven framework:\n\n"
                "### 1. The Sean Ellis 40% Benchmark\n"
                "Rahul discovered Sean Ellis's leading indicator of PMF: ask users, *'How would you feel if you could no longer use the product?'* with options: "
                "**Very disappointed**, **Somewhat disappointed**, or **Not disappointed**.\n"
                "- Companies that struggled always scored under **40% 'Very disappointed'**.\n"
                "- In Summer 2017, Superhuman scored only **22%**.\n\n"
                "### 2. High-Expectation Customer (HXC) Segmentation\n"
                "Instead of listening to all users, Superhuman isolated the 'Very disappointed' group to find their High-Expectation Customer personas (founders, executives, investors). "
                "Their core benefit was **speed and keyboard shortcuts**.\n\n"
                "### 3. The 50/50 Roadmap Strategy\n"
                "Superhuman split their roadmap 50/50:\n"
                "- **50% doubling down** on what the happy users loved (more speed and shortcuts).\n"
                "- **50% fixing deal-breakers** for the 'Somewhat disappointed' cohort who valued speed.\n\n"
                "Within 9 months, Superhuman's PMF score skyrocketed from **22% to 58%** before public launch.\n\n"
                "*Sources cited: [Rahul Vohra - Superhuman (04:12 - 23:10)]*"
            )
        elif "elena" in q_lower or "pql" in q_lower or "plg" in q_lower or "verna" in q_lower:
            return (
                "### What are Product Qualified Leads (PQLs)?\n\n"
                "According to Elena Verna, Product Qualified Leads (PQLs) are users who have experienced enough value from your product—usually through self-serve usage—that they are likely to see clear value in paying for it. PQLs are identified based on meaningful in-product behaviors that signal intent, rather than traditional firmographic or demographic data.\n\n"
                "> \"A PQL is a user who has experienced the core value of your product and is likely to benefit from an upgrade or expansion.\"\n"
                "> — Elena Verna, Lenny's Podcast\n\n"
                "### How should sales teams engage with self-serve users?\n\n"
                "Elena emphasizes that sales should engage PQLs with a customer-centric, consultative approach. The key is to add value, not just push for a sale. Sales conversations should:\n\n"
                "1. **Be triggered by in-product usage signals** (e.g., hitting limits, using key features, team adoption).\n"
                "2. **Focus on the user's goals** and how the product can help them achieve more value.\n"
                "3. **Provide guidance, best practices, and personalized recommendations**.\n"
                "4. **Avoid reaching out too early**, before the user has experienced meaningful value.\n"
                "5. **Use product usage data** to tailor the conversation and make it relevant.\n\n"
                "The goal is to help self-serve users become successful, long-term customers by showing them how to get more value from the product, not just closing a deal.\n\n"
                "*Sources cited: [Elena Verna - Product Qualified Leads: Bridging Product and Sales (28:14)]*"
            )
        elif "balfour" in q_lower or "four fits" in q_lower or "retention" in q_lower:
            return (
                "According to Brian Balfour (*'The Four Fits Framework and Retention Mechanics'*), companies must align four interlocking components rather than viewing PMF in isolation:\n\n"
                "1. **Market-Product Fit:** Validating a severe customer problem.\n"
                "2. **Product-Channel Fit:** Adapting the product to channel rules (SEO, virality, paid).\n"
                "3. **Channel-Model Fit:** Matching your monetization (ARPU) with acquisition costs (CAC).\n"
                "4. **Model-Market Fit:** Ensuring ARPU multiplied by market size equals a viable business.\n\n"
                "Balfour emphasizes that **retention is the bedrock of all growth**—if your cohort retention curve does not flatten parallel to the x-axis, the business is a leaky bucket.\n\n"
                "*Sources cited: [Brian Balfour - Reforge / HubSpot (05:00 - 18:20)]*"
            )
        elif "lno" in q_lower or "shreyas" in q_lower or "doshi" in q_lower:
            return (
                "According to Shreyas Doshi on Lenny's Podcast (*'The LNO Framework'*), high-agency PMs manage their energy by classifying tasks into three tiers:\n\n"
                "1. **L (Leverage):** 10x-100x high-upside strategic tasks (product strategy, key hires). Give **100-110% perfection**.\n"
                "2. **N (Neutral):** Standard execution work (sprint planning, PRD updates). Aim for **80% quality**.\n"
                "3. **O (Overhead):** Administrative routine (expense reports, corporate forms). Allocate **50% effort**, batch, or automate.\n\n"
                "*Sources cited: [Shreyas Doshi - Stripe / Twitter (02:30 - 16:40)]*"
            )
        else:
            return (
                f"Based on the transcript evidence from Lenny's Podcast:\n\n"
                f"The core insight regarding your query centers on disciplined product discovery, quantitative feedback loops, and customer empathy.\n\n"
                f"Key principles from the podcast:\n"
                f"- Focus on high-expectation customers and identify their primary benefit.\n"
                f"- Measure retention cohort curves before scaling acquisition spend.\n"
                f"- Prioritize strategic leverage tasks and continuously resolve value, usability, feasibility, and viability risks.\n\n"
                f"*Sources cited: [Lenny's Podcast Transcript Knowledge Base]*"
            )

    def _generate_ship30_mock(self, query: str, context: str) -> str:
        return (
            "# The PMF Engine: How Superhuman Turned Product-Market Fit Into a Science\n\n"
            "**Most startup founders treat Product-Market Fit like lightning in a bottle.**\n\n"
            "You either get struck, or you wander in the dark until your bank balance hits zero.\n\n"
            "They rely on Marc Andreessen's famous definition: *'Money piling up, customers knocking down your door.'* But if you're in the trenches pre-launch, that definition is completely useless.\n\n"
            "It tells you what PMF looks like after you have it—not how to get there.\n\n"
            "---\n\n"
            "### The 40% Leading Indicator That Changes Everything\n\n"
            "In 2017, Rahul Vohra was building Superhuman. When they surveyed their early users, their score was a dismal **22%**. By conventional wisdom, they were dead in the water.\n\n"
            "Instead of pivoting aimlessly, Vohra adopted Sean Ellis's benchmark question:\n\n"
            "> *'How would you feel if you could no longer use the product?'*\n\n"
            "Ellis analyzed hundreds of high-growth companies and uncovered a mathematical pattern:\n"
            "- Companies that struggled to scale always scored under **40% 'Very disappointed'**.\n"
            "- Companies that achieved explosive, durable growth scored above **40%**.\n\n"
            "---\n\n"
            "### Step 1: Isolate Your High-Expectation Customers (HXCs)\n\n"
            "If you listen to all your users equally, your product will become a bloated Frankenstein.\n\n"
            "Superhuman segmented their data and isolated **only** the users who answered 'Very disappointed'. They looked at their job titles (founders, VCs, executives) and asked them what they loved.\n\n"
            "The answer was unanimous: **Speed, keyboard shortcuts, and reaching Inbox Zero.**\n\n"
            "---\n\n"
            "### Step 2: The 50/50 Roadmap Rule\n\n"
            "Next, they analyzed the 'Somewhat disappointed' group. They filtered out anyone who wanted unrelated features (like full CRM integrations) and focused exclusively on the users who wanted **speed** but had deal-breaking bugs.\n\n"
            "Then they engineered their sprint roadmap with surgical balance:\n"
            "- **50% of roadmap capacity** dedicated to doubling down on features their happiest users loved.\n"
            "- **50% of roadmap capacity** dedicated to eliminating blockers for on-the-fence users.\n\n"
            "---\n\n"
            "### The Result: From 22% to 58% in 9 Months\n\n"
            "By treating PMF as a weekly quantitative metric rather than a mystical feeling, Superhuman moved their score from **22% to 58%** before ever opening the product to the public.\n\n"
            "**The Big Takeaway:** Don't wait for product-market fit to find you. Measure your 'Very disappointed' percentage weekly, double down on your High-Expectation Customers, and engineer your way to 40%.\n\n"
            "*Grounded in Lenny's Podcast: Rahul Vohra on Building the PMF Engine.*"
        )

    def _generate_artifact_mock(self, query: str, context: str) -> str:
        q_lower = query.lower()
        if "pql" in q_lower or "elena" in q_lower or "framework" in q_lower:
            return (
                "```html\n"
                "<!DOCTYPE html>\n"
                "<html lang=\"en\">\n"
                "<head>\n"
                "  <meta charset=\"UTF-8\">\n"
                "  <title>The PQL Framework</title>\n"
                "  <style>\n"
                "    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111827; padding: 24px; margin: 0; box-sizing: border-box; }\n"
                "    .container { max-width: 460px; margin: 0 auto; }\n"
                "    .header { text-align: center; margin-bottom: 24px; }\n"
                "    .header h1 { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 4px 0; }\n"
                "    .header p { font-size: 12px; color: #6b7280; margin: 0; }\n"
                "    .step-card { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #ffffff; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }\n"
                "    .badge { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #ffffff; shrink-0; margin-top: 2px; }\n"
                "    .badge-1 { background-color: #3b82f6; }\n"
                "    .badge-2 { background-color: #10b981; }\n"
                "    .badge-3 { background-color: #f59e0b; }\n"
                "    .badge-4 { background-color: #8b5cf6; }\n"
                "    .card-content h3 { margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #111827; }\n"
                "    .card-content ul { margin: 0; padding-left: 16px; font-size: 12px; color: #4b5563; line-height: 1.6; }\n"
                "    .card-content li { margin-bottom: 2px; }\n"
                "    .arrow { text-align: center; color: #9ca3af; font-size: 14px; margin: 4px 0; }\n"
                "  </style>\n"
                "</head>\n"
                "<body>\n"
                "  <div class=\"container\">\n"
                "    <div class=\"header\">\n"
                "      <h1>The PQL Framework</h1>\n"
                "      <p>From Product Usage to Revenue</p>\n"
                "    </div>\n\n"
                "    <div class=\"step-card\">\n"
                "      <div class=\"badge badge-1\">1</div>\n"
                "      <div class=\"card-content\">\n"
                "        <h3>Usage Signals</h3>\n"
                "        <ul>\n"
                "          <li>Key feature adoption</li>\n"
                "          <li>Repeated usage</li>\n"
                "          <li>Team collaboration</li>\n"
                "          <li>Hitting usage limits</li>\n"
                "        </ul>\n"
                "      </div>\n"
                "    </div>\n\n"
                "    <div class=\"arrow\">↓</div>\n\n"
                "    <div class=\"step-card\">\n"
                "      <div class=\"badge badge-2\">2</div>\n"
                "      <div class=\"card-content\">\n"
                "        <h3>Identify PQLs</h3>\n"
                "        <ul>\n"
                "          <li>High-intent behaviors</li>\n"
                "          <li>Meaningful value realized</li>\n"
                "          <li>Likely to benefit from paid plan</li>\n"
                "        </ul>\n"
                "      </div>\n"
                "    </div>\n\n"
                "    <div class=\"arrow\">↓</div>\n\n"
                "    <div class=\"step-card\">\n"
                "      <div class=\"badge badge-3\">3</div>\n"
                "      <div class=\"card-content\">\n"
                "        <h3>Engage with Value</h3>\n"
                "        <ul>\n"
                "          <li>Customer-centric approach</li>\n"
                "          <li>Provide guidance</li>\n"
                "          <li>Share best practices</li>\n"
                "          <li>Personalized recommendations</li>\n"
                "        </ul>\n"
                "      </div>\n"
                "    </div>\n\n"
                "    <div class=\"arrow\">↓</div>\n\n"
                "    <div class=\"step-card\">\n"
                "      <div class=\"badge badge-4\">4</div>\n"
                "      <div class=\"card-content\">\n"
                "        <h3>Drive Long-term Success</h3>\n"
                "        <ul>\n"
                "          <li>Help them get more value</li>\n"
                "          <li>Enable expansion</li>\n"
                "          <li>Build lasting relationships</li>\n"
                "        </ul>\n"
                "      </div>\n"
                "    </div>\n"
                "  </div>\n"
                "</body>\n"
                "</html>\n"
                "```"
            )
        return (
            "```html\n"
            "<!DOCTYPE html>\n"
            "<html lang=\"en\">\n"
            "<head>\n"
            "  <meta charset=\"UTF-8\">\n"
            "  <title>Superhuman PMF Engine Calculator</title>\n"
            "  <style>\n"
            "    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111827; padding: 24px; margin: 0; }\n"
            "    .card { max-width: 500px; margin: 0 auto; background: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; }\n"
            "    h2 { margin-top: 0; color: #0e382b; font-size: 20px; text-align: center; }\n"
            "    .input-group { margin-bottom: 16px; }\n"
            "    label { display: block; font-size: 13px; color: #4b5563; margin-bottom: 6px; font-weight: 500; }\n"
            "    input[type=\"number\"] { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; color: #111; box-sizing: border-box; font-size: 15px; }\n"
            "    .result-box { margin-top: 24px; padding: 18px; border-radius: 8px; text-align: center; background: #ffffff; border: 1px solid #e5e7eb; }\n"
            "    .score { font-size: 36px; font-weight: bold; margin: 8px 0; }\n"
            "    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }\n"
            "    .success { color: #059669; }\n"
            "    .warning { color: #dc2626; }\n"
            "  </style>\n"
            "</head>\n"
            "<body>\n"
            "  <div class=\"card\">\n"
            "    <h2>Sean Ellis PMF Score Calculator</h2>\n"
            "    <p style=\"font-size: 13px; color: #6b7280; text-align: center;\">Grounded in Rahul Vohra's Superhuman Framework</p>\n"
            "    <div class=\"input-group\">\n"
            "      <label>1. Very Disappointed Responses (Core Fans):</label>\n"
            "      <input type=\"number\" id=\"very\" value=\"58\" min=\"0\" oninput=\"calculate()\">\n"
            "    </div>\n"
            "    <div class=\"input-group\">\n"
            "      <label>2. Somewhat Disappointed Responses:</label>\n"
            "      <input type=\"number\" id=\"somewhat\" value=\"32\" min=\"0\" oninput=\"calculate()\">\n"
            "    </div>\n"
            "    <div class=\"input-group\">\n"
            "      <label>3. Not Disappointed Responses:</label>\n"
            "      <input type=\"number\" id=\"not\" value=\"10\" min=\"0\" oninput=\"calculate()\">\n"
            "    </div>\n"
            "    <div class=\"result-box\">\n"
            "      <div style=\"font-size: 12px; color: #6b7280;\">Calculated PMF Score:</div>\n"
            "      <div id=\"score\" class=\"score success\">58.0%</div>\n"
            "      <div id=\"status\" class=\"badge\" style=\"background: #ecfdf5; color: #059669;\">Strong Product-Market Fit (≥ 40%)</div>\n"
            "    </div>\n"
            "  </div>\n"
            "  <script>\n"
            "    function calculate() {\n"
            "      const v = parseFloat(document.getElementById('very').value) || 0;\n"
            "      const s = parseFloat(document.getElementById('somewhat').value) || 0;\n"
            "      const n = parseFloat(document.getElementById('not').value) || 0;\n"
            "      const total = v + s + n;\n"
            "      if (total === 0) return;\n"
            "      const pct = ((v / total) * 100).toFixed(1);\n"
            "      const scoreEl = document.getElementById('score');\n"
            "      const statusEl = document.getElementById('status');\n"
            "      scoreEl.innerText = pct + '%';\n"
            "      if (pct >= 40) {\n"
            "        scoreEl.className = 'score success';\n"
            "        statusEl.innerText = 'Strong Product-Market Fit (≥ 40%)';\n"
            "        statusEl.style.background = '#ecfdf5';\n"
            "        statusEl.style.color = '#059669';\n"
            "      } else {\n"
            "        scoreEl.className = 'score warning';\n"
            "        statusEl.innerText = 'Pre-PMF (Target: 40% threshold)';\n"
            "        statusEl.style.background = '#fef2f2';\n"
            "        statusEl.style.color = '#dc2626';\n"
            "      }\n"
            "    }\n"
            "  </script>\n"
            "</body>\n"
            "</html>\n"
            "```"
        )
