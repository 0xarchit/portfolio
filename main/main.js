// About Data
const text = `Hi, I'm Archit Jain, aka '0xArchit', a programmer and student in India. I love exploring and learning new Tech. Currently I am learning
 |- MERN Stack
 |- Python and Ai Implementation
 |- Cyber Security
 |- Ethical Hacking
 |- and many more.
 By keeping my self diverse in tech field and following my passion.
 I am a self-taught programmer learned most of thing by Reverse Engineering and different youtube videos and other courses. I enjoys reading business, stock and crypto market news in free time.`;

const codingBox = document.getElementById('codingBox');

function typeWriter(text, i) {
    if (i < text.length) {
        codingBox.textContent += text.charAt(i);
        i++;
        setTimeout(function () { typeWriter(text, i); }, 50);
    }
}

typeWriter(text, 0);

// Skills Data
const skills = [
    { name: 'Html', level: 90 },
    { name: 'Css', level: 85 },
    { name: 'Bootstrap', level: 85 },
    { name: 'Javascript', level: 80 },
    { name: 'Jquery', level: 90 },
    { name: 'react', level: 10 },
    { name: 'Python', level: 40 }
];

// Hobbies Data
const hobbies = [
    {
        icon: 'bi-controller',
        title: 'Gaming',
        description: 'Passionate about playing strategy and FPS games'
    },
    {
        icon: 'bi-book',
        title: 'Reading',
        description: 'Try new tech, Reading Tech news and blogs, Market and Business news'
    },
    {
        icon: 'bi-cup-hot',
        title: 'Explore and Learn',
        description: 'A.I., Crypto, Blockchain, Cyber Securtiy & Ethical Hacking'
    }
];

// Projects Data
const projects = [
    {
        title: 'E-commerce Platform',
        description: 'A e-commerce Frontend built with HTML, CSS, Javascript and Bootstrap.',
        image: './shopping.jpg',
        github: 'https://github.com/0xarchit/Ecommerce-site-demo',
        live: 'https://ecommerce-frontend-demo.pages.dev'
    },
    {
        title: 'Connect 4 Game',
        description: 'A game made in Javascript , HTML, and CSS in which we have to connect dots to win the game.',
        image: './connect4.jpg',
        github: 'https://github.com/0xarchit/Connect-Four-Game',
        live: 'https://connect-four-game.pages.dev'
    },
    {
        title: 'Portfolio Website',
        description: 'Portfolio website built with HTML, CSS, JS and Bootstrap to showcase my work.',
        image: './portfolio.jpg',
        github: 'https://github.com/0xarchit',
        live: 'https://0xarchit.pages.dev'
    }
];

// Social Links Data
const socialLinks = [
    { icon: 'bi-github', url: 'https://github.com/0xarchit' },
    { icon: 'bi-linkedin', url: 'https://linkedin.com/in/0xarchit' },
    { icon: 'bi-twitter', url: 'https://x.com/0xarchit' },
    { icon: 'bi-envelope', url: 'mailto:0xarchit@gmail.com' }
];

// Typing
document.addEventListener('DOMContentLoaded', () => {
    new Typed('#typed-text', {
        strings: ['B.Tech Student', 'Web Dev', 'Cyber Security Learner', 'Gamer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true
    });

    // Skills
    const skillBarsContainer = document.querySelector('.skill-bars');
    skills.forEach(skill => {
        const skillBar = document.createElement('div');
        skillBar.className = 'skill-bar';
        skillBar.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span>${skill.name}</span>
                <span>${skill.level}%</span>
            </div>
            <div class="progress">
                <div class="progress-bar" data-width="${skill.level}"></div>
            </div>
        `;
        skillBarsContainer.appendChild(skillBar);
    });

    // Hobbies
    const hobbyCardsContainer = document.querySelector('.hobby-cards');
    hobbies.forEach(hobby => {
        const hobbyCard = document.createElement('div');
        hobbyCard.className = 'col-md-4 mb-4 appear';
        hobbyCard.innerHTML = `
            <div class="card h-100 p-4 text-center">
                <i class="bi ${hobby.icon} display-4 text-primary mb-3"></i>
                <h4 class="mb-3">${hobby.title}</h4>
                <p class="card-text">${hobby.description}</p>
            </div>
        `;
        hobbyCardsContainer.appendChild(hobbyCard);
    });

    // Projects
    const projectCardsContainer = document.querySelector('.project-cards');
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'col-md-4 mb-4 appear';
        projectCard.innerHTML = `
            <div class="card h-100">
                <img src="${project.image}" alt="${project.title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${project.title}</h5>
                    <p class="card-text">${project.description}</p>
                    <div class="d-flex gap-3">
                        <a href="${project.github}" class="btn btn-outline-dark" target="_blank">
                            <i class="bi bi-github me-2"></i>Code
                        </a>
                        <a href="${project.live}" class="btn btn-primary" target="_blank">
                            <i class="bi bi-box-arrow-up-right me-2"></i>Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `;
        projectCardsContainer.appendChild(projectCard);
    });

    // Social Links
    const socialLinksContainer = document.querySelector('.social-links');
    socialLinks.forEach(link => {
        const socialLink = document.createElement('a');
        socialLink.href = link.url;
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';
        socialLink.innerHTML = `<i class="bi ${link.icon}"></i>`;
        socialLinksContainer.appendChild(socialLink);
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();

    const cards = document.querySelectorAll('.card');
    const skillBars = document.querySelectorAll('.skill-bar');

    observeElements(cards);
    observeElements(skillBars);

    window.addEventListener('scroll', handleNavbarScroll);
});

// popup
const downloadButton = document.getElementById("download-btn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

downloadButton.addEventListener("click", () => {
    popup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

// animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            
            if (entry.target.classList.contains('skill-bar')) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const targetWidth = progressBar.getAttribute('data-width');
                progressBar.style.width = targetWidth + '%';
            }
        }
    });
}, observerOptions);

function observeElements(elements) {
    elements.forEach(element => observer.observe(element));
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
