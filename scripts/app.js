const rules = {
    desc: \(/^\S\)(?:\(.*\S\))?\$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?\$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|\d|3)\$/,
    duplicate: /\b(\w+)\s+\1\b/i
};

let records = JSON.parse(localStorage.getItem('student_records')) || [];
let activeCurrency = 'USD';
let budgetCap = 500;
const rates = { 
    USD: 1, 
    EUR: 0.92, 
    XAF: 584.70, 
    RWF: 1300
};
const tableBody = document.getElementById('table-body');
const capAlert = document.getElementById('cap-alert');

function render() {
    tableBody.innerHTML = '';
    let total = 0;
    let cats = {};
    const searchVal = document.getElementById('search-box').value;
    let searchRegex = null;
    try { 
        if (searchVal) searchRegex = new RegExp(`(${searchVal})`, 'gi'); 
    } catch (e) {
    }
    
    records.forEach(r => {
        total += Number(r.amount);
        cats[r.category] = (cats[r.category] || 0) + Number(r.amount);
        let displayDesc = r.description;
        if (searchRegex) {
            displayDesc = r.description.replace(searchRegex, '<mark>\$1</mark>');
        }
        const convAmount = (r.amount * rates[activeCurrency]).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${displayDesc}</td>
            <td>${convAmount} ${activeCurrency}</td>
            <td>${r.category}</td>
            <td>${r.date}</td>
            <td><button type="button" onclick="deleteRecord('${r.id}')">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
    document.getElementById('stat-count').textContent = records.length;
    document.getElementById('stat-total').textContent = (total * rates[activeCurrency]).toFixed(2);
    let topCat = 'None';
    let maxSpent = 0;
    for (let c in cats) {
        if (cats[c] > maxSpent) {
            maxSpent = cats[c];
            topCat = c;
        }
    }
    document.getElementById('stat-top').textContent = topCat;
    if (total > budgetCap) {
        capAlert.textContent = `ALERT: Budget exceeded by ${(total - budgetCap).toFixed(2)} USD!`;
        capAlert.style.color = "red";
        capAlert.setAttribute('aria-live', 'assertive');
    } else {
        capAlert.textContent = `Safe. ${(budgetCap - total).toFixed(2)} USD remaining.`;
        capAlert.style.color = "green";
        capAlert.setAttribute('aria-live', 'polite');
    }
    localStorage.setItem('student_records', JSON.stringify(records));
    buildChart();
}
function buildChart() {
    const container = document.getElementById('chart-container');
    container.innerHTML = '';
    records.slice(-7).forEach(r => {
        const bar = document.createElement('div');
        const heightPercent = (r.amount / budgetCap) * 100;
        bar.style.height = `${Math.min(Math.max(heightPercent, 15), 100)}%`;
        bar.style.width = '20px';
        bar.style.backgroundColor = '#2563eb';
        bar.setAttribute('title', `${r.description}: ${r.amount}`);
        container.appendChild(bar);
    });
}
document.getElementById('finance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const desc = document.getElementById('tx-desc').value.trim();
    const amount = document.getElementById('tx-amount').value;
    const date = document.getElementById('tx-date').value;
    const cat = document.getElementById('tx-cat').value;

    if (!rules.desc.test(desc) || rules.duplicate.test(desc)) {
        return alert("Invalid description or duplicate words detected.");
    }
    if (!rules.amount.test(amount)) {
        return alert("Invalid numeric amount format.");
    }
    if (!rules.date.test(date)) {
        return alert("Invalid date template (YYYY-MM-DD).");
    }
    records.push({ 
        id: 'rec_' + Date.now(), 
        description: desc, 
        amount: Number(amount), 
        category: cat, 
        date: date 
    });
    this.reset();
    render();
});
window.deleteRecord = function(id) {
    if (confirm("Delete this record permanently?")) {
        records = records.filter(r => r.id !== id);
        render();
    }
};

document.getElementById('search-box').addEventListener('input', render);
document.getElementById('sort-date').addEventListener('click', () => { 
    records.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    render(); 
});
document.getElementById('sort-amount').addEventListener('click', () => { 
    records.sort((a, b) => a.amount - b.amount); 
    render(); 
});
document.getElementById('currency-select').addEventListener('change', function() { 
    activeCurrency = this.value; 
    document.getElementById('active-currency').textContent = this.value; 
    render(); 
});
document.getElementById('budget-cap').addEventListener('input', function() { 
    budgetCap = Number(this.value) || 500; 
    render(); 
});
document.getElementById('export-json').addEventListener('click', () => {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const a = document.createElement('a'); 
    a.href = data; 
    a.download = "seed.json"; 
    a.click();
});
document.getElementById('import-json').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        try { 
            const parsed = JSON.parse(evt.target.result);
            if (Array.isArray(parsed)) {
                records = parsed; 
                render(); 
            } else {
                alert("Invalid structural format.");
            }
        } catch(err) { 
            alert("Bad file tracking data syntax."); 
        }
    };
    reader.readAsText(file);
});
document.getElementById('theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
});

render();
