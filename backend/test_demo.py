import sys
import os
import time
import json

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import app

client = app.app.test_client()

print("=" * 60)
print("JuryX Backend — Live Demo Verification Suite")
print("=" * 60)

# 1. Test /health
h = client.get("/health")
print(f"\n1. GET /health -> Status {h.status_code}")
print(json.dumps(h.get_json(), indent=2))

# 2. Test /api/cases
c = client.get("/api/cases")
print(f"\n2. GET /api/cases -> Status {c.status_code}")
print(f"Loaded {len(c.get_json())} summary cases from agents.py")

# 3. Test /api/eligibility
e = client.post("/api/eligibility", json={"case_type": "cheque_dishonour", "claim_amount": 45000})
print(f"\n3. POST /api/eligibility -> Status {e.status_code}")
print(json.dumps(e.get_json(), indent=2))

# 4. Test /api/deliberate (Parallel Round 1 + Parallel Round 2 + Head Jurist Synthesis)
sample_case = app.SAMPLE_CASES[0]
payload = {
    "case_facts": sample_case["facts"],
    "case_type": sample_case["case_type"]
}

print(f"\n4. POST /api/deliberate -> Running 3-Round Pipeline for: {sample_case['title']}...")
t0 = time.time()
res = client.post("/api/deliberate", json=payload)
total_t = round(time.time() - t0, 2)
data = res.get_json()

print(f"Status: {res.status_code} | Total Roundtrip Time: {total_t}s")
print(f"Source: {data.get('source')} | Pipeline Time: {data.get('pipeline_time_seconds')}s")

if data.get("round1"):
    print("\n--- ROUND 1 (Initial Juror Opinions) ---")
    for j_id, j_data in data["round1"].items():
        print(f"  [{j_id.upper()}] Stance: {j_data.get('stance')} | Conf: {j_data.get('confidence')} | St: {j_data.get('statutory_references')}")

if data.get("round2"):
    print("\n--- ROUND 2 (Parallel Rebuttals & Sway) ---")
    for j_id, j_data in data["round2"].items():
        rebs = len(j_data.get("rebuttals", []))
        print(f"  [{j_id.upper()}] Revised Stance: {j_data.get('revised_stance')} | Conf: {j_data.get('revised_confidence')} | Rebuttals count: {rebs}")

if data.get("round3"):
    print("\n--- ROUND 3 (Head Jurist Advisory Synthesis) ---")
    r3 = data["round3"]
    print(f"  Verdict: {r3.get('verdict')}")
    print(f"  Consensus: {r3.get('consensus_level')}")
    print(f"  Advisory Note: {r3.get('advisory_note')}")
    print(f"  Remedy: {r3.get('remedy_or_sentencing')}")

print("\n" + "=" * 60)
print("Verification complete! Ready for live pitch demo.")
print("=" * 60)
