import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Google GenAI client (SDK: google-genai)
genai_client = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        from google import genai
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Google GenAI Client: {e}")

def load_fallback_data():
    """Loads fallback demo JSON for resilient hackathon demonstrations."""
    fallback_path = os.path.join(os.path.dirname(__file__), "fallback_demo.json")
    if os.path.exists(fallback_path):
        with open(fallback_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Fallback file not found"}

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "service": "JuryX Backend",
        "genai_configured": genai_client is not None,
        "model": GEMINI_MODEL
    }), 200

@app.route("/api/deliberate", methods=["POST"])
def deliberate():
    """
    Main deliberation endpoint:
    - Round 1: 4 Jurors initial opinions (Analyst, Empath, Jurist, Skeptic)
    - Round 2: 4 Jurors rebuttals based on Round 1
    - Round 3: Lead Jurist synthesis & advisory verdict
    Falls back to fallback_demo.json if API key is unset or error occurs.
    """
    case_data = request.get_json() or {}
    use_fallback = request.args.get("fallback", "").lower() in ["true", "1"]

    if use_fallback or not genai_client:
        # Fallback path for hackathon stability
        return jsonify(load_fallback_data()), 200

    try:
        # TODO (Teammate 2 & 3): Connect agents.py personas to genai_client
        # ------------------------------------------------------------------
        # ROUND 1: Generate initial opinions from the 4 primary jurors
        # Example using SDK:
        # response = genai_client.models.generate_content(
        #     model=GEMINI_MODEL,
        #     contents=prompt
        # )
        # ------------------------------------------------------------------
        # ROUND 2: Feed Round 1 opinions back to 4 jurors for rebuttals
        # ------------------------------------------------------------------
        # ROUND 3: Lead Jurist synthesizes all discussions into advisory verdict
        # ------------------------------------------------------------------

        # Temporary placeholder returning fallback until live agent calls are finalized
        return jsonify(load_fallback_data()), 200

    except Exception as e:
        print(f"Deliberation error: {e}. Reverting to fallback demo data.")
        return jsonify(load_fallback_data()), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
