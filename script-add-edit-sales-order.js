document.addEventListener('DOMContentLoaded', () => {
const sizeInputs = document.querySelectorAll('.size-input');
const rowTotals = document.querySelectorAll('.order-items tbody tr');
const qtyInput = document.getElementById('qty');
const totalPairsInput = document.getElementById('total-pairs');
const addRecordButton = document.querySelector('.add-record-button');
const orderItemsTableBody = document.querySelector('.order-items tbody');
const entryList = document.getElementById('entry-list');
const entryCountSpan = document.getElementById('entry-count');

const usernameElement = document.getElementById('username');
const logoutLink = document.getElementById('logoutLink');


// Check for cookies (or localStorage as fallback) and display username
    displayUsername();
	
// Function to display the username
    function displayUsername() {
        // First try to get from cookie
        let username = getCookie('phelan-username');
        
        // If not found in cookie, try localStorage as fallback
        if (!username) {
            username = localStorage.getItem('phelan-username');
        }
        
        // If username is found, display it
        if (username) {
            usernameElement.textContent = username;
        } else {
            // If no login info is found, redirect to login page
            console.log('No login information found. Redirecting to login page...');
            window.location.href = 'login.html';
        }
    }
    
    // Function to log out
    function logout() {
        // Clear cookies
        deleteCookie('phelan-login');
        deleteCookie('phelan-username');
        deleteCookie('phelan-remember');
        
        // Clear localStorage as fallback
        localStorage.removeItem('phelan-login');
        localStorage.removeItem('phelan-username');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
    
    // Helper function to get a cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }
	

// --- Simulate fetching data from entries.txt ---
const entriesData = [
    "ABC-BB-BX-FV-3",
    "ABT-FT-CC-IL-1",
    "ACD-DF-DR-AL-1",
    "EFG-HH-JK-LM-2",
    "XYZ-PQ-RS-TU-4"
];

document.getElementById('back-to-main-button').addEventListener('click', () => { window.location = "main.html";});

function populateEntryList(data) {
    entryList.innerHTML = '';
    data.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        entryList.appendChild(li);
    });
    entryCountSpan.textContent = data.length;
}

populateEntryList(entriesData); // Populate the list on page load

function calculateRowTotal(row) {
    let total = 0;
    const inputs = row.querySelectorAll('.size-input');
    inputs.forEach(input => {
        total += parseInt(input.value || 0);
    });
    const rowTotalCell = row.querySelector('.row-total');
    if (rowTotalCell) {
        rowTotalCell.textContent = total;
    }
    return total;
}

function updateTotalPairs() {
    let totalPairs = 0;
    rowTotals.forEach(row => {
        totalPairs += calculateRowTotal(row);
    });
    totalPairsInput.value = totalPairs;
}

sizeInputs.forEach(input => {
    input.addEventListener('input', () => {
        const row = input.closest('tr');
        calculateRowTotal(row);
        updateTotalPairs();
    });
});

if (qtyInput) {
    qtyInput.addEventListener('input', updateTotalPairs);
}

if (addRecordButton && orderItemsTableBody) {
    addRecordButton.addEventListener('click', () => {
        const newRow = document.querySelector('.order-items tbody .empty-row').cloneNode(true);
        newRow.classList.remove('empty-row');
        const inputs = newRow.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'number' || input.type === 'text') {
                input.value = 0;
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
            input.addEventListener('input', () => {
                const row = input.closest('tr');
                calculateRowTotal(row);
                updateTotalPairs();
            });
        });
        orderItemsTableBody.appendChild(newRow);
        updateTotalPairs();
    });
}

// Initial calculation on load
updateTotalPairs();
});