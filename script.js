document.addEventListener("DOMContentLoaded", function() {
    // Get all checkbox elements and the continue button
    const checkboxes = document.querySelectorAll('.consent-checkbox');
    const continueBtn = document.getElementById('continueBtn');
    
    // Add event listener to each checkbox
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', checkAllChecked);
    });
    
    // Add event listener to the continue button
    continueBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // Function to check if all checkboxes are checked
    function checkAllChecked() {
        // Convert NodeList to array to use every method
        const allChecked = Array.from(checkboxes).every(function(checkbox) {
            return checkbox.checked;
        });
        
        // Enable or disable button based on checkbox status
        continueBtn.disabled = !allChecked;
    }
});