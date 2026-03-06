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
const BREAKPOINT_SM = 768;

const isXL = () => window.innerWidth >= BREAKPOINT_XL;
const isMD = () => window.innerWidth >= BREAKPOINT_MD;
const isSM = () => window.innerWidth >= BREAKPOINT_SM;


// Éléments
const heroLeft = document.querySelector('.hero-left');
const cvContainer = document.querySelector('.cv-container');
const aboutContainer = document.querySelector('.about-container');
const skillsPanel = document.querySelector('.panel-2');
const skillsWrapper = document.querySelector('.skills-header-wrapper');
const panel3 = document.querySelector('.panel-3');
const titleWrapper = document.querySelector('.title-wrapper');

// SkillCards
let skillCards = [];

// ProjectCards 
let projectCards = [];


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

const moonPath = "M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C388.8 576 451.3 548.8 497.3 504.6C504.6 497.6 506.7 486.7 502.6 477.5C498.5 468.3 488.9 462.6 478.8 463.4C473.9 463.8 469 464 464 464C362.4 464 280 381.6 280 280C280 207.9 321.5 145.4 382.1 115.2C391.2 110.7 396.4 100.9 395.2 90.8C394 80.7 386.6 72.5 376.7 70.3C358.4 66.2 339.4 64 320 64z";
const sunPath = "M320 192C375.228 192 420 236.772 420 292C420 347.228 375.228 392 320 392C264.772 392 220 347.228 220 292C220 236.772 264.772 192 320 192Z M344 134H296V0H344V134Z M344 640H296V506H344V640Z M134 344H0V296H134V344Z M640 344H506V296H640V344Z M212.904 178.62L184.62 206.904L91.7676 114.052L120.052 85.7676L212.904 178.62Z M555.232 114.052L462.38 206.904L434.096 178.62L526.948 85.7676L555.232 114.052Z M212.904 461.38L120.052 554.232L91.7676 525.948L184.62 433.096L212.904 461.38Z M555.232 525.948L526.948 554.232L434.096 461.38L462.38 433.096L555.232 525.948Z";
const themeIcon = document.querySelector('#theme-toggle path');

function updateThemeIcon(isDark) {
    themeIcon?.setAttribute('d', isDark ? sunPath : moonPath);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-dark-mode', isDark);
    updateThemeIcon(isDark);
    initTitleHover();
}

// Fixe flash thèmes clairs / sombres
const savedTheme = localStorage.getItem('portfolio-dark-mode');
const isDark = savedTheme === 'true' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
if (isDark) document.body.classList.add('dark-mode');
updateThemeIcon(isDark);

themeBtn?.addEventListener('click', toggleTheme);

const burgerBtn = document.querySelector('.btn-burger');
const body = document.body;
burgerBtn.addEventListener('click', () => {
    body.classList.toggle('nav-open');
    console.log('body = nav-open')
});

window.addEventListener('resize', () => {
    if (isSM() && body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
    }
});


const skillsData = [
    {
        number: '01',
        title: 'JavaScript ES6+',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M96 96L96 544L544 544L544 96L96 96zM339.8 445.4C339.8 489 314.2 508.9 276.9 508.9C243.2 508.9 223.7 491.5 213.7 470.4L248 449.7C254.6 461.4 260.6 471.3 275.1 471.3C288.9 471.3 297.7 465.9 297.7 444.8L297.7 301.7L339.8 301.7L339.8 445.4zM439.4 508.9C400.3 508.9 375 490.3 362.7 465.9L397 446.1C406 460.8 417.8 471.7 438.5 471.7C455.9 471.7 467.1 463 467.1 450.9C467.1 436.5 455.7 431.4 436.4 422.9L425.9 418.4C395.5 405.5 375.4 389.2 375.4 354.9C375.4 323.3 399.5 299.3 437 299.3C463.8 299.3 483 308.6 496.8 333L464 354C456.8 341.1 449 336 436.9 336C424.6 336 416.8 343.8 416.8 354C416.8 366.6 424.6 371.7 442.7 379.6L453.2 384.1C489 399.4 509.1 415.1 509.1 450.3C509.1 488.1 479.3 508.9 439.4 508.9z" />
                </svg>`,
        description: `Création d'animations interactives et gestion avancée du DOM pour des expériences utilisateur dynamiques.`
    },

    {
        number: '02',
        title: 'React / Next.js',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M482.2 241.2C476.8 239.4 471.4 237.7 466 236.1C466.9 232.4 467.7 228.7 468.5 225C480.8 165.4 472.7 117.5 445.4 101.7C419.1 86.6 376.2 102.3 332.8 140.1C328.5 143.8 324.3 147.7 320.3 151.6C317.6 149 314.8 146.4 312 143.9C266.5 103.5 220.9 86.5 193.6 102.4C167.4 117.6 159.6 162.7 170.6 219.1C171.7 224.7 172.9 230.2 174.3 235.8C167.9 237.6 161.6 239.6 155.7 241.7C102.3 260.2 64 289.4 64 319.6C64 350.8 104.8 382.1 160.3 401.1C164.8 402.6 169.3 404.1 173.9 405.4C172.4 411.4 171.1 417.3 169.9 423.4C159.4 478.9 167.6 522.9 193.8 538C220.8 553.6 266.2 537.6 310.4 498.9C313.9 495.8 317.4 492.6 320.9 489.2C325.3 493.5 329.9 497.6 334.5 501.6C377.3 538.4 419.6 553.3 445.7 538.2C472.7 522.6 481.5 475.3 470.1 417.7C469.2 413.3 468.2 408.8 467.1 404.2C470.3 403.3 473.4 402.3 476.5 401.3C534.2 382.2 576 351.3 576 319.6C576 289.3 536.6 259.9 482.2 241.2zM346.9 156.3C384.1 123.9 418.8 111.2 434.6 120.3C451.5 130 458 169.2 447.4 220.7C446.7 224.1 446 227.4 445.1 230.7C422.9 225.7 400.4 222.1 377.8 220.1C364.8 201.5 350.6 183.7 335.2 167C339.1 163.3 342.9 159.8 346.9 156.3zM231.2 371.5C236.3 380.2 241.5 388.9 247 397.4C231.4 395.7 215.9 393.2 200.6 389.9C205 375.5 210.5 360.6 216.9 345.4C221.5 354.2 226.2 362.9 231.2 371.5zM200.9 251.2C215.3 248 230.6 245.4 246.5 243.4C241.2 251.7 236 260.2 231.1 268.8C226.2 277.3 221.4 286 216.9 294.8C210.6 279.9 205.3 265.3 200.9 251.2zM228.3 320.1C234.9 306.3 242.1 292.8 249.7 279.5C257.3 266.2 265.5 253.3 274.1 240.6C289.1 239.5 304.4 238.9 320 238.9C335.6 238.9 351 239.5 365.9 240.6C374.4 253.2 382.5 266.1 390.2 279.3C397.9 292.5 405.1 306 411.9 319.7C405.2 333.5 398 347.1 390.3 360.5C382.7 373.8 374.6 386.7 366.1 399.5C351.2 400.6 335.7 401.1 320 401.1C304.3 401.1 289.1 400.6 274.4 399.7C265.7 387 257.5 374 249.8 360.7C242.1 347.4 235 333.9 228.3 320.1zM408.9 371.3C414 362.5 418.8 353.6 423.5 344.6C429.9 359.1 435.5 373.8 440.4 388.9C424.9 392.4 409.2 395.1 393.4 396.9C398.8 388.5 403.9 379.9 408.9 371.3zM423.3 294.8C418.6 286 413.8 277.2 408.8 268.6C403.9 260.1 398.8 251.7 393.5 243.4C409.6 245.4 425 248.1 439.4 251.4C434.8 266.2 429.4 280.6 423.3 294.8zM320.2 182.3C330.7 193.7 340.6 205.7 349.8 218.1C330 217.2 310.1 217.2 290.3 218.1C300.1 205.2 310.2 193.2 320.2 182.3zM204.2 121C221 111.2 258.3 125.2 297.6 160C300.1 162.2 302.6 164.6 305.2 167C289.7 183.7 275.4 201.5 262.3
                     220.1C239.7 222.1 217.3 225.6 195.1 230.5C193.8 225.4 192.7 220.2 191.6 215C182.2 166.6 188.4 130.1 204.2 121zM179.7 384.6C175.5 383.4 171.4 382.1 167.3 380.7C146 374 121.8 363.4 104.3 349.5C94.2 342.5 87.4 331.7 85.5 319.6C85.5 301.3 117.1 277.9 162.7 262C168.4 260 174.2 258.2 180 256.5C186.8 278.2 195 299.5 204.5 320.1C194.9 341 186.6 362.6 179.7 384.6zM296.3 482.6C279.8 497.7 260.7 509.7 239.9 517.9C228.8 523.2 216 523.7 204.6 519.2C188.7 510 182.1 474.7 191.1 427.2C192.2 421.6 193.4 416 194.8 410.5C217.2 415.3 239.8 418.6 262.7 420.3C275.9 439 290.4 456.9 305.9 473.7C302.7 476.8 299.5 479.8 296.3 482.6zM320.8 458.3C310.6 447.3 300.4 435.1 290.5 422C300.1 422.4 310 422.6 320 422.6C330.3 422.6 340.4 422.4 350.4 421.9C341.2 434.6 331.3 446.7 320.8 458.3zM451.5 488.3C450.6 500.5 444.6 511.9 435 519.6C419.1 528.8 385.2 516.8 348.6 485.4C344.4 481.8 340.2 477.9 335.9 473.9C351.2 457 365.3 439.1 378.1 420.3C401 418.4 423.8 414.9 446.3 409.8C447.3 413.9 448.2 418 449 422C453.9 443.6 454.7 466.1 451.5 488.3zM469.7 380.8C466.9 381.7 464.1 382.6 461.2 383.4C454.2 361.6 445.6 340.3 435.7 319.6C445.3 299.2 453.4 278.2 460.2 256.7C465.4 258.2 470.4 259.8 475.2 261.4C521.8 277.4 554.5 301.2 554.5 319.4C554.5 339 519.6 364.3 469.7 380.8zM320 365.8C345.3 365.8 365.8 345.3 365.8 320C365.8 294.7 345.3 274.2 320 274.2C294.7 274.2 274.2 294.7 274.2 320C274.2 345.3 294.7 365.8 320 365.8z" />
                </svg>`,
        description: `Conception d'applications web performantes, routage dynamique et composants réutilisables.`
    },

    {
        number: '03',
        title: 'GSAP & Lenis',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9.83,7.59C10.647,7.595 11.267,7.828 11.672,8.282C12.055,8.713 12.239,9.336 12.219,10.132L12.205,10.193C12.197,10.211 12.185,10.229 12.17,10.243C12.14,10.272 12.099,10.288 12.057,10.288L10.398,10.288C10.29,10.288 10.199,10.2 10.199,10.093C10.199,9.669 10.071,9.435 9.809,9.383L9.689,9.372C9.347,9.372 9.125,9.583 9.119,9.951C9.112,10.361 9.344,10.734 10.004,11.374C10.872,12.19 11.221,12.913 11.204,13.867C11.177,15.411 10.127,16.41 8.531,16.41C7.716,16.41 7.093,16.191 6.678,15.761C6.258,15.324 6.066,14.683 6.106,13.855C6.108,13.813 6.125,13.772 6.155,13.743C6.185,13.714 6.226,13.698 6.267,13.698L7.983,13.698C8.007,13.699 8.03,13.705 8.052,13.715C8.073,13.726 8.092,13.741 8.107,13.76C8.12,13.775 8.129,13.793 8.135,13.813C8.14,13.832 8.141,13.853 8.137,13.873C8.118,14.171 8.171,14.394 8.288,14.518C8.363,14.598 8.469,14.639 8.599,14.639C8.916,14.639 9.102,14.414 9.109,14.024C9.115,13.687 9.007,13.39 8.427,12.792C7.676,12.058 7.003,11.3 7.024,10.108C7.037,9.416 7.311,8.784 7.798,8.327C8.312,7.845 9.014,7.59 9.83,7.59ZM4.047,7.618C4.794,7.612 5.381,7.842 5.789,8.303C6.221,8.79 6.44,9.524 6.441,10.485C6.44,10.527 6.422,10.567 6.392,10.597C6.362,10.626 6.322,10.643 6.28,10.643L4.479,10.643C4.448,10.642 4.417,10.629 4.395,10.607C4.373,10.584 4.361,10.553 4.36,10.522C4.346,9.899 4.172,9.576 3.828,9.538L3.757,9.534C3.067,9.535 2.66,10.472 2.444,10.992C2.142,11.719 1.988,12.507 2.018,13.293C2.033,13.659 2.092,14.173 2.438,14.386C2.746,14.575 3.185,14.45 3.451,14.24C3.716,14.031 3.93,13.669 4.02,13.339C4.033,13.293 4.033,13.258 4.021,13.241C4.015,13.233 4.003,13.229 3.989,13.226L3.485,13.222C3.461,13.222 3.436,13.216 3.414,13.206C3.392,13.196 3.372,13.181 3.356,13.162C3.344,13.148 3.335,13.13 3.331,13.112C3.327,13.093 3.327,13.074 3.331,13.056L3.647,11.682C3.663,11.611 3.726,11.558 3.804,11.548L3.804,11.545L6.839,11.545C6.846,11.545 6.854,11.545 6.86,11.546C6.939,11.5566.995,11.63 6.994,11.71L6.994,11.714L6.678,13.085C6.661,13.163 6.583,13.22 6.494,13.22L6.113,13.22C6.1,13.22 6.086,13.225 6.075,13.233C6.064,13.241 6.056,13.253 6.052,13.266C5.7,14.46 5.223,15.282 4.594,15.775C4.058,16.195 3.399,16.391 2.517,16.391C1.725,16.391 1.191,16.136 0.738,15.633C0.14,14.967 -0.107,13.879 0.043,12.566C0.313,10.103 1.589,7.618 4.047,7.618ZM21.016,7.75C23.026,7.75
                      24.03,8.662 23.999,10.461C23.962,12.569 22.678,14.119 20.745,14.477C20.47,14.527 20.191,14.547 19.912,14.545L18.978,14.541C18.963,14.541 18.948,14.547 18.937,14.558C18.926,14.568 18.92,14.583 18.92,14.598C18.92,14.608 18.922,14.618 18.928,14.627C18.933,14.636 18.941,14.643 18.95,14.648L19.744,15.062C19.809,15.096 19.835,15.153 19.82,15.226C19.815,15.249 19.618,16.139 19.613,16.159C19.596,16.237 19.533,16.282 19.442,16.282L17.739,16.282C17.715,16.28217.69,16.277 17.668,16.267C17.646,16.257 17.626,16.241 17.61,16.223C17.598,16.208 17.589,16.191 17.585,16.173C17.58,16.155 17.581,16.135 17.585,16.116L19.481,7.875C19.5,7.789 19.581,7.751 19.653,7.751L21.016,7.75ZM17.273,7.762C17.292,7.77 17.31,7.781 17.324,7.795C17.338,7.81 17.351,7.828 17.358,7.847C17.366,7.866 17.369,7.886 17.369,7.906L17.358,16.119C17.361,16.138 17.36,16.158 17.355,16.177C17.35,16.196 17.34,16.213 17.328,16.228C17.313,16.245 17.295,16.259 17.274,16.268C17.254,16.277 17.232,16.282 17.21,16.281L15.397,16.281C15.377,16.282 15.356,16.277 15.337,16.27C15.318,16.262 15.3,16.25 15.286,16.236C15.272,16.221 15.26,16.204 15.253,16.185C15.245,16.166 15.241,16.146 15.241,16.125L15.28,15.328C15.282,15.241 15.28,15.217 15.229,15.211L15.161,15.209L13.447,15.209C13.323,15.209 13.314,15.22 13.27,15.334L12.914,16.191C12.882,16.252 12.818,16.281 12.722,16.281L10.927,16.281C10.818,16.281 10.74,16.173 10.781,16.072L14.499,7.873C14.524,7.824 14.562,7.75 14.648,7.75L17.214,7.75C17.234,7.75 17.254,7.754 17.273,7.762ZM15.5,9.985C15.492,9.953 15.466,9.956 15.445,9.998C15.43,10.028 15.416,10.06 15.405,10.091L14.121,13.274C14.114,13.294 14.109,13.31 14.105,13.322C14.104,13.328 14.103,13.335 14.104,13.341C14.105,13.347 14.108,13.353 14.111,13.358C14.115,13.363 14.12,13.367 14.126,13.37C14.131,13.373 14.137,13.376 14.143,13.376L15.215,13.39C15.334,13.38 15.34,13.374 15.352,13.253C15.354,13.21 15.506,10.022 15.5,9.985ZM20.112,9.582C20.097,9.582 20.083,9.588 20.072,9.599C20.061,9.609 20.055,9.624 20.054,9.639C20.054,9.649 20.057,9.659 20.062,9.668C20.068,9.677 20.075,9.685 20.084,9.69C20.097,9.697 20.869,10.104 20.926,10.135C20.968,10.158 20.969,10.198 20.955,10.267C20.948,10.298 20.415,12.642 20.416,12.644C20.419,12.647 20.435,12.655 20.515,12.655L20.551,12.655C21.446,12.619 21.934,11.561 21.952,10.534C21.961,9.979 21.772,9.638 21.429,9.588L21.358,9.582L20.112,9.582Z"/>
        </svg>`,
        description: `Création d'expériences immersives avec des animations synchronisées au scroll et une navigation fluide.`
    },

    {
        number: '04',
        title: 'HTML5 & CSS3',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M192 112L304 112L304 200C304 239.8 336.2 272 376 272L464 272L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 128C176 119.2 183.2 112 192 112zM352 131.9L444.1 224L376 224C362.7 224 352 213.3 352 200L352 131.9zM192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 250.5C512 233.5 505.3 217.2 493.3 205.2L370.7 82.7C358.7 70.7 342.5 64 325.5 64L192 64zM298.2 359.6C306.8 349.5 305.7 334.4 295.6 325.8C285.5 317.2 270.4 318.3 261.8 328.4L213.8 384.4C206.1 393.4 206.1 406.6 213.8 415.6L261.8 471.6C270.4 481.7 285.6 482.8 295.6 474.2C305.6 465.6 306.8 450.4 298.2 440.4L263.6 400L298.2 359.6zM378.2 328.4C369.6 318.3 354.4 317.2 344.4 325.8C334.4 334.4 333.2 349.6 341.8 359.6L376.4 400L341.8 440.4C333.2 450.5 334.3 465.6 344.4 474.2C354.5 482.8 369.6 481.7 378.2 471.6L426.2 415.6C433.9 406.6 433.9 393.4 426.2 384.4L378.2 328.4z" />
                </svg>`,
        description: `Développement d'interfaces précises et entièrement responsives, respectant le designpixel-perfect et optimisées pour la performance.`
    },

    {
        number: '05',
        title: 'Wordpress',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.7 383.4c-1.2 2-2.6 4-4 6L326 272l-47 92-26-54-32 60-43-82-28 59 152 152c3.2-1.2 6.4-2.6 9.6-4.2 44-20.8 78.6-58.7 95.1-105.4l-41.6-13.6zM256 64c105.9 0 192 86.1 192 192 0 29.6-6.8 57.4-19.2 82.3l-51.7-16.9-26.8 58.2-29.6-61.4-37.4 74.7L256 376l-32.3-64.3-37.4 74.7-29.6-61.4-26.8 58.2-51.7-16.9C70.8 313.4 64 285.6 64 256 64 150.1 150.1 64 256 64z" />
                </svg>`,
        description: `Mise en place et personnalisation de sites WordPress élégants, avec une attention particulière à l'optimisation.`
    },
    {
        number: '06',
        title: 'Git & GitHub',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M216.8 399.5C210.9 399.1 204.2 398.7 196.6 398.2C193.3 402.3 190 406.6 190 411.7C190 430.2 255.5 430.2 255.5 410.2C255.5 401.9 248.1 401.5 216.7 399.5L216.8 399.5zM224.6 281.6C192.3 281.6 190.9 326.1 223.9 326.1C256.4 326.1 255.6 281.6 224.6 281.6zM480 96L160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96zM339.9 236.2C325.4 236.2 317 227.8 317 213.3C317 198.8 325.4 191 339.9 191C354.6 191 363 198.8 363 213.3C363 227.8 354.6 236.2 339.9 236.2zM245.6 259L295.1 259L295.1 280.6L271.7 282.4C276.3 288.2 281.1 296.4 281.1 308.1C281.1 356.8 223.9 355.3 206.9 350.5L198.5 363.9C203.5 364.2 208.3 364.5 212.8 364.7C269.1 367.9 293.3 369.3 293.3 403.2C293.3 432.4 267.6 448.9 223.4 448.9C177.4 448.9 159.9 437.3 159.9 417.2C159.9 405.8 165 399.7 173.9 391.3C165.5 387.8 162.7 381.4 162.7 374.5C162.7 364.9 170.1 358.2 185.7 343.9L185.9 343.7C173.5 337.6 164.1 324.4 164.1 305.6C164.1 254 220.7 252.3 245.7 258.8L245.6 259zM366.5 367.1L379.5 368.9L379.5 389L307.1 389L307.1 368.9C309.8 368.5 312.1 368.2 314 368C323.9 366.8 324.1 366.7 324.1 362L324.1 287.3C324.1 282.9 323.2 282.6 314 279.5C312.1 278.8 309.8 278.1 307.1 277.1L309.9 256.5L362.5 256.5L362.5 362C362.5 366.1 362.7 366.6 366.6 367.1L366.5 367.1zM473.1 356.7L480 379C469.1 384.4 453.1 389.2 438.6 389.2C408.4 389.2 396.9 377 396.9 348.3L396.9 281.7C396.9 280.9 396.9 280.3 396.7 279.9C395.9 278.7 392.5 279.2 377.1 279.2L377.1 256.6C399.4 254.1 408.3 242.9 411.1 215.2L435.3 215.2C435.3 248.5 434.7 253.2 436 253.8C436.3 253.9 436.7 253.8 437.3 253.8L473.1 253.8L473.1 279.2L435.3 279.2L435.3 340.8C435.1 347.1 434.4 371.2 473.2 356.7L473.1 356.7z" />
                </svg>`,
        description: `Mise en place d'un workflow efficace avec Git, pour un développement rapide et organisé.`
    },
    {
        number: '07',
        title: 'Figma',
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96zM269.7 160C236.7 160 209.9 186.8 209.9 219.8C209.9 240.8 220.7 259.2 237.1 269.9C220.7 280.6 209.9 299 209.9 320C209.9 341 220.7 359.5 237.1 370.1C220.7 380.8 209.9 399.2 209.9 420.2C209.9 453.3 237 480 270 480C303.2 480 330.6 453.1 330.6 419.7L330.6 364C341.2 373.8 355.4 379.8 371 379.8L372.1 379.8C405.1 379.8 431.9 353 431.9 320C431.9 299 421.1 280.5 404.7 269.9C421.1 259.2 431.9 240.8 431.9 219.8C431.9 186.8 405.1 160 372.1 160L269.7 160zM311.3 379.8L311.3 419.7C311.3 442.3 292.7 460.7 270 460.7C247.6 460.7 229.3 442.5 229.3 420.2C229.3 397.9 247.4 379.8 269.6 379.8L311.3 379.8zM311.3 279.5L311.3 360.4L269.6 360.4C247.3 360.3 229.3 342.2 229.3 319.9C229.3 297.6 247.4 279.4 269.8 279.4L311.4 279.4zM372.1 279.5C394.4 279.5 412.6 297.6 412.6 320C412.6 342.4 394.5 360.5 372.1 360.5L371 360.5C348.7 360.5 330.6 342.4 330.6 320C330.6 297.6 348.7 279.5 371 279.5L372.1 279.5zM311.3 260.2L269.7 260.2C247.4 260.2 229.2 242.1 229.2 219.8C229.2 197.5 247.3 179.3 269.7 179.3L311.3 179.3L311.3 260.2zM372.1 179.3C394.4 179.3 412.6 197.4 412.6 219.8C412.6 242.2 394.5 260.2 372.1 260.2L330.6 260.2L330.6 179.3L372.1 179.3z" />
                </svg>`,
        description: `Conception de maquettes détaillées et préparation d'assets UI optimisés pour l'intégration.`
    }

];


function renderSkillsCards() {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;

    grid.innerHTML = Object.entries(skillsData).map(([id, skill]) => `
        <article class="skill-card">
            <div class="card-header">
                <span class="skill-index">${skill.number}</span>
                <div class="skill-svgs" aria-hidden="true">
                    ${skill.iconSvg}
                </div>
            </div>
            <span class="skill-icon">${skill.title}</span>
            <p>${skill.description}</p>
        </article>
    `).join('');
}

const projectsData = {

    1: {
        title: 'Site vitrine',
        number: '01',
        image: 'images/projet3.webp',
        alt: 'Site vitrine Next.js avec Tailwind CSS',
        tags: ['Next.js', 'Tailwind CSS'],
        description: "Site vitrine réalisé avec Next.js et Tailwind CSS, outils de réservation multi-étapes.",
        link: null,
        github: 'https://github.com/BarruelJ/Site-vitrine-h-telier-Next.js-Tailwind-CSS'
    },
    2: {
        title: 'Portfolio Interactif',
        number: '02',
        image: 'images/projet1.webp',
        alt: 'Portfolio interactif avec animations GSAP',
        tags: ['GSAP', 'ScrollTrigger', 'Lenis'],
        description: 'Site vitrine personnel avec animations GSAP avancées, effet parallaxe et scroll fluide via Lenis.',
        link: 'https://portfolio-2026-lac-tau.vercel.app/',
        github: 'https://github.com/BarruelJ/portfolio-2026'
    },
    3: {
        title: 'Site Vitrine',
        number: '03',
        image: 'images/projet2.webp',
        alt: 'Site vitrine WordPress',
        tags: ['WordPress', 'Kadence'],
        description: "Création d'un site vitrine pour une entreprise d'isolation. Thème personnalisé avec Kadence.",
        link: null,
        github: null
    },
    4: {
        title: 'Moteur de génération PDF',
        number: '04',
        image: 'images/projet4.webp',
        alt: 'Moteur de génération de documents PDF dynamiques',
        tags: ['TKinter', 'Reportlab', 'Python'],
        description: "Générateur d'étiquettes et de documents PDF dynamiques avec interface graphique TKinter.",
        link: null,
        github: 'https://github.com/BarruelJ/PrintLoader'
    },
};

function renderProjectCards() {
    const grid = document.querySelector('.bento-grid');
    if (!grid) return;

    grid.innerHTML = Object.entries(projectsData).map(([id, project]) => `
        <article class="project-card large" data-project="${id}">
            <div class="card-image">
                <img src="${project.image}" alt="${project.alt}"
                    width="726" height="416" fetchpriority="high" decoding="async">
                <div class="card-overlay" aria-hidden="true">
                    <span class="project-number">${project.number}</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tags" aria-label="Technologies utilisées">
                    ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <button class="card-cta">
                    <span>Voir le projet</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                    </svg>
                </button>
            </div>
        </article>
    `).join('');
}


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
            start: 'top+=120px top',
            endTrigger: '.panel-3',
            end: 'top top+=50',
            scrub: 1,
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
    gsap.set(projectCards, { opacity: 1, y: 24 });

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
                y: -250, opacity: 1,
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



function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    // Bouton GitHub
    const githubEl = document.querySelector('.modal-github');
    if (project.github) {
        githubEl.href = project.github;
        githubEl.style.display = 'inline-flex';
    } else {
        githubEl.style.display = 'none';
    }

    // Bouton Visiter le site
    const linkEl = document.querySelector('.modal-link');
    if (project.link && project.link !== '#') {
        linkEl.href = project.link;
        linkEl.style.display = 'inline-flex';
    } else {
        linkEl.style.display = 'none';
    }

    document.querySelector('.modal-number').textContent = project.number;
    document.querySelector('.modal-title').textContent = project.title;
    document.querySelector('.modal-description').textContent = project.description;

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
        '.card-cta, .btn-accent, .meta-item.clickable-badge, .modal-close, .hero-tagline a, .contact-cta, .contact-btn'
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
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return; // Sécu fix propre
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        lenis.scrollTo(target, { offset: -91, duration: 1.2 });
    });
});

/* INIT & RESIZE */
function init() {
    killAllTriggers();

    renderProjectCards();
    renderSkillsCards();

    skillCards = gsap.utils.toArray('.skill-card');
    projectCards = gsap.utils.toArray('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.project));
    });

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

    // Refresh
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