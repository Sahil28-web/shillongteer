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

// Load common.json into #common-number-box
fetch("common.json?_=" + new Date().getTime())
  .then((res) => res.json())
  .then((data) => {
    const box = document.getElementById("common-number-box");
    if (!box) return;
    const items = data && Array.isArray(data.items) ? data.items : [];
    if (!items.length) {
      box.textContent = "No data";
      return;
    }
    const latest = items
      .slice()
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
    const rows = Array.isArray(latest.Rows) ? latest.Rows : [];
    const header = `${latest.Place ? latest.Place + " – " : ""}${latest.Date || ""}`;
    const rowsHtml = rows
      .map(
        (r) => `
        <tr>
          <td>${r.Direct || "--"}</td>
          <td>${r.House || "--"}</td>
          <td>${r.Ending || "--"}</td>
        </tr>`
      )
      .join("");
    box.innerHTML = `
      <div><strong>${header}</strong></div>
      <table>
        <thead>
          <tr><th>Direct</th><th>House</th><th>Ending</th></tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>`;
  })
  .catch((err) => {
    console.error("Error loading common numbers:", err);
    const box = document.getElementById("common-number-box");
    if (box) box.textContent = "Error loading";
  });
