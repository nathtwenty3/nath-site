// your name 
var typed = new Typed('.your-name', {
    strings: ['Neng Phanath.'],
    typeSpeed: 70,
    backSpeed: 70,
    loop: true
});

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
}, 4000);

window.addEventListener('load', () => {
    clearTimeout(slowTimer);

    if(loader){
        loader.style.opacity = '1';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            document.body.style.overflow = '';
            loader.style.display = 'none';
            document.body.classList.add('loaded');

            const slowText = loader.querySelector?.(".loader-slow");
            if(slowText) slowText.style.display = '';
        }, 500);
    }
    BackgroundMusic('bgMusic1', 'bgMusic2', 'musicToggle');
});

// function BackgroundMusic(bgMusic1, bgMusic2, musicToggle) {
//     const song1 = document.getElementById('bgMusic1');
//     const song2 = document.getElementById('bgMusic2');
//     const MtoggleBtn = document.getElementById('musicToggle');
//     let isMuted = false;

//     song1.volume = 0.2;
//     song2.volume = 0.2;


//     const songs = [song1, song2];
//     let currentSong = songs[Math.floor(Math.random() * songs.length)];
//     let nextSong = currentSong === song1 ? song2 : song1;

//     const playSong = (song) => {
//         song.play().catch(() => {
//             document.body.addEventListener('click', () => {
//                 song.muted = false;
//                 song.play();
//             }, { once: true });
//         });
//     };
    
//     playSong(currentSong);

//     songs.forEach(s => {
//         s.addEventListener('ended', () => {
//             if (s === currentSong) {
//                 [currentSong, nextSong] = [nextSong, currentSong];
//                 playSong(currentSong);
//             }
//         });
//     });

//     MtoggleBtn.addEventListener('click', () => {
//         isMuted = !isMuted;
//         song1.muted = isMuted;
//         song2.muted = isMuted;

//         MtoggleBtn.innerHTML = isMuted
//             ? '<i class="bi bi-volume-mute-fill fs-3"></i>'
//             : '<i class="bi bi-volume-up-fill fs-3"></i>';
//     });
// }



// ---------- Background music handler ----------
function BackgroundMusic(bgMusic1Id, bgMusic2Id, musicToggleId) {
    const song1 = document.getElementById(bgMusic1Id);
    const song2 = document.getElementById(bgMusic2Id);
    const MtoggleBtn = document.getElementById(musicToggleId);

    if (!song1 || !song2 || !MtoggleBtn) return;

    song1.volume = 0.2;
    song2.volume = 0.2;
    song1.loop = false;
    song2.loop = false;

    const songs = [song1, song2];
    let currentIndex = Math.floor(Math.random() * songs.length);
    let currentSong = songs[currentIndex];
    let nextSong = songs[(currentIndex + 1) % songs.length];

    let isMuted = false;

    // MtoggleBtn.innerHTML = '<i class="bi bi-volume-up-fill fs-3"></i>';

    const tryPlay = (s) => {
        s.muted = isMuted;
        s.play().catch(() => {
            const onFirstClick = () => {
                s.muted = isMuted;
                s.play().catch(() => { /* second failure, ignore */ });
                document.body.removeEventListener('click', onFirstClick);
            };
            document.body.addEventListener('click', onFirstClick, { once: true });
        });
    };

    tryPlay(currentSong);

    currentSong.addEventListener('ended', function handleFirstEnd() {
        nextSong.currentTime = 0;
        nextSong.loop = true;

        currentSong = nextSong;
        tryPlay(currentSong);

        this.removeEventListener('ended', handleFirstEnd);
    }, { once: true });

    MtoggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        song1.muted = isMuted;
        song2.muted = isMuted;

        MtoggleBtn.innerHTML = isMuted
            ? '<i class="bi bi-volume-mute-fill fs-3"></i>'
            : '<i class="bi bi-volume-up-fill fs-3"></i>';
    });
}


//------------------------------
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
const formInner = document.getElementById('contactFormInner');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');

formInner.addEventListener('submit', function (e) {
    e.preventDefault();
    if(form.dataset.justOpened === "true") return;

    if (!formInner.checkValidity()) {
        // formInner.reportValidity();
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
    📅 Date: ${dateTime}\n
    👤 Name: ${name}\n
    📧 Email: ${email}\n
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

            if (data.success) {
                form.reset();
                form.classList.remove('was-validated');

                submitBtn.classList.add('sent');
                submitBtn.innerHTML = `
                    <span class="btn-icon"><i class="bi bi-check2-all"></i></span>
                    <span class="btn-text">Sent!</span>`;
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('sent');
                    submitBtn.innerHTML = "Send";
                    errorBox.classList.remove('show');
                    errorBox.classList.add('d-none');
                    hideForm();
                }, 3000);
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
            console.error("Fetch error:", err)
        });
    return false;
}




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
    toggleBtn.classList.add('hide');
    overlay.classList.add('active');
    overlay.classList.add('profile-active');
    document.body.style.overflow = 'hidden';
});

closeProfileBtn.addEventListener("click", () => {
    modal.style.display = "none";
    toggleBtn.classList.remove('hide');
    overlay.classList.remove('active');
    overlay.classList.remove('profile-active');
    document.body.style.overflow = '';
});

window.addEventListener("click", (e) => {
    if (e.target === modal)
        closeProfileBtn.click();
});

// window.addEventListener('DOMContentLoaded', () => {
//     profileCard.click();
// });

// const music1 = document.getElementById('bg-music-1');
// const MtoggleBtn = document.getElementById('music-toggle');
// let isPlaying = false;
// music1.volume = 0.05;

// MtoggleBtn.addEventListener('click', () => {
//     if (!isPlaying) {
//         music1.play();
//         MtoggleBtn.innerHTML = '<i class="bi bi-volume-up-fill fs-3"></i>';
//     } else {
//         music1.pause();
//         MtoggleBtn.innerHTML = '<i class="bi bi-volume-mute-fill fs-3"></i>';
//     }
//     isPlaying = !isPlaying;
// });
