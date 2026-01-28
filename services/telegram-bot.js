function sendToTelegram() {
    const form = document.getElementById('contactFormInner');
    const errorBox = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');

    const name = document.querySelector('[name="name"]').value.trim();
    const email = document.querySelector('[name="email"]').value.trim();
    const message = document.querySelector('[name="message"]').value.trim();
    const now = new Date();
    const dateTime = now.toDateString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const text = `📩 New Contact Submission:\n
    📅  Date: ${dateTime}\n
    👤  Name: ${name}\n
    📧  Email: ${email}\n
        Message:\t\t${message}\n`;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;

    fetch(`/api/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: text
        }),
        signal: controller.signal
    })
        .then(response => response.json())
        .then(data => {
            clearTimeout(timeoutId);

            if (data.success || data.ok) {
                form.reset();
                form.classList.remove('was-validated');

                submitBtn.innerHTML = `
                    <span class="btn-icon"><i class="bi bi-check2"></i></span>
                    <span class="btn-text">Sent!</span>`;
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "Send";

                    errorBox.classList.remove('show');
                    errorBox.classList.add('d-none');
                    hideForm();
                }, 3000);
            } else {
                console.error("Telegram API error:", data.description);
                errorBox.classList.remove('d-none');
                errorBox.textContent = "Failed to send message.";

                submitBtn.innerHTML = "Send";
                submitBtn.disabled = false;
            }
        })
        .catch(err => {
            clearTimeout(timeoutId);
            let userMessage;

            if (!navigator.onLine) {
                userMessage = "You appear to be offline. Please check your internet connection.";
            }
            else if (err.name === 'AbortError') {
                userMessage = "⏱️ Request timed out. Please check your connection and try again.";
            }
            else if (err.message.includes('Failed to fetch')) {
                userMessage = "Unable to reach the server. Please check your internet connection or try again later.";
            }
            else {
                userMessage = `Network error: ${err.message || 'An unknown error occurred. Please try again.'}`;
            }
            errorBox.classList.remove('d-none');
            errorBox.classList.add('show');

            submitBtn.innerHTML = "Send";
            submitBtn.disabled = false;

            console.error("Fetch error:", err)
        });
    return false;
}

const formInner = document.getElementById('contactFormInner');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');

formInner.addEventListener('submit', function (e) {
    e.preventDefault();
    if (formInner.dataset.justOpened === "true") return;

    if (!formInner.checkValidity()) {
        formInner.classList.add('was-validated');

        const invalids = formInner.querySelectorAll(':invalid');
        invalids.forEach(input => {
            input.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        });
        return;
    }
    sendToTelegram();
});