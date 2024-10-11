// Ensure the script waits for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fs-frm');

    if (form) {  // Check if the form exists
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Send form using fetch.
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // If succeeded, clear the form
                    form.reset();
                    alert('Message sent. Thank you for contacting us!');
                } else {
                    alert('Something went wrong. Try again.');
                }
            }).catch(error => {
                alert('Something went wrong. Try again.');
            });
        });
    } else {
        console.error('Form element not found!');
    }
});
