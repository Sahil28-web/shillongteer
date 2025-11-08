// script.js — Cleaned + fixed version (no fake XX, keeps all results)

// Format today's date like "08 Nov 2025"
function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = today.toLocaleString("en-US", { month: "short" });
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

const sessions = ["Morning", "Afternoon", "Evening"];
const today = getTodayDate();

// Load results.json
fetch("results.json?_=" + new Date().getTime())
  .then((res) => res.json())
  .then((data) => {
    if (!Array.isArray(data)) data = [];

    let updated = false;

    // Add today's blank entries if missing
    sessions.forEach((session) => {
      const exists = data.some(
        (r) => r.Date === today && r.Session === session
      );
      if (!exists) {
        data.unshift({ Date: today, Session: session, FR: "", SR: "" });
        updated = true;
      }
    });

    // Show current session results (for index/afternoon/evening.html)
    if (typeof sessionName !== "undefined") {
      const sessionData = data.find(
        (r) => r.Date === today && r.Session === sessionName
      );
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
        dateEl.textContent = sessionData ? sessionData.Date : today;
      }

      // Fill last results table for this session
      const tbody = document.getElementById("results-body");
      if (tbody) {
        const filtered = data
          .filter((r) => r.Session === sessionName)
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

    if (updated) console.log("Auto-added today's blank entries:", today);
  })
  .catch((err) => {
    console.error("Error loading results:", err);
    const allBody = document.getElementById("all-results-body");
    if (allBody)
      allBody.innerHTML = `<tr><td colspan="4">Error loading results</td></tr>`;
  });
