// Load skills.html into the placeholder
// In script.js
fetch('subfiles/skills.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(html => {
    document.getElementById('skills-section-placeholder').innerHTML = html;
  })
  .catch(error => {
    console.error('Error fetching skills section:', error);
    document.getElementById('skills-section-placeholder').innerHTML = 
      '<p class="error-message">Could not load skills content. Please try again later.</p>';
  });
// Animate .skill elements on scroll


  // Load Experience section
fetch('subfiles/experience.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('experience-section-placeholder').innerHTML = html;
  });
















  
// Wait for the initial HTML document to be fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const skillsPlaceholder = document.getElementById('skills-section-placeholder');
    const experiencePlaceholder = document.getElementById('experience-section-placeholder');

    // --- State Variables ---
    let hideSidebarTimeout;

    // --- Functions ---

    /**
     * Fetches an HTML file and injects it into a target element.
     * Returns a promise that resolves when the content is loaded.
     * @param {string} url - The URL of the HTML file to fetch.
     * @param {HTMLElement} targetElement - The element to inject the HTML into.
     * @returns {Promise<void>}
     */
    function loadSection(url, targetElement) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${url}. Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                targetElement.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching section:', error);
                targetElement.innerHTML = `<p class="error-message">Could not load content. Please try again later.</p>`;
                // Re-throw the error to be caught by Promise.all
                throw error;
            });
    }

    /**
     * Sets up the sidebar functionality, including toggle, auto-hide, and outside click.
     */
    /**
     * Sets up the sidebar functionality, including toggle, auto-hide, and outside click.
     */
    function initializeSidebar() {
        if (!toggleBtn || !sidebar) {
            console.warn("Sidebar elements not found. Skipping initialization.");
            return;
        }

        // --- Helper function to control the state of the sidebar and toggle button ---
        const setSidebarActive = (isActive) => {
            sidebar.classList.toggle('active', isActive);
            toggleBtn.classList.toggle('hidden', isActive); // Toggle 'hidden' class on the button

            clearTimeout(hideSidebarTimeout); // Always clear previous timer
            if (isActive) {
                // Set a new timer only if we are activating the sidebar
                hideSidebarTimeout = setTimeout(() => {
                    setSidebarActive(false); // Use our new function to hide it
                }, 3000);
            }
        };

        // Show/hide sidebar on toggle button click
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent this click from triggering the document listener
            // The new state is the opposite of the current state
            const shouldBeActive = !sidebar.classList.contains('active');
            setSidebarActive(shouldBeActive);
        });

        // Hide sidebar if clicked outside of it
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target)) {
                setSidebarActive(false);
            }
        });

        // Reset the auto-hide timer on any interaction within the sidebar
        sidebar.addEventListener('mousemove', () => {
            if (sidebar.classList.contains('active')) {
                // Re-calling setSidebarActive(true) will reset the timer
                setSidebarActive(true);
            }
        });
    }

    /**
     * Sets up the Intersection Observer to highlight the active nav link on scroll.
     * This should only be called AFTER the fetched sections are in the DOM.
     */
    function initializeScrollObserver() {
        const sections = document.querySelectorAll(".section");
        const navLinks = document.querySelectorAll(".sidebar-nav a");

        if (sections.length === 0 || navLinks.length === 0) {
            console.warn("Observer not initialized: no .section or .sidebar-nav links found.");
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            root: null, // observes intersections relative to the viewport
            threshold: 0.6 // Triggers when 60% of the section is visible
        });

        sections.forEach(section => observer.observe(section));
    }


    // --- Main Execution ---

    // Initialize sidebar immediately as its elements are in the main HTML
    initializeSidebar();

    // Fetch all dynamic content concurrently
    Promise.all([
        loadSection('subfiles/skills.html', skillsPlaceholder),
        loadSection('subfiles/experience.html', experiencePlaceholder)
    ]).then(() => {
        console.log("✅ All sections loaded successfully.");
        // Now that all content is on the page, initialize the observer
        initializeScrollObserver();

        // TODO: Initialize your skill animations here
        // animateSkillsOnScroll();

    }).catch(error => {
        console.error("❌ Failed to load one or more page sections.", error);
    });

});


