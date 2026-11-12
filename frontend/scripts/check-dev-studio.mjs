import assert from "node:assert/strict";
import { reviewSource } from "../src/lib/sourceReview.js";
import { reviewWorkflow } from "../src/lib/workflowReview.js";

const sourceFindings = reviewSource(
  "const token = 'this-is-a-long-hard-coded-token';\nconsole.log(token);\neval(input);",
);
assert(sourceFindings.some((item) => item.title === "Possible hard-coded secret"));
assert(sourceFindings.some((item) => item.title === "Debug statement"));
assert(sourceFindings.some((item) => item.title === "Dynamic code execution"));

const pythonFindings = reviewSource("try:\n    work()\nexcept:\n    pass", "python");
assert(pythonFindings.some((item) => item.title === "Bare exception handler"));

const workflowFindings = reviewWorkflow(`name: Unsafe check
on: pull_request_target
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "\${{ github.event.pull_request.title }}"
`);
assert(workflowFindings.some((item) => item.title === "Privileged pull_request_target trigger"));
assert(workflowFindings.some((item) => item.title === "Untrusted event text enters a shell command"));
assert(workflowFindings.some((item) => item.title === "Permissions not declared"));

const validWorkflowFindings = reviewWorkflow(`name: Test
on: push
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@0123456789abcdef0123456789abcdef01234567
      - run: npm test
`);
assert(!validWorkflowFindings.some((item) => item.severity === "high"));
assert(!validWorkflowFindings.some((item) => item.title === "Action is not pinned to a full commit SHA"));
const taggedActionFindings = reviewWorkflow(`name: Test
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
`);
assert(taggedActionFindings.some((item) => item.title === "Action is not pinned to a full commit SHA"));

console.log("Developer studio checks passed.");
