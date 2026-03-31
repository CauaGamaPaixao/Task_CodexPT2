/**
 * checklistSkill.js
 * Simulates an external skill service that converts task descriptions into checklists.
 */
(function () {
  function buildDefaultChecklist(description) {
    const text = (description || "").toLowerCase();

    if (text.includes("api")) {
      return [
        "Create endpoint",
        "Validate inputs",
        "Implement authentication",
        "Test API"
      ];
    }

    if (text.includes("bug") || text.includes("fix")) {
      return [
        "Reproduce issue",
        "Identify root cause",
        "Apply fix",
        "Run regression checks"
      ];
    }

    return [
      "Break work into subtasks",
      "Implement core changes",
      "Review and refine",
      "Run tests"
    ];
  }

  function generateChecklist(description) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(buildDefaultChecklist(description));
      }, 300);
    });
  }

  window.ChecklistSkill = {
    generateChecklist
  };
})();
