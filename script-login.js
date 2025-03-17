document.addEventListener("DOMContentLoaded", function() {
    // Get DOM elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    // Check if login cookie exists and pre-fill username if it does
    checkLoginCookie();
    
    // Valid login credentials
    const validCredentials = [
        { username: 'mike', password: 'phelan123' },
        { username: 'tina', password: 'phelan321' },
        { username: 'factory', password: 'phelanabc' }
    ];
    
    // Add event listener to login button
    loginBtn.addEventListener('click', validateLogin);
    
    // Add event listener for pressing Enter key in password field
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            validateLogin();
        }
    });
    
    // Validate login credentials
    function validateLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Check if credentials match any valid pair
        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
        
        if (isValid) {
            // Clear any error message
            errorMessage.textContent = '';
            
            // If remember me is checked, set a cookie
            if (rememberMeCheckbox.checked) {
                setLoginCookie(username, true);
            } else {
                setLoginCookie(username, false);
            }
            
            // Add a small delay to make sure cookie is set before alert
            setTimeout(function() {
                window.location.href = 'main.html';
            }, 100);
        } else {
            // Display error message
            errorMessage.textContent = 'Invalid username or password. Please try again.';
            
            // Clear the password field
            passwordInput.value = '';
            
            // Focus on the username field if it's empty, otherwise focus on the password field
            if (!username) {
                usernameInput.focus();
            } else {
                passwordInput.focus();
            }
        }
    }
    
    // Function to set login cookie
    function setLoginCookie(username, remember) {
        // Set cookie to expire in 30 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Set the cookie with the specified name 'phelan-login'
        document.cookie = `phelan-login=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        
        // Also store the username for convenience
        document.cookie = `phelan-username=${username}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        
        // Does the user want to be remembered?
        if (remember) {
			document.cookie = `phelan-remember=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
		} 
        
        // Debug: Log to confirm cookie was set
        console.log("Cookie set:", document.cookie);
    }
    
    // Function to check if login cookie exists
    function checkLoginCookie() {
        console.log("Checking cookies:", document.cookie);
        
        const cookies = document.cookie.split(';');
        
        // Check for both cookies
        let hasLoginCookie = false;
		let wantsToBeRemembered = false;
        let username = '';
        
        cookies.forEach(cookie => {
            const parts = cookie.trim().split('=');
            const name = parts[0];
            const value = parts.slice(1).join('='); // Handle values that might contain =
            
            console.log("Checking cookie:", name, value);
            
            if (name === 'phelan-login' && value === 'true') {
                hasLoginCookie = true;
            }
            
            if (name === 'phelan-username') {
                username = value;
            }
            
            if (name === 'phelan-remember' && value === 'true') {
                wantsToBeRemembered = true;
            }
        });
        
        // If login cookie exists and user wants to be remembered, redirect to main
        if (hasLoginCookie && username && wantsToBeRemembered) {
            window.location.href = 'main.html';
        } else {
            console.log("No valid cookies found for auto-login");
        }
    }
    
    // Helper function to get a specific cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});