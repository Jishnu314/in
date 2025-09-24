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

    // Skills Explore button
    document.querySelector('.skills-explore-btn').textContent = data.exploreBtn;
    document.querySelector('.skills-title').textContent = "Skills";
  })
  .catch(err => console.error("Error loading skills.json:", err));

// Load Experience

fetch('json/experience.json')
  .then(res => res.json())
  .then(data => {
    // Set section title
    document.querySelector('.experience-title').textContent = data.title;

    const expContainer = document.getElementById('experience-section-placeholder');

    data.list.forEach(exp => {
      const div = document.createElement('div');
      div.className = 'exp';

      // Build HTML dynamically
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
const dotsContainer = document.getElementById("nav-dots-container"); // NEW: Get the dots container

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

/**
 * Creates navigation dots based on the number of projects.
 */
function createDots() {
    dotsContainer.innerHTML = '';
    projects.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('nav-dot');
        dot.dataset.index = index; // Store index for click events
        dotsContainer.appendChild(dot);
    });
}

/**
 * Displays the project for the given index and updates the active dot.
 */
function showProject(index) {
    const project = projects[index];

    // 1. Update project content
    projectNumberEl.textContent = (index + 1).toString().padStart(2, '0');
    titleEl.textContent = project.title;
    subtitleEl.textContent = project.subtitle;
    descEl.textContent = project.description;
    imageEl.src = project.image;
    imageEl.alt = project.title;

    // 2. Update active dot
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, dotIndex) => {
        if (dotIndex === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // 3. NEW: Add this block to handle the "Read More" button
    if (project.link && project.link !== "") {
        readMoreBtn.style.display = 'inline-block'; // Or 'block', based on your CSS
        readMoreBtn.href = project.link;
    } else {
        readMoreBtn.style.display = 'none'; // Hide the button if no link is in the JSON
    }
}

// --- Event Listeners ---

// Previous button
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  showProject(currentIndex);
  resetAutoScroll();
});

// Next button
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % projects.length;
  showProject(currentIndex);
  resetAutoScroll();
});

// Add event listener for dot clicks
dotsContainer.addEventListener('click', (e) => {
    // Check if a dot was actually clicked
    if (e.target.classList.contains('nav-dot')) {
        // Get the index from the dot's data-index attribute
        currentIndex = parseInt(e.target.dataset.index);
        showProject(currentIndex);
        resetAutoScroll();
    }
});

// NEW: Add event listener for keyboard keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { // If left arrow is pressed
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        showProject(currentIndex);
        resetAutoScroll();
    } else if (e.key === 'ArrowRight') { // If right arrow is pressed
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
  }, 5000); // 5 seconds
}

function resetAutoScroll() {
  clearInterval(autoScrollInterval);
  startAutoScroll();
}


// Sidebar Navigation Active Link Highlighting

document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    // Function to remove 'active' class from all links
    const removeActiveClasses = () => {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    };

    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.6 // The section is considered "visible" when 60% of it is in the viewport
    };

    // The observer callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // If the section is intersecting (i.e., visible)
            if (entry.isIntersecting) {
                // Get the ID of the visible section
                const sectionId = entry.target.id;
                
                // Find the corresponding navigation link
                const correspondingLink = document.querySelector(`.sidebar-nav a[href="#${sectionId}"]`);
                
                // Remove the active class from all links
                removeActiveClasses();
                
                // Add the active class to the correct link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    };

    // Create a new Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

});