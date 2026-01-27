import { API_URL } from "../api/url.js";

// Fecth Data and load links
function loadFrontendLinks() {
    const container = document.getElementById("linksContainer");
    const iconBar = document.getElementById("iconBar");

    fetch(`${API_URL}?action=get`)
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