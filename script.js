import { loadFrontendLinks } from './services/linkService.js';

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

let pageLoaded = false;
let linksLoaded = false;


function setLinksLoaded() {
    linksLoaded = true;
    checkBothLoaded();
}

function checkBothLoaded() {
    if (pageLoaded && linksLoaded) {
        hideLoader();
    }
}

window.addEventListener('load', () => {
    pageLoaded = true;
    checkBothLoaded();
});


function hideLoader() {
    document.body.style.overflow = '';
    loader.style.display = 'none';
    document.body.classList.add('loaded');

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




//------------------------------
const toggleBtn = document.getElementById('contactToggle');
const form = document.getElementById('contactForm');
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

// Profile Modal function
const profileCard = document.getElementById("profileCard");
const modal = document.getElementById("customModal");
const closeProfileBtn = modal.querySelector(".close-profile");

function openProfile() {
    modal.style.display = "flex";
    modal.classList.remove('closing');

    toggleBtn.classList.add('hide');
    overlay.classList.add('active', 'profile-active');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.classList.add("show");
    });
}

function closeProfile() {
    modal.classList.remove("show");
    modal.classList.add('closing');

    toggleBtn.classList.remove('hide');
    overlay.classList.remove('active', 'profile-active');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
    }, 300);
}

profileCard.addEventListener("click", openProfile);
closeProfileBtn.addEventListener("click", closeProfile);

window.addEventListener("click", (e) => {
    if (e.target === modal)
        closeProfile();
});


// Share Modal - Copy Link functionality
function initShareCopyLink() {
    const copyBtn = document.getElementById("copyLinkButton");
    const copyInput = document.getElementById("copyLinkInput");

    if (!copyBtn || !copyInput) return;

    copyInput.value = window.location.href;

    const fallbackCopy = () => {
        copyInput.focus();
        copyInput.select();
        copyInput.setSelectionRange(0, copyInput.value.length);
        const ok = document.execCommand("copy");
        if (!ok) throw new Error("execCommand copy failed");
    };

    copyBtn.addEventListener("click", async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(copyInput.value);
            } else {
                fallbackCopy();
            }
            copyBtn.classList.add('copied');
            copyBtn.textContent = "Copied!";

            console.log("Link copied to clipboard");
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.style.transition = '0.3s ease';
            }, 500);
            setTimeout(() => (copyBtn.innerHTML = `<i class="bi bi-copy"></i> Copy`), 1500);
        } catch (e) {
            console.error("Copy failed:", e);
            copyBtn.textContent = "Failed";
            setTimeout(() => (copyBtn.innerHTML = `<i class="bi bi-copy"></i> Copy`), 1500);
        }
    });
}

function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: "Check out this site!",
            url: window.location.href
        })
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Share failed:", error));
    } else {
        console.warn("Web Share API not supported.");
    }
}

function shareTo(app) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this site!");

    let shareUrl = "";

    switch (app) {
        case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case "linkedin": 
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; 
            break;
        case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case "telegram":
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case "whatsapp":
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
            break;
        default:
            alert("Unsupported app for sharing");
            console.warn("Unsupported app for sharing");
            return;
    }
    window.open(shareUrl, '_blank');
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
    window.copyHref = copyHref;
}

function animationTest() {
    const tiles = document.querySelectorAll(".tile");
    if (tiles.length === 0) return;

    gsap.set(tiles, {
        opacity: 0,
        y: -20
    });

    gsap.to(tiles, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
        clearProps: "transform"
    });
}


document.addEventListener("DOMContentLoaded", function () {
    loadFrontendLinks(animationTest, copyHref, setLinksLoaded);
    initShareCopyLink();

    // const myModal = new bootstrap.Modal(document.getElementById('shareModal'), {
    //     keyboard: true
    // });
    // myModal.show();

    setTimeout(() => {
        if (!linksLoaded) {
            console.warn("Links loading timeout - hiding loader anyway");
            linksLoaded = true;
            checkBothLoaded();
        }
    }, 10000);
});

Object.assign(window, { shareSite, shareTo });