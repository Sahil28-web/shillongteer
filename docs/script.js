// script.js — Fixed version (Keeps old data + removes xx placeholders + auto date update)

document.addEventListener("DOMContentLoaded", async () => {
  const sessionName = typeof window.sessionName !== "undefined" ? window.sessionName : null;
  const frEl = document.getElementById("fr");
  const srEl = document.getElementById("sr");
  const dateEl = document.getElementById("res-date");
  const resultsBody = document.getElementById("results-body");
  const allResultsBody = document.getElementById("all-results-body");

  async function fetchResults() {
    try {
      const res = await fetch("results.json?v=" + Date.now());
      return await res.json();
    } catch {
      const fallback = document.getElementById("results-fallback");
      return fallback ? JSON.parse(fallback.textContent) : [];
    }
  }

  function formatResult(val) {
    return !val || val === "xx" ? "–" : val;
  }

  function getTodayDate() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = d.toLocaleString("en", { month: "short" });
    const yyyy = d.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  }

  async function init() {
    const data = await fetchResults();
    const today = getTodayDate();

    // Ensure today's entry exists for all sessions
    const sessions = ["Morning", "Afternoon", "Evening"];
    sessions.forEach((session) => {
      const hasToday = data.some((r) => r.Date === today && r.Session === session);
      if (!hasToday) {
        data.unshift({
          Date: today,
          Session: session,
          FR: "",
          SR: ""
        });
      }
    });

    // Update session-specific page (index.html, afternoon.html, evening.html)
    if (sessionName && frEl && srEl && dateEl) {
      const todayResult = data.find((r) => r.Date === today && r.Session === sessionName);
      frEl.textContent = formatResult(todayResult?.FR);
      srEl.textContent = formatResult(todayResult?.SR);
      dateEl.textContent = today;
    }

    // Update "Last Results" section (like in index.html or evening.html)
    if (resultsBody) {
      const filtered = data.filter((r) => r.Session === sessionName).slice(0, 10);
      resultsBody.innerHTML = filtered
        .map(
          (r) =>
            `<tr><td>${r.Date}</td><td>${formatResult(r.FR)}</td><td>${formatResult(r.SR)}</td></tr>`
        )
        .join("");
    }

    // Update "All Results" page (results.html)
    if (allResultsBody) {
      allResultsBody.innerHTML = data
        .map(
          (r) =>
            `<tr><td>${r.Session}</td><td>${r.Date}</td><td>${formatResult(
              r.FR
            )}</td><td>${formatResult(r.SR)}</td></tr>`
        )
        .join("");
    }
  }

  init();
});
