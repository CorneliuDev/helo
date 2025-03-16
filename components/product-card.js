import { LitElement, html, css } from 'https://esm.sh/lit';

class ProductCard extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    price: { type: String },
    rating: { type: String },
    starIcon:{type: String}
  };

  static styles = css`
    
  `;

  constructor() {
    super();
    this.link = '';
    this.image = '';
    this.title = '';
    this.price = '';
    this.oldPrice = '';
    this.rating = '';
    this.starIcon = new URL("../media/icons/star.svg", import.meta.url).href;

  }


  render() {
    return html`
      <a href="${this.link}" class="product-card">
        <img class="product-image" src="${this.image}" alt="Product Image" />
        <div class="product-info">
          <div class="product-prices">
            ${this.oldPrice
              ? html`
                  <p class="current-price">${this.currentPrice} MDL</p>
                  <div class="old-price">${this.oldPrice}</div>
                `
              : html`
                  <p class="current-price" style="color:black">${this.currentPrice} MDL</p>
                `}
          </div>
          <p class="product-title truncate-text">${this.title}</p>
          <div class="product-rating-add-cart">
            <div class="product-rating">
              ${this.rating == 5
                ? html`<p style="color: #ff4363 !important; font-weight: 500">${this.rating}</p>`
                : html`<p>${this.rating}</p>`}
              <img src="${this.starIcon}" alt="Star" />
            </div>
            <!-- <button class="add-to-cart">În coș</button> -->
          </div>
        </div>
      </a>
    `;
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;
