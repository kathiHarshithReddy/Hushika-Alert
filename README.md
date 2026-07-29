Husika Alert

Raw hazard signals, turned into plain-language early warnings.

Built for the IGAD Hackathon 2026: Smarter Early Warning, Stronger Communities

The problem

Regional institutions like ICPAC already publish high-quality hazard and drought monitoring data through platforms such as HUSIKA, Hazard Watch, and Drought Watch. But that data is built for technical analysis — indicators like VCI, SPI-3, and WRSI mean little to a farmer in Turkana or a family near the Shabelle river basin who just needs to know: is my area at risk, and what should I do right now?

Husika Alert is a "last mile" translation layer that converts expert-grade hazard monitoring data into short, plain-language warnings that anyone can read and act on in seconds.

What it does
Ingests hazard indicator data — drought signals, flood river-stage readings, and food security phase classifications — structured the way ICPAC's own indicators are (value, trigger threshold, status, trend).
Converts each record into a plain-language alert: a short headline, a 2–3 sentence explanation of the risk, and a concrete list of actions.
Available in English and Swahili.
Every alert stays linked back to the raw indicator it came from, so nothing is a black box — users and responders can see exactly what triggered the warning.
Alerts load instantly from a local rule-based template (fast, reliable, no network dependency), with an optional "Regenerate with AI" button on each card that calls the Claude API live to generate a fresh, more nuanced alert from the raw data.
How it works
Data layer — Sample hazard records modeled on real ICPAC indicators (Vegetation Condition Index for drought, river stage height for floods, IPC phase for food security), each with a value, threshold, trigger status, and trend.
Local template engine — Renders instant, reliable plain-language alerts in English or Swahili so the interface never stalls waiting on a network call.
AI enrichment layer — Sends the raw indicator data to the Claude API in a structured prompt and receives back a JSON object (severity, headline, message, actions), demonstrating a genuine AI transformation step rather than a static mockup.
UI — A dashboard where alerts can be filtered by hazard type, language can be toggled, and raw signal data can be expanded per card for transparency.
Tech stack
React
Tailwind CSS
lucide-react icons
Claude API (Anthropic, claude-sonnet-4-6)
JSON-structured prompting
Data & resource acknowledgments

Hazard indicator structures in this prototype are modeled on publicly available information from ICPAC's platforms, explored for inspiration and structure only (sample data is used in this prototype, not live feeds):

ICPAC Website
ICPAC Hazard Watch
ICPAC Drought Watch
HUSIKA Platform
ICPAC Thresholds and Triggers System

This is a hackathon prototype. It does not connect to live ICPAC data feeds and is not an official ICPAC product.

Running locally
bash
# Clone the repository
git clone https://github.com/<your-username>/husika-alert.git
cd husika-alert

# Install dependencies
npm install

# Start the development server
npm run dev

The app will be available at http://localhost:5173 (or whichever port your dev server prints).

No API key setup is required to view local alerts. Live "Regenerate with AI" calls require a valid Anthropic API key configured in your environment.

What's next
Connect directly to ICPAC's live Hazard Watch, Drought Watch, and Thresholds & Triggers feeds
SMS/USSD delivery for low-connectivity areas
Expanded language coverage across the IGAD region (Amharic, Somali, Oromo)
Partnership with local disaster response coordinators to validate alert accuracy in the field
Multi-hazard alerts for regions facing overlapping risks (e.g. drought + food insecurity simultaneously)
License

Built for the IGAD Hackathon 2026. Sample data and prototype code only — not for production use.
