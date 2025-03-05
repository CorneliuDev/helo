import '/components/slide.js';



//_____________________________________________________________________________
//Slide controls function
//_____________________________________________________________________________
//_____________________________________________________________________________
let slideIndex = 1;
showSlides(slideIndex);

function changeSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.querySelectorAll(".slides");
    let wrapper = document.querySelector("#slides-wrapper");

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    wrapper.style.transform = `translateX(-${(slideIndex - 1) * 25}%)`;
}



