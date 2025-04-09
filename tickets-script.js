let data = [];
let selectedTicket = null;

// Initialize global button handlers
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('global-remove-btn').addEventListener('click', removeSelectedTicket);
  document.getElementById('global-duplicate-btn').addEventListener('click', duplicateSelectedTicket);
  document.getElementById('global-new-btn').addEventListener('click', addTicket);
});

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    addTicket();
  });

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
  const value = prompt('Enter a number from 4 to 9');
  const num = parseInt(value);
  if (num >= 4 && num <= 9) {
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