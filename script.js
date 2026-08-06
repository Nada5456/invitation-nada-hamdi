
const opening = document.getElementById('opening');
const seal = document.getElementById('seal');
const site = document.getElementById('site');
const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const inlineMusic = document.getElementById('inlineMusic');

let playing = false;

// Sécurité : ne jamais laisser une page blanche si l'écran d'ouverture est absent.
if (!opening || !seal) {
  if (site) {
    site.setAttribute('aria-hidden', 'false');
    site.classList.add('is-revealed');
  }
  document.body.classList.remove('locked');
}


async function toggleMusic(){
  try{
    if(playing){
      music.pause();
      playing = false;
      musicButton.classList.remove('playing');
      musicButton.textContent = '♫';
    }else{
      await music.play();
      playing = true;
      musicButton.classList.add('playing');
      musicButton.textContent = '❚❚';
    }
  }catch(error){
    console.warn('La lecture audio attend une interaction utilisateur.', error);
  }
}

function openInvitation() {
  if (opening.dataset.state === "opening" || opening.dataset.state === "done") return;

  opening.dataset.state = "opening";
  toggleMusic();

  // 1. Open the envelope flap.
  opening.classList.add("is-opening");

  // 2. Once fully open, reveal the site smoothly.
  window.setTimeout(() => {
    site.setAttribute("aria-hidden", "false");
    site.classList.add("is-revealed");
    opening.classList.add("show-site");
    document.body.classList.remove("locked");
  }, 1050);

  // 3. Remove the opening layer after the fade.
  window.setTimeout(() => {
    opening.classList.add("is-finished");
    opening.dataset.state = "done";
  }, 1800);
}

if (seal) seal.addEventListener('click', openInvitation);
if (seal) seal.addEventListener('keydown', event => {
  if(event.key === 'Enter' || event.key === ' '){
    event.preventDefault();
    openInvitation();
  }
});
if (musicButton) musicButton.addEventListener('click', toggleMusic);
if (inlineMusic) {
  inlineMusic.addEventListener('click', toggleMusic);
}

const target = new Date('2026-08-19T18:00:00');
function updateCountdown(){
  const diff = Math.max(0, target - new Date());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
