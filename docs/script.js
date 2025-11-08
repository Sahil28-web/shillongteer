// --- script.js (Final Clean Version) ---

// Fetch and display results
fetch('results.json?_=' + new Date().getTime())
  .then(res => res.json())
  .then(results => {
    const body = document.getElementById('result-body');
    if (!body) return;

    // Get today's date in same format as your JSON
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'short' });
    const year = today.getFullYear();
    const todayStr = `${day} ${month} ${year}`;

    // Check if today's date exists in results.json
    const todayExists = results.items.some(item => item.Date === todayStr);

    // If not found, auto-create blank sessions for today
    if (!todayExists) {
      results.items.unshift({
        Date: todayStr,
        Sessions: [
          { Session: "Morning", FR: "", SR: "" },
          { Session: "Afternoon", FR: "", SR: "" },
          { Session: "Evening", FR: "", SR: "" }
        ]
      });
    }

    // Clear previous display
    body.innerHTML = '';

    // Show all results (latest first)
    results.items.forEach(item => {
      const dateEl = document.createElement('h3');
      dateEl.className = 'date-title';
      dateEl.textContent = `${item.Date}`;
      body.appendChild(dateEl);

      if (item.Sessions) {
        const table = document.createElement('table');
        table.className = 'result-table';

        const header = document.createElement('tr');
        header.innerHTML = '<th>Session</th><th>FR</th><th>SR</th>';
        table.appendChild(header);

        item.Sessions.forEach(session => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${session.Session}</td>
            <td>${session.FR || '-'}</td>
            <td>${session.SR || '-'}</td>
          `;
          table.appendChild(tr);
        });

        body.appendChild(table);
      }
    });
  })
  .catch(err => {
    console.error('Error loading results:', err);
    document.getElementById('result-body').innerHTML =
      '<p>Failed to load results. Please refresh later.</p>';
  });
