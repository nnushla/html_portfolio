/* =============================================
   NUSHLA PRADHAN — PORTFOLIO SCRIPTS
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  var html = document.documentElement;

  /* ── DARK MODE ── */
  var STORAGE_KEY = 'nushla-theme';
  var themeToggle = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });


  /* ── NAV SCROLL ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }


  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        if (mobileNav) mobileNav.classList.remove('open');
      }
    });
  });


  /* ── MOBILE MENU ── */
  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }


  /* ── SCROLL REVEAL ── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ── TYPEWRITER ── */
  var twEl = document.getElementById('typewriter-text');

  if (twEl) {
    var phrases = [
      'Aspiring Product Manager',
      'Data Analyst',
      'Problem Solver',
      'Aspiring Product Manager & Analyst'
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var deleting = false;

    function typeStep() {
      var phrase = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        twEl.textContent = phrase.slice(0, charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          setTimeout(typeStep, 1800);
        } else {
          setTimeout(typeStep, 55);
        }
      } else {
        charIdx--;
        twEl.textContent = phrase.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeStep, 400);
        } else {
          setTimeout(typeStep, 28);
        }
      }
    }

    setTimeout(typeStep, 800);
  }


  /* ── HERO PARTICLE CANVAS ── */
  var canvas = document.getElementById('hero-canvas');

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W, H, particles, rafId;
    var mouse = { x: -9999, y: -9999 };

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initParticles();
    }

    function initParticles() {
      var count = Math.min(Math.floor((W * H) / 4800), 180);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x:     Math.random() * W,
          y:     Math.random() * H,
          z:     Math.random(),
          vx:    (Math.random() - 0.5) * 0.28,
          vy:    (Math.random() - 0.5) * 0.28,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawFrame(t) {
      ctx.clearRect(0, 0, W, H);
      var dark = html.getAttribute('data-theme') === 'dark';

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.vx + Math.sin(t * 0.00048 + p.phase) * 0.11;
        p.y += p.vy + Math.cos(t * 0.00048 + p.phase) * 0.11;

        if (p.x < -12) p.x = W + 12;
        if (p.x > W + 12) p.x = -12;
        if (p.y < -12) p.y = H + 12;
        if (p.y > H + 12) p.y = -12;

        var dx2 = p.x - mouse.x;
        var dy2 = p.y - mouse.y;
        var dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        var pull = Math.max(0, 1 - dist / 175);
        if (pull > 0) {
          p.x += (mouse.x - p.x) * pull * 0.011;
          p.y += (mouse.y - p.y) * pull * 0.011;
        }

        var radius = (0.7 + p.z * 1.6) * (1 + pull * 2.2);
        var hue = 265 + p.z * 30;
        var alpha = dark ? (0.22 + p.z * 0.58) : (0.18 + p.z * 0.52);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + hue + ', 72%, 70%, ' + alpha + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q  = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          var maxD = 115 + p.z * 65;
          if (d < maxD) {
            var la = (1 - d / maxD) * 0.22 * (p.z * 0.42 + 0.4);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'hsla(265, 62%, 70%, ' + la + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(drawFrame);
    }

    canvas.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    canvas.addEventListener('touchmove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
    }, { passive: true });
    canvas.addEventListener('touchend', function () { mouse.x = -9999; mouse.y = -9999; });

    window.addEventListener('resize', function () {
      cancelAnimationFrame(rafId);
      resizeCanvas();
      rafId = requestAnimationFrame(drawFrame);
    }, { passive: true });

    resizeCanvas();
    rafId = requestAnimationFrame(drawFrame);
  }


  /* ── PROJECT SCREENSHOTS ── */
  document.querySelectorAll('.project-card[data-screenshot]').forEach(function (card) {
    var imgEl       = card.querySelector('.pcard-screenshot');
    var placeholder = card.querySelector('.pcard-placeholder');
    var imgArea     = card.querySelector('.pcard-img');
    var gradientVal = imgArea ? imgArea.getAttribute('data-gradient') : null;

    if (imgArea && gradientVal) {
      imgArea.style.background = 'linear-gradient(' + gradientVal + ')';
    }
    if (!imgEl) return;

    imgEl.src = card.getAttribute('data-screenshot');
    imgEl.addEventListener('load', function () {
      imgEl.classList.add('loaded');
      if (placeholder) placeholder.classList.add('hidden');
    });
    imgEl.addEventListener('error', function () {
      imgEl.style.display = 'none';
    });
  });


  /* ── CONTACT FORM ── */
  var contactForm = document.getElementById('contact-form');
  var submitBtn   = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = document.getElementById('fname').value.trim();
      var email = document.getElementById('femail').value.trim();
      var msg   = document.getElementById('fmsg').value.trim();
      var subj  = encodeURIComponent('Portfolio inquiry from ' + name);
      var body  = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + msg);
      window.open('mailto:nushlapradhan@gmail.com?subject=' + subj + '&body=' + body, '_blank');
      if (submitBtn) {
        submitBtn.textContent = 'Sent ✓';
        submitBtn.classList.add('sent');
        submitBtn.disabled = true;
        setTimeout(function () {
          submitBtn.textContent = 'Send Message →';
          submitBtn.classList.remove('sent');
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3500);
      }
    });
  }


  /* ── RESUME BUTTON ── */
  var resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function (e) {
      if (resumeBtn.getAttribute('href') === 'resume.pdf') {
        fetch('resume.pdf', { method: 'HEAD' })
          .then(function (res) {
            if (!res.ok) { e.preventDefault(); alert('Add resume.pdf to the project folder.'); }
          })
          .catch(function () { e.preventDefault(); alert('Add resume.pdf to the project folder.'); });
      }
    });
  }


  /* ── CASE STUDY MODAL ── */
  var PROJECTS = {
    'neural-network-fashion-mnist': {
      title: 'Neural Network Image Classification (Fashion-MNIST)',
      category: 'AI & Data',
      role: 'ML Developer & Researcher',
      timeframe: 'Fall 2025',
      tools: ['Python', 'NumPy', 'Matplotlib', 'Jupyter Notebook'],
      context: 'Developed neural networks from the ground up to classify fashion items from the Fashion-MNIST dataset, implementing core deep learning concepts without using high-level frameworks to gain deep understanding of neural network mechanics.',
      approach: 'Built both 1-layer and 2-layer multilayer perceptrons (MLPs) implementing forward propagation with ReLU activation functions, softmax output layer for multi-class classification, and backpropagation algorithm for weight optimization. Experimented with different hyperparameters including learning rates, batch sizes, and network architectures.',
      solution: 'Created complete neural network implementation handling 10,000+ image samples with 85% classification accuracy. Optimized training pipeline with mini-batch gradient descent and implemented comprehensive evaluation metrics to track model performance across 10 fashion categories.',
      impact: 'Demonstrated strong grasp of neural network fundamentals by implementing algorithms from scratch. Project served as foundation for understanding more complex deep learning architectures and optimization techniques.',
      learnings: 'Gained deep technical understanding of backpropagation, gradient descent, and activation functions. Learned importance of proper initialization, regularization techniques, and the mathematical foundations underlying modern deep learning frameworks.',
      tags: ['Neural Networks', 'Python', 'Deep Learning', 'NumPy', 'Matplotlib', 'Jupyter Notebook'],
      imageUrl: '/assets/mnist.png',
      gradient: 'linear-gradient(135deg,#EDE9FE,#C7D2FE)',
      liveUrl: 'https://github.com/nnushla/CNN_MNIST'
    },
    'period-productivity': {
      title: 'Period Productivity Prediction Model',
      category: 'AI & Data',
      role: 'ML Researcher & Developer',
      timeframe: 'Spring 2026',
      tools: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter Notebook'],
      context: 'Built a machine learning model to help individuals understand productivity patterns across menstrual cycles, addressing the gap in personalized productivity insights while maintaining strict ethical data standards.',
      approach: 'Developed comprehensive feature engineering pipeline, implemented multiple ML algorithms (Random Forest, Gradient Boosting, Neural Networks), and conducted rigorous model evaluation with cross-validation. Prioritized model interpretability and bias detection throughout development.',
      solution: 'Created an end-to-end ML pipeline with 85% prediction accuracy, featuring automated data preprocessing, feature selection using PCA, and ensemble modeling. Implemented fairness metrics to ensure equitable predictions across demographic groups.',
      impact: 'Demonstrated potential to improve individual productivity planning by 30% through data-driven insights. Research contributed to broader discussions on ethical AI in health tech.',
      learnings: 'Gained deep expertise in ethical ML development, learned to balance model performance with fairness considerations, and developed frameworks for responsible data handling in sensitive domains.',
      tags: ['Machine Learning', 'Python', 'Data Ethics', 'Scikit-learn', 'Pandas', 'PCA'],
      imageUrl: '/assets/flow.jpg',
      gradient: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)',
      liveUrl: 'https://github.com/nnushla/FlowCast'
    },
    'sign-language-vr': {
      title: 'Sign Language Recognition for VR Learning',
      category: 'AI & Data',
      role: 'AI Researcher',
      timeframe: 'Summer 2024',
      tools: ['Python', 'TensorFlow', 'OpenCV', 'VR Development Tools'],
      context: 'As part of my research at Computing Research Association, I researched and developed methods to improve a sign language recognition system for a VR-based learning platform called ASL Champ, focusing on accessibility for Deaf and Hard-of-Hearing learners.',
      approach: 'Conducted literature review on existing sign language recognition models, identified key limitations in accuracy and cultural inclusivity, then designed experiments to improve model robustness across different signing styles and lighting conditions.',
      solution: 'Enhanced neural network architecture achieving 92% recognition accuracy across diverse signing patterns. Implemented real-time feedback mechanisms in VR environment and created culturally inclusive training dataset.',
      impact: 'Contributed to making VR learning more accessible. Research findings presented at university symposium and integrated into ongoing accessibility initiatives.',
      learnings: 'Developed expertise in computer vision and deep learning while understanding the critical importance of inclusive design in AI systems. Learned to collaborate with accessibility advocates to ensure technology serves diverse needs.',
      tags: ['Computer Vision', 'Accessibility', 'Neural Networks', 'Research', 'TensorFlow', 'OpenCV'],
      imageUrl: '/assets/aslchamp.png',
      gradient: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
      liveUrl: 'https://nnushla.github.io/'
    },
    'defeasts': {
      title: 'DeFeasts Restaurant Web App',
      category: 'Product & UX',
      role: 'Product Manager',
      timeframe: 'Spring 2024',
      tools: ['Vue.js', 'Node.js', 'PostgreSQL', 'Figma', 'Git'],
      context: 'Led product strategy for DeFeasts, a comprehensive restaurant web application built during DePauw\'s annual hackathon. Coordinated cross-functional team of 4 developers and designers to create an end-to-end dining experience.',
      approach: 'Conducted rapid user research with campus dining community, defined MVP features through prioritization matrix, created user flows and wireframes in Figma, and managed development sprint with daily standups and iterative releases.',
      solution: 'Delivered responsive web app featuring real-time menu browsing, smart recommendations, cart management, and order tracking. Implemented intuitive UI with seamless checkout flow and accessibility features (WCAG AA compliant).',
      impact: 'Won Overall Winner and Best UI/UX awards at hackathon. App prototype demonstrated to university administration for potential campus-wide implementation. Achieved 95% user satisfaction in post-demo surveys.',
      learnings: 'Mastered rapid prototyping and MVP development under time constraints. Learned to balance technical feasibility with user needs and how to rally a team around shared vision.',
      tags: ['Product Management', 'UI/UX', 'Vue.js', 'Full-Stack', 'Figma', 'WCAG'],
      imageUrl: '/assets/defeasts.png',
      gradient: 'linear-gradient(135deg,#FCE7F3,#FDE8D8)',
      award: 'Overall Winner & Best UI/UX — DePauw Hackathon',
      liveUrl: 'https://defeasts.netlify.app/'
    },
    'networks': {
      title: 'NetWorks Mentorship Platform',
      category: 'Product & UX',
      role: 'Product Owner',
      timeframe: 'Spring 2026',
      tools: ['Jira', 'Figma', 'Miro', 'Notion', 'Analytics Tools'],
      context: 'Served as Product Owner for NetWorks, a platform designed to facilitate meaningful mentorship connections between university students and alumni professionals. Managed stakeholder expectations and product roadmap for a 6-month development cycle.',
      approach: 'Led discovery phase with 100+ user interviews, synthesized insights into personas and journey maps, created product roadmap aligned with business goals, and facilitated bi-weekly sprint planning and retrospectives with a dev team of 3.',
      solution: 'Launched beta platform with smart matching algorithm based on career interests, industry, and availability. Features include mentor profiles, booking system, goal tracking, and resource library. Designed onboarding flow that improved activation rate by 60%.',
      impact: 'Won 2nd Place and a $1,500 investment at the McDermond Center Startup Pitch Competition.  Secured university funding for continued development.',
      learnings: 'Developed skills in stakeholder communication, agile product management, and data-informed decision making. Learned to navigate ambiguity and pivot based on user feedback.',
      tags: ['Product Development', 'User Research', 'Agile', 'Stakeholder Management', 'Jira', 'Figma'],
      imageUrl: '/assets/networks.jpg',
      gradient: 'linear-gradient(135deg,#FEF3C7,#FCE7F3)',
      award: '2nd Place · McDermond Startup Pitch · $1,500 Investment',
      liveUrl: 'https://minus-forest-19866863.figma.site/'
    }
  };

  var modalOverlay = document.getElementById('modal-overlay');
  var modalClose   = document.getElementById('modal-close');

  function openModal(id) {
    var p = PROJECTS[id];
    if (!p || !modalOverlay) return;

    // Image
    var imgEl = document.getElementById('modal-img');
    var phEl  = document.getElementById('modal-img-placeholder');
    if (p.imageUrl) {
      imgEl.src = p.imageUrl;
      imgEl.alt = p.title;
      imgEl.style.display = 'block';
      phEl.style.display  = 'none';
    } else {
      imgEl.style.display = 'none';
      phEl.style.background = p.gradient || 'var(--v50)';
      phEl.style.display = 'flex';
    }

    document.getElementById('modal-cat').textContent       = p.category;
    document.getElementById('modal-title').textContent     = p.title;
    document.getElementById('modal-context').textContent   = p.context;
    document.getElementById('modal-approach').textContent  = p.approach;
    document.getElementById('modal-solution').textContent  = p.solution;
    document.getElementById('modal-impact').textContent    = p.impact;
    document.getElementById('modal-learnings').textContent = p.learnings;

    // Meta row
    var meta = document.getElementById('modal-meta');
    meta.innerHTML =
      '<span class="modal-meta-item"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' + p.role + '</span>' +
      '<span class="modal-meta-item"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' + p.timeframe + '</span>' +
      '<span class="modal-meta-item"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' + p.tools.join(', ') + '</span>' +
      (p.award ? '<span class="modal-meta-item"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>' + p.award + '</span>' : '');

    // Tags
    var tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = p.tags.map(function(t) {
      return '<span class="modal-tag">' + t + '</span>';
    }).join('');

    // Live site button
    var existingLiveBtn = document.getElementById('modal-live-btn');
    if (existingLiveBtn) existingLiveBtn.remove();
    if (p.liveUrl) {
      var liveBtn = document.createElement('a');
      liveBtn.id = 'modal-live-btn';
      liveBtn.href = p.liveUrl;
      liveBtn.target = '_blank';
      liveBtn.rel = 'noopener';
      liveBtn.className = 'modal-live-btn';
      liveBtn.innerHTML = 'View project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
      document.getElementById('modal-tags').after(liveBtn);
    }

    // Open
    document.body.style.overflow = 'hidden';
    modalOverlay.classList.add('open');
    document.getElementById('modal').scrollTop = 0;
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // Wire up all "View case study" buttons and project cards
  document.querySelectorAll('.pcard-btn[data-id]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openModal(btn.getAttribute('data-id'));
    });
  });
  document.querySelectorAll('.project-card[data-id]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
      // If click came from the live-link button inside the card, don't open modal
      if (e.target.closest('.pcard-btn')) return;
      openModal(card.getAttribute('data-id'));
    });
  });

}); // end DOMContentLoaded
