window.onload = function() {
    const cookies = document.cookie;
    if(cookies == 'auth=true') {
        const loginPanel = document.getElementById("login");
        loginPanel.classList.add('hidden');
    }
    const myElement = document.querySelector("product-page");
    const button = myElement.shadowRoot.querySelector("#cart_add");
    button.onclick = function() {
        fetch('/addtocart', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({product_id: window.location.pathname.split('/')[2]})
        }).then((response) => response.json()).then((data) => {
            if(data['reason'] == 'noauth') window.location = '/conectare';
        });
        document.getElementById("success-modal").classList.remove("hidden");
    }
}