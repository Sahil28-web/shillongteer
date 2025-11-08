// --- script.js ---
// Auto-manages results display and daily entries

async function loadResults() {
  try {
    const res = await fetch("results.json", { cache: "no-store" });
    const data = await res.json();

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, " ");

    // Sessions to check for each day
    const sessions = ["Morning", "Afternoon", "Evening"];

    // --- Step 1: Ensure today's entries exist ---
    const todayExists = data.items.some((item) => item.Date === formattedDate);
    if (!todayExists) {
      sessions.forEach((session) => {
        data.items.push({
          Date: formattedDate,
          Session: session,
          FR: "",
          SR: "",
        });
      });

      // Save new structure back to results.json
      await saveResults(data);
    }

    // --- Step 2: Display results ---
    renderResults(data.items);
  } catch (err) {
    console.error("Error loading results:", err);
  }
}

// Save updated results.json (requires write permission from backend or GitHub API)
async function saveResults(data) {
  // This part can’t actually write to GitHub directly from the browser.
  // If you deploy with Netlify or a backend, connect this via an API or GitHub Action.
  // For now, it just logs the new structure so you can copy & paste manually.
  console.log("Updated results.json:", JSON.stringify(data, null, 2));
}

// --- Step 3: Render the result table ---
function renderResults(items) {
  const container = document.getElementById("result-body");
  if (!container) return;

  container.innerHTML = "";

  items
    .slice()
    .reverse() // show latest first
    .forEach((item) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = item.Date;

      const sessionCell = document.createElement("td");
      sessionCell.textContent = item.Session;

      const frCell = document.createElement("td");
      frCell.textContent =
        item.FR && item.FR !== "xx" && item.FR !== "45" ? item.FR : "";

      const srCell = document.createElement("td");
      srCell.textContent =
        item.SR && item.SR !== "xx" && item.SR !== "45" ? item.SR : "";

      row.appendChild(dateCell);
      row.appendChild(sessionCell);
      row.appendChild(frCell);
      row.appendChild(srCell);

      container.appendChild(row);
    });
}

// --- Step 4: Run automatically ---
loadResults();

// Optional: Auto-refresh every 10 minutes
setInterval(loadResults, 10 * 60 * 1000);
