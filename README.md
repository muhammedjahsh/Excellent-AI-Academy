# DataVerse AI Academy: vertical slice

**Implemented (real, tested):** register/login (JWT, PBKDF2), catalog for all 4 tracks (module titles from the brief),
Data Analytics Module 4 lesson with source links, SQL lab with 3 tasks graded deterministically against hidden reference
results (SELECT-only, subprocess, 5s timeout), stored attempts, certificate eligibility/issue/public-verify endpoints
(issuance is correctly blocked until all requirements exist), minimal web UI.

**Not implemented yet:** AI tutor and retrieval/citations, LLM provider layer, quiz engine, Python lab, mock interviews,
projects, adaptive plans, gamification, PDF/QR certificates, admin/instructor console, content for the other ~70 modules.
Module content status is reported honestly as `planned`.

**Security caveat:** the SQL runner is a subprocess with an authorizer, which is fine for local dev. Before exposing publicly,
move execution to an isolated container service (no network, resource limits, read-only FS) and never run Python submissions this way.

## Run
    cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload   # SQLite, http://localhost:8000
    pytest                                                                          # tests
    docker compose up --build                                                       # PostgreSQL
Set `JWT_SECRET` in any real deployment. API docs at `/docs`.

## Next steps (per the architecture proposal)
LLMProvider interface + tutor with allowlisted retrieval, question-bank validation pipeline, container sandbox, interview engine,
certificate policy tables + PDF/QR, admin console.
