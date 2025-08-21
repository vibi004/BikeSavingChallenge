
import { getUserByName } from "../database/user.js"
import {getProgressByUser} from "../database/progress";

document.addEventListener("DOMContentLoaded", async () => {
    const userName = localStorage.getItem('user')
    const user = await getUserByName(userName)

    document.getElementById('user-name').textContent = `Hallo ${userName}! 🎉`

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');     // Benutzer entfernen
        window.location.href = '../index.html'; // Zur Startseite weiterleiten
    });

    const moneyGoal = 1500;
    const moneyPerKm = 2.5;
    let km1 = getProgressByUser(getUserByName('Vani')), km2 = getProgressByUser(getUserByName('Kathi'));

    document.getElementById('addKm').addEventListener('click', () => {
        addKm(user.id);
    });

    function updateBar(id, km) {
        const percent = Math.min(100, (km*moneyPerKm/moneyGoal)*100);
        document.getElementById("fill"+id).style.width = percent + "%";
        document.getElementById("p"+id).textContent = km*moneyPerKm + " €";
    }

    function addKm(id) {
        const input = prompt("Wie viele Kilometer hinzufügen?");
        const value = parseFloat(input);
        if (!isNaN(value) && value > 0) {
            if (id === 1) { km1 += value; updateBar(1, km1); }
            if (id === 2) { km2 += value; updateBar(2, km2); }
        }
    }
})
