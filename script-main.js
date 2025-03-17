document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const usernameElement = document.getElementById('username');
    const logoutLink = document.getElementById('logoutLink');
	
	
	document.getElementById('add-edit-sales-order-button').addEventListener('click',()=>{ window.location = 'add-edit-sales-order.html'; });
    
    // Check for cookies (or localStorage as fallback) and display username
    displayUsername();
    
    // Add event listener for logout
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
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
    
    // Helper function to delete a cookie
    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    }
});