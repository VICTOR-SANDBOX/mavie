const readings = {
  sun: { symbol: '☉', kicker: 'sol em virgem · 19°', title: 'A arte de reparar no que importa.', text: 'Seu centro tem olhos atentos. Existe cuidado na sua forma de amar, criar e deixar o mundo um pouco melhor do que encontrou.' },
  moon: { symbol: '☽', kicker: 'lua em sagitário · 8°', title: 'Um coração que precisa de horizonte.', text: 'Você sente grande. A sua emoção pede espaço, sinceridade e histórias que façam a vida parecer maior do que o medo.' },
  mercury: { symbol: '☿', kicker: 'mercúrio em libra · 13°', title: 'Palavras que procuram harmonia.', text: 'Sua mente enxerga os dois lados e transforma conversa em ponte. Há beleza na sua diplomacia e inteligência no seu jeito de escutar.' },
  venus: { symbol: '♀', kicker: 'vênus em escorpião · 3°', title: 'Amar é ir até o fundo.', text: 'Quando você escolhe alguém, escolhe com presença. Seu afeto é leal, intenso e não tem medo das verdades que pedem coragem.' },
  mars: { symbol: '♂', kicker: 'marte em virgem · 25°', title: 'A força que mora nos detalhes.', text: 'Sua ação ganha potência quando encontra um propósito. Você sabe transformar atenção, método e constância em movimento real.' },
  jupiter: { symbol: '♃', kicker: 'júpiter em leão · 8°', title: 'Um brilho que dá espaço aos outros.', text: 'Sua expansão vem da generosidade, da criatividade e da coragem de ocupar o próprio lugar — sem apagar ninguém ao redor.' },
  saturn: { symbol: '♄', kicker: 'saturno em gêmeos · 28°', title: 'Pensamento que constrói caminho.', text: 'Sua disciplina aprende pela curiosidade. Com o tempo, suas perguntas viram repertório, estrutura e uma voz cada vez mais sua.' },
  uranus: { symbol: '♅', kicker: 'urano retrógrado em aquário · 25°', title: 'A liberdade de inventar outra rota.', text: 'Você carrega uma relação íntima com o novo. A sua diferença não é ruído: é uma forma de enxergar antes.' },
  neptune: { symbol: '♆', kicker: 'netuno retrógrado em aquário · 8°', title: 'Imaginação com antenas abertas.', text: 'Existe sensibilidade para captar atmosferas, ideias e futuros possíveis. Sonho e visão caminham lado a lado.' },
  pluto: { symbol: '♇', kicker: 'plutão em sagitário · 14°', title: 'A verdade que transforma.', text: 'Você não passa pela vida sem fazer perguntas grandes. Cada descoberta muda a paisagem por dentro.' },
  node: { symbol: '☊', kicker: 'nodo norte em gêmeos · 12°', title: 'Aprender a contar o que você sabe.', text: 'O caminho de crescimento passa pela curiosidade, pela troca e pela coragem de deixar a própria voz circular.' },
  chiron: { symbol: '⚷', kicker: 'quíron em capricórnio · 3°', title: 'A delicadeza escondida na força.', text: 'Há cura quando você permite que realização também seja cuidado — com você, com o tempo e com o que sente.' },
  lilith: { symbol: '⚸', kicker: 'lilith em áries · 13°', title: 'O desejo de existir sem pedir licença.', text: 'Sua parte indomável lembra que autonomia também é afeto. Há verdade no impulso de começar por si.' }
};

const reading = document.querySelector('#planetReading');
const buttons = [...document.querySelectorAll('.planet')];
function selectPlanet(button) {
  const item = readings[button.dataset.planet];
  document.querySelectorAll('[data-planet]').forEach((planet) => planet.classList.toggle('active', planet.dataset.planet === button.dataset.planet));
  reading.querySelector('.reading-symbol').textContent = item.symbol;
  document.querySelector('#readingKicker').textContent = item.kicker;
  document.querySelector('#readingTitle').textContent = item.title;
  document.querySelector('#readingText').textContent = item.text;
  reading.animate([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'ease-out' });
}
document.querySelectorAll('[data-planet]').forEach((button) => button.addEventListener('click', () => selectPlanet(button)));

const observer = new IntersectionObserver((entries) => entries.forEach(({ isIntersecting, target }) => { if (isIntersecting) { target.classList.add('visible'); observer.unobserve(target); } }), { threshold: .14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const canvas = document.querySelector('#stars');
const context = canvas.getContext('2d');
let stars = [];
function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; context.scale(devicePixelRatio, devicePixelRatio); stars = Array.from({ length: Math.min(130, Math.round(innerWidth / 8)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.15 + .15, speed: Math.random() * .18 + .03, alpha: Math.random() * .65 + .15 })); }
function draw() { context.clearRect(0, 0, innerWidth, innerHeight); stars.forEach((star) => { star.y -= star.speed; if (star.y < -2) { star.y = innerHeight + 2; star.x = Math.random() * innerWidth; } context.beginPath(); context.arc(star.x, star.y, star.r, 0, Math.PI * 2); context.fillStyle = `rgba(247,240,223,${star.alpha})`; context.fill(); }); requestAnimationFrame(draw); }
resize(); draw(); addEventListener('resize', resize);

let audioContext; let drone;
document.querySelector('#soundToggle').addEventListener('click', (event) => {
  const enabled = event.currentTarget.getAttribute('aria-pressed') === 'true';
  if (enabled) { drone?.stop(); drone = null; event.currentTarget.setAttribute('aria-pressed', 'false'); event.currentTarget.innerHTML = '<span class="sound-icon">◌</span> ativar atmosfera'; return; }
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) { event.currentTarget.textContent = 'áudio indisponível'; return; }
  audioContext ??= new AudioEngine();
  drone = audioContext.createOscillator(); const gain = audioContext.createGain(); drone.type = 'sine'; drone.frequency.value = 146.83; gain.gain.value = .025; drone.connect(gain).connect(audioContext.destination); drone.start(); event.currentTarget.setAttribute('aria-pressed', 'true'); event.currentTarget.innerHTML = '<span class="sound-icon">◉</span> atmosfera ativa';
});
