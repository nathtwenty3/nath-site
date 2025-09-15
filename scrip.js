
function copyHref(el) {
    event.stopPropagation();
    event.preventDefault();

    const parentLink = el.closest('a');
    const url = parentLink?.getAttribute('href');

    if (url) {
        navigator.clipboard.writeText(url).then(() => {
            el.innerHTML = '<i class="bi bi-check2"></i> Copied!';
            setTimeout(() => {
                el.innerHTML = '<i class="bi bi-box-arrow-up fs-5"></i>';
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


