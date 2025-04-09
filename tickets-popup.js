// Note: 'ticketData' is declared in tickets-script.js. Do not redeclare it here.

function showPopupList(event, items, onSelect) {
  hidePopup();

  const popup = document.createElement('div');
  popup.className = 'ticket-popup';

  // TEMP: Debug border and background
  popup.style.border = '2px solid red';
  popup.style.backgroundColor = 'white';
  popup.style.display = 'block';

  const list = document.createElement('ul');

  // Sort items alphabetically, case-insensitive
  const sortedItems = [...items].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  sortedItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.onclick = (e) => {
      e.stopPropagation(); // prevent closing from outside click
      onSelect(item);
      hidePopup();
    };
    list.appendChild(li);
  });

  popup.appendChild(list);
  document.body.appendChild(popup);

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  popup.style.position = 'absolute';
  popup.style.left = `${mouseX}px`;
  popup.style.top = `${mouseY}px`;
  popup.style.zIndex = 9999;

  console.log("Popup element added to DOM:", popup.outerHTML);

  // Delay outside click registration to avoid immediate removal
  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler, { once: true });
  }, 0);
}

function outsideClickHandler(e) {
  const popup = document.querySelector('.ticket-popup');
  if (popup && !popup.contains(e.target)) hidePopup();
}

function hidePopup() {
  const existing = document.querySelector('.ticket-popup');
  if (existing) existing.remove();
}