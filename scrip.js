
function copyHref(el) {
    event.stopPropagation();
    event.preventDefault();

    const parentLink = el.closest('a');
    const url = parentLink?.getAttribute('href');

    if (url) {
        navigator.clipboard.writeText(url).then(() => {
            el.innerHTML = '<i class="bi bi-check2"></i> Copied!';
            setTimeout(() => {
                el.innerHTML = '<i class="bi bi-link-45deg fs-5"></i>';
            }, 3000);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
}

function shareSite() {
    const shareData = {
        title: document.title,
        text: "Check out this site!",
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Share failed:', error));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Clipboard copy failed:", err);
            });
    }
}

const form = document.getElementById('contactForm')
const alertBox = document.getElementById('formAlert');
const modalElement = document.getElementById('contactModal');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop default form submission

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;

    const formData = new FormData(form);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alertBox.classList.remove('d-none');
            alertBox.classList.add('show');
            form.reset();

            modalInstance.hide(); // Close modal
            submitBtn.innerHTML = "SEND";
            setTimeout(() => {
                alertBox.classList.add('d-none'); // Hide alert
                submitBtn.disabled = false;
            }, 4000);
        } else {
            alertBox.textContent = "Something went wrong. Please try again.";
            alertBox.classList.remove('d-none');
            submitBtn.disabled = false;
        }
    }).catch(()=>{
        alertBox.textContent = "Network error. Please try again.";
        alertBox.classList.remove('d-none');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "SEND MESSAGE";
    });
});

// // Show success alert
// alertBox.classList.remove('d-none');
// alertBox.classList.add('show');

// // Reset form
// modalElement.querySelector('form').reset();

// // Auto-close modal after 2 seconds
// modalInstance.hide();
// setTimeout(() => {
//     alertBox.classList.add('d-none'); // Hide alert after closing
// }, 2000);

// return false;

