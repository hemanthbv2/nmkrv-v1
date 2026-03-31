/* ================================================
   NMKRV COLLEGE — APP.JS
   Interactive features: Confetti, Quiz, Filters,
   Scroll Animations, Counter, Navigation
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavigation();
  initMobileMenu();
  initConfetti();
  initScrollReveal();
  initProgramFilters();
  initCounterAnimation();
  initQuiz();
});

/* ================================================
   SCROLL PROGRESS BAR
   ================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ================================================
   NAVIGATION — Scroll Effects
   ================================================ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollTop;
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

/* ================================================
   MOBILE MENU
   ================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

/* ================================================
   CONFETTI CANVAS (Hero)
   ================================================ */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff6b35', '#f0a030', '#7c3aed', '#10b981', '#3b82f6', '#ec4899'];
  const particles = [];
  const PARTICLE_COUNT = 35;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 6 + 2;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 3;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the reveal for sibling elements
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.scroll-reveal')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex * 80;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ================================================
   PROGRAM FILTERS
   ================================================ */
function initProgramFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.program-card');
  const grid = document.getElementById('programs-grid');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const categories = card.dataset.category || '';
        const shouldShow = filter === 'all' || categories.includes(filter);

        if (shouldShow) {
          card.classList.remove('hidden');
          card.style.position = '';
          card.style.visibility = '';
        } else {
          card.classList.add('hidden');
          // After animation, truly hide
          setTimeout(() => {
            if (card.classList.contains('hidden')) {
              card.style.position = 'absolute';
              card.style.visibility = 'hidden';
            }
          }, 400);
        }
      });
    });
  });
}

/* ================================================
   COUNTER ANIMATION
   ================================================ */
function initCounterAnimation() {
  const counter = document.getElementById('club-count');
  if (!counter) return;

  const target = parseInt(counter.dataset.target);
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounter(counter, 0, target, 1200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(counter);
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (end - start) * eased);
    element.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ================================================
   INTERACTIVE CAREER QUIZ
   ================================================ */
const quizData = {
  questions: [
    {
      q: "It's a lazy Saturday. You'd rather...",
      options: [
        { emoji: "🔬", text: "Binge a sci-fi documentary", cats: ["science"] },
        { emoji: "💻", text: "Build an app or tinker with code", cats: ["technology"] },
        { emoji: "🛒", text: "Hit up a flea market & make deals", cats: ["commerce", "management"] },
        { emoji: "☕", text: "Write poetry at a cozy café", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "Pick your weapon of choice:",
      options: [
        { emoji: "🔭", text: "A microscope", cats: ["science"] },
        { emoji: "⌨️", text: "A laptop", cats: ["technology"] },
        { emoji: "🧮", text: "A calculator", cats: ["commerce"] },
        { emoji: "🖊️", text: "A pen", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "Your superpower would be:",
      options: [
        { emoji: "🧠", text: "Understanding any equation instantly", cats: ["science"] },
        { emoji: "📱", text: "Controlling technology with your mind", cats: ["technology"] },
        { emoji: "📈", text: "Predicting market trends", cats: ["commerce", "management"] },
        { emoji: "💭", text: "Reading people's emotions", cats: ["humanities"] }
      ]
    },
    {
      q: "Group project! You're the one who...",
      options: [
        { emoji: "📚", text: "Does all the research", cats: ["science"] },
        { emoji: "🎨", text: "Makes the killer presentation", cats: ["technology"] },
        { emoji: "💰", text: "Handles the budget perfectly", cats: ["commerce"] },
        { emoji: "👑", text: "Leads and motivates the team", cats: ["management"] }
      ]
    },
    {
      q: "Your phone home screen is full of:",
      options: [
        { emoji: "🧪", text: "Science news & space apps", cats: ["science"] },
        { emoji: "👨‍💻", text: "Coding challenges & tech blogs", cats: ["technology"] },
        { emoji: "📊", text: "Stock trackers & business news", cats: ["commerce", "management"] },
        { emoji: "🎧", text: "Podcasts & audiobook apps", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "On a field trip, you'd choose:",
      options: [
        { emoji: "🏗️", text: "A cutting-edge research lab", cats: ["science"] },
        { emoji: "🚀", text: "A buzzing tech startup office", cats: ["technology"] },
        { emoji: "🏦", text: "The stock exchange floor", cats: ["commerce"] },
        { emoji: "🏛️", text: "A stunning historical monument", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "Your YouTube algorithm is mostly:",
      options: [
        { emoji: "🌌", text: "Veritasium & Kurzgesagt", cats: ["science"] },
        { emoji: "⚡", text: "MKBHD & coding tutorials", cats: ["technology"] },
        { emoji: "💼", text: "Business case studies & finance", cats: ["commerce", "management"] },
        { emoji: "🎤", text: "TEDx talks & book reviews", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "Pick a quote that hits different:",
      options: [
        { emoji: "💡", text: "\"Never stop questioning.\" — Einstein", cats: ["science"] },
        { emoji: "🖥️", text: "\"Code is poetry.\" — WordPress", cats: ["technology"] },
        { emoji: "🤑", text: "\"Risk comes from not knowing.\" — Buffett", cats: ["commerce", "management"] },
        { emoji: "✒️", text: "\"The pen is mightier than the sword.\"", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "Your ideal first job would be at:",
      options: [
        { emoji: "🛰️", text: "ISRO or a research institute", cats: ["science"] },
        { emoji: "🏢", text: "Google or a hot startup", cats: ["technology"] },
        { emoji: "🏛️", text: "Deloitte, EY or a top bank", cats: ["commerce", "management"] },
        { emoji: "📰", text: "A media house or an NGO", cats: ["humanities", "languages"] }
      ]
    },
    {
      q: "What do you want to be remembered for?",
      options: [
        { emoji: "🔭", text: "A groundbreaking discovery", cats: ["science"] },
        { emoji: "📲", text: "An app that changed the world", cats: ["technology"] },
        { emoji: "🏙️", text: "Building a business empire", cats: ["commerce", "management"] },
        { emoji: "✨", text: "Inspiring millions with your words", cats: ["humanities", "languages"] }
      ]
    }
  ],

  results: {
    science: {
      program: "B.Sc (PCM / CBZ / CZBt / PMCs)",
      desc: "You're a natural scientist! Whether it's Physics, Chemistry, Biology or Maths — NMKRV's B.Sc programs will fuel your curiosity and launch you into research, medicine, or the civil services.",
      tags: ["Research", "NEET PG", "Civil Services", "Armed Forces"]
    },
    technology: {
      program: "BCA — Bachelor of Computer Applications",
      desc: "You think in code and dream in algorithms! NMKRV's BCA programme will turn your love for tech into a career at top IT firms or your very own startup.",
      tags: ["App Dev", "Software", "MCA", "Startups"]
    },
    commerce: {
      program: "B.Com — Bachelor of Commerce",
      desc: "Numbers are your language and business is your playground. B.Com at NMKRV sets you up for CA, finance, banking and everything business.",
      tags: ["CA", "Finance", "Banking", "Accounting"]
    },
    management: {
      program: "BBA — Bachelor of Business Administration",
      desc: "Born leader spotted! BBA at NMKRV gives you the tools to build businesses, lead teams, and fast-track to an MBA.",
      tags: ["Entrepreneurship", "MBA Prep", "Leadership", "Marketing"]
    },
    humanities: {
      program: "B.A. Humanities & Languages",
      desc: "You see the world differently — and that's your superpower. B.A. at NMKRV lets you explore History, Political Science, Sociology, Literature and more.",
      tags: ["UPSC", "Journalism", "Literature", "Media"]
    },
    languages: {
      program: "B.A. Languages",
      desc: "Words are your weapon and stories are your strength. Master English, Kannada, Hindi and more at NMKRV to shape narratives that matter.",
      tags: ["Literature", "Media", "Content", "Translation"]
    }
  }
};

let currentQuestion = 0;
let scores = {};

function initQuiz() {
  const startBtn = document.getElementById('start-quiz-btn');
  const closeBtn = document.getElementById('quiz-close');
  const backdrop = document.getElementById('quiz-backdrop');

  if (startBtn) startBtn.addEventListener('click', openQuiz);
  if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
  if (backdrop) backdrop.addEventListener('click', closeQuiz);

  // Build quiz questions
  buildQuizQuestions();
}

function buildQuizQuestions() {
  const container = document.getElementById('quiz-questions');
  if (!container) return;

  quizData.questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-question' + (i === 0 ? ' active' : '');
    div.dataset.index = i;

    let optionsHtml = '';
    q.options.forEach((opt, j) => {
      optionsHtml += `
        <button class="quiz-option" data-categories='${JSON.stringify(opt.cats)}' onclick="selectAnswer(this, ${i})">
          <span class="opt-emoji">${opt.emoji}</span>
          ${opt.text}
        </button>
      `;
    });

    div.innerHTML = `
      <h3>${q.q}</h3>
      <div class="quiz-options">${optionsHtml}</div>
    `;
    container.appendChild(div);
  });
}

function openQuiz() {
  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  currentQuestion = 0;
  scores = {};
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateQuizUI();
}

function closeQuiz() {
  const modal = document.getElementById('quiz-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Reset quiz
  setTimeout(() => {
    currentQuestion = 0;
    scores = {};
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach((q, i) => {
      q.classList.toggle('active', i === 0);
    });
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    updateQuizUI();
  }, 400);
}

function selectAnswer(btn, questionIndex) {
  const categories = JSON.parse(btn.dataset.categories);
  categories.forEach(cat => {
    scores[cat] = (scores[cat] || 0) + 1;
  });

  // Visual feedback
  btn.style.borderColor = '#ff6b35';
  btn.style.background = 'rgba(255,107,53,0.08)';

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.questions.length) {
      const questions = document.querySelectorAll('.quiz-question');
      questions.forEach((q, i) => {
        q.classList.toggle('active', i === currentQuestion);
      });
      updateQuizUI();
    } else {
      showQuizResult();
    }
  }, 300);
}

function updateQuizUI() {
  const fill = document.getElementById('quiz-progress-fill');
  const counter = document.getElementById('quiz-counter');
  if (fill) {
    fill.style.width = ((currentQuestion + 1) / quizData.questions.length * 100) + '%';
  }
  if (counter) {
    counter.textContent = `${currentQuestion + 1} / ${quizData.questions.length}`;
  }
}

function showQuizResult() {
  // Find the top category
  let topCategory = 'science';
  let topScore = 0;
  for (const cat in scores) {
    if (scores[cat] > topScore) {
      topScore = scores[cat];
      topCategory = cat;
    }
  }

  const result = quizData.results[topCategory];
  document.getElementById('result-program').textContent = result.program;
  document.getElementById('result-desc').textContent = result.desc;

  const tagsContainer = document.getElementById('result-tags');
  tagsContainer.innerHTML = '';
  result.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });

  document.getElementById('quiz-questions').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';

  // Mini confetti burst on result
  launchResultConfetti();
}

function launchResultConfetti() {
  const canvas = document.getElementById('result-confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth + 80;
  canvas.height = parent.offsetHeight + 80;

  const colors = ['#ff6b35', '#f0a030', '#7c3aed', '#10b981', '#ec4899', '#3b82f6'];
  const particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.15
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.012;
      p.rotation += p.rotSpeed;
      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });
    frame++;
    if (alive && frame < 120) requestAnimationFrame(animate);
  }
  animate();
}

/* ================================================
   MAGNETIC BUTTONS (Subtle hover attraction)
   ================================================ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
