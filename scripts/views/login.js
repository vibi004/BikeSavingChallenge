import { supabase } from "../database/supabase.js";

const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

const { data: sess } = await supabase.auth.getSession();
if (sess?.session) {
    window.location.href = "./pages/mainpage.html";
}
let failCount = 0;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "msg";

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
        msg.textContent = "Bitte E-Mail und Passwort eingeben.";
        msg.classList.add("err");
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    const messages = [
        "Nope, falsch️",
        "Versuch's nochmal",
        "Zugang verweigert",
        "Fast… aber nur fast",
    ];

    if (error) {
        failCount++;
        if (failCount >= 3) {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            return;
        }
        const rand = Math.floor(Math.random() * messages.length);
        msg.textContent = messages[rand];
        msg.classList.add("err");
        return;
    }
    failCount = 0;

    msg.textContent = "Erfolgreich eingeloggt – weiterleiten…";
    msg.classList.add("ok");
    window.location.href = "./pages/mainpage.html";
});