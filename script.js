const quotes = [
    'Always',
    'If you want to know what a man’s like, take a good look at how he treats his inferiors, not his equals',
    'Differences of habit and language are nothing at all if our aims are identical and our hearts are open',
    'Things we lose have a way of coming back to us in the end, if not always in the way we expect',
    'Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.',
    'We’ve all got both light and dark inside us. What matters is the part we choose to act on.',
    'It is the quality of one’s convictions that determines success, not the number of followers.',
];

let wordQueue;
let highlightPosition;
let startTime;

const quote = document.getElementById('quote');
const message = document.getElementById('message');
const input = document.getElementById('typed-value');
const start = document.getElementById('start');

function startGame() {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quoteText = quotes[quoteIndex];
  
  highlightPosition = 0;
  wordQueue = quoteText.split(' ');

  quote.innerHTML = wordQueue.map(word => (`<span>${word}</span>`)).join('');
  
  quote.childNodes[highlightPosition].className = 'highlight';
  
  input.focus();
  input.value = '';
  message.innerText = '';  

  startTime = new Date().getTime();  
  
  document.body.className = "";
  start.className = "started";
  setTimeout(() => { start.className = "button"; }, 2000);
}

function checkInput() {
  const currentWord = wordQueue[0].replaceAll(".","").replaceAll(",","");  
  const typedValue = input.value.trim();
  
  if (currentWord !== typedValue) {    
    input.className = currentWord.startsWith(typedValue) ? "" : "error";
    return;
  }
  
  wordQueue.shift(); //shift removes first item (0th element)
  input.value = ""; // empty textbox
  quote.childNodes[highlightPosition].className = ""; // unhighlight word
    
  if (wordQueue.length === 0) { // if we have run out of words in the queue then game over.
    gameOver();
    return;
  }
  
  // if it is not game over then we increment the highligher position
  
  highlightPosition++;
  quote.childNodes[highlightPosition].className = 'highlight';  
}

function canvasConfetti({
  particleCount = 100,
  spread = 360,
  origin = { x: 0.5, y: 0.5 },
  colors = ['#FFC312', '#DAE0E2', '#6A0572', '#AB83A1', '#F3722C'],
} = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const defaultSettings = {
    particleCount,
    spread,
    colors,
    origin,
  };

  return new Promise((resolve) => {
    const elements = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti';
      elements.push(particle);
    }

    let particleIndex = 0;
    let particleTick = 0;

    function render() {
      particleTick += 0.05;

      for (let i = 0; i < particleCount; i++) {
        const element = elements[i];
        const progress = particleTick + i * 0.5;

        element.progress = progress;
        element.quadratic = Math.cos(progress);
        element.yProgress = element.progress + origin.y;

        element.style.width = `${Math.sin(element.quadratic * spread) * 8}px`;
        element.style.height = `${Math.sin(element.quadratic * spread) * 8}px`;
        element.style.left = `${element.yProgress * canvas.width * 0.5 * Math.sin(progress) + canvas.width * 0.5}px`;
        element.style.top = `${element.yProgress * canvas.height * Math.cos(progress)}px`;

        element.style.backgroundColor = colors[i % colors.length];
      }

      if (particleTick < 0.2) {
        requestAnimationFrame(render);
      } else {
        elements.forEach((element) => {
          element.parentNode.removeChild(element);
        });

        resolve();
      }
    }

    render();
  });
}

function gameOver() {
  const elapsedTime = new Date().getTime() - startTime;
  document.body.className = "winner";
  message.innerHTML = `<span class="congrats">Congratuations!</span> <br> You finished in ${elapsedTime / 1000} seconds.`;  
  // Trigger confetti effect
  triggerConfetti();
}

function triggerConfetti() {
  // Create confetti settings
  const confettiSettings = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  };

  // Trigger confetti animation
  window.confetti(confettiSettings);
}

start.addEventListener('click', startGame);
input.addEventListener('input', checkInput);