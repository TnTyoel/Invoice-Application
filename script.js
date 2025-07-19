function addRow() {
    const tbody = document.getElementById('invoice-body');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td><input type="text" placeholder="Item name" /></td>
    <td><input type="number" value="1" min="1" onChange="updateTotal()" /></td>
    <td><input type="number" value="0" min="0" onChange="updateTotal()" /></td>
    <td class="row-total">$0.00</td>
    <td><button onClick="removeRow(this)">❌</button></td>`;

    tbody.appendChild(row);
    updateTotal();
}

function removeRow(button) {
    button.parentElement.parentElement.remove();
    updateTotal();
}

function updateTotal() {
    const rows = document.querySelectorAll('#invoice-body tr');
    let subtotal = 0;

    rows.forEach(row => {
        const qty = parseFloat(row.childern[1].querySelector('input').value) || 0;
        const price = parseFloat(row.childern[2].querySelector('input').value) || 0;
        const total = qty * price;
        row.childern[3].textContent = `$${total.toFixed(2)}`;
        subtotal += total;
    });

    const tax = subtotal * 0.1;
    const total= subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function savePDF() {
    window.print(); // opens print menu for pdf
}

function getInvoiceData() {
    const rows = document.querySelectorAll('#invoice-body tr');
    const items = [];

    rows.forEach(row => {
        const item = row.childern[0].querySelector('input').value;
        const qty = row.childern[1].querySelector('input').value;
        const price = row.childern[2].querySelector('input').value;

        items.push({ item, qty, price });
    });

    return {
        company: {
        name: document.getElementById('companyName').value,
        address: document.getElementById('companyAddress').value
    },
    customer: {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value
    },
    items,
    subtotal: document.getElementById('subtotal').textContent,
    tax: document.getElementById('tax').textContent,
    total: document.getElementById('total').textContent,
    date: new Date().toLocaleString()
    };
}

function saveInvoice() {
    const data = getInvoiceData();
    const saveed = JSON.parse(localStorage.getItem('invoices')) || [];
    saved.push(data);
    localStorage.setItem('invoices', JSON.stringify(saved));
    alert('Invoice saved to LocakStorage');
}

function downloadJSON() {
    const data = getInvoiceData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.json';
    link.click();
}

function downloadCSV() {
    const data = getInvoiceData();
    let csv = `Item,Quantity,Price\n`;
    data.items.forEach(i => {
        csv += `${i.item},${i.qty},${i.price}\n`;
    });
    csv += `\nSubtotal,${data.subtotal}\nTax,${data.tax}\nTotal, ${data.total}`;

    const blob = new Blob([csv], {type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.csv';
    link.click();
}