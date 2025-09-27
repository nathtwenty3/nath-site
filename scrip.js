
// your name 
var typed = new Typed('.your-name', {
    strings: ['@Neng Phanath.'],
    typeSpeed: 70,
    backSpeed: 70,
    loop: true
});


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

// const form = document.getElementById('contactForm')
// const alertBox = document.getElementById('formAlert');
// const modalElement = document.getElementById('contactModal');
// const submitBtn = form.querySelector('button[type="submit"]');

// form.addEventListener('submit', function (e) {
//     e.preventDefault(); // Stop default form submission

//     submitBtn.disabled = true;
//     submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;

//     const formData = new FormData(form);
//     const modalInstance = bootstrap.Modal.getInstance(modalElement);

//     fetch(form.action, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'Accept': 'application/json'
//         }
//     }).then(response => {
//         if (response.ok) {
//             alertBox.classList.remove('d-none');
//             alertBox.classList.add('show');
//             form.reset();

//             modalInstance.hide(); // Close modal
//             submitBtn.innerHTML = "SEND";
//             setTimeout(() => {
//                 alertBox.classList.add('d-none'); // Hide alert
//                 submitBtn.disabled = false;
//             }, 4000);
//         } else {
//             alertBox.textContent = "Something went wrong. Please try again.";
//             alertBox.classList.remove('d-none');
//             submitBtn.disabled = false;
//         }
//     }).catch(() => {
//         alertBox.textContent = "Network error. Please try again.";
//         alertBox.classList.remove('d-none');
//         submitBtn.disabled = false;
//         submitBtn.innerHTML = "SEND MESSAGE";
//     });
// });







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

// function showTestAlert() {
//     const alertBox = document.getElementById('formAlert');
//     alertBox.classList.remove('d-none');
//     alertBox.classList.add('show');

//     setTimeout(() => {
//         alertBox.classList.add('d-none');
//     }, 2000);
// }

// function setupValidation() {
//     const form = document.getElementById('contactForm');

//     form.querySelectorAll('.form-control').forEach(input => {
//         const isRequired = input.hasAttribute('required');

//         input.addEventListener('blur', () => {
//             if (isRequired) {
//                 if (!input.checkValidity()) {
//                     input.classList.add('is-invalid');
//                 } else {
//                     input.classList.remove('is-invalid');
//                     input.classList.add('is-valid');
//                 }
//             } else {
//                 input.classList.remove('is-invalid', 'is-valid');
//             }
//         });

//         input.addEventListener('input', () => {
//             if (isRequired && input.checkValidity()) {
//                 input.classList.remove('is-invalid');
//                 input.classList.add('is-valid');
//             } else if (isRequired) {
//                 input.classList.remove('is-valid');
//             } else {
//                 input.classList.remove('is-invalid', 'is-valid');
//             }
//         });
//     });
// }

function sendToTelegram() {

    const modalEl = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formAlert');
    const errorBox = document.getElementById('formError');
    const submitBtn = form.querySelector('button[type="submit"]');
    const modalInstance = bootstrap.Modal.getInstance(modalEl) 
        || new bootstrap.Modal(modalEl);

    const name = document.querySelector('[name="name"]').value.trim();
    const email = document.querySelector('[name="email"]').value.trim();
    const phone = document.querySelector('[name="phone"]').value.trim();
    const message = document.querySelector('[name="message"]').value.trim();
    const now = new Date();
    const dateTime = now.toDateString();
    
    //validate the whole form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false; // Prevent submission
    }
    
    let text = `📩 New Contact Submission:\n
    📅 Date: ${dateTime}\n
    👤 Name: ${name}\n
    📧 Email: ${email}\n
    📱 Phone: ${phone}\n
    💬 Message: ${message}`;

    // let text = `📩 New Contact Submission:\n\n` +
    //     `📅 Date: ${dateTime}\n` +
    //     `👤 Name: ${name}\n` +
    //     `📧 Email: ${email}\n` +
    //     `📱 Phone: ${phone}`;
    // if (message) {
    //     text += `\n💬 Message: ${message}`;
    // } 
    const telegramURL = `https://api.telegram.org/bot8325372659:AAHFDER6bz0-MbbhvaKRM7WiT3qZLS58Pyw/sendMessage`;
    const chatID = `-1003062617687`; // Group chat ID
    // const chatID = 999999999;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
    fetch(telegramURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatID,
            text: text,
            parse_mode: "Markdown"
        }),
        signal: controller.signal
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alertBox.classList.remove('d-none');
                alertBox.classList.add('show');
                
                form.reset();
                form.classList.remove('was-validated');
                modalInstance.hide();

                submitBtn.innerHTML = "Send";
                setTimeout(() => {
                    alertBox.classList.add('d-none');
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                console.error("Telegram API error:", data.description);
            }
        })
        .catch(err => {
            clearTimeout(timeoutId);
            errorBox.classList.remove('d-none');
            errorBox.classList.add('show');

            submitBtn.innerHTML = "Send";
            submitBtn.disabled = false;
            console.error("Fetch error:", err)});

    return false;
}


// function sendToTelegram() {

//     const modalEl = document.getElementById('contactModal');
//     const form = document.getElementById('contactForm');
//     const alertBox = document.getElementById('formAlert');

//     const btn = document.getElementById('sendBtn');
//     const spinner = btn.querySelector('.spinner');

//     const modalInstance = bootstrap.Modal.getInstance(modalEl) 
//         || new bootstrap.Modal(modalEl);


//     const name = document.querySelector('[name="name"]').value.trim();
//     const email = document.querySelector('[name="email"]').value.trim();
//     const phone = document.querySelector('[name="phone"]').value.trim();
//     const message = document.querySelector('[name="message"]').value.trim();
//     const now = new Date();
//     const dateTime = now.toDateString();


//     let text = `📩 New Contact Submission:\n
//     📅 Date: ${dateTime}\n
//     👤 Name: ${name}\n
//     📧 Email: ${email}\n
//     📱 Phone: ${phone}\n
//     💬 Message: ${message}`;

//     const telegramURL = `https://api.telegram.org/bot8325372659:AAHFDER6bz0-MbbhvaKRM7WiT3qZLS58Pyw/sendMessage`;
//     const chatID = `-1003062617687`; // Group chat ID
//     // const chatID = 999999999;

    

//     // submitBtn.disabled = true;
//     // submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);

//     btn.classList.add('loading');
//     spinner.classList.remove('d-none');

//     fetch(telegramURL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             chat_id: chatID,
//             text: text,
//             parse_mode: "Markdown"
//         }),
//         signal: controller.signal
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.ok) {
//                 alertBox.classList.remove('d-none');
//                 alertBox.classList.add('show');
                
//                 form.reset();
//                 // form.classList.remove('was-validated');
//                 // modalInstance.hide();

//                 // submitBtn.innerHTML = "SEND";
//                 setTimeout(() => {
//                     btn.classList.remove('loading');
//                     spinner.classList.add('d-none');
//                     document.getElementById('formAlert').classList.remove('d-none');
//                     document.getElementById('formAlert').classList.add('show');
//                 }, 4000);
//             } else {
//                 console.error("Telegram API error:", data.description);
//             }
//         })
//         .catch(err => {
//             const errorBox = document.getElementById('formError');
//             clearTimeout(timeoutId);
//             errorBox.classList.remove('d-none');
//             errorBox.classList.add('show');

//             // submitBtn.innerHTML = "SEND";
//             // submitBtn.disabled = false;
//             console.error("Fetch error:", err)});


//     return false;
// }

const profileCard = document.getElementById('profileCard');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      profileCard.classList.add('animate');
      observer.unobserve(profileCard);
    }
  });
});

observer.observe(profileCard);




//--- for test ----

// document.addEventListener('DOMContentLoaded', () => {
//     const modalEl = document.getElementById('contactModal');
//     const modal = new bootstrap.Modal(modalEl);
//     modal.show();
// });