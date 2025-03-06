import { LitElement, html, css } from 'https://esm.sh/lit';

class ProductCard extends LitElement {
  static properties = {
    link: { type: String },
    image: { type: String },
    title: { type: String },
    currentPrice: { type: String },
    oldPrice: { type: String },
    rating: { type: String }
  };

  static styles = css`

    .product-card {
    color: inherit; 
        text-decoration: none;
      cursor:pointer;
      padding: 8px;
      height: 350px;
      width: 100%;
      background: white;
      box-shadow: 0 0 20px #1f2f5415;;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: space-between;
      box-sizing: border-box;
      solid .5px #F2F2F2;
    }
    .product-image {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
    }
    .product-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    .product-prices {
      display: flex;
      gap: 8px;
      align-items: center;
      height: 24px;
      margin: 0;
      padding: 0;
      
    }
    .current-price {
      font-weight: 500;
      font-size: 1.5rem;
      color: var(--coral, #ff5733);
      line-height: 0;
    }
    .old-price {
      position: relative;
      font-size: 1rem;
      color: gray;
      line-height: 0;
    }
    .old-price::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      background: gray;
      transform: rotate(10deg);
    }
    .product-title {
      font-size: 1rem;
      line-height: 0;
      margin: 0;
    }
    .product-rating-add-cart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin:0;
    }
    .product-rating {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #f9f9f9;
      width: 85px;
      height: 30px;
      border-radius: 8px;
    }
    button {
    font-size: 1.1rem;
      height: 35px;
      width: 100px;
      background: var(--coral, #ff5733);
      color: white;
      border-radius: 8px;
      transition: transform 0.15s;
      border: solid .5px #F2F2F2;
      z-index: 1;
    }
    button:active {
      transform: scale(0.95);
    }
  `;

  constructor() {
    super();
    this.link = '';
    this.image = '';
    this.title = '';
    this.currentPrice = '';
    this.oldPrice = '';
    this.rating = '';
  }

  render() {
    return html`
      <a href="${this.link}" class="product-card">
        <img class="product-image" src="${this.image}" alt="Product Image" />
        <div class="product-info">
          <div class="product-prices">
            ${this.oldPrice
              ? html`
              <p class="current-price" >${this.currentPrice} MDL</p>
              <div class="old-price">${this.oldPrice}</div>`
              : html`<p class="current-price" style="color:black">${this.currentPrice} MDL</p>`}
          </div>
          <p class="product-title">${this.title}</p>
        
        <div class="product-rating-add-cart">
          <div class="product-rating">
            <p>${this.rating}/5</p>
            <img src="media/icons/star.svg" alt="Star" />
          </div>
          <button>În coș</button>
        </div>
        </div>
      </a>
    `;
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;