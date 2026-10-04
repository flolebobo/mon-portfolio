// The button label stays "Menu": aria-expanded alone conveys the open/closed state
function initNavbarMenu() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  // Everything the full-screen menu covers: made inert so keyboard focus can't land behind it
  const coveredByMenu = document.querySelectorAll('.skip-link, .navbar__logo, main, footer');

  function setMenuOpen(isOpen) {
    navbar.classList.toggle('navbar--open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    coveredByMenu.forEach((element) => {
      element.inert = isOpen;
    });
  }

  toggle.addEventListener('click', () => {
    setMenuOpen(!navbar.classList.contains('navbar--open'));
  });

  document.querySelectorAll('.navbar__logo, .navbar__link').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navbar.classList.contains('navbar--open')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  // The menu is always visible from 768px: an open state left over would keep the page inert
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });
}

// Marks the navbar link of the section crossing the middle of the viewport with aria-current
function initActiveSectionLinks() {
  const linksBySection = new Map(
    [...document.querySelectorAll('.navbar__link')].map((link) => [link.hash.slice(1), link]),
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = linksBySection.get(entry.target.id);
      if (entry.isIntersecting) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  linksBySection.forEach((link, id) => {
    observer.observe(document.getElementById(id));
  });
}

// The saved theme is applied early by the inline script in index.html
function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  function updateLabel() {
    toggle.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair');
  }

  updateLabel();

  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = theme;
    updateLabel();
    // Throws when storage is blocked: the theme still switches, it just isn't remembered
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  });
}

// The hidden state is added here, not in the HTML, so sections stay visible if JS fails
function initSectionAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('section--animated');
    observer.observe(section);
  });
}

function createElementWithClass(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

// UTC: "YYYY-MM-DD" is parsed as UTC midnight, so a local time zone could shift it to the previous day
const projectDateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function createProjectCard(project) {
  const card = createElementWithClass('article', 'project-card');
  const body = createElementWithClass('div', 'project-card__body');
  const link = createElementWithClass('a', 'project-card__link', 'Voir le projet');

  link.href = project.url;
  link.target = '_blank';
  link.rel = 'noopener';
  // Starts with the visible text (WCAG 2.5.3) and tells the three identical links apart
  link.setAttribute('aria-label', `Voir le projet ${project.name} (nouvel onglet)`);

  body.append(
    createElementWithClass('h3', 'project-card__title', project.name),
    createElementWithClass('p', 'project-card__description', project.description),
  );

  // A missing or malformed date only hides this line: format() would throw a RangeError
  // and the catch in initProjects() would replace the whole list with the error message
  const lastUpdated = new Date(project.lastUpdated);
  if (Number.isNaN(lastUpdated.getTime())) {
    console.warn(`Invalid lastUpdated for project "${project.name}":`, project.lastUpdated);
  } else {
    const date = createElementWithClass('time', 'project-card__date', `Mis à jour le ${projectDateFormat.format(lastUpdated)}`);
    date.dateTime = project.lastUpdated;
    body.append(date);
  }

  // No empty <ul>: screen readers would announce an empty list
  if (project.languages?.length > 0) {
    const tags = createElementWithClass('ul', 'project-card__tags');
    project.languages.forEach((language) => {
      tags.append(createElementWithClass('li', 'project-card__tag', language));
    });
    body.append(tags);
  }

  body.append(link);
  card.append(createElementWithClass('div', 'project-card__banner'), body);
  return card;
}

// Cards are generated from data/projects.json
async function initProjects() {
  const projectList = document.getElementById('project-list');

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();
    projectList.replaceChildren(...projects.map(createProjectCard));
  } catch (error) {
    console.error('Failed to load projects:', error);
    const message = createElementWithClass('p', 'project-list__message', 'Impossible de charger les projets');
    message.setAttribute('role', 'alert');
    projectList.replaceChildren(message);
  }
}

// No backend yet: block submission so the page doesn't reload, and say so in the role="status" region
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  const email = document.querySelector('.contact-list a[href^="mailto:"]').textContent;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = `Le formulaire n'est pas encore actif. Écrivez-moi à ${email}.`;
  });
}

initNavbarMenu();
initActiveSectionLinks();
initThemeToggle();
initSectionAnimations();
initProjects();
initContactForm();
