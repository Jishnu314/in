// Load Skills
fetch('json/skills.json')
  .then(res => res.json())
  .then(data => {
    const skillsContainer = document.getElementById('skills-section-placeholder');
    data.list.forEach((skill, index) => {
      const div = document.createElement('div');
      div.className = 'skill';
      div.setAttribute('tabindex', '0');
      div.setAttribute('data-aos', 'fade-up-right');
      div.setAttribute('data-aos-delay', 200 + index * 100);
      div.setAttribute('data-aos-duration', '800');
      div.setAttribute('data-aos-easing', 'ease-in-out');

      let iconHTML = '';
      if (skill.iconClass) {
        iconHTML = `<i class="${skill.iconClass}"></i>`;
      } else if (skill.iconify) {
        iconHTML = `<iconify-icon icon="${skill.iconify}" width="40"></iconify-icon>`;
      }

      div.innerHTML = `${iconHTML}<span class="skill-name">${skill.name}</span>`;
      skillsContainer.appendChild(div);
    });

    document.querySelector('.skills-explore-btn').textContent = data.exploreBtn;
    document.querySelector('.skills-title').textContent = "Skills";
  })
  .catch(err => console.error("Error loading skills.json:", err));
  
// Load Experience
fetch('json/experience.json')
  .then(res => res.json())
  .then(data => {
    document.querySelector('.experience-title').textContent = data.title;
    const expContainer = document.getElementById('experience-section-placeholder');
    data.list.forEach(exp => {
      const div = document.createElement('div');
      div.className = 'exp';
      div.innerHTML = `
        <h2 class="experience-title"><span style="color: ${exp.highlightColor};">⦿</span> ${exp.company}</h2>
        <p class="experience-desc">${exp.description}</p>
        <ul class="experience-list">
          ${exp.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
      `;
      expContainer.appendChild(div);
    });
  })
  .catch(err => console.error("Error loading experience.json:", err));

// --- Get DOM Elements ---
let currentIndex = 0;
let projects = [];
const projectNumberEl = document.getElementById("project-number");
const titleEl = document.getElementById("project-title");
const subtitleEl = document.getElementById("project-subtitle");
const descEl = document.getElementById("project-description");
const imageEl = document.getElementById("project-image");
const readMoreBtn = document.getElementById("read-more-btn");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsContainer = document.getElementById("nav-dots-container");

// --- Load JSON and Initialize ---
fetch("json/projects.json")
  .then(res => res.json())
  .then(data => {
    projects = data.projects;
    createDots();
    showProject(currentIndex);
    startAutoScroll();
  })
  .catch(err => console.error("Error loading projects:", err));

// --- Core Functions ---
function createDots() {
  dotsContainer.innerHTML = '';
  projects.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('nav-dot');
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });
}

function showProject(index) {
  const project = projects[index];
  projectNumberEl.textContent = (index + 1).toString().padStart(2, '0');
  titleEl.textContent = project.title;
  subtitleEl.textContent = project.subtitle;
  descEl.textContent = project.description;
  imageEl.src = project.image;
  imageEl.alt = project.title;

  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  if (project.link && project.link !== "") {
    readMoreBtn.style.display = 'inline-block';
    readMoreBtn.href = project.link;
  } else {
    readMoreBtn.style.display = 'none';
  }
}

// --- Event Listeners ---
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  showProject(currentIndex);
  resetAutoScroll();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % projects.length;
  showProject(currentIndex);
  resetAutoScroll();
});

dotsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-dot')) {
    currentIndex = parseInt(e.target.dataset.index);
    showProject(currentIndex);
    resetAutoScroll();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    showProject(currentIndex);
    resetAutoScroll();
  } else if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % projects.length;
    showProject(currentIndex);
    resetAutoScroll();
  }
});

// --- Auto-scroll Logic ---
let autoScrollInterval;
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % projects.length;
    showProject(currentIndex);
  }, 5000);
}
function resetAutoScroll() {
  clearInterval(autoScrollInterval);
  startAutoScroll();
}

// Sidebar Navigation Active Link Highlighting
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const removeActiveClasses = () => {
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
  };
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const correspondingLink = document.querySelector(`.sidebar-nav a[href="#${sectionId}"]`);
        removeActiveClasses();
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Contact section dynamic rendering
fetch('json/texts.json')
  .then(response => response.json())
  .then(data => {
    const contact = data.contact;
    if (contact) {
      const descElem = document.querySelector('#contact .section-desc');
      if (descElem) descElem.textContent = contact.description;

      const emailBtn = document.createElement('a');
      emailBtn.href = `mailto:${contact.email.address}`;
      emailBtn.className = 'section-btn';
      emailBtn.setAttribute('data-aos', 'zoom-in');
      emailBtn.setAttribute('data-aos-delay', '300');
      emailBtn.textContent = contact.email.label;

      const resumeBtn = document.createElement('a');
      resumeBtn.href = contact.resume.file;
      resumeBtn.className = 'section-btn';
      resumeBtn.setAttribute('download', '');
      resumeBtn.setAttribute('data-aos', 'zoom-in');
      resumeBtn.setAttribute('data-aos-delay', '400');
      resumeBtn.textContent = contact.resume.label;

      const sectionContent = document.querySelector('#contact .section-content');
      if (sectionContent) {
        sectionContent.querySelectorAll('.section-btn, .spacer-sm').forEach(el => el.remove());
        sectionContent.appendChild(emailBtn);
        sectionContent.appendChild(document.createElement('div')).className = 'spacer-sm';
        sectionContent.appendChild(resumeBtn);
        sectionContent.appendChild(document.createElement('div')).className = 'spacer-sm';
      }
    }
  })
  .catch(err => console.error('Error loading texts.json:', err));


  

// Load Social Icons
fetch('json/social.json')
  .then(response => response.json())
  .then(icons => {
    const socialIconsContainer = document.querySelector('#social-links');
    if (socialIconsContainer) {
      socialIconsContainer.innerHTML = '';
      icons.forEach((icon, idx) => {
        const a = document.createElement('a');
        a.href = icon.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', icon.ariaLabel);
        a.className = 'icon';

        // Apply background color if it exists
        if (icon.bgColor) {
          a.style.backgroundColor = icon.bgColor;
        }

        // Apply custom inline style string if it exists
        if (icon.style) {
          a.style.cssText += icon.style; 
        }

        // --- THIS IS THE NEW PART ---
        // Apply the border-color from JSON as a CSS variable
        // The CSS will use this variable only on :hover
        if (icon.borderColor) {
          a.style.setProperty('--hover-outline-color', icon.borderColor);
        }
        // --- END OF NEW PART ---
        
        a.setAttribute('data-aos-offset', '50');
        a.setAttribute('data-aos', 'fade-up');
        a.setAttribute('data-aos-delay', 250 + idx * 100);

        const i = document.createElement('i');
        i.className = icon.iconClass;
        a.appendChild(i);

        socialIconsContainer.appendChild(a);
      });
    }
  })
  .catch(err => console.error('Error loading social icons:', err));





  //sidedbar toggle button (phones only)
  // Sidedbar toggle button (phones only)
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    let autoHideTimer; // Variable to hold our timer

    if (!sidebar || !sidebarToggle) {
        // If elements don't exist, do nothing.
        return;
    }

    const openSidebar = () => {
        sidebar.classList.add('active');
        sidebarToggle.style.display = 'none'; // <-- ADD THIS LINE to hide the button
        autoHideTimer = setTimeout(closeSidebar, 3000);
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        sidebarToggle.style.display = ''; // <-- ADD THIS LINE to show the button again
        clearTimeout(autoHideTimer);
    };

    sidebarToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the document click listener from firing
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebar.addEventListener('mouseenter', () => {
        clearTimeout(autoHideTimer); // Pause the timer
    });

    // 3. Resume auto-hide when mouse leaves the sidebar
    sidebar.addEventListener('mouseleave', () => {
        autoHideTimer = setTimeout(closeSidebar, 3000); // Resume the timer
    });

    // 4. Close sidebar if user clicks anywhere else on the page
    document.addEventListener('click', (event) => {
        // Check if the sidebar is active AND the click was outside the sidebar
        if (sidebar.classList.contains('active') && !sidebar.contains(event.target)) {
            closeSidebar();
        }
    });
});