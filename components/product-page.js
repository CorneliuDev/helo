import { LitElement, html, css } from 'https://esm.sh/lit';

class ProductPage extends LitElement {
  static properties = {
    images: { type: Array },
    title: { type: String },
    currentPrice: { type: String },
    oldPrice: { type: String },
    rating: { type: String },
    starIcon:{type: String},
    description: { type: String },

  };

  static styles = css`
  * {
    margin: 0;
  }
     .product-section {
            display: grid;
            grid-template-columns: 2fr 2.4fr;
            gap: 6rem;
            margin: 50px 0;
    
            width: 100%;
            
        }
        
    
        @media (max-width: 1024px) {
            .product-section {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }
        
        .images-container {
            display: flex;
            flex-direction: column;
            
        }

        .main-image {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 4%;
            box-shadow: 0 0 20px rgba(31, 47, 84, 0.08);
            border: 1px solid #F2F2F2;
        }
        
        .small-images {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem 0;
            overflow-x: auto;
        }
        
    
        .small-images::-webkit-scrollbar {
            height: 8px;
        }
        
        .small-images::-webkit-scrollbar-thumb {
            background: #c0c0c0;
            border-radius: 10px;
        }
        
        .the-small-image {
            aspect-ratio: 1 / 1;
            border-radius: 10%;
            cursor: pointer;
            transition: filter 0.2s ease-in-out;
            border: 1px solid #F2F2F2;
            height: clamp(90px, 8vw, 100px);
        }
        
        .the-small-image:hover {
            filter: brightness(0.8);
        }
        
        .content-container {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        @media (max-width: 768px) { 
        .content-container {
            padding: 0 1rem;
            box-sizing: border-box;
        }
        }
        
        .product-title {
            font-size: clamp(1.5rem, 2.5vw, 2rem);
            font-weight: 500;
            line-height: 1.2;
            width: 100%;
            margin: 0;
        }
        
        .product-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
            box-shadow: 0 0 20px rgba(31, 47, 84, 0.08);
            padding: 0.2rem 1rem;
            border-radius: 7px;
            width: fit-content;
        }
        
        .product-rating img {
            width: 20px;
        }
            .product-rating p {
                margin: 0;
            }
        
        .price-and-types {
            border-top: 1px solid #c5c5c5;
            border-bottom: 1px solid #c5c5c5;
            padding: 1rem 0;
        }
        
        .price-container {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .price {
            font-size: clamp(1.5rem, 2.5vw, 2.5rem);
            font-weight: 600;
            margin: 0;
        }
        
        .old-price {
            text-decoration: line-through;
            color: rgb(142, 142, 142);
        }
        
        .delivery {
        margin:0;
        }

        .add-to-cart {
            margin: 2rem 0 1rem;
            background-color: var(--coral);
            color: white;
            height: 55px;
            width: 200px;
            font-size: 1.5rem;
            font-weight: 500;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
            border: none;
        }
        
        .add-to-cart:active {
            transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
            .add-to-cart {
                width: 100%;
            }
        }
        
        .description {
            border: 1px solid var(--gray);
            padding: 1rem;
            margin: 2rem 0;
            border-radius: 20px;
        }
        
        .description-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
  `;

  constructor() {
    super();
    this.title = '';
    this.currentPrice = '';
    this.oldPrice = '';
    this.rating = '';
    this.starIcon = new URL("/media/icons/star.svg", import.meta.url).href;
    this.description = '';
  }

  firstUpdated() {
    const smallImages = this.shadowRoot.querySelectorAll(".the-small-image");
    const mainImage = this.shadowRoot.querySelector(".main-image");

    if (smallImages.length > 0) {
        mainImage.src = smallImages[0].src;
    }

    smallImages.forEach(image => {
        image.addEventListener("click", () => {
            mainImage.src = image.src;
        });
    });
}


  render() {
    return html`
       <section class="product-section">
        <div class="images-container">
            <img src="${this.images[0]}" alt="Product Image" class="main-image">
            <div class="small-images">
            ${this.images.map(image => html`<img src="${image}" alt="" class="the-small-image">`)}
            </div>
        </div>
        <div class="content-container">
            <h1 class="product-title">${this.title}</h1>
            <div class="product-rating">
                <p>${this.rating}</p>
                <img src="${this.starIcon}" alt="Star Rating">
            </div>
            <div class="price-and-types">
                <div class="price-container">
                ${this.oldPrice ?
                    html`<p class="price current-price" style="color:#FF4363">${this.currentPrice} MDL</p>
                    <p class="price old-price">${this.oldPrice} MDL</p>` : 
                    html`
                    <p class="price current-price">${this.currentPrice} MDL</p>`} 
                </div>
            </div>
            <button class="add-to-cart" id="cart_add">Adaugă în coș</button>
            <p class="delivery">Livrare gratuită în 2-3 zile</p>
            <div class="description">
                <h2 class="description-title">Descriere</h2>
                ${this.description ? html`<p class="description-text">${this.description}</p>` : html``}
            </div>
        </div>
    </section>
    `;
  }
}

customElements.define('product-page', ProductPage);

export default ProductPage;
