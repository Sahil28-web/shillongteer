// script.js — Cleaned + fixed version (no fake XX, keeps all results)

const sessions = ["Morning", "Afternoon", "Evening"];

// Load results.json
fetch("results.json?_=" + new Date().getTime())
  .then((res) => res.json())
  .then((data) => {
    if (!Array.isArray(data)) data = [];

    // Show current session results (for index/afternoon/evening.html)
    if (typeof sessionName !== "undefined") {
      const sessionData = data
        .filter((r) => r.Session === sessionName)
        .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
      const frEl = document.getElementById("fr");
      const srEl = document.getElementById("sr");
      const dateEl = document.getElementById("res-date");

      if (frEl && srEl && dateEl) {
        if (sessionData && (sessionData.FR || sessionData.SR)) {
          frEl.textContent = sessionData.FR || "--";
          srEl.textContent = sessionData.SR || "--";
        } else {
          frEl.textContent = "--";
          srEl.textContent = "--";
        }
        dateEl.textContent = sessionData ? sessionData.Date : "--";
      }

      // Fill last results table for this session
      const tbody = document.getElementById("results-body");
      if (tbody) {
        const filtered = data
          .filter((r) => r.Session === sessionName)
          .sort((a, b) => new Date(b.Date) - new Date(a.Date))
          .slice(0, 10);
        tbody.innerHTML = filtered
          .map(
            (r) => `
          <tr>
            <td>${r.Date}</td>
            <td>${r.FR || "--"}</td>
            <td>${r.SR || "--"}</td>
          </tr>`
          )
          .join("");
      }
    }

    // Show all results (for results.html)
    const allBody = document.getElementById("all-results-body");
    if (allBody) {
      const sorted = data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      allBody.innerHTML = sorted
        .map(
          (r) => `
          <tr>
            <td>${r.Session}</td>
            <td>${r.Date}</td>
            <td>${r.FR || "--"}</td>
            <td>${r.SR || "--"}</td>
          </tr>`
        )
        .join("");
    }
  })
  .catch((err) => {
    console.error("Error loading results:", err);
    const allBody = document.getElementById("all-results-body");
    if (allBody)
      allBody.innerHTML = `<tr><td colspan="4">Error loading results</td></tr>`;
  });
