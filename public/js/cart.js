window.onload = function() {
    const cookies = document.cookie;
    if(cookies == 'auth=true') {
        const loginPanel = document.getElementById("login");
        loginPanel.classList.add('hidden');
    }
    document.addEventListener('update-cart', function(event) {
        const {id, user, change} = event.detail;
        fetch('/updateAmount', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: id, user: user, change: change})
        });
    });
    document.addEventListener('delete-cart', function(event) {
        const {id, user} = event.detail;
        fetch('/deleteItemCart', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: id, user: user})
        });
        window.location.reload();
    });
}

function finalise()
{
    document.getElementById("couponValidation").value = document.getElementById("coupon").value;
    document.getElementById("submitOrder").submit();
}
function applycoupon()
{
    const totalPriceItem = document.getElementById("total-price");
    const inputCouponValue = document.getElementById("coupon").value;                            
    const couponValue = document.getElementById("cupon-value");
    const cuponApplied = document.getElementById("cupon-applied");
    const subTotalPrice = document.getElementById("subtotal-price").innerText;
    fetch('/check-coupon', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({coupon: inputCouponValue})
    }).then((response) => response.json())
    .then((data) => {
        const rate = data['result']['rate'];
        cuponApplied.classList.remove("hidden");
        document.getElementById("currency").classList.add("text-[var(--coral)]");
        totalPriceItem.classList.add("text-[var(--coral)]");
        couponValue.innerText = `-${rate}%`;
        totalPriceItem.innerText = Math.round((subTotalPrice - rate / 100 * subTotalPrice) * 100) / 100;
    })
    .catch(error => console.log(`Error:${error}`));
}