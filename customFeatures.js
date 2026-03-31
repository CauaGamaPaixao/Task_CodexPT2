/**
 * customFeatures.js
 * Adds modular DOM enhancements without modifying existing TaskMaster logic.
 */
(function () {
  const BG_KEY = "taskmaster.customBackground";
  const DESC_PREFIX = "taskmaster.taskDescription.";
  const CHECK_PREFIX = "taskmaster.checklistState.";

  function encodeCsvValue(value) {
    const normalized = String(value || "").replace(/"/g, '""');
    return `"${normalized}"`;
  }

  function getBoardContainer(doc) {
    return (
      doc.querySelector('[data-testid="stAppViewContainer"]') ||
      doc.querySelector(".stApp") ||
      doc.body
    );
  }

  function getTaskKey(card) {
    const title = card.querySelector("strong")?.textContent?.trim() || "Untitled";
    const priorityText = card.querySelector("small")?.textContent?.trim() || "Priority: Unknown";
    return `${title}__${priorityText}`;
  }

  function getTaskMeta(card, status) {
    const title = card.querySelector("strong")?.textContent?.trim() || "Untitled";
    const priority = (card.querySelector("small")?.textContent?.replace("Priority:", "").trim()) || "Medium";
    const taskKey = getTaskKey(card);
    const description = localStorage.getItem(`${DESC_PREFIX}${taskKey}`) || "";
    return { title, priority, description, status, taskKey };
  }

  function getStatusMap(doc) {
    const map = new Map();
    const columns = doc.querySelectorAll('[data-testid="column"]');

    columns.forEach((column) => {
      const heading = column.querySelector("h3")?.textContent || "";
      let status = "To Do";
      if (heading.toLowerCase().includes("progress")) status = "Doing";
      if (heading.toLowerCase().includes("finished")) status = "Done";
      column.querySelectorAll(".task-card").forEach((card) => map.set(card, status));
    });

    return map;
  }

  function exportBacklog(doc) {
    const statusMap = getStatusMap(doc);
    const cards = Array.from(doc.querySelectorAll(".task-card"));

    const rows = cards.map((card) => {
      const status = statusMap.get(card) || "To Do";
      const meta = getTaskMeta(card, status);
      return [meta.title, meta.description, meta.priority, meta.status];
    });

    const csvLines = [
      ["Title", "Description", "Priority", "Status"].map(encodeCsvValue).join(","),
      ...rows.map((r) => r.map(encodeCsvValue).join(","))
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = doc.createElement("a");
    link.href = url;
    link.download = "taskmaster_backlog.csv";
    doc.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function renderChecklist(card, items, taskKey) {
    const container = card.querySelector(".tm-checklist");
    if (!container) return;

    container.innerHTML = '<div class="tm-checklist-title">Auto-generated checklist</div>';
    const savedState = JSON.parse(localStorage.getItem(`${CHECK_PREFIX}${taskKey}`) || "{}");

    items.forEach((itemText, idx) => {
      const row = card.ownerDocument.createElement("label");
      row.className = "tm-checklist-item";

      const checkbox = card.ownerDocument.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!savedState[idx];
      checkbox.addEventListener("change", () => {
        savedState[idx] = checkbox.checked;
        localStorage.setItem(`${CHECK_PREFIX}${taskKey}`, JSON.stringify(savedState));
      });

      const text = card.ownerDocument.createElement("span");
      text.textContent = itemText;

      row.append(checkbox, text);
      container.appendChild(row);
    });
  }

  function attachCardFeatures(doc, card, status) {
    if (card.dataset.tmEnhanced === "1") return;
    card.dataset.tmEnhanced = "1";

    const taskKey = getTaskKey(card);

    const actions = doc.createElement("div");
    actions.className = "tm-actions";

    const addCalendarBtn = doc.createElement("button");
    addCalendarBtn.className = "tm-btn";
    addCalendarBtn.textContent = "Add to Calendar";
    addCalendarBtn.type = "button";

    const shareTeamsBtn = doc.createElement("button");
    shareTeamsBtn.className = "tm-btn";
    shareTeamsBtn.textContent = "Share to Teams";
    shareTeamsBtn.type = "button";

    const descriptionField = doc.createElement("textarea");
    descriptionField.className = "tm-description";
    descriptionField.placeholder = "Task description (used for Calendar, Teams, and checklist)";
    descriptionField.value = localStorage.getItem(`${DESC_PREFIX}${taskKey}`) || "";

    const checklistWrap = doc.createElement("div");
    checklistWrap.className = "tm-checklist";
    checklistWrap.innerHTML = '<div class="tm-checklist-title">Auto-generated checklist</div>';

    descriptionField.addEventListener("input", () => {
      localStorage.setItem(`${DESC_PREFIX}${taskKey}`, descriptionField.value.trim());
    });

    addCalendarBtn.addEventListener("click", () => {
      const meta = getTaskMeta(card, status);
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.set("action", "TEMPLATE");
      url.searchParams.set("text", meta.title);
      url.searchParams.set("details", meta.description);
      window.open(url.toString(), "_blank", "noopener");
    });

    shareTeamsBtn.addEventListener("click", async () => {
      const meta = getTaskMeta(card, status);
      const summary = `New Task: ${meta.title} | Priority: ${meta.priority}`;
      try {
        await navigator.clipboard.writeText(summary);
      } catch (_error) {
        // Best effort clipboard copy only.
      }
      window.open("https://teams.microsoft.com", "_blank", "noopener");
    });

    actions.append(addCalendarBtn, shareTeamsBtn);
    card.append(actions, descriptionField, checklistWrap);

    const description = descriptionField.value.trim() || card.querySelector("strong")?.textContent || "";
    window.ChecklistSkill.generateChecklist(description).then((items) => {
      renderChecklist(card, items, taskKey);
    });
  }

  function attachGlobalControls(doc) {
    if (doc.querySelector(".tm-controls")) return;

    const headerAnchor = doc.querySelector('[data-testid="stAppViewContainer"] .block-container') || doc.body;
    const controls = doc.createElement("div");
    controls.className = "tm-controls";

    const bgBtn = doc.createElement("button");
    bgBtn.className = "tm-btn";
    bgBtn.type = "button";
    bgBtn.textContent = "Customize Background";

    const exportBtn = doc.createElement("button");
    exportBtn.className = "tm-btn";
    exportBtn.type = "button";
    exportBtn.textContent = "Export Backlog";

    const fileInput = doc.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    bgBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = String(reader.result || "");
        localStorage.setItem(BG_KEY, imageData);
        applyBackground(doc, imageData);
      };
      reader.readAsDataURL(file);
    });

    exportBtn.addEventListener("click", () => exportBacklog(doc));

    controls.append(bgBtn, exportBtn, fileInput);
    headerAnchor.prepend(controls);
  }

  function applyBackground(doc, imageData) {
    if (!imageData) return;
    const board = getBoardContainer(doc);
    board.classList.add("tm-board-bg");
    board.style.backgroundImage = `url("${imageData}")`;
    board.style.backgroundSize = "cover";
    board.style.backgroundPosition = "center";
  }

  function enhanceAll(doc) {
    attachGlobalControls(doc);

    const statusMap = getStatusMap(doc);
    statusMap.forEach((status, card) => attachCardFeatures(doc, card, status));
  }

  function init() {
    const doc = window.parent?.document || document;

    const savedImage = localStorage.getItem(BG_KEY);
    if (savedImage) {
      applyBackground(doc, savedImage);
    }

    enhanceAll(doc);

    const observer = new MutationObserver(() => {
      enhanceAll(doc);
    });

    observer.observe(doc.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
