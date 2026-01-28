const API_URL = "https://script.google.com/macros/s/AKfycbwCJBygEWeCo2UIh2ZX0GrwPPADVqwcMtViFk1X5m8Bj7dGZiKtkMhLXB5hfBQhAv4/exec";

export async function fetchLinks() {
    try {
        const response = await fetch(`${API_URL}?action=get`, {
            method: 'GET',
            redirect: 'follow',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Failed to fetch links:", err);
        throw err;
    }
}