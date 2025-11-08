// script.js — Shillong Teer Results (Fixed Version by GPT-5)

// Path to your results file (change if needed)
const RESULTS_FILE = 'results.json';

// Elements
const tableBody = document.querySelector('#results-body');
const sessionSelect = document.querySelector('#session-select');
const loadMoreBtn = document.querySelector('#load-more');

let allResults = [];
let shownCount = 0;
const BATCH_SIZE = 20;

// Utility — get today’s date in “DD MMM YYYY”
function getToday() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(',', '');
}

// Load JSON file without cache
async function loadJSON() {
  const response = await fetch(`${RESULTS_FILE}?v=${Date.now()}`);
  if (!response.ok) throw new Error('Failed to load results.json');
  return await response.json();
}

// Ensure today’s blank entries exist for all 3 sessions
function ensureTodayExists(data) {
  const today = getToday();
  const sessions = ['Morning', 'Evening', 'Night'];

  sessions.forEach(session => {
    const exists = data.some(r => r.Date === today && r.Session === session);
    if (!exists) {
      data.unshift({
        Session: session,
        Date: today,
        FR: '',
        SR: ''
      });
    }
  });

  return data;
}

// Render results in table
function renderResults(session) {
  const filtered = allResults.filter(r => r.Session === session);
  tableBody.innerHTML = '';

  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="4">No results found</td></tr>';
    return;
  }

  const nextBatch = filtered.slice(shownCount, shownCount + BATCH_SIZE);
  nextBatch.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.Session}</td>
      <td>${r.Date}</td>
      <td>${r.FR || '-'}</td>
      <td>${r.SR || '-'}</td>
    `;
    tableBody.appendChild(row);
  });

  shownCount += BATCH_SIZE;

  if (shownCount >= filtered.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// Initialize page
async function init() {
