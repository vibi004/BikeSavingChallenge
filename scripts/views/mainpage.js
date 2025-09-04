import { supabase } from "../database/supabase.js";
import { getAllUsers } from "../database/user.js";
import { getProgressByUser, updateProgress } from "../database/progress.js";
import { getSettings } from "../database/settings.js";

document.addEventListener("DOMContentLoaded", async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess?.session) {
        window.location.href = "../index.html";
        alert("Nice try – du musst dich erst einloggen!");
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&themeRefresh=1";
        return;
    }
    const { data: userRes } = await supabase.auth.getUser();
    const currentUser = userRes?.user;

    document.getElementById("user-name").textContent =
        `Hallo ${currentUser?.email ?? "User"}!`;
    document.getElementById("logout").addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "../index.html";
    });

    const settings = await getSettings();
    const moneyGoal = Number(settings?.goal ?? 0);
    const moneyPerKm = Number(settings?.euro_per_km ?? 0);

    const state = new Map();

    const profiles = (await getAllUsers()) ?? [];
    await renderAllUserBars(profiles);

    document.getElementById("addKm").addEventListener("click", async () => {
        const input = prompt("Wie viele Kilometer hinzufügen?");
        const delta = parseFloat(input);
        if (isNaN(delta) || delta <= 0) return;

        const uid = currentUser.id;
        const progress = await getProgressByUser(uid);
        if (!progress) {
            alert("Kein Progress-Datensatz für dich gefunden.");
            return;
        }

        const newKm = Number(progress.km ?? 0) + delta;

        const err = await updateProgress(newKm, uid);
        if (err) {
            alert(err.message ?? "Fehler beim Speichern.");
            return;
        }

        const entry = state.get(uid);
        if (entry) {
            entry.km = newKm;
            updateBar(entry.fillEl, entry.percentEl, newKm);
        }
    });

    async function renderAllUserBars(users) {
        const container = document.getElementById("progress-container");
        container.innerHTML = "";

        users.sort((a, b) => (a.username ?? "").localeCompare(b.username ?? "", "de"));

        console.log(users);
        for (const u of users) {
            const progress = await getProgressByUser(u.id);
            const km = Number(progress?.km ?? 0);

            const row = document.createElement("div");
            row.className = "row mb-4";

            const label = document.createElement("div");
            label.className = "label mb-2";
            label.textContent = u.username ?? (u.id?.slice(0, 8) + "…");

            const progressOuter = document.createElement("div");
            progressOuter.className = "progress";
            progressOuter.setAttribute("aria-label", `Fortschritt ${u.username ?? ""}`);

            const fill = document.createElement("div");
            fill.className = "fill";

            const img = document.createElement("img");
            img.className = "avatar";
            const avatarFile = u.picturename

            img.src = `../resources/${avatarFile}`;
            img.alt = `Avatar von ${u.username ?? "User"}`;
            fill.appendChild(img);

            progressOuter.appendChild(fill);

            const percent = document.createElement("span");
            percent.className = "percent";

            row.appendChild(label);
            row.appendChild(progressOuter);
            row.appendChild(percent);
            container.appendChild(row);

            state.set(u.id, { km, fillEl: fill, percentEl: percent });
            updateBar(fill, percent, km);
        }
    }

    function updateBar(fillEl, percentEl, kmVal) {
        const percent =
            moneyGoal > 0 ? Math.min(100, (kmVal * moneyPerKm / moneyGoal) * 100) : 0;

        fillEl.style.width = percent + "%";

        const euroText = (kmVal * moneyPerKm).toLocaleString("de-AT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        percentEl.textContent =
            `${euroText} € / ${kmVal} km${moneyGoal > 0 ? ` (${percent.toFixed(1)}%)` : ""}`;
    }
});
