const showPassword = document.getElementById("show-password");
showPassword.onclick = togglePassword;

const pass = document.getElementById("pass");
const confirmPass = document.getElementById("confirm-pass");
function togglePassword() {
    if (pass.type === "password") {
        pass.setAttribute("type", "text");
        confirmPass.setAttribute("type", "text");
        showPassword.src = "/assets/icons/show.svg";
    } else {
        pass.setAttribute("type", "password");
        confirmPass.setAttribute("type", "password");
        showPassword.src = "/assets/icons/hide.svg";
    }
}


function checkPasswordStrength() {
    const passwordString = document.getElementById("pass").value;

    let strength = 0;
    if (passwordString.length >= 8) strength++;
    if (/[A-Z]/.test(passwordString) && passwordString.length >= 8) strength++;
    if (/[0-9]/.test(passwordString) && passwordString.length >= 8) strength++;
    if (/[!@#$%^&*]/.test(passwordString) && passwordString.length >= 8) strength++;

    switch (strength) {
        case 0:
            document.getElementById("weak").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strength-text").innerText = "";
            break;
        case 1:
            document.getElementById("weak").className = "w-1/3 bg-red-600 border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strength-text").innerText = "Slabă";
            document.getElementById("strength-text").classList.add("text-red-600");
            break;
        case 2:
            document.getElementById("weak").className = "w-1/3 bg-orange-500 border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-orange-500 border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strength-text").innerText = "Medie";
            document.getElementById("strength-text").classList.add("text-orange-500");
            break;
        case 3:
            document.getElementById("weak").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("strength-text").innerText = "Puternică";
            document.getElementById("strength-text").classList.add("text-green-600");
            break;
        case 4:
            document.getElementById("weak").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-green-600 border-accent rounded-full";
            document.getElementById("strength-text").innerText = "Puternică";
            document.getElementById("strength-text").classList.add("text-green-600");
            break;
        default:
            document.getElementById("weak").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("medium").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strong").className = "w-1/3 bg-accent border-accent rounded-full";
            document.getElementById("strength-text").innerText = "";
            break;
    }
}


const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    const passwordString = document.getElementById("pass").value;
    const confirmPasswordString = document.getElementById("confirm-pass").value;
    const nameString = document.getElementById("nume").value;
    const emailString = document.getElementById("email").value;


    if (nameString.length === "") {
        e.preventDefault();
        document.getElementById("nume").setCustomValidity("Acest câmp este obligatoriu!");
        return false;
    }
    else if (emailString === "") {
        e.preventDefault();
        document.getElementById("nume").setCustomValidity("Acest câmp este obligatoriu!");
        return false;
    }
    else if (passwordString !== confirmPasswordString) {
        e.preventDefault();
        document.getElementById("confirm-pass").setCustomValidity("Parolele nu trebuie să fie identice!");
        return false;
    }
    else if (passwordString.length < 8) {
        e.preventDefault();
        document.getElementById("pass").setCustomValidity("Parola trebuie sa aiba cel putin 8 caractere!");
        return false;
    }

    return true;

});