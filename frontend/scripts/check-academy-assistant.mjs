import assert from "node:assert/strict";
import { academyGuideReply } from "../src/lib/academyAssistant.js";
import { TRACKS } from "../src/data/curriculum.js";

const catalog = academyGuideReply("What courses are offered?");
assert.match(catalog.text, new RegExp(`a catalog of ${TRACKS.length} learning paths`));
assert.equal(catalog.to, "/tracks");

const overview = academyGuideReply("Tell me about this website");
assert.match(overview.text, /homepage/i);

const courseOverview = academyGuideReply("Tell me about Data Science");
assert.match(courseOverview.text, /Foundations & problem formulation/);

const course = academyGuideReply("What modules are in Data Science?");
assert.match(course.text, /Foundations & problem formulation/);
assert.match(course.text, /major project/i);

const module = academyGuideReply("Show me the five projects in Data Analytics Query and databases");
assert.match(module.text, /Five distinctive project briefs/);
assert.equal((module.text.match(/— Query and databases:/g) || []).length, 5);
assert.match(module.to, /#data-analytics-2$/);

const enrollment = academyGuideReply("How much does enrollment cost?");
assert.match(enrollment.text, /₹10,000 INR/);
assert.equal(enrollment.to, "/checkout");

const allCourseFees = academyGuideReply("What is the fee for all courses?");
assert.match(allCourseFees.text, /₹1,00,000 INR/);

const threeCourseFees = academyGuideReply("What would three courses cost?");
assert.match(threeCourseFees.text, /₹30,000 INR/);

const moduleSyllabus = academyGuideReply("What does the SQL module in Data Analytics cover?");
assert.match(moduleSyllabus.text, /SELECT, aliases, expressions, and DISTINCT/);
assert.match(moduleSyllabus.text, /published lesson/i);

const studio = academyGuideReply("What is in Developer Studio?");
assert.match(studio.text, /Pyodide Python runner/);
assert.match(studio.text, /not a security sandbox/);
assert.equal(studio.to, "/studio");

const unknown = academyGuideReply("What is the academy's refund policy?");
assert.match(unknown.text, /does not publish a post-payment refund policy/i);

const currentModule = academyGuideReply("What does this module cover?", {
  pathname: "/learn/data-analytics/2",
  activeCourse: "data-analytics",
});
assert.match(currentModule.text, /Query and databases/);

const currentProgress = academyGuideReply("What is my progress?", {
  activeCourse: "data-science",
  done: { "data-science-1": true, "data-science-2": true },
  seen: { "data-science-1": true, "data-science-2": true, "data-science-3": true },
});
assert.match(currentProgress.text, /2 of 19 modules marked complete and 3 opened/);

let moduleQueries = 0;
for (const track of TRACKS) {
  for (const item of track.modules) {
    const reply = academyGuideReply(`${track.title} ${item.title} projects`);
    assert.match(reply.text, /Five distinctive project briefs/);
    assert.ok(reply.text.includes(item.title), `${track.title} / ${item.title} was not resolved`);
    moduleQueries += 1;
  }
}

assert.equal(moduleQueries, TRACKS.reduce((total, track) => total + track.modules.length, 0));
console.log("Academy assistant checks passed.");
