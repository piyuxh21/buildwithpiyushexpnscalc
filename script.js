// --- Category Definitions ---
const categories = [
    { name: 'Seeds', color: '#23511e', legend: 'bg-green-900', icon: '🌱' },
    { name: 'Fertilizer', color: '#e6d7b0', legend: 'bg-[#e6d7b0]', icon: '🧪' },
    { name: 'Other', color: '#d6b95c', legend: 'bg-[#d6b95c]', icon: '🔔' }
    // Add more categories here as needed
];

// --- Data Model ---
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let expenses = [];
// Load from localStorage if available
if (localStorage.getItem('expenses')) {
    try { expenses = JSON.parse(localStorage.getItem('expenses')); } catch { expenses = []; }
}
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// --- Section switching logic ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const newSection = document.getElementById(sectionId);
    const currentSection = Array.from(sections).find(sec => !sec.classList.contains('hidden'));
    if (currentSection && currentSection !== newSection) {
        currentSection.classList.remove('opacity-100');
        currentSection.classList.add('opacity-0');
        setTimeout(() => {
            currentSection.classList.add('hidden');
            newSection.classList.remove('hidden');
            setTimeout(() => {
                newSection.classList.remove('opacity-0');
                newSection.classList.add('opacity-100');
                if(sectionId === 'section-add') setupCategoryDropdown();
            }, 10);
        }, 300);
    } else {
        sections.forEach(sec => sec.classList.add('hidden', 'opacity-0'));
        newSection.classList.remove('hidden', 'opacity-0');
        newSection.classList.add('opacity-100');
        if(sectionId === 'section-add') setupCategoryDropdown();
    }
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.querySelector('.nav-dot').classList.add('opacity-0');
        btn.querySelector('.nav-dot').classList.remove('opacity-100');
        btn.querySelector('.nav-icon').classList.remove('text-green-700');
    });
    let activeBtn = null;
    if(sectionId === 'section-dashboard') activeBtn = document.getElementById('nav-dashboard');
    if(sectionId === 'section-add') activeBtn = document.getElementById('nav-add');
    if(sectionId === 'section-reports') activeBtn = document.getElementById('nav-reports');
    if(sectionId === 'section-expenses') activeBtn = document.getElementById('nav-expenses');
    if(activeBtn) {
        activeBtn.querySelector('.nav-dot').classList.remove('opacity-0');
        activeBtn.querySelector('.nav-dot').classList.add('opacity-100');
        activeBtn.querySelector('.nav-icon').classList.add('text-green-700');
    }
    // Focus first input for accessibility
    if(sectionId === 'section-add') setTimeout(() => { document.getElementById('expense-amount').focus(); }, 200);
}
showSection('section-dashboard');

// --- Render Functions ---
function renderDashboard() {
    // Donut chart data
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const monthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    // Donut chart SVG
    const donut = document.getElementById('donut-chart');
    const donutLegend = document.getElementById('donut-legend');
    const barChart = document.getElementById('bar-chart');
    if (donut) {
        let donutData = categories.map(cat => ({ color: cat.color, value: monthExpenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0) }));
        let circumference = 2 * Math.PI * 16;
        let offset = 0;
        donut.innerHTML = '';
        let totalValue = donutData.reduce((sum, d) => sum + d.value, 0) || 1;
        donutData.forEach((d, i) => {
            let val = d.value / totalValue * circumference;
            donut.innerHTML += `<circle cx="18" cy="18" r="16" fill="none" stroke="${d.color}" stroke-width="4" stroke-dasharray="${val},${circumference-val}" stroke-dashoffset="${offset}"/>`;
            offset -= val;
        });
        // Donut center
        const totalExpense = document.getElementById('total-expense');
        if (totalExpense) totalExpense.textContent = `₹ ${total.toLocaleString()}`;
    }
    if (donutLegend) {
        donutLegend.innerHTML = categories.map(cat => {
            const sum = monthExpenses.filter(e => e.category === cat.name).reduce((s, e) => s + e.amount, 0);
            return `<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full ${cat.legend} inline-block"></span> ${cat.name} <span class="ml-2 font-semibold">₹${sum.toLocaleString()}</span></div>`;
        }).join('');
    }
    if (barChart) {
        barChart.innerHTML = '';
        let months = [];
        for(let i=0; i<7; i++) {
            let m = (thisMonth - 6 + i + 12) % 12;
            let y = thisYear;
            if (thisMonth - 6 + i < 0) y--;
            months.push({ m, y });
        }
        let maxVal = 0;
        let monthTotals = months.map(({m, y}) => {
            let sum = expenses.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === m && d.getFullYear() === y;
            }).reduce((s, e) => s + e.amount, 0);
            if(sum > maxVal) maxVal = sum;
            return sum;
        });
        months.forEach(({m}, i) => {
            let h = maxVal ? Math.round((monthTotals[i] / maxVal) * 64) : 8;
            barChart.innerHTML += `
                <div class="flex flex-col items-center w-6">
                    <div class="bg-green-900 w-4 rounded-t" style="height:${h}px"></div>
                    <span class="text-xs mt-1">${monthNames[m]}</span>
                </div>
            `;
        });
    }
}

function renderReports() {
    const reportsList = document.getElementById('reports-list');
    if (expenses.length === 0) {
        reportsList.innerHTML = '<div class="text-center text-gray-400 py-4">No expenses yet.</div>';
        return;
    }
    let sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    reportsList.innerHTML = sorted.map(e => `
        <div class="flex items-center justify-between py-1 border-b last:border-b-0">
            <span class="text-sm">${new Date(e.date).getDate()} ${monthNames[new Date(e.date).getMonth()]}</span>
            <span class="flex items-center gap-1 text-sm">${e.category === 'Seeds' ? '🌾' : e.category === 'Fertilizer' ? '🌾' : '🐝'} ${e.category}${e.note ? `<span class='ml-1 text-xs text-gray-400' title='${e.note}'>📝</span>` : ''}</span>
            <span class="text-sm font-semibold">₹${e.amount.toLocaleString()}</span>
        </div>
        ${e.note ? `<div class='text-xs text-gray-500 pl-8 pb-1 italic'>${e.note}</div>` : ''}
    `).join('');
}

function renderExpenses() {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = categories.map(cat => {
        let sum = expenses.filter(e => e.category === cat.name).reduce((s, e) => s + e.amount, 0);
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><span class="text-lg">${cat.icon}</span> ${cat.name}</div>
                <span class="font-semibold">${sum.toLocaleString()}</span>
            </div>
        `;
    }).join('');
}

function renderAll() {
    renderDashboard();
    renderReports();
    renderExpenses();
}

// --- Add Expense Form ---
const addExpenseForm = document.getElementById('add-expense-form');
const feedback = document.getElementById('form-feedback');
function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'fixed bottom-28 left-1/2 -translate-x-1/2 bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg text-lg animate-bounce z-50';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
addExpenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('expense-category').value;
    const amount = parseInt(document.getElementById('expense-amount').value, 10);
    const date = document.getElementById('expense-date').value;
    const note = document.getElementById('expense-note').value.trim();
    if (!category || !amount || !date || amount < 1) {
        showToast('Please fill all fields with valid values.');
        return;
    }
    expenses.push({ category, amount, date, note });
    saveExpenses();
    renderAll();
    showSection('section-dashboard');
    addExpenseForm.reset();
    showToast('🌾 Expense Added!');
});

// --- Default date to today and restrict to today only ---
function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const dateInput = document.getElementById('expense-date');
    dateInput.value = todayStr;
    dateInput.min = todayStr;
    dateInput.max = todayStr;
}
document.getElementById('nav-add').addEventListener('click', setDefaultDate);
var addExpenseBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent && btn.textContent.trim() === 'Add Expense');
if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', setDefaultDate);
}
// Set on page load as well
setDefaultDate();

// --- PDF Download ---
document.getElementById('download-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Farmer Expense Tracker - Reports', 10, 15);
    doc.setFontSize(10);
    let y = 25;
    doc.text('Date', 10, y);
    doc.text('Category', 40, y);
    doc.text('Amount', 100, y);
    doc.text('Note', 130, y);
    y += 5;
    let sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(e => {
        doc.text(`${new Date(e.date).getDate()} ${monthNames[new Date(e.date).getMonth()]}`, 10, y);
        doc.text(e.category, 40, y);
        doc.text(`₹${e.amount.toLocaleString()}`, 100, y);
        doc.text(e.note || '', 130, y, { maxWidth: 60 });
        y += 6;
        if (y > 270) { doc.addPage(); y = 15; }
    });
    doc.save('farmer-expense-reports.pdf');
});

// --- Clear All Data ---
document.getElementById('clear-data').addEventListener('click', function() {
    if (confirm('Are you sure you want to erase all expenses? This cannot be undone.')) {
        expenses = [];
        localStorage.removeItem('expenses');
        renderAll();
    }
});

// --- Custom Dropdown for Category ---
function setupCategoryDropdown() {
    const btn = document.getElementById('dropdown-btn');
    const list = document.getElementById('dropdown-list');
    const selected = document.getElementById('dropdown-selected');
    const input = document.getElementById('expense-category');
    // Populate dropdown list
    list.innerHTML = categories.map(cat => `<li class="px-4 py-2 hover:bg-green-100 cursor-pointer" data-value="${cat.name}" role="option">${cat.icon} ${cat.name}</li>`).join('');
    // Set default
    selected.textContent = categories[0].icon + ' ' + categories[0].name;
    input.value = categories[0].name;
    let open = false;
    btn.onclick = function(e) {
        e.stopPropagation();
        open = !open;
        list.classList.toggle('hidden', !open);
        btn.setAttribute('aria-expanded', open);
    };
    list.querySelectorAll('li').forEach(item => {
        item.onclick = function() {
            selected.textContent = this.textContent;
            input.value = this.getAttribute('data-value');
            open = false;
            list.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        };
    });
    // Remove previous click event to avoid stacking
    document.removeEventListener('click', closeDropdown, true);
    function closeDropdown() {
        open = false;
        list.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    }
    document.addEventListener('click', closeDropdown, true);
    // Keyboard navigation
    btn.onkeydown = function(e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open = true;
            list.classList.remove('hidden');
            btn.setAttribute('aria-expanded', 'true');
            list.querySelector('li').focus();
        }
    };
    list.querySelectorAll('li').forEach((item, idx, arr) => {
        item.setAttribute('tabindex', '0');
        item.onkeydown = function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                (arr[idx+1]||arr[0]).focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                (arr[idx-1]||arr[arr.length-1]).focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        };
    });
}

// --- Welcome Screen Logic ---
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeNext = document.getElementById('welcome-next');
if (welcomeScreen && welcomeNext) {
    welcomeNext.addEventListener('click', function() {
        welcomeScreen.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
        setTimeout(() => welcomeScreen.style.display = 'none', 700);
    });
}

// --- Initial Render ---
renderAll();
