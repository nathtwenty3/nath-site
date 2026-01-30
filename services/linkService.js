import { API_URL } from './ApiUrl.js';

export async function getAllLinks() {
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

export async function createLink(linkData) {
    try {
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('title', linkData.title);
        formData.append('url', linkData.url);
        if (linkData.imageFile) {
            formData.append('image', linkData.imageFile);
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            redirect: 'follow',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }  
        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Failed to add link:", err);
        throw err;
    } 
}