import { API_URL } from './api/url.js';

const startTime = performance.now();
const loader = document.getElementById('siteLoader');
let slowShown = false;

const slowTimer = setTimeout(() => {
    if (!loader) return;
    const slowText = loader.querySelector(".loader-slow");
    if (slowText) {
        slowText.style.display = "flex";
        slowShown = true;
    }
}, 10000);

function hideLoader() {
    clearTimeout(slowTimer);

    if (loader) {
        loader.style.opacity = '1';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            document.body.style.overflow = '';
            loader.style.display = 'none';
            document.body.classList.add('loaded');

            const slowText = loader.querySelector?.(".loader-slow");
            if (slowText) slowText.style.display = '';
        }, 500);
    }
}

let pageLoaded = false;
let linksLoaded = false;

window.addEventListener('load', () => {
    pageLoaded = true;
    checkBothLoaded();
});

function checkBothLoaded() {
    if (pageLoaded && linksLoaded) {
        hideLoader();
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
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Clipboard copy failed:", err);
            });
    }
}

//------------------------------
const toggleBtn = document.getElementById('contactToggle');
const form = document.getElementById('contactForm');
const contactFloat = document.getElementById('contactFloat');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
const inputs = form.querySelectorAll('input, textarea');

let isInputFocused = false;
let isButtonHovering = false;
let isFormHovering = false;
let hideTimer = null;

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        isInputFocused = true;
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            isInputFocused = false;
        }, 300);
    });

    input.addEventListener('input', () => {
        isInputFocused = true;
        clearTimeout(hideTimer);
    });
});

function showForm() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
    form.classList.add('show');
    overlay.classList.add('active');
    toggleBtn.classList.add('hide');
    form.dataset.justOpened = "true";
    setTimeout(() => {
        form.dataset.justOpened = "false";
    }, 500);
}

function hideForm() {
    form.classList.remove('show');
    overlay.classList.remove('active');
    toggleBtn.classList.remove('hide');
}

function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        const active = document.activeElement;
        if (!isButtonHovering && !isFormHovering &&
            !(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) &&
            form.dataset.justOpened !== "true") {
            hideForm();
        }
    }, 300);
}

// Manual close
closeBtn.addEventListener('click', hideForm);
overlay.addEventListener('click', hideForm);

toggleBtn.addEventListener('click', showForm);
toggleBtn.addEventListener('touchstart', showForm);

toggleBtn.addEventListener('mouseenter', () => {
    isButtonHovering = true;
    showForm();
});

toggleBtn.addEventListener('mouseleave', () => {
    isButtonHovering = false;
    scheduleHide();
});

form.addEventListener('mouseenter', () => {
    isFormHovering = true;
    showForm();
});

form.addEventListener('mouseleave', () => {
    isFormHovering = false;
    scheduleHide();
});

// Profile Modal
const profileCard = document.getElementById("profileCard");
const modal = document.getElementById("customModal");
const closeProfileBtn = modal.querySelector(".close-profile");

profileCard.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.classList.remove('closing');
    toggleBtn.classList.add('hide');
    
    overlay.classList.add('active');
    overlay.classList.add('profile-active');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.classList.add("show");
    });
});

function closeProfile() {
    modal.classList.remove("show");
    modal.classList.add('closing');
    toggleBtn.classList.remove('hide');
    
    overlay.classList.remove('active');
    overlay.classList.remove('profile-active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
    }, 200);
}
closeProfileBtn.addEventListener("click", closeProfile);

window.addEventListener("click", (e) => {
    if (e.target === modal)
        closeProfile();
});


// const API_URL = "https://script.google.com/macros/s/AKfycbwCJBygEWeCo2UIh2ZX0GrwPPADVqwcMtViFk1X5m8Bj7dGZiKtkMhLXB5hfBQhAv4/exec";

// Fecth Data and load links
function loadFrontendLinks() {
    const container = document.getElementById("linksContainer");
    const iconBar = document.getElementById("iconBar");

    fetch(`${API_URL}?action=get`,{
            method: 'GET',
            redirect: 'follow',
    })
        .then(res => res.json())
        .then(data => {

            if (!Array.isArray(data)) {
                container.innerHTML = "<p class='text-danger text-center'>No links found</p>";
                return;
            }
            // filter active links
            const links = data.filter(
                link => link.active === "TRUE" || link.active === true
            );
            links.sort((a, b) => (parseInt(a.order) || 999) - (parseInt(b.order) || 999));

            iconBar.innerHTML = "";
            const isBarHidden = String(data.showInBar).toUpperCase() === "TRUE";
            if (isBarHidden) {
                iconBar.style.setProperty('display', 'none', 'important');
            } else {
                iconBar.style.display = "flex";

                const barLinks = links.filter(l =>
                    String(l.active).toUpperCase() === "TRUE" &&
                    String(l.showInBar).toUpperCase() === "TRUE"
                );

                iconBar.innerHTML = "";
                barLinks.forEach(link => {
                    const a = document.createElement("a");
                    a.href = link.url;
                    a.target = "_blank";
                    a.className = "text-light fs-3 mx-2";
                    a.innerHTML = `<i class="bi bi-${link.icon}"></i>`;
                    iconBar.appendChild(a);
                });
            }
            container.innerHTML = "";
            links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.className = "tile w-100 mb-3 d-flex align-items-center position-relative text-white";
                a.innerHTML = `
                    <i class="bi bi-${link.icon || "link-45deg"} fs-4 position-absolute start-0 ms-3"></i>
                    <span class="mx-auto">${link.title}</span>
                    <div class="icon-link icon-link-hover position-absolute end-0 me-3" style="--bs-icon-link-transform: translate3d(0, -.125rem, 0);" 
                        onclick="copyHref(event, this)" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        data-bs-title="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi" viewBox="0 0 16 16">
                            <g class="icon-normal">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                            </g>
                            <g class="icon-success d-none">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                            </g>
                        </svg>
                    </div>
                `;
                container.appendChild(a);
            });
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

            linksLoaded = true;
            checkBothLoaded();

        })
        .catch(err => {
            console.error("Failed to fetch links:", err);
            container.innerHTML = "<p class='text-center'>Failed to load links</p>";

            linksLoaded = true;
            checkBothLoaded();
        });
}

// Copy to clipboard function
function copyHref(evt, el) {
    if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    const parentLink = el.closest('a');
    const url = parentLink?.getAttribute('href');

    if (!url) return;

    const normalIcon = el.querySelector('.icon-normal');
    const successIcon = el.querySelector('.icon-success');

    const showSuccess = () => {
        normalIcon.classList.add('d-none');
        successIcon.classList.remove('d-none');

        setTimeout(() => {
            normalIcon.classList.remove('d-none');
            successIcon.classList.add('d-none');
            el.classList.remove('text-success');
        }, 3000);
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(showSuccess).catch(err => console.error(err));
    } else {
        const tmp = document.createElement('textarea');
        tmp.value = url;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
        showSuccess();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadFrontendLinks();

    setTimeout(() => {
        if (!linksLoaded) {

            console.warn("Links loading timeout - hiding loader anyway");
            linksLoaded = true;
            checkBothLoaded();
        }
    }, 10000);
});