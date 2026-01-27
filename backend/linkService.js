
let currentLinks = [];

const API_URL = "https://script.google.com/macros/s/AKfycbwCJBygEWeCo2UIh2ZX0GrwPPADVqwcMtViFk1X5m8Bj7dGZiKtkMhLXB5hfBQhAv4/exec";
function refreshLinks() {
    loadLinks();
}

function loadLinks() {
    const loading = document.getElementById("loading");
    const tableBody = document.getElementById("linksList");
    const noLinksMessage = document.getElementById("noLinksMessage");

    loading.classList.remove("d-none");
    tableBody.classList.add("d-none");
    noLinksMessage.classList.add("d-none");


    fetch(`${API_URL}?action=get`)
        .then(res => res.json())
        .then(data => {
            currentLinks = data;
            renderLinks(data);
        })
        .catch(err => console.error("Failed to load links:", err))
        .finally(() => {
            loading.classList.add("d-none");
            tableBody.classList.remove("d-none");
        });
}

function renderLinks(links) {
    links.sort((a, b) => (parseInt(a.order) || 999) - (parseInt(b.order) || 999));

    const tbody = document.getElementById("linksList");
    tbody.innerHTML = "";

    if (!Array.isArray(links) || links.length === 0) {
        const noLinksMessage = document.getElementById("noLinksMessage");
        const linksTable = document.getElementById("linksTable");
        noLinksMessage.classList.remove("d-none");
        linksTable.querySelector('table')?.classList.add('d-none');
        return;
    } else {
        document.getElementById("noLinksMessage").classList.add("d-none");
        const linksTable = document.getElementById("linksTable");
        linksTable.querySelector('table')?.classList.remove('d-none');
    }

    links.forEach((link, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${link.title}</td>
            <td><a href="${link.url}" target="_blank">${link.url}</a></td>
            <td>
                ${link.icon && link.icon !== 'link-45deg' ? `<i class="bi bi-${link.icon}"></i>` : 'N/A'}
            </td>
            <td>
                <span class="badge badge-sm ${String(link.active).toUpperCase() === "TRUE" ? "text-bg-success" : "text-bg-danger"}">
                    ${String(link.active).toUpperCase() === "TRUE" ? "Active" : "Inactive"}
                </span>
            </td>
            <td>${link.order}</td>
            <td>
                <span class="badge ${String(link.showInBar).toUpperCase() === "TRUE" ? "text-bg-info" : "text-bg-secondary"}">
                    ${String(link.showInBar).toUpperCase() === "TRUE" ? "Shown" : "Hidden"}
                </span>
            </td>
            <td>
                <button class="btn btn-sm" onclick="openEditModal(${link._rowIndex})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm text-danger" onclick="deleteLink(${link._rowIndex})"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function onSubmit() {
    const form = document.getElementById("linkForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (editingRowIndex !== null) {
        updateLink();
    } else {
        saveLink();
    }
}




let editingRowIndex = null;

const btn = document.getElementById("submitBtn");
const spinner = btn.querySelector(".spinner-border");
const text = btn.querySelector(".btn-text");

function openAddModal() {
    editingRowIndex = null;

    document.getElementById("linkModalTitle").innerText = "Add Link";
    document.querySelector("#submitBtn .btn-text").textContent = "Add";
    document.getElementById("linkForm").reset();

    document.getElementById("linkIcon").value = "";
    document.getElementById("selectedIconPreview").style.display = 'none';
    document.getElementById("selectedIconText").textContent = "None";
    document.getElementById("linkActive").value = "TRUE";
    document.getElementById("linkShowInBar").value = "TRUE";

    const maxOrder = currentLinks.length > 0
        ? Math.max(...currentLinks.map(l => parseInt(l.order) || 0))
        : 0;
    document.getElementById("linkOrder").value = maxOrder + 1;

    const modalElem = document.getElementById("linkModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElem);
    modalInstance.show();
}

function openEditModal(rowIndex) {
    const link = currentLinks.find(l => l._rowIndex === rowIndex);
    const activeValue = String(link.active).toUpperCase();
    const showInBarValue = String(link.showInBar).toUpperCase();
    if (!link) return;

    editingRowIndex = rowIndex;

    document.getElementById("linkModalTitle").innerText = "Edit Link";
    document.querySelector("#submitBtn .btn-text").textContent = "Update";

    document.getElementById("linkTitle").value = link.title;
    document.getElementById("linkUrl").value = link.url;
    document.getElementById("linkOrder").value = link.order || 0;
    document.getElementById("linkActive").value =
        activeValue === "TRUE" ? "TRUE" : "FALSE";
    document.getElementById("linkShowInBar").value =
        showInBarValue === "TRUE" ? "TRUE" : "FALSE";

    const iconValue = link.icon || '';
    const selectedIcon = icons.find(i => i.value === iconValue) || icons[0];
    document.getElementById("linkIcon").value = selectedIcon.value;

    if (selectedIcon.icon) {
        document.getElementById("selectedIconPreview").className = `bi bi-${selectedIcon.icon}`;
        document.getElementById("selectedIconPreview").style.display = '';
    } else {
        document.getElementById("selectedIconPreview").style.display = 'none';
    }
    document.getElementById("selectedIconText").textContent = selectedIcon.label;

    const modalElem = document.getElementById("linkModal");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElem);
    modalInstance.show();
}


async function saveLink() {
    const title = document.getElementById("linkTitle").value.trim();
    const url = document.getElementById("linkUrl").value.trim();

    btn.disabled = true;
    spinner.classList.remove("d-none");
    text.textContent = "Adding...";

    const data = new URLSearchParams({
        action: "add",
        title,
        url,
        icon: document.getElementById("linkIcon").value,
        active: document.getElementById("linkActive").value,
        showInBar: document.getElementById("linkShowInBar").value,
        order: document.getElementById("linkOrder").value || 999
    });
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: data
        })
        const result = await res.json();
        console.log("API response", result);

        if (result.status !== "success") {
            throw new Error("API did not save data");
        }

        refreshLinks();
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("linkModal")
        );
        modal.hide();
        showAlert("Link added successfully", "success");

    } catch (error) {
        console.error("Error adding link:", error);
    }
    finally {
        btn.disabled = false;
        spinner.classList.add("d-none");
        if (text) text.textContent = "Add";
    }
}

async function updateLink() {
    btn.disabled = true;
    spinner.classList.remove("d-none");
    text.textContent = "Updating...";

    if (!editingRowIndex) return;

    const data = new URLSearchParams({
        action: "update",
        row: editingRowIndex,
        title: document.getElementById("linkTitle").value.trim(),
        url: document.getElementById("linkUrl").value.trim(),
        icon: document.getElementById("linkIcon").value,
        active: document.getElementById("linkActive").value,
        showInBar: document.getElementById("linkShowInBar").value,
        order: document.getElementById("linkOrder").value || 999
    });
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: data
        })
        const result = await res.json();
        console.log("API response", result);

        if (result.status !== "success") {
            throw new Error("API did not update data");
        }

        refreshLinks();
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("linkModal")
        );
        modal.hide();
        showAlert("Link updated successfully", "success");

    } catch (error) {
        console.error("Error updating link:", error);
    }
    finally {
        btn.disabled = false;
        spinner.classList.add("d-none");
        if (text) text.textContent = "Update";
    }
}

function deleteLink(rowIndex) {
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const confirmBtn = document.getElementById('confirmDeleteBtn');

    confirmModal.show();
    if(!confirmBtn) return;
    
    confirmBtn.onclick = () => {
        const loadingAlert = showLoadingAlert("Deleting link...");
        confirmModal.hide();

        fetch(API_URL, {
            method: "POST",
            body: new URLSearchParams({
                action: "delete",
                row: rowIndex
            })
        })
            .then(res => res.json())
            .then(() => {
                loadingAlert?.remove();
                console.log("Link deleted");
                showAlert("Link deleted successfully!", "success");
                loadLinks();
            })
            .catch(err => {
                loadingAlert?.remove();
                console.error("Delete failed:", err)
                showAlert("Failed to delete link.", "danger");
            });
    }
}


function showAlert(message, type = "success", duration = 3000) {
    const container = document.getElementById("alertContainer");
    if (!container) return;

    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} d-flex align-items-center`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `
        <i class="bi ${type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
        }fs-5"></i>
        <div>
            ${message}
        </div>
    `;

    container.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

function showLoadingAlert(message = "Loading...") {
    const container = document.getElementById("alertContainer");
    if (!container) return null;

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-info d-flex align-items-center";
    alertDiv.setAttribute("role", "alert");

    alertDiv.innerHTML = `
        <i class="bi bi-hourglass-split me-2 fs-5"></i>
        <div class="d-flex align-items-center gap-2">
            <strong>${message}</strong>
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    container.appendChild(alertDiv);
    return alertDiv;
}


const icons = [
    { value: '', label: 'None', icon: '' },
    { value: 'facebook', label: 'Facebook', icon: 'facebook' },
    { value: 'twitter', label: 'Twitter', icon: 'twitter' },
    { value: 'instagram', label: 'Instagram', icon: 'instagram' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
    { value: 'github', label: 'GitHub', icon: 'github' },
    { value: 'youtube', label: 'YouTube', icon: 'youtube' },
    { value: 'tiktok', label: 'TikTok', icon: 'tiktok' },
    { value: 'telegram', label: 'Telegram', icon: 'telegram' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
    { value: 'discord', label: 'Discord', icon: 'discord' },
    { value: 'twitch', label: 'Twitch', icon: 'twitch' },
    { value: 'snapchat', label: 'Snapchat', icon: 'snapchat' },
    { value: 'pinterest', label: 'Pinterest', icon: 'pinterest' },
    { value: 'reddit', label: 'Reddit', icon: 'reddit' },
    { value: 'envelope', label: 'Email', icon: 'envelope' },
    { value: 'phone', label: 'Phone', icon: 'phone' },
    { value: 'globe', label: 'Website', icon: 'globe' },
];

function Autocomplete() {
    const linkUrlInput = document.getElementById('linkUrl');

    linkUrlInput.addEventListener('blur', () => {
        const titleInput = document.getElementById('linkTitle');
        const url = linkUrlInput.value.trim();
        if (url) {
            try {
                const urlObj = new URL(url);
                // Extract domain name without www and .com/.net etc
                let domain = urlObj.hostname.replace('www.', '');
                domain = domain.split('.')[0];
                titleInput.value = domain.charAt(0).toUpperCase() + domain.slice(1);

                const matchedIcon = icons.find(i =>
                    i.label.toLowerCase() === domain.toLowerCase()
                );

                if (matchedIcon) {
                    document.getElementById('linkIcon').value = matchedIcon.value;
                    const selectedIconPreview = document.getElementById('selectedIconPreview');
                    const selectedIconText = document.getElementById('selectedIconText');

                    if (matchedIcon.icon) {
                        selectedIconPreview.className = `bi bi-${matchedIcon.icon}`;
                        selectedIconPreview.style.display = '';
                    } else {
                        selectedIconPreview.style.display = 'none';
                    }
                    selectedIconText.textContent = matchedIcon.label;
                }
            } catch (e) {
                console.error('Invalid URL for autocomplete:', e);
            }
        }
    });
}

function initIconSelect() {
    const iconBtn = document.getElementById('iconSelectBtn');
    const iconDropdown = document.getElementById('iconDropdown');
    const iconSearch = document.getElementById('iconSearch');
    const iconOptions = document.getElementById('iconOptions');
    const linkIcon = document.getElementById('linkIcon');
    const selectedIconPreview = document.getElementById('selectedIconPreview');
    const selectedIconText = document.getElementById('selectedIconText');


    function renderIcons(filter = '') {
        const filtered = icons.filter(icon =>
            icon.label.toLowerCase().includes(filter.toLowerCase()) ||
            icon.value.toLowerCase().includes(filter.toLowerCase())
        );

        iconOptions.innerHTML = filtered.map(icon => `
        <div class="icon-option" data-value="${icon.value}" data-icon="${icon.icon}" data-label="${icon.label}">
            ${icon.icon ? `<i class="bi bi-${icon.icon}"></i>` : '<span style="width: 20px; display: inline-block;"></span>'}
            <span>${icon.label}</span>
        </div>
        `).join('');

        iconOptions.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const icon = option.dataset.icon;
                const label = option.dataset.label;

                linkIcon.value = value;

                if (icon) {
                    selectedIconPreview.className = `bi bi-${icon}`;
                    selectedIconPreview.style.display = '';
                } else {
                    selectedIconPreview.style.display = 'none';
                }
                selectedIconText.textContent = label;

                iconDropdown.classList.remove('show');
                iconSearch.value = '';
            });
        });
    }

    iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        iconDropdown.classList.toggle('show');
        if (iconDropdown.classList.contains('show')) {
            iconSearch.focus();
            renderIcons();
        }
    });

    iconSearch.addEventListener('input', (e) => {
        renderIcons(e.target.value);
    });
    document.addEventListener('click', (e) => {
        if (!iconBtn.contains(e.target) && !iconDropdown.contains(e.target)) {
            iconDropdown.classList.remove('show');
            iconSearch.value = '';
        }
    });

    renderIcons();
}


document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
    initIconSelect();
    Autocomplete();
    const modalElement = document.getElementById('linkModal');
    modalElement.addEventListener('hidden.bs.modal', function () {
        document.getElementById("linkForm").reset();
    });
});