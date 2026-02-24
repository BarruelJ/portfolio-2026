/*
   Logique  :
     Config et utilitaires
     Lenis + GSAP init
     Dark mode & titre hover
     Animations panel 2 
     Animations panel 3
     Projet Modal
     Effet magnétique
     Init & resize */


/* CONFIG & UTILITAIRES */

// Trigger
const BREAKPOINT_XL = 1920;
const BREAKPOINT_MD = 1024;

const isXL = () => window.innerWidth >= BREAKPOINT_XL;
const isMD = () => window.innerWidth >= BREAKPOINT_MD;

// Éléments
const heroLeft = document.querySelector('.hero-left');
const cvContainer = document.querySelector('.cv-container');
const aboutContainer = document.querySelector('.about-container');
const skillsPanel = document.querySelector('.panel-2');
const skillsWrapper = document.querySelector('.skills-header-wrapper');
const skillCards = gsap.utils.toArray('.skill-card');
const panel3 = document.querySelector('.panel-3');
const titleWrapper = document.querySelector('.title-wrapper');
const projectCards = gsap.utils.toArray('.project-card');

// ScrollTriggers
let triggers = [];

function killAllTriggers() {
    triggers.forEach(st => st?.kill());
    triggers = [];
}


/* LENIS et GSAP */
gsap.registerPlugin(ScrollTrigger);

// Reset
gsap.set(['.about-container', '.cv-container', '.hero-left', '.hero-right',
    '.panel-1', '.hero-split-container', '.skills-header-wrapper', '.title-wrapper'], {
    clearProps: 'all'
});

const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


/* DARK MODE & TITRE HOVER */
const themeBtn = document.querySelector('#theme-toggle');
let titleTl = null;

function initTitleHover() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const firstName = heroTitle.querySelector('.first-name');
    const lastName = heroTitle.querySelector('.last-name');

    titleTl?.kill();
    gsap.set([firstName, lastName], { clearProps: 'color' });

    const style = getComputedStyle(document.body);
    const colorBg = style.getPropertyValue('--bg').trim();
    const colorText = style.getPropertyValue('--text').trim();

    titleTl = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: 'power2.out' } });
    titleTl.to(firstName, { color: colorBg }, 0)
        .to(lastName, { color: colorText }, 0);

    heroTitle.onmouseenter = () => titleTl.play();
    heroTitle.onmouseleave = () => titleTl.reverse();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-dark-mode', isDark);
    initTitleHover();
}

// Fixe flash thèmes clairs / sombres
const savedTheme = localStorage.getItem('portfolio-dark-mode');
if (savedTheme === 'true' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
}

themeBtn?.addEventListener('click', toggleTheme);


/* ANIMATIONS PANEL 2 */

function initSkillsXL() {

    const vpH = window.innerHeight;

    gsap.set(aboutContainer, { willChange: 'transform' });

    // CV démarre sous le viewport
    gsap.set(cvContainer, { y: vpH, willChange: 'transform' });

    // Pin panel 1 sur toute la page
    triggers.push(ScrollTrigger.create({
        trigger: '.panel-1',
        start: 'top top',
        endTrigger: 'html',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
    }));

    // About 
    triggers.push(
        gsap.to(aboutContainer, {
            y: -(aboutContainer.offsetHeight + vpH),
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.panel-spacer',
                start: 'top bottom',
                end: 'top top',
                scrub: true,
            }
        }).scrollTrigger
    );

    // CV 
    triggers.push(
        gsap.to(cvContainer, {
            y: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.panel-spacer',
                start: 'top+=200px bottom',
                end: '60% bottom',
                scrub: true,
            }
        }).scrollTrigger
    );

    // Pin du titre skills 
    triggers.push(ScrollTrigger.create({
        trigger: skillsPanel,
        start: 'top+=20px top',
        endTrigger: '.panel-3',
        end: 'top top',
        pin: skillsWrapper,
        pinSpacing: false,
    }));

    // Cards skills
    skillCards.forEach(card => {
        triggers.push(
            gsap.fromTo(card,
                { y: 80, opacity: 0.9 },
                {
                    y: 0, opacity: 1,
                    ease: 'power1.inOut',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=50vh',
                        end: 'top top+=70',
                        scrub: true,
                    }
                }
            ).scrollTrigger
        );
    });

    // Remontée finale
    const lastCard = skillCards[skillCards.length - 1];
    const moveDist = skillsPanel.offsetHeight - skillsWrapper.offsetHeight;

    const finalTl = gsap.timeline({
        scrollTrigger: {
            trigger: lastCard,
            start: 'top+=150 top',
            endTrigger: '.panel-3',
            end: 'top top+=50',
            scrub: 2,
        }
    });

    finalTl
        .to(skillsWrapper, { y: -moveDist, ease: 'none' }, 0)
        .to(heroLeft, { y: -moveDist, ease: 'none' }, 0);

    triggers.push(finalTl.scrollTrigger);
}
function initSkillsResponsive() {

    // Reset complet
    gsap.set([heroLeft, cvContainer, aboutContainer,
        skillsWrapper, '.panel-1', '.hero-right'], {
        clearProps: 'all'
    });



    // Fade-in cascade des cards
    skillCards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 24 });
        triggers.push(
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                delay: i * 0.05,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                }
            }).scrollTrigger
        );
    });
}


/* ANIMATIONS PANEL 3 */

function initProjectsAnimations() {

    // État initial
    gsap.set(projectCards, { opacity: 0, y: 24 });

    if (isXL()) {

        // Pin du titre projets sous la nav
        triggers.push(ScrollTrigger.create({
            trigger: panel3,
            start: 'top 91px',
            endTrigger: '.panel-4',
            end: 'top top',
            pin: titleWrapper,
            pinSpacing: false,
        }));

        projectCards.forEach(card => {
            triggers.push(
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    ease: 'power1.inOut',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=80px',
                        end: 'top center',
                        scrub: true,
                    }
                }).scrollTrigger
            );
        });

        // Titre disparaît à l'arrivé du panel 4
        triggers.push(
            gsap.to(titleWrapper, {
                y: -200, opacity: 1,
                ease: 'power2.in',
                scrollTrigger: {
                    trigger: '.panel-4',
                    start: 'top center',
                    end: 'top top+=101px',
                    scrub: true,
                }
            }).scrollTrigger
        );

    } else {

        // Reset titleWrapper
        gsap.set(titleWrapper, { clearProps: 'all' });

        // Fade-in cascade
        projectCards.forEach((card, i) => {
            triggers.push(
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out',
                    delay: i * 0.05,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }).scrollTrigger
            );
        });
    }
}


/* MODAL PROJETS */
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

const projectsData = {
    1: {
        title: 'Portfolio Interactif',
        number: '01',
        image: 'images/projet1.webp',
        tags: ['GSAP', 'ScrollTrigger', 'Lenis'],
        description: 'Site vitrine personnel avec animations GSAP avancées, effet parallaxe et scroll fluide via Lenis.',
        link: '#'
    },
    2: {
        title: 'Site Vitrine',
        number: '02',
        image: 'images/projet2.webp',
        tags: ['WordPress', 'Kadence'],
        description: "Création d'un site vitrine pour une entreprise d'isolation. Thème personnalisé avec Kadence.",
        link: '#'
    },
    3: {
        title: 'Moteur de génération PDF',
        number: '03',
        image: 'images/projet3.webp',
        tags: ['TKinter', 'Reportlab', 'Python'],
        description: "Générateur d'étiquettes et de documents PDF dynamiques avec interface graphique TKinter.",
        link: '#'
    },
};

function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    document.querySelector('.modal-number').textContent = project.number;
    document.querySelector('.modal-title').textContent = project.title;
    document.querySelector('.modal-description').textContent = project.description;
    document.querySelector('.modal-link').href = project.link;

    const img = document.querySelector('.modal-image img');
    img.src = project.image;
    img.alt = project.title;

    const tagsEl = document.querySelector('.modal-tags');
    tagsEl.innerHTML = project.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis.stop();

    gsap.fromTo('.modal-content',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );
}

function closeModal() {
    gsap.to('.modal-content', {
        scale: 0.85,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.4)',
        onComplete: () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            lenis.start();
        }
    });
}

projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
});

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});


/* EFFET MAGNÉTIQUE */
function initMagnetic() {
    if (!isMD()) return; // pas sur mobile/tablette

    const targets = document.querySelectorAll(
        '.card-cta, .btn-accent, .meta-item.clickable-badge, .modal-close, #theme-toggle, .hero-tagline a, .contact-cta'
    );

    targets.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
            gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });
}


/* ANCRES NAVIGATION */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        lenis.scrollTo(target, { offset: -91, duration: 1.2 });
    });
});

/* INIT & RESIZE */
function init() {
    killAllTriggers();

    gsap.set([
        heroLeft, cvContainer, aboutContainer,
        skillsWrapper, titleWrapper,
        '.panel-1', '.hero-right', '.hero-split-container'
    ], { clearProps: 'all' });

    if (isXL()) {
        initSkillsXL();
    } else {
        initSkillsResponsive();
    }

    initProjectsAnimations();
    initTitleHover();
    initMagnetic();

    ScrollTrigger.refresh();
}

// Lancement au chargement
window.addEventListener('load', () => {
    init();

    // Refresh après chargement
    const images = document.querySelectorAll('img');
    let loaded = 0;
    const onLoad = () => {
        loaded++;
        if (loaded === images.length) ScrollTrigger.refresh();
    };
    images.forEach(img => {
        if (img.complete) onLoad();
        else img.addEventListener('load', onLoad);
    });
});

// Resize
let resizeTimer;
let prevXL = isXL();

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const nowXL = isXL();
        // Reinit complète
        if (nowXL !== prevXL) {
            prevXL = nowXL;
            init();
        } else {
            // Simple refresh
            ScrollTrigger.refresh();
        }
    }, 250);
});