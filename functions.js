window.onload = function() {
    const cookies = document.cookie;
    if(cookies == 'auth=true') {
        const loginPanel = document.getElementById("login");
        loginPanel.classList.add('hidden');
    }
}