//_____________________________________________________________________________________________________________________________________________________________
//Slide controls function
//_____________________________________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________________________________
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

            if (n > slides.length) {
                slideIndex = 1;   
            }
            if (n < 1) { 
                slideIndex = slides.length;   
            }

            let translateValue = -(slideIndex - 1)*(100/slides.length);
            wrapper.style.transform = `translateX(${translateValue}%)`;
        }

        
        let wrapper = document.querySelector("#slides-wrapper");
        wrapper.addEventListener("mouseover", () =>  {
           
        })

        function autoSlides() {
            changeSlides(1);
        }
        setTimeout(setInterval(autoSlides, 3000),2000);
        
//_____________________________________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________________________________


