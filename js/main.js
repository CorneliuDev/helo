let count = 0;
const div = document.getElementById("products");

function fillData(item)
{
    const product = document.createElement('product-card');
    product.setAttribute('title', item['title']);
    product.setAttribute('link', `/product/${item['id_product']}`);
    product.setAttribute('image', `/media/images/${item['image'].split(';')[0]}`);
    product.setAttribute('rating', item['rating']);
    product.setAttribute('currentPrice', item['currentPrice']);
    if(item['oldPrice'] != null)
        product.setAttribute('oldPrice', item['oldPrice']);
    div.appendChild(product);
}

function getProducts()
{
    fetch('/fetch-data', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({offset: 20*count++})
    }).then(response => response.json())
    .then(data => data['message'].forEach(fillData))
    .catch(error => console.log(`Error:${error}`));
}
getProducts();