// About Data
const text = `Hi, I'm Archit Jain, aka '0xAcrhit', a programmer and student in India. I love exploring and learning new Tech. Currently I am learning
 |- MERN Stack
 |- Python and Ai Implementation
 |- Cyber Security
 |- Ethical Hacking
 |- and many more.
 By keeping my self diverse in tech field and following my passion.
 I am a self-taught programmer. I enjoys reading business, stock and crypto market news in free time.`;

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