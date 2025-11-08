// script.js — Shillong Teer Auto Update System

const sessions = ["Morning", "Afternoon", "Evening"];
const today = new Date();
const todayStr = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).replace(/ /g, " ");

// Fetch results.json
fetch("results.json?_=" + new Date().getTime())
  .then((r) => r.json())
  .then((data) => {
    // --- Step 1: Ensure today's blank entries exist for all sessions ---
    const existingDates = data.map((e) => e.Date);
    const hasToday = existingDates.includes(todayStr);

    if (!hasToday) {
      sessions.forEach((s) => {
        data.unshift({
          Date: todayStr,
          Session: s,
          FR: "-",
          SR: "-",
        });
      });
    }

    // --- Step 2: Display current session result (e.g., Morning.html) ---
    const page = window.location.pathname.toLowerCase();
    let session = "Morning";
    if (page.includes("afternoon")) session = "Afternoon";
    if (page.includes("evening")) session = "Evening";

    const latest = data.find((e) => e.Date === todayStr && e.Session === session);

    if (latest) {
      const fr = document.getElementById("fr");
      const sr = document.getElementById("sr");
      const dateEl = document.getElementById("result-date");

      if (fr) fr.textContent = latest.FR !== "-" ? latest.FR : "-";
      if (sr) sr.textContent = latest.SR !== "-" ? latest.SR : "-";
      if (dateEl) dateEl.textContent = todayStr;
    }

    // --- Step 3: Handle Previous Results Page ---
    const prevTable = document.getElementById("prev-body");
    if (prevTable) {
      const sel = document.getElementById("session-select");
      const loadBtn = document.getElementById("load-more");
      let visible = 10;

      function render(sessionFilter) {
        prevTable.innerHTML = "";
        const filtered = data.filter((e) => e.Session === sessionFilter);
        filtered.slice(0, visible).forEach((e) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${e.Session}</td>
            <td>${e.Date}</td>
            <td>${e.FR}</td>
            <td>${e.SR}</td>
          `;
          prevTable.appendChild(row);
        });
      }

      sel.addEventListener("change", () => {
        visible = 10;
        render(sel.value);
      });

      loadBtn.addEventListener("click", () => {
        visible += 10;
        render(sel.value);
      });

      render(sel.value);
    }

    // --- Step 4: Save updated results.json (for GitHub Pages we just simulate) ---
    console.log("Data updated locally for display:", data);
  })
  .catch((err) => console.error("Error loading results.json:", err));
