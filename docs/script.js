// sessionName should be defined in each HTML page: "Morning", "Afternoon", "Evening"
function readInlineFallback(){
  try {
    const el = document.getElementById('results-fallback');
    if(!el) return [];
    const txt = el.textContent || el.innerText || '';
    if(!txt) return [];
    const parsed = JSON.parse(txt);
    return Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.items) ? parsed.items : []);
  } catch { return []; }
}

function getResultsData(){
  // Prefer network; fallback to inline JSON when blocked (e.g., file://)
  return fetch('results.json')
    .then(res => res.json())
    .catch(() => ({ items: readInlineFallback() }))
    .then(data => Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []));
}

getResultsData().then(items => {
    if(!items || items.length === 0) return;

    // Per-session section (only when sessionName is defined on the page)
    const hasSession = (typeof sessionName !== 'undefined' && sessionName);
    if(hasSession){
      const sessionData = items.filter(r => r.Session === sessionName)
                               .sort((a,b) => new Date(b.Date) - new Date(a.Date));
      const latest = sessionData[0] || {};
      const frEl = document.getElementById('fr');
      const srEl = document.getElementById('sr');
      const dtEl = document.getElementById('res-date');
      if(frEl) frEl.textContent = latest.FR || '–';
      if(srEl) srEl.textContent = latest.SR || '–';
      if(dtEl) dtEl.textContent = latest.Date || '–';

      // Last 5 table if present
      const lastEl = document.getElementById('results-body');
      if(lastEl){
        lastEl.innerHTML = '';
        sessionData.slice(0,5).forEach(r=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${r.Date}</td><td>${r.FR}</td><td>${r.SR}</td>`;
          lastEl.appendChild(tr);
        });
      }
    }
    // Also populate Evening 'today' fields on pages that include them (e.g., homepage)
    const frE = document.getElementById('fr-evening');
    const srE = document.getElementById('sr-evening');
    const dtE = document.getElementById('res-date-evening');
    if(frE || srE || dtE){
      const eveningData = items.filter(r => r.Session === 'Evening')
                               .sort((a,b) => new Date(b.Date) - new Date(a.Date));
      const latestE = eveningData[0] || {};
      if(frE) frE.textContent = latestE.FR || '–';
      if(srE) srE.textContent = latestE.SR || '–';
      if(dtE) dtE.textContent = latestE.Date || '–';
    }

    // Previous results (all sessions)
    const allEl = document.getElementById('all-results-body');
    const resultsPage = document.getElementById('results-page');
    if(allEl){
      const allSorted = [...items].sort((a,b) => new Date(b.Date) - new Date(a.Date));
      const isHomeSnippet = document.querySelector('.previous-results-home') !== null && !resultsPage;

      if(isHomeSnippet){
        // Home: show previous results (exclude the latest per session)
        allEl.innerHTML = '';
        const latestBySession = {};
        for(const r of allSorted){
          if(!latestBySession[r.Session]) latestBySession[r.Session] = r;
        }
        allSorted.filter(r => latestBySession[r.Session] !== r).forEach(r=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${r.Session}</td><td>${r.Date}</td><td>${r.FR}</td><td>${r.SR}</td>`;
          allEl.appendChild(tr);
        });
      } else if(resultsPage) {
        // Results page: filter + pagination
        const filterSel = document.getElementById('session-filter');
        const loadMoreBtn = document.getElementById('load-more');
        let currentFilter = (filterSel && filterSel.value) || 'all';
        let shown = 0;
        const pageSize = 50;

        function getFiltered(){
          return currentFilter === 'all' ? allSorted : allSorted.filter(r => r.Session === currentFilter);
        }

        function render(reset=false){
          const source = getFiltered();
          if(reset){
            shown = 0;
            allEl.innerHTML = '';
          }
          const next = source.slice(shown, shown + pageSize);
          next.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.Session}</td><td>${r.Date}</td><td>${r.FR}</td><td>${r.SR}</td>`;
            allEl.appendChild(tr);
          });
          shown += next.length;
          if(loadMoreBtn){
            loadMoreBtn.style.display = shown < source.length ? 'inline-block' : 'none';
          }
        }

        if(filterSel){
          filterSel.addEventListener('change', () => {
            currentFilter = filterSel.value;
            render(true);
          });
        }
        if(loadMoreBtn){
          loadMoreBtn.addEventListener('click', () => render(false));
        }

        // initial render
        render(true);
      }
    }
    const commonBox = document.getElementById('common-number-box');
    if(commonBox){
      fetch('common.json')
        .then(r => r.json())
        .then(list => {
          const arr = Array.isArray(list) ? list : (list && Array.isArray(list.items) ? list.items : []);
          if(!arr || arr.length === 0) return;
          const latest = arr[0];
          const date = latest.Date || '';
          const place = (latest.Place || '').toUpperCase();
          const rows = Array.isArray(latest.Rows) ? latest.Rows : [];
          const r1 = rows[0] || { Direct: '', House: '', Ending: '' };
          const r2 = rows[1] || { Direct: '', House: '', Ending: '' };
          const html = `
            <div style="text-align:center; font-weight:700;">${date}</div>
            <div style="text-align:center; letter-spacing:1px; margin-bottom:6px;">${place}</div>
            <table>
              <thead>
                <tr><th>Direct</th><th>House</th><th>Ending</th></tr>
              </thead>
              <tbody>
                <tr><td>${r1.Direct || ''}</td><td>${r1.House || ''}</td><td>${r1.Ending || ''}</td></tr>
                <tr><td>${r2.Direct || ''}</td><td>${r2.House || ''}</td><td>${r2.Ending || ''}</td></tr>
              </tbody>
            </table>
            <div style="font-size:0.85rem; color: var(--muted); margin-top:6px;">Disclaimer : These common numbers are purely based on certain calculations done using past results. There is no guarantee of the accuracy of these numbers.</div>
          `;
          commonBox.innerHTML = html;
        })
        .catch(()=>{});
    }
  }).catch(err => console.error('Error loading results:', err));
