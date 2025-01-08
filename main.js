// Typing
document.addEventListener('DOMContentLoaded', () => {
    new Typed('#typed-text', {
        strings: ['B.Tech Student', 'Web Dev', 'Cyber Security Learner', 'Gamer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true
    });

    // Render Skills
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

    // Render Hobbies
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

    // Render Projects
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

    // Render Social Links
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