
        // Funzione per recuperare il numero di elementi dal file JSON
        function getNumItemsForSlider(sliderContainer) {
            // Recupera l'ID dello slider
            const sliderId = sliderContainer.id;
        
            // Effettua una richiesta HTTP per ottenere i dati dal file JSON
            return fetch("assets/database.json")
                .then(response => response.json())
                .then(data => {
                    // Filtra gli elementi nel JSON che corrispondono allo slider
                    const sliderItems = Object.keys(data).filter(key => key.startsWith(sliderId));
                
                    // Restituisci il numero di elementi trovati
                    return sliderItems.length;
                })
                .catch(error => {
                    console.error("Errore durante il recupero dei dati JSON:", error);
                    return 0; // Se si verifica un errore, restituisci 0 elementi
                });
        }

document.addEventListener("DOMContentLoaded", function() {
    // Seleziona tutti i contenitori degli slider
    const sliderContainers = document.querySelectorAll('.slider-container');

    // Itera su ciascun contenitore dello slider
    sliderContainers.forEach(sliderContainer => {
        // Recupera il numero di elementi presenti nel file JSON corrispondenti allo slider
        getNumItemsForSlider(sliderContainer)
            .then(numItems => {
                // Calcola il valore di grid-template-columns in base al numero di elementi
                const gridColumnValue = `repeat(${numItems}, 2fr)`;

                // Aggiorna il CSS del contenitore dello slider
                sliderContainer.style.gridTemplateColumns = gridColumnValue;
            });
    });
});
      document.addEventListener("DOMContentLoaded", function() {
         const sliders = document.querySelectorAll('.slider-container');
      
         sliders.forEach((slider, index) => {
        const imageList = slider.querySelector(".slider-wrapper .image-list");
        const sliderScrollbar = slider.querySelector(".container .slider-scrollbar");
        const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
        const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
        const sliderId = slider.getAttribute("data-slider-id"); // Ottieni l'ID del slider

        // Funzione per generare gli elementi del carosello dal file JSON
        function generateCarouselItems(data) {
            data.forEach(item => {
                // Controlla se l'ID dell'elemento corrisponde a quello del slider
                if (item.id.includes(sliderId)) {
                    const imageItem = document.createElement("img");
                    imageItem.className = "image-item";
                    imageItem.draggable = false;
                    imageItem.src = item.src;
                    imageItem.alt = item.alt;
                    imageItem.id = item.id;

                    // Aggiungi l'evento click per aprire il popup
                    imageItem.addEventListener("click", function() {
                        openPopup(item.videoUrl);
                    });

                    // Aggiungi l'elemento al carosello
                    imageList.appendChild(imageItem);
                }
            });
        }

        // Carica i dati dal file JSON e genera gli elementi del carosello
        fetch("assets/database.json")
            .then(response => response.json())
            .then(data => generateCarouselItems(data))
            .catch(error => console.error("Errore durante il caricamento del JSON:", error));


        });

             // Funzione per aprire il popup con il video di YouTube
             function openPopup(videoUrl) {
            // Imposta l'iframe del video
            var playerDiv = document.getElementById('ytplayer1');
            playerDiv.innerHTML = '<iframe width="1240px" height="700px" src="' + videoUrl + '" frameborder="0" allowfullscreen style="border-radius:20px;" class="iframe"></iframe>';
        
            // Mostra il popup
            document.getElementById("overlay").style.display = "flex";
        }

             // Funzione per chiudere il popup
             function closePopup() {
            // Nascondi il popup
            document.getElementById("overlay").style.display = "none";
        
            // Interrompi la riproduzione del video di YouTube
            document.getElementById("ytplayer1").innerHTML = "";
        }

             // Aggiungi un gestore di eventi per i pulsanti
             const slideButtons = document.querySelectorAll(".slide-button");

             // Aggiungi eventi click ai pulsanti
             slideButtons.forEach(button => {
            button.addEventListener("click", () => {
                const direction = button.id.includes("prev") ? -1 : 1;
                const sliderContainer = button.closest(".slider-container");
                const imageList = sliderContainer.querySelector(".image-list");
                const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
                const scrollAmount = imageList.clientWidth * direction;
                imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });
        });

             // Gestione dello slider
             sliders.forEach((slider, index) => {
            const imageList = slider.querySelector(".slider-wrapper .image-list");
            const sliderScrollbar = slider.querySelector(".container .slider-scrollbar");
            const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
            const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
        
            // Handle scrollbar thumb drag
            scrollbarThumb.addEventListener("mousedown", (e) => {
                const startX = e.clientX;
                const thumbPosition = scrollbarThumb.offsetLeft;
                const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;
            
                // Update thumb position on mouse move
                const handleMouseMove = (e) => {
                    const deltaX = e.clientX - startX;
                    const newThumbPosition = thumbPosition + deltaX;
                    // Ensure the scrollbar thumb stays within bounds
                    const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
                    const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;
                
                    scrollbarThumb.style.left = `${boundedPosition}px`;
                    imageList.scrollLeft = scrollPosition;
                }
              
                // Remove event listeners on mouse up
                const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                }
              
                // Add event listeners for drag interaction
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
            });
          
            // Show or hide slide buttons based on scroll position
            const handleSlideButtons = () => {
                const slideButtons = slider.querySelectorAll(".slider-wrapper .slide-button");
                slideButtons.forEach((button, i) => {
                    button.style.display =
                        i === 0
                            ? imageList.scrollLeft <= 0
                            ? "none"
                            : "flex"
                            : i === slideButtons.length - 1
                            ? imageList.scrollLeft >= maxScrollLeft
                            ? "none"
                            : "flex"
                            : "flex";
                });
            };
          
            // Update scrollbar thumb position based on image scroll
            const updateScrollThumbPosition = () => {
                const scrollPosition = imageList.scrollLeft;
                const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
                scrollbarThumb.style.left = `${thumbPosition}px`;
            };
          
            // Call these two functions when image list scrolls
            imageList.addEventListener("scroll", () => {
                updateScrollThumbPosition();
                handleSlideButtons();
            });
        });

             // Inizializzazione dello slider
             function initSlider() {
            sliders.forEach((slider, index) => {
                const imageList = slider.querySelector(".slider-wrapper .image-list");
                const sliderScrollbar = slider.querySelector(".container .slider-scrollbar");
                const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
                const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
            
                // Reset scrollbar thumb position
                scrollbarThumb.style.left = "0px";
            
                // Show or hide slide buttons based on scroll position
                const handleSlideButtons = () => {
                    const slideButtons = slider.querySelectorAll(".slider-wrapper .slide-button");
                    slideButtons.forEach((button, i) => {
                        button.style.display =
                            i === 0
                                ? imageList.scrollLeft <= 0
                                ? "none"
                                : "flex"
                                : i === slideButtons.length - 1
                                ? imageList.scrollLeft >= maxScrollLeft
                                ? "none"
                                : "flex"
                                : "flex";
                    });
                };
              
                // Update scrollbar thumb position based on image scroll
                const updateScrollThumbPosition = () => {
                    const scrollPosition = imageList.scrollLeft;
                    const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
                    scrollbarThumb.style.left = `${thumbPosition}px`;
                };
              
                // Call these two functions when image list scrolls
                imageList.addEventListener("scroll", () => {
                    updateScrollThumbPosition();
                    handleSlideButtons();
                });
            });
        }

             // Aggiungi gli eventi di ridimensionamento e caricamento per inizializzare lo slider
             window.addEventListener("resize", initSlider);
             window.addEventListener("load", initSlider);
         });

    function closePopup() {
    // Nascondi il popup
    document.getElementById("overlay").style.display = "none";

    // Interrompi la riproduzione del video di YouTube
    document.getElementById("ytplayer1").innerHTML = "";
    }

    // Aggiungi un event listener all'overlay per chiudere il popup
    document.getElementById("overlay").addEventListener("click", function(event) {
        if (event.target === this) {
            closePopup();
        }
    });

    // Aggiungi un event listener al pulsante di chiusura per chiudere il popup
    document.getElementById("closeBtn").addEventListener("click", function() {
        closePopup();
    });