let data = [];
let selectedTicket = null;
let printstyle = "";

// Initialize global button handlers
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('global-remove-btn').addEventListener('click', removeSelectedTicket);
  document.getElementById('global-duplicate-btn').addEventListener('click', duplicateSelectedTicket);
  document.getElementById('global-new-btn').addEventListener('click', addTicket);
  document.getElementById('global-labels-btn').addEventListener('click', showLabels);
});

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    addTicket();
  });

fetch('tickets-print-style.css')
  .then(response => response.text())
  .then(css => {
    printstyle = css;

    const btn = document.getElementById('global-print-tickets-btn');
    btn.disabled = false;

    btn.addEventListener('click', () => {
  const VALUE_STYLES = {
    3: { backgroundColor: '#ffffff', color: '#000000', border: '1px solid black' },
    4: { backgroundColor: '#fc8c03', color: '#ffffff' },
    5: { backgroundColor: '#0062ff', color: '#ffffff' },
    6: { backgroundColor: '#d60000', color: '#ffffff' },
    7: { backgroundColor: '#14c400', color: '#ffffff' },
    8: { backgroundColor: '#ffeb0d', color: '#000000' },
    9: { backgroundColor: '#be0dff', color: '#ffffff' }
  };

  const original = document.getElementById('ticket-list');
  const clone = original.cloneNode(true);

  // Apply inline styles only to .size-box elements for color printing
  clone.querySelectorAll('.size-box').forEach(box => {
    const val = box.getAttribute('data-value');
    if (val && VALUE_STYLES[val]) {
      const styles = VALUE_STYLES[val];
      Object.entries(styles).forEach(([key, value]) => {
        box.style[key] = value;
      });
      box.style.webkitPrintColorAdjust = 'exact';
      box.style.printColorAdjust = 'exact';
    }
  });

  const printContents = clone.innerHTML;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Tickets</title>
        <style>
          ${printstyle}
        </style>
        <style>
          /* Fallback overrides to enforce color printing */
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 100);
  };
});


  })
  .catch(err => {
    console.error('Could not load print stylesheet:', err);
  });


function showLabels() {
  const labelsData = [];

  document.querySelectorAll('.ticket-wrapper').forEach(wrapper => {
    const code = wrapper.querySelector('[data-type="code"]').innerText;
    const prodname = wrapper.querySelector('[data-type="prod"]').innerText;
    const date = wrapper.querySelector('[data-type="date"]').innerText;
    const size = wrapper.querySelector('.box-value').innerText;
    const count = parseInt(wrapper.querySelector('[data-type="count"]').innerText);

    // Push 'count' number of labels
    for (let i = 0; i < count; i++) {
      labelsData.push({ code, prodname, date, size });
    }
  });

  sessionStorage.setItem('labelsData', JSON.stringify(labelsData));
  window.location.href = 'labels.html';
}


function addTicket() {
  const template = document.getElementById('ticket-template');
  const clone = template.content.cloneNode(true);
  const wrapper = clone.querySelector('.ticket-wrapper');
  
  addListenersToTicket(wrapper);
  document.getElementById('ticket-list').appendChild(wrapper);
  
  // Select the newly created ticket
  setTimeout(() => {
    selectTicket(wrapper);
  }, 0);
}

function addListenersToTicket(wrapper) {
  wrapper.querySelector('[data-type="code"]').onclick = (e) => showCodePopup(e, wrapper);
  wrapper.querySelector('[data-type="prod"]').onclick = (e) => showProdPopup(e, wrapper);
  wrapper.querySelector('[data-type="box"]').onclick = () => showBoxPopup(wrapper);
  wrapper.querySelector('[data-type="count"]').onclick = () => showCountPopup(wrapper);
  wrapper.querySelector('[data-type="date"]').onclick = (e) => showDatePicker(e, wrapper);
  
  // Add click listener to select the ticket
  wrapper.addEventListener('click', () => selectTicket(wrapper));
}

function selectTicket(wrapper) {
  // Deselect previously selected ticket if any
  if (selectedTicket) {
    selectedTicket.classList.remove('selected-ticket');
  }
  
  // Select the new ticket
  wrapper.classList.add('selected-ticket');
  selectedTicket = wrapper;
}

function removeSelectedTicket() {
  if (!selectedTicket) return;
  
  const all = document.querySelectorAll('.ticket-wrapper');
  if (all.length > 1) {
    const nextTicket = selectedTicket.nextElementSibling || selectedTicket.previousElementSibling;
    selectedTicket.remove();
    if (nextTicket) selectTicket(nextTicket);
  } else {
    clearTicket(selectedTicket);
  }
}

function duplicateSelectedTicket() {
  if (!selectedTicket) return;
  
  const clone = selectedTicket.cloneNode(true);
  document.getElementById('ticket-list').appendChild(clone);
  addListenersToTicket(clone);
  selectTicket(clone);
}

function clearTicket(wrapper) {
  wrapper.querySelector('[data-type="code"]').innerText = '???-??-??-??';
  wrapper.querySelector('[data-type="prod"]').innerText = '# ?';
  wrapper.querySelector('[data-type="date"]').innerText = '#';
  wrapper.querySelector('.size-box').style.background = '#ccc';
  wrapper.querySelector('.size-box').removeAttribute('data-value');
  wrapper.querySelector('.box-value').innerText = '#';
  wrapper.querySelector('[data-type="count"]').innerText = '#';
  wrapper.querySelector('[data-type="month"]').innerText = '???';
}

function showCodePopup(event, wrapper) {
  const codes = data.map(d => d.code);
  showPopupList(event, codes, selected => {
    const entry = data.find(d => d.code === selected);
    if (entry) applyData(wrapper, entry);
  });
}

function showProdPopup(event, wrapper) {
  const names = data.map(d => d.name);
  showPopupList(event, names, selected => {
    const entry = data.find(d => d.name === selected);
    if (entry) applyData(wrapper, entry);
  });
}

function applyData(wrapper, entry) {
  const code = entry.code;
  const name = entry.name;

  const codeMatch = code.match(/(\D+)(\d)$/);
  const formattedCodePart = codeMatch ? codeMatch[1] : code;
  const number = codeMatch ? codeMatch[2] : '?';

  const formattedCode = `${formattedCodePart.slice(0, 3)}-${formattedCodePart.slice(3, 5)}-${formattedCodePart.slice(5, 7)}-${formattedCodePart.slice(7, 9)}`;

  wrapper.querySelector('[data-type="code"]').innerText = formattedCode;
  wrapper.querySelector('[data-type="prod"]').innerText = `${number} ${name}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB');
  wrapper.querySelector('[data-type="date"]').innerText = dateStr;

  const monthStr = now.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
  wrapper.querySelector('[data-type="month"]').innerText = monthStr;
}

function showBoxPopup(wrapper) {
  const value = prompt('Enter a number from 3 to 9');
  const num = parseInt(value);
  if (num >= 3 && num <= 9) {
    const box = wrapper.querySelector('.size-box');
    box.setAttribute('data-value', num);
    box.querySelector('.box-value').innerText = num;
  }
}

function showCountPopup(wrapper) {
  const value = prompt('Enter a count');
  const countSpan = wrapper.querySelector('[data-type="count"]');
  countSpan.innerText = value;
}

function showDatePicker(event, wrapper) {
  hidePopup();

  const popup = document.createElement('div');
  popup.className = 'ticket-popup';

  const input = document.createElement('input');
  input.type = 'date';
  input.style.fontSize = '1rem';
  input.style.width = '100%';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'OK';
  submitBtn.style.marginTop = '10px';
  submitBtn.style.width = '100%';

  submitBtn.onclick = () => {
    if (input.value) {
      const dateObj = new Date(input.value);
      const formatted = dateObj.toLocaleDateString('en-GB');
      wrapper.querySelector('[data-type="date"]').innerText = formatted;
      const month = dateObj.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
      wrapper.querySelector('[data-type="month"]').innerText = month;
      hidePopup();
    }
  };

  popup.appendChild(input);
  popup.appendChild(submitBtn);
  document.body.appendChild(popup);

  popup.style.left = `${event.clientX}px`;
  popup.style.top = `${event.clientY}px`;
  popup.style.position = 'absolute';
  popup.style.zIndex = 9999;

  input.focus();

  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler, { once: true });
  }, 0);
}