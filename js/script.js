const typingTitle = document.getElementById('typing-title');
const typingSubtitle = document.getElementById('typing-subtitle');

const texts = [
    { title: "Olá, eu sou o Raphael Vinicius", subtitle: "Desenvolvedor" },
    { title: "Hello, I am Raphael Vinicius", subtitle: "Developer" }
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const currentTitle = texts[textIndex].title;
    const currentSubtitle = texts[textIndex].subtitle;

    const titlePart = currentTitle.substring(0, charIndex);
    const subtitlePart = currentSubtitle.substring(0, charIndex);

    typingTitle.innerHTML = `<span class="typing">${titlePart}</span>`;
    typingSubtitle.innerHTML = `<span class="typing">${subtitlePart}</span>`;

    if (!isDeleting) {
        charIndex++;
        if (charIndex > currentTitle.length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
            return;
        }
    } else {
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeText, typingSpeed);
}

typeText();
