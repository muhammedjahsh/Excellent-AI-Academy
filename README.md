# DataVerse AI Academy: vertical slice

**Implemented:** register/login (JWT, PBKDF2), a catalog of 10 learning paths, and tool-based advanced roadmaps
for Data Analytics and the other courses. Every course has a course-specific, on-device curriculum coach; no external AI model
is configured or receives learner prompts. Data Analytics Module 2 SQL lesson with source links, SQL lab with 3 tasks graded deterministically against hidden reference
results (SELECT-only, subprocess, 5s timeout), stored attempts, certificate eligibility/issue/public-verify endpoints
(issuance is correctly blocked until all requirements exist), and a Stripe Checkout enrollment flow. Checkout and payment
verification are covered with mocked Stripe API tests; live payments require private Stripe credentials. Courses are
₹10,000 each as a one-time INR payment; a confirmed payment unlocks the selected course(s) for that account.

**Course focus:** learners may enroll in multiple courses and choose one active course in the browser. The workspace, course
search, progress dashboard, and course coach focus on that selection; switching preserves progress for each course in that
browser. Paid enrollments are stored on the server and used to gate course modules and course tools.
The SQL lab and certificate operations also verify enrollment in the API. Course text is currently bundled with the frontend,
so move paid lesson content behind authenticated server routes before using the UI gate to protect confidential materials.

**Not implemented yet:** hosted AI tutor and retrieval/citations, LLM provider layer, quiz engine, Python lab, mock interviews,
projects, adaptive plans, gamification, PDF/QR certificates, admin/instructor console, content for the other ~70 modules.
Module content status is reported honestly as `planned`.

**Security caveat:** the SQL runner is a subprocess with an authorizer, which is fine for local dev. Before exposing publicly,
move execution to an isolated container service (no network, resource limits, read-only FS) and never run Python submissions this way.

**Developer Studio:** the frontend includes a Pyodide Python playground (executed in a temporary browser worker), local source heuristics,
and a GitHub Actions workflow inspector. Python code is not sent to the backend; the runtime downloads from jsDelivr on first use.
This is a learning convenience, not a security sandbox. Drafts are stored in the browser.

## Run
    cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload   # SQLite, http://localhost:8000
    cd frontend && npm install && npm run dev                                     # Vite, http://localhost:5173
    pytest                                                                          # tests
    docker compose up --build                                                       # PostgreSQL
Set `JWT_SECRET` in any real deployment. API docs at `/docs`.

## Stripe course enrollment
Course enrollment uses Stripe-hosted Checkout, one-time payments in INR, and a server-side fixed price of ₹10,000 per
course. Set these server environment variables before starting the API:

- `STRIPE_SECRET_KEY` — Stripe test key for development; use a live key only in a secured production environment.
- `STRIPE_WEBHOOK_SECRET` — signing secret for the webhook endpoint `/billing/webhook`.
- `FRONTEND_URL` — frontend origin used for Checkout return URLs (for example `http://localhost:5173`).

For local development, forward Stripe events to `http://localhost:8000/billing/webhook` using Stripe CLI and set the
printed webhook signing secret as `STRIPE_WEBHOOK_SECRET`. In production, register the public HTTPS webhook URL with
Stripe. Configure the allowed payment methods in your Stripe account. The application never collects or stores card
details; access is granted only after Stripe confirms payment. Do not put Stripe secret keys in frontend variables,
source control, or chat. Payment endpoints return a configuration error until server keys are set.

PowerShell local setup (use your private Stripe **test-mode** values):

```powershell
$env:STRIPE_SECRET_KEY = "sk_test_..."
$env:STRIPE_WEBHOOK_SECRET = "whsec_..."
$env:FRONTEND_URL = "http://localhost:5173"
Set-Location backend
python -m uvicorn app.main:app --reload
```

In another terminal, run `stripe listen --forward-to localhost:8000/billing/webhook` and use the `whsec_...` value it
prints for `STRIPE_WEBHOOK_SECRET`.

## Next steps (per the architecture proposal)
LLMProvider interface + tutor with allowlisted retrieval, question-bank validation pipeline, container sandbox, interview engine,
certificate policy tables + PDF/QR, admin console.
