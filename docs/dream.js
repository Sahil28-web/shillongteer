// Fetch and render dream numbers
fetch('dream.json')
  .then(r => r.json())
  .then(raw => {
    const body = document.getElementById('dream-body');
    const search = document.getElementById('dream-search');
    const fieldSel = document.getElementById('dream-field');
    const clearBtn = document.getElementById('dream-clear');
    const countEl = document.getElementById('dream-count');
    if (!body) return;

    const data = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.items) ? raw.items : []);

    function normalize(v) {
      return String(v || '').toLowerCase();
    }

    // 🌈 Apply colors to the Direct, House, and Ending values
    function colorize(type, value) {
      const colorMap = {
        direct: '#2e8b57', // green
        house: '#1e90ff',  // blue
        ending: '#ff6347'  // red-orange
      };
      const color = colorMap[type] || '#000';
      return `<span style="color:${color}; font-weight:600;">${value}</span>`;
    }

    function rowHtml(x) {
      const direct = (x.direct || []).map(v => colorize('direct', v)).join(', ');
      const house = (x.house || []).map(v => colorize('house', v)).join(', ');
      const ending = (x.ending || []).map(v => colorize('ending', v)).join(', ');
      return `<tr>
        <td>${x.sl ?? ''}</td>
        <td>${x.dream ?? ''}</td>
        <td>${direct}</td>
        <td>${house}</td>
        <td>${ending}</td>
      </tr>`;
    }

    function render(list) {
      if (!list || list.length === 0) {
        body.innerHTML = '<tr><td colspan="5">No results</td></tr>';
        if (countEl) countEl.textContent = '0 matches';
        return;
      }
      body.innerHTML = list.map(rowHtml).join('');
      if (countEl) countEl.textContent = `${list.length} match${list.length === 1 ? '' : 'es'}`;
    }

    function matches(q, x, field) {
      if (!q) return true;
      const dream = normalize(x.dream);
      const direct = normalize((x.direct || []).join(' '));
      const house = normalize((x.house || []).join(' '));
      const ending = normalize((x.ending || []).join(' '));
      const sl = String(x.sl ?? '');
      if (field === 'dream') return dream.includes(q);
      if (field === 'direct') return direct.includes(q);
      if (field === 'house') return house.includes(q);
      if (field === 'ending') return ending.includes(q);
      return dream.includes(q) || direct.includes(q) || house.includes(q) || ending.includes(q) || sl.includes(q);
    }

    let debounceId;
    function filterAndRender() {
      const q = normalize(search ? search.value : '');
      const field = fieldSel ? fieldSel.value : 'all';
      const run = () => {
        const filtered = data
          .slice()
          .sort((a, b) => (a.sl ?? 0) - (b.sl ?? 0))
          .filter(x => matches(q, x, field));
        render(filtered);
      };
      clearTimeout(debounceId);
      debounceId = setTimeout(run, 120);
    }

    // Initial render
    render(data);

    if (search) {
      search.addEventListener('input', filterAndRender);
    }
    if (fieldSel) {
      fieldSel.addEventListener('change', filterAndRender);
    }
    if (clearBtn && search) {
      clearBtn.addEventListener('click', () => { search.value = ''; filterAndRender(); });
    }
  })
  .catch(err => {
    const body = document.getElementById('dream-body');
    if (body) {
      body.innerHTML = '<tr><td colspan="5">Failed to load dream.json</td></tr>';
    }
    console.error('Error loading dream.json', err);
  });
