
import { getUserByName } from "../database/user.js"

document.addEventListener("DOMContentLoaded", async () => {
    const userName = localStorage.getItem('user')
    const user = await getUserByName(userName)

    document.getElementById('user-name').textContent = `Hallo ${userName}! 🎉`

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');     // Benutzer entfernen
        window.location.href = '../index.html'; // Zur Startseite weiterleiten
    });
})
