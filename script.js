/* Shared page behavior: reveals, navigation state, progress, and mobile menu. */
document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".section");
    const navLinks = [...document.querySelectorAll("#site-nav a")];
    const chapters = [...document.querySelectorAll(".chapter[id]")];
    const menuButton = document.querySelector(".menu-toggle");
    const progress = document.querySelector(".scroll-progress span");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach(item => item.classList.add("show"));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
        revealItems.forEach(item => revealObserver.observe(item));
    }

    const chapterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
        });
    }, { rootMargin: "-30% 0px -60%", threshold: 0 });
    chapters.forEach(chapter => chapterObserver.observe(chapter));

    function closeMenu() {
        document.body.classList.remove("menu-open");
        menuButton?.setAttribute("aria-expanded", "false");
        if (menuButton) menuButton.querySelector("span").textContent = "+";
    }

    menuButton?.addEventListener("click", () => {
        const open = document.body.classList.toggle("menu-open");
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.querySelector("span").textContent = open ? "−" : "+";
    });
    navLinks.forEach(link => link.addEventListener("click", closeMenu));

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
            if (progress) progress.style.width = `${percent}%`;
            ticking = false;
        });
    }, { passive: true });
});
