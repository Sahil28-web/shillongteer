// Fetch and render dream numbers
fetch('dream.json')
  .then(r => r.json())
  .then(raw => {
    const body = document.getElementById('dream-body');
    const search = document.getElementById('dream-search');
    const fieldSel = document.getElementById('dream-field');
    const clearBtn = document.getElementById('dream-clear');
    const countEl = document.getElementById('dream-count');
    if(!body) return

    let filtered = raw;
    function render() {
      body.innerHTML = "";
      filtered.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i+1}</td>
          <td>${r.Number}</td>
          <td>${r.Meaning}</td>
        `;
        body.appendChild(tr);
      });
      countEl.textContent = filtered.length;
    }

    function filter() {
      const s = search.value.trim().toLowerCase();
      const f = fieldSel.value;
      filtered = raw.filter(r => {
        if(!s) return true;
        if(f === 'number') return String(r.Number).includes(s);
        if(f === 'meaning') return r.Meaning.toLowerCase().includes(s);
        return true;
      });
      render();
    }

    search.addEventListener('input', filter);
    fieldSel.addEventListener('change', filter);
    clearBtn.addEventListener('click', () => {
      search.value = '';
      filter();
    });

    render();
  })
  .catch(err => {
    console.error('Error loading dream numbers', err);
  });

// Fetch and render common numbers
fetch('common.json')
  .then(r => r.json())
  .then(raw => {
    const body = document.getElementById('common-body');
    if(!body) return

    raw.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.Date}</td>
        <td>${item.Place}</td>
        <td>${item.Rows.map(r => `
          <div>Direct: ${r.Direct} | House: ${r.House} | Ending: ${r.Ending}</div>
        `).join('')}</td>
      `;
      body.appendChild(tr);
    });
  })
  .catch(err => {
    console.error('Error loading common numbers', err);
  });

// Fetch and render results
fetch('results.json')
  .then(r => r.json())
  .then(raw => {
    const body = document.getElementById('result-body');
    if(!body) return

    raw.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.Date}</td>
        <td>${item.Session}</td>
        <td>${item.FR}</td>
        <td>${item.SR}</td>
      `;
      body.appendChild(tr);
    });
  })
  .catch(err => {
    console.error('Error loading results', err);
  });
