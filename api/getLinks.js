// export async function getAllLinks() {
//     const API_URL = process.env.API_URL;
//     try {
//         const response = await fetch(`${API_URL}?action=get`, {
//             method: 'GET',
//             redirect: 'follow',
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         return result;
//     } catch (err) {
//         console.error("Failed to fetch links:", err);
//         throw err;
//     }
// }
export default async function handler(req, res) {
    const API_URL = process.env.API_URL;

    try {
        const response = await fetch(`${API_URL}?action=get`, {
            method: 'GET',
            redirect: 'follow',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to fetch links:", err);
        res.status(500).json({ error: "Failed to fetch links" });
    }
}