(function(){
  // Resume modal
  var resumeModal = document.getElementById('resumeModal');
  var viewResumeBtn = document.getElementById('viewResumeBtn');
  var closeResumeBtn = document.getElementById('closeResumeBtn');
  function openResume(){ resumeModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeResume(){ resumeModal.classList.remove('open'); document.body.style.overflow = ''; }
  viewResumeBtn.addEventListener('click', openResume);
  closeResumeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', function(e){ if(e.target === resumeModal) closeResume(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeResume(); });

  // Theme
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  function systemPrefersDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function getStoredTheme(){ try { return localStorage.getItem('portfolio-theme'); } catch(e){ return null; } }
  function storeTheme(t){ try { localStorage.setItem('portfolio-theme', t); } catch(e){} }
  function applyTheme(t){ root.setAttribute('data-theme', t); }
  applyTheme(getStoredTheme() || (systemPrefersDark() ? 'dark' : 'light'));
  themeToggle.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next); storeTheme(next);
  });

  // Social placeholder links
  var socialUrls = { github:'https://github.com/', linkedin:'https://www.linkedin.com/', twitter:'https://twitter.com/' };
  document.querySelectorAll('[data-social]').forEach(function(el){
    var key = el.getAttribute('data-social');
    if(socialUrls[key]){ el.setAttribute('href', socialUrls[key]); el.setAttribute('target','_blank'); el.setAttribute('rel','noopener noreferrer'); }
  });

  // Active nav link on scroll
  var links = document.querySelectorAll('.nav-link');
  var sections = Array.prototype.map.call(links, function(l){ return document.getElementById(l.getAttribute('data-nav')); });
  function setActive(id){
    links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('data-nav') === id); });
  }
  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ setActive(entry.target.id); }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function(s){ if(s) observer.observe(s); });
  }

  // Contact form
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value;
    var email = document.getElementById('cf-email').value;
    var message = document.getElementById('cf-message').value;
    var subject = encodeURIComponent('Portfolio contact from ' + name);
    var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    status.style.display = 'block';
    window.location.href = 'mailto:byrnald@gmail.com?subject=' + subject + '&body=' + body;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
