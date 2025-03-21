window.onload = function()
{
    const cookies = document.cookie;
    if(cookies == 'auth=true') {
        const loginPanel = document.getElementById("login");
        loginPanel.classList.add('hidden');
    }
}

// ====================== PAYMENT METHOD HANDLING ======================
let paymentMethodExists = false;
// Show modal for adding a new payment method
document.getElementById('add-payment-method').addEventListener('click', function () {
    document.getElementById('add-payment-method-modal').classList.remove('hidden');
});

// Close modal for adding a new payment method
document.getElementById('close-payment-method-modal').addEventListener('click', function () {
    document.getElementById('add-payment-method-modal').classList.add('hidden');
});

// Handle form submission for new payment method
document.getElementById('payment-method-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const cardHolder = document.getElementById('card-holder').value;
    const cardNumber = document.getElementById('card-number').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const cvv = document.getElementById('cvv').value;

    // Create a new payment method item
    const paymentMethodContainer = document.getElementById('payment-options-container');

    const newPaymentMethod = document.createElement('div');
    newPaymentMethod.classList.add('payment-method');
    newPaymentMethod.innerHTML = `
     <input type="radio" name="payment-method" checked>
        <p><strong>Cardholder:</strong> ${cardHolder}</p>
        <p><strong>Card Number:</strong> **** **** **** ${cardNumber.slice(-4)}</p>
        <p><strong>Expiration Date:</strong> ${expirationDate}</p>
        <p><strong>CVV:</strong> ***</p>
        <button class="remove-payment-method">Șterge</button>
    `;
    
    // Add new payment method to the container
    paymentMethodContainer.appendChild(newPaymentMethod);

    // Close modal after adding payment method
    document.getElementById('add-payment-method-modal').classList.add('hidden');

    // Clear form fields
    document.getElementById('payment-method-form').reset();

    paymentMethodExists = true;
});

// Remove a payment method
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('remove-payment-method')) {
        const paymentMethod = event.target.closest('.payment-method');
        paymentMethod.remove();
    }
});


// ====================== ADDRESS HANDLING ======================

let addressExists = false;
// Show modal for adding a new address
document.querySelector('#add-address').addEventListener('click', function () {
    document.getElementById('add-address-modal').classList.remove('hidden');
});

// Close modal for adding a new address
document.getElementById('close-address-modal').addEventListener('click', function () {
    document.getElementById('add-address-modal').classList.add('hidden');
});

// Handle form submission for new address
document.getElementById('address-form').addEventListener('submit', function (event) {
    event.preventDefault();

    saveAddress();
});


function saveAddress() {
    const city = document.querySelector('#city').value;
    const street = document.querySelector('#street').value;
    const block = document.querySelector('#block').value;
    const apartment = document.querySelector('#apartment').value;
    const postal = document.querySelector('#postal').value;

    let newAddress = `${city}, ${street} ${block}/${apartment}, MD-${postal}`;

    document.getElementById('add-address-modal').classList.add('hidden');

    
    if (newAddress) {
        const addressContainer = document.getElementById('addresses-container');
        const addressDiv = document.createElement('div');

        const radioLabel = document.createElement('label');
        radioLabel.classList.add('flex', 'items-center', 'gap-2');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'address-selection';
        radioInput.checked = true;
        radioLabel.appendChild(radioInput);
        radioLabel.appendChild(document.createTextNode(newAddress));

        addressDiv.classList.add('address-entry', 'flex', 'items-center', 'gap-2', 'my-2');
        addressDiv.appendChild(radioLabel);
        addressContainer.appendChild(addressDiv);

        addressExists = true;
    }
}


// ====================== ORDER COMPLETION HANDLING ======================

// Handle finish order
const finishOrder = document.querySelector("#finish-order");
document.getElementById("finish-order").addEventListener("click", function (event) {
    if (!addressExists || !paymentMethodExists) {
        event.preventDefault(); 
        document.getElementById("error-modal").classList.remove("hidden");
    } else {
        window.location = "/comanda-finalizata";
    }
});
