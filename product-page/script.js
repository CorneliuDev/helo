const smallImages=document.querySelectorAll(".the-small-image");
const mainImage=document.querySelector(".main-image");

mainImage.src=smallImages[0].src;

smallImages.forEach(image => {
    image.addEventListener("click", () => {
        mainImage.src=image.src;
    })
}); 