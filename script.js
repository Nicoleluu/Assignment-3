// ------------------------------
// Smooth Fade In
// ------------------------------

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.15
});

sections.forEach(section => {
    observer.observe(section);
});


// ------------------------------
// Hover Effect for Chair Parts
// ------------------------------

const parts = document.querySelectorAll(".part");

parts.forEach(part => {

    part.addEventListener("mouseenter", () => {

        part.textContent = getDescription(part.textContent);

    });

    part.addEventListener("mouseleave", () => {

        part.textContent = getName(part.textContent);

    });

});

function getDescription(name){

    switch(name){

        case "Backrest":
            return "Supports your back";

        case "Seat":
            return "Carries your weight";

        case "Frame":
            return "Connects every part";

        case "Legs":
            return "Keeps everything balanced";

        default:
            return name;
    }

}

function getName(text){

    if(text.includes("Supports")) return "Backrest";
    if(text.includes("Carries")) return "Seat";
    if(text.includes("Connects")) return "Frame";
    if(text.includes("Keeps")) return "Legs";

    return text;

}


// ------------------------------
// Button Hover Animation
// ------------------------------

const button = document.querySelector(".button");

button.addEventListener("mouseenter", () => {

    button.textContent = "Let's Go →";

});

button.addEventListener("mouseleave", () => {

    button.textContent = "Begin";

});


// ------------------------------
// Reveal Hero Slightly on Scroll
// ------------------------------

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero");

    hero.style.opacity = 1 - window.scrollY / 900;

});
