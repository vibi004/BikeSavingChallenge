
import { getUserByName } from "../database/user.js"
import {getProgressByUser, updateProgress} from "../database/progress.js";
import {getSettings} from "../database/settings.js";

document.addEventListener("DOMContentLoaded", async () => {
    const userName = localStorage.getItem('user')
    const user = await getUserByName(userName)
    const settings = await getSettings()

    document.getElementById('user-name').textContent = `Hallo ${userName}! 🎉`

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    });

    const moneyGoal = settings.goal;
    const moneyPerKm = settings.euro_per_km;

    let { km1, km2 } = await getKmValues()

    updateBar(1, km1);
    updateBar(2, km2);

    document.getElementById('addKm').addEventListener('click', () => {
        addKm(user.id);
    });

    function updateBar(id, km) {
        const percent = Math.min(100, (km*moneyPerKm/moneyGoal)*100);
        document.getElementById("fill"+id).style.width = percent + "%";
        document.getElementById("p"+id).textContent = km*moneyPerKm + " € / " + km + " km";
    }

    function addKm(id) {
        const input = prompt("Wie viele Kilometer hinzufügen?");
        const value = parseFloat(input);
        if (!isNaN(value) && value > 0) {
            if (id === 1) { km1 += value; updateBar(1, km1); }
            if (id === 2) { km2 += value; updateBar(2, km2); }
        }
        updateProgress(value, user.id);
    }
})

async function getKmValues() {
    const user1 = await getUserByName('Kathi')
    const user2 = await getUserByName('Vani')

    const progress1 = await getProgressByUser(user1.id)  // Progress holen
    const progress2 = await getProgressByUser(user2.id)

    const km1 = progress1.km
    const km2 = progress2.km

    return { km1, km2 }
}

