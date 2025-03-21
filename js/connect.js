const showPassword = document.getElementById("show-password");
showPassword.onclick = togglePassword;

const pass = document.getElementById("pass");
const confirmPass = document.getElementById("confirm-pass");
function togglePassword() {
    if (pass.type === "password") {
        pass.setAttribute("type", "text");
        confirmPass.setAttribute("type", "text");
        showPassword.src = "/media/icons/show.svg";
    } else {
        pass.setAttribute("type", "password");
        confirmPass.setAttribute("type", "password");
        showPassword.src = "/media/icons/hide.svg";
    }
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    const passwordString = document.getElementById("pass").value;
    const emailString = document.getElementById("email").value;

    if (emailString === "") {
        e.preventDefault();
        document.getElementById("nume").setCustomValidity("Acest câmp este obligatoriu!");
        return false;
    }
    else if (passwordString === "") {
        e.preventDefault();
        document.getElementById("pass").setCustomValidity("Acest câmp este obligatoriu!");
        return false;
    }
    return true;

});