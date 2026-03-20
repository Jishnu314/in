/**
 * Jishnu K - Portfolio Logic
 * Handles dynamic content fetching from modular JSON files.
 */

async function initPortfolio() {
    try {
        const [skills, experience, projects, socials, profile] = await Promise.all([
            fetch('json/skills.json').then(res => res.json()),
            fetch('json/experience.json').then(res => res.json()),
            fetch('json/project.json').then(res => res.json()),
            fetch('json/socials.json').then(res => res.json()),
            fetch('json/profile.json').then(res => res.json())
        ]);

        // 1. Populate Profile & About
        document.getElementById('hero-name').innerHTML = `Hi, I'm<br><span class="hero-name-span">${profile.name}</span>`;
        document.getElementById('hero-desc').innerText = profile.heroDescription;
        document.getElementById('hero-image').src = profile.heroImage;
        document.getElementById('about-title').innerText = profile.aboutTitle;
        document.getElementById('about-text').innerText = profile.aboutText;
        document.getElementById('about-pic').src = profile.profilePicture;
        document.getElementById('footer-name').innerText = profile.fullName;

        // 2. Dynamic Stats
        document.getElementById('stat-projects').innerHTML = `${projects.length} <span>Projects</span>`;
        document.getElementById('stat-skills').innerHTML = `${skills.length} <span>Skills</span>`;

        // 3. Render Skills
        renderSkills(skills);

        // 4. Render Experience
        renderExperience(experience);

        // 5. Render Socials & Contact
        document.getElementById('email-btn').href = `mailto:${socials.contact.email}`;

        const resumeBtn = document.getElementById('resume-btn');
        resumeBtn.href = socials.contact.resume;

       resumeBtn.addEventListener('click', (event) => {
          event.preventDefault();

          const overlay = document.createElement('div');
          overlay.style.cssText = `
              position: fixed; inset: 0;
              background: rgba(0,0,0,0.5);
              display: flex; align-items: center; justify-content: center;
              z-index: 9999;
              backdrop-filter: blur(4px);
          `;

          const modal = document.createElement('div');
          modal.style.cssText = `
              background: #111;
              border: 1px solid #222;
              border-radius: 16px;
              padding: 32px;
              max-width: 360px;
              width: 90%;
              text-align: center;
          `;

          modal.innerHTML = `
              <div style="font-size:28px;margin-bottom:12px;">📄</div>
              <h3 style="color:#fff;font-size:17px;font-weight:600;margin-bottom:8px;">Download Resume</h3>
              <p style="color:#888;font-size:13px;line-height:1.6;margin-bottom:24px;">
                  Would you like to download Jishnu's Resume as a PDF?
              </p>
              <div style="display:flex;gap:10px;justify-content:center;">
                  <button id="modal-cancel" style="
                      padding:10px 24px;border-radius:8px;
                      background:transparent;color:#888;
                      border:1px solid #333;font-size:13px;
                      cursor:pointer;transition:all 0.2s;
                  ">Cancel</button>
                  <button id="modal-confirm" style="
                      padding:10px 24px;border-radius:8px;
                      background:#ff6a00;color:#fff;
                      border:none;font-size:13px;font-weight:500;
                      cursor:pointer;transition:all 0.2s;
                  ">Download</button>
              </div>
          `;

          overlay.appendChild(modal);
          document.body.appendChild(overlay);

          // ── Button hover effects ──────────────────────────────────
          const cancelBtn  = document.getElementById('modal-cancel');
          const confirmBtn = document.getElementById('modal-confirm');

          cancelBtn.addEventListener('mouseenter', () => {
              cancelBtn.style.background = '#1f1e1e';
              cancelBtn.style.color = '#ccc';
              cancelBtn.style.borderColor = '#e05e00';
          });
          cancelBtn.addEventListener('mouseleave', () => {
              cancelBtn.style.background = 'transparent';
              cancelBtn.style.color = '#888';
              cancelBtn.style.borderColor = '#333';
          });
          cancelBtn.addEventListener('mousedown', () => cancelBtn.style.transform = 'scale(0.97)');
          cancelBtn.addEventListener('mouseup',   () => cancelBtn.style.transform = 'scale(1)');

          confirmBtn.addEventListener('mouseenter', () => {
              confirmBtn.style.background = '#1f1e1e';
              confirmBtn.style.transform = 'translateY(-1px)';
          });
          confirmBtn.addEventListener('mouseleave', () => {
              confirmBtn.style.background = '#ff6a00';
              confirmBtn.style.transform = 'translateY(0)';
          });
          confirmBtn.addEventListener('mousedown', () => confirmBtn.style.transform = 'scale(0.97)');
          confirmBtn.addEventListener('mouseup',   () => confirmBtn.style.transform = 'translateY(-1px)');

          // ── Close logic ───────────────────────────────────────────
          const closeModal = () => document.body.removeChild(overlay);

          cancelBtn.addEventListener('click', closeModal);
          overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

          // ── Download ──────────────────────────────────────────────
          confirmBtn.addEventListener('click', () => {
              const link = document.createElement('a');
              link.href = resumeBtn.href;
              link.download = "Jishnu_K_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              closeModal();
          });
      });
    

        renderSocials(socials.links);

        // 6. Render Projects & Start Slider
        renderProjects(projects);

    } catch (err) {
        console.error("Critical Error: One or more JSON files failed to load.", err);
    }
}

function renderSkills(skillsArray) {
    const skillContainer = document.getElementById('skill-container');
    skillContainer.style.display = 'grid';
    skillContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(56px, 1fr))';
    skillContainer.style.gap = '32px';
    skillContainer.style.height = 'auto';
    skillContainer.style.minHeight = '100px';

    skillContainer.innerHTML = skillsArray.map((skill, index) => {
        let iconHTML = '';
        if (skill.iconClass) {
            iconHTML = `<i class="${skill.iconClass}"></i>`;
        } else if (skill.iconify) {
            iconHTML = `<iconify-icon icon="${skill.iconify}" width="40"></iconify-icon>`;
        }
        return `
            <div class="skill-item"
                 tabindex="0"
                 data-aos="fade-up-right"
                 data-aos-delay="${200 + index * 100}"
                 data-aos-duration="800"
                 data-aos-easing="ease-in-out">
                <div class="skill-icon-box">${iconHTML}</div>
                <span class="skill-name">${skill.name}</span>
            </div>
        `;
    }).join('');

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function renderExperience(experienceArray) {
    const expContainer = document.getElementById('exp-container');
    expContainer.innerHTML = '<h2>Experience</h2>';

    const expHTML = experienceArray.map(e => {
        const pointsHTML = e.points
            ? `<ul class="exp-points">${e.points.map(point => `<li>${point}</li>`).join('')}</ul>`
            : '';
        return `
            <div class="exp-item" data-aos="fade-up">
                <div class="exp-header"><h3>${e.company}</h3></div>
                <p>${e.description}</p>
                ${pointsHTML}
            </div>
        `;
    }).join('');

    expContainer.innerHTML += expHTML;
}

function renderSocials(socialLinks) {
    const container = document.getElementById('social-container');

    container.innerHTML = socialLinks.map((social, index) => `
        <a href="${social.url}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${social.ariaLabel}"
           class="social-icon-link"
           data-index="${index}"
           style="border: 1.5px solid ${social.borderColor}; color: ${social.borderColor};">
            <i class="${social.iconClass}"></i>
        </a>
    `).join('');

    const iconLinks = container.querySelectorAll('.social-icon-link');
    iconLinks.forEach(link => {
        const index = link.getAttribute('data-index');
        const data = socialLinks[index];

        link.addEventListener('mouseenter', () => {
            if (data.style) {
                link.style.background = data.style;
            } else {
                link.style.backgroundColor = data.bgColor;
            }
            link.style.color = '#fff';
            link.style.borderColor = 'transparent';
        });

        link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
            link.style.color = data.borderColor;
            link.style.borderColor = data.borderColor;
        });
    });
}

function renderProjects(projects) {
    const list = document.getElementById('project-container');
    const bar = document.getElementById('bar');

    let current = 0;
    let timer;
    const VISIBLE = 4;
    let windowStart = 0;

    function pad(n) { return String(n).padStart(2, '0'); }

    // ── Render cards ─────────────────────────────────────────
    list.innerHTML = projects.map((p, i) => `
        <div class="project-card ${i === 0 ? 'active' : ''} ${i >= VISIBLE ? 'c-hidden' : ''}"
             data-index="${i}" data-image="${p.image}">
            <div>
                <div class="project-number">${pad(i + 1)}</div>
                <strong>${p.title}</strong><br>
                <span>${p.tags}</span>
            </div>
            <div class="arrow-icon">&#8599;</div>
        </div>
    `).join('');

    const items = Array.from(list.querySelectorAll('.project-card'));

    // ── Build image preview ───────────────────────────────────
    const projectImage = document.querySelector('.project-image');
    projectImage.innerHTML = '';

    const flipper = document.createElement('div');
    flipper.style.cssText = `
        width: 100%; height: 100%;
        position: relative;
        transition: opacity 0.4s ease;
    `;

    // Front
    const front = document.createElement('div');
    front.style.cssText = `
        position: absolute; inset: 0;
        border-radius: 22px;
        overflow: hidden;
    `;

    const previewImg = document.createElement('img');
    previewImg.style.cssText = `
        width: 100%; height: 100%;
        object-fit: cover; display: block;
        transition: transform 0.3s ease;
    `;
    previewImg.src = projects[0].image;
    front.appendChild(previewImg);

    const frontOverlay = document.createElement('div');
    frontOverlay.style.cssText = `
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 60%);
        pointer-events: none;
    `;
    front.appendChild(frontOverlay);

    const frontHint = document.createElement('div');
    frontHint.style.cssText = `
        position: absolute;
        bottom: 14px; right: 16px;
        font-size: 10px; color: #88888784;
        letter-spacing: 2px; text-transform: uppercase;
        pointer-events: none; transition: opacity 0.3s ease;
    `;
    frontHint.textContent = 'HOVER TO SEE DETAILS';
    front.appendChild(frontHint);

    // Back
    const back = document.createElement('div');
    back.style.cssText = `
        position: absolute; inset: 0;
        background: #111;
        border-radius: 22px;
        display: flex; flex-direction: column;
        justify-content: center;
        padding: 36px;
        opacity: 0;
        pointer-events: none;
    `;
    back.innerHTML = `
        <div id="back-num" style="font-size:56px;font-weight:700;color:#222;line-height:1;margin-bottom:12px;">01</div>
        <div id="back-title" style="font-size:22px;font-weight:600;color:#fff;margin-bottom:8px;"></div>
        <div id="back-tags" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ff6a00;margin-bottom:20px;"></div>
        <div id="back-desc" style="font-size:14px;color:#888;line-height:1.7;margin-bottom:16px;"></div>
        <div id="back-features" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;"></div>
        <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:32px;height:2px;background:#ff6a00;"></div>
            <a id="back-github" href="#" target="_blank" rel="noopener noreferrer"
               onclick="event.stopPropagation()"
               onmouseenter="this.style.background='#383e46'"
               onmouseleave="this.style.background='#24292e'"
               style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;
                      border-radius:8px;background:#24292e;color:#fff;font-size:12px;
                      font-weight:500;text-decoration:none;letter-spacing:0.3px;
                      border:1px solid #444;transition:background 0.2s ease;">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                      -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                      .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                      -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                      .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                      .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                      0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
                      c0-4.42-3.58-8-8-8z"/>
                </svg>
                View on GitHub
            </a>
        </div>
        <div style="font-size:10px;color:#444;letter-spacing:2px;margin-top:16px;">HOVER OUT TO RESUME</div>
    `;

    flipper.appendChild(front);
    flipper.appendChild(back);
    projectImage.appendChild(flipper);

    let isFlipped = false;

    function updateBack(idx) {
        document.getElementById('back-num').textContent   = pad(idx + 1);
        document.getElementById('back-title').textContent = projects[idx].title;
        document.getElementById('back-tags').textContent  = projects[idx].tags;
        document.getElementById('back-desc').textContent  = projects[idx].desc || projects[idx].description || '';

        const featuresEl = document.getElementById('back-features');
        const features = projects[idx].features || [];
        featuresEl.innerHTML = features.map(f => `
            <span style="
                display:inline-block;
                padding:4px 10px;
                border-radius:20px;
                border:1px solid #ff6a00c2;
                color:#ff6a00;
                font-size:10px;
                letter-spacing:1px;
                text-transform:uppercase;
            ">${f}</span>
        `).join('');

        const ghBtn = document.getElementById('back-github');
        if (projects[idx].github) {
            ghBtn.href = projects[idx].github;
            ghBtn.style.display = 'inline-flex';
        } else {
            ghBtn.style.display = 'none';
        }
    }

    updateBack(0);

    // ── Desktop hover ─────────────────────────────────────────
    const handleMouseEnter = () => {
        clearInterval(timer);
        bar.style.transition = 'none';
        isFlipped = true;
        updateBack(current);
        front.style.transition = 'opacity 0.4s ease';
        back.style.transition = 'opacity 0.4s ease';
        back.style.pointerEvents = 'auto';
        front.style.opacity = '0.5';
        back.style.opacity = '0.9';
        front.style.scale = '1.2'
    };

    const handleMouseLeave = () => {
        isFlipped = false;
        front.style.transition = 'opacity 0.4s ease';
        back.style.transition = 'opacity 0.4s ease';
        back.style.pointerEvents = 'none';
        front.style.opacity = '1';
        back.style.opacity = '0';
        front.style.scale = '1'
        restartBar();
        autoPlay();
    };

    projectImage.addEventListener('mouseenter', handleMouseEnter);
    projectImage.addEventListener('mouseleave', handleMouseLeave);

    // ── Parallax on front only ────────────────────────────────
    projectImage.addEventListener('mousemove', (e) => {
        if (isFlipped) return;
        const rect = projectImage.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        previewImg.style.transform = `scale(1.06) translate(${cx * 16}px, ${cy * 16}px)`;
    });

    // ── Window scroll logic ───────────────────────────────────
    function updateWindow(newStart) {
        if (projects.length <= VISIBLE) return;
        newStart = Math.max(0, Math.min(newStart, projects.length - VISIBLE));
        if (newStart === windowStart) return;
        windowStart = newStart;

        items.forEach((item, i) => {
            item.classList.remove('c-hidden', 'c-slide-out');
            if (i >= windowStart && i < windowStart + VISIBLE) {
                // in view
            } else if (i < windowStart) {
                item.classList.add('c-slide-out');
            } else {
                item.classList.add('c-hidden');
            }
        });
    }

    // ── goTo ──────────────────────────────────────────────────
    function goTo(idx) {
        if (idx === current) return;
        items[current].classList.remove('active');
        current = idx;
        items[current].classList.add('active');

        if (current >= windowStart + VISIBLE) updateWindow(current - VISIBLE + 1);
        else if (current < windowStart) updateWindow(current);

        if (!isFlipped) {
            previewImg.style.opacity = '0';
            previewImg.style.transform = 'scale(1.04)';
            setTimeout(() => {
                previewImg.src = projects[current].image;
                previewImg.onload = () => {
                    previewImg.style.transition = 'opacity 0.5s ease, transform 0.7s ease';
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = 'scale(1)';
                };
            }, 250);
        } else {
            updateBack(current);
            previewImg.src = projects[current].image;
        }

        restartBar();
    }

    function restartBar() {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            bar.style.transition = 'width 3s linear';
            bar.style.width = '100%';
        }));
    }

    function autoPlay() {
        clearInterval(timer);
        timer = setInterval(() => goTo((current + 1) % projects.length), 3000);
    }

    // ── Mobile tap on list cards ──────────────────────────────
    let mobileDescTimer;

    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            goTo(i);
            clearInterval(timer);

            if (window.innerWidth <= 768) {
                const existing = item.querySelector('.mobile-desc');
                const arrow = item.querySelector('.arrow-icon');

                clearTimeout(mobileDescTimer);

                // close all other open cards
                items.forEach(el => {
                    const d = el.querySelector('.mobile-desc');
                    const a = el.querySelector('.arrow-icon');
                    const g = el.querySelector('a.mobile-gh-btn');
                    const fw = el.querySelector('.mobile-features');
                    if (d) {
                        d.style.maxHeight = '0';
                        d.style.opacity = '0';
                        setTimeout(() => d.remove(), 400);
                    }
                    if (g) g.remove();
                    if (fw) fw.remove();
                    if (a) {
                        a.style.transform = 'rotate(0deg)';
                        a.style.color = '';
                        a.style.scale = '';
                    }
                });

                if (!existing) {
                    // ── desc ──
                    const desc = document.createElement('p');
                    desc.className = 'mobile-desc';
                    desc.textContent = projects[i].desc || projects[i].description || '';
                    desc.style.cssText = `
                        max-height: 0;
                        opacity: 0;
                        overflow: hidden;
                        transition: max-height 0.4s ease, opacity 0.3s ease;
                        font-size: 13px;
                        color: #888;
                        line-height: 1.6;
                        margin-top: 8px;
                    `;
                    item.querySelector('div').appendChild(desc);

                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        desc.style.maxHeight = '200px';
                        desc.style.opacity = '1';
                    }));

                    // ── feature pills ──
                    const features = projects[i].features || [];
                    if (features.length > 0) {
                        const featuresWrap = document.createElement('div');
                        featuresWrap.className = 'mobile-features';
                        featuresWrap.style.cssText = `
                            display: flex;
                            flex-wrap: wrap;
                            gap: 6px;
                            margin-top: 10px;
                        `;
                        featuresWrap.innerHTML = features.map(f => `
                            <span style="
                                padding:3px 9px;
                                border-radius:20px;
                                border:1px solid #ff6a00;
                                color:#ff6a00;
                                font-size:10px;
                                letter-spacing:1px;
                                text-transform:uppercase;
                            ">${f}</span>
                        `).join('');
                        item.querySelector('div').appendChild(featuresWrap);
                    }

                    // ── GitHub button ──
                    if (projects[i].github) {
                        const ghBtn = document.createElement('a');
                        ghBtn.href = projects[i].github;
                        ghBtn.target = '_blank';
                        ghBtn.rel = 'noopener noreferrer';
                        ghBtn.className = 'mobile-gh-btn';
                        ghBtn.onclick = (e) => e.stopPropagation();
                        ghBtn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                                  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                                  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                                  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                                  -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                                  .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                                  .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                                  0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
                                  c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            View on GitHub
                        `;
                        ghBtn.style.cssText = `
                            display:inline-flex;align-items:center;gap:6px;
                            margin-top:10px;padding:7px 14px;
                            border-radius:8px;background:#24292e;color:#fff;
                            font-size:12px;font-weight:500;text-decoration:none;
                            border:1px solid #444;
                        `;
                        item.querySelector('div').appendChild(ghBtn);
                    }

                    // ── arrow state ──
                    if (arrow) {
                        arrow.style.transform = 'rotate(180deg)';
                        arrow.style.color = '#ff6a00';
                        arrow.style.scale = '1.5';
                    }

                    // ── auto hide after 10s ──
                    mobileDescTimer = setTimeout(() => {
                        desc.style.maxHeight = '0';
                        desc.style.opacity = '0';
                        const ghBtn = item.querySelector('a.mobile-gh-btn');
                        const featuresWrap = item.querySelector('.mobile-features');
                        if (ghBtn) ghBtn.remove();
                        if (featuresWrap) featuresWrap.remove();
                        setTimeout(() => desc.remove(), 400);
                        if (arrow) {
                            arrow.style.transform = 'rotate(0deg)';
                            arrow.style.color = '';
                            arrow.style.scale = '';
                        }
                        autoPlay();
                    }, 10000);

                } else {
                    // tapped same card — close immediately
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                        arrow.style.color = '';
                        arrow.style.scale = '';
                    }
                    clearTimeout(mobileDescTimer);
                    autoPlay();
                }

            } else {
                autoPlay();
            }
        });
    });

    // ── Init ──────────────────────────────────────────────────
    restartBar();
    autoPlay();
}

/**
 * Fixes "Stuck Hover" on Mobile
 */
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('touchstart', (e) => {
        const target = e.target.closest('.skill-item, .project-card, .socials a, .btn-outline');
        if (target) target.classList.add('touch-active');
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const target = e.target.closest('.skill-item, .project-card, .socials a, .btn-outline');
        if (target) {
            setTimeout(() => target.classList.remove('touch-active'), 150);
        }
    }, { passive: true });

    document.addEventListener('touchmove', () => {
        document.querySelectorAll('.touch-active').forEach(el => el.classList.remove('touch-active'));
    }, { passive: true });
});

const menuBtn = document.getElementById('menu-btn');
const sideNav = document.querySelector('.side-nav');
let sideNavTimer;

function closeSideNav() {
    menuBtn.classList.remove('open');
    sideNav.classList.remove('mobile-open');
    clearTimeout(sideNavTimer);
}

function openSideNav() {
    menuBtn.classList.add('open');
    sideNav.classList.add('mobile-open');
    clearTimeout(sideNavTimer);
    sideNavTimer = setTimeout(closeSideNav, 8000);
}

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sideNav.classList.contains('mobile-open') ? closeSideNav() : openSideNav();
});

document.addEventListener('click', (event) => {
    if (!sideNav.classList.contains('mobile-open')) return;
    if (menuBtn.contains(event.target)) return;
    const rect = sideNav.getBoundingClientRect();
    const isOutside = event.clientX < rect.left || event.clientX > rect.right ||
                      event.clientY < rect.top  || event.clientY > rect.bottom;
    if (isOutside) closeSideNav();
});

sideNav.addEventListener('click', () => {
    clearTimeout(sideNavTimer);
    sideNavTimer = setTimeout(closeSideNav, 8000);
});

// ── Side nav active state on scroll ──────────────────────
const sideNavItems = document.querySelectorAll('.side-nav .side-nav-item');
const sections = document.querySelectorAll('section');

const sideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            sideNavItems.forEach(item => item.classList.remove('active'));
            const active = document.querySelector(
                `.side-nav .side-nav-item[href="#${entry.target.id}"]`
            );
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sideObserver.observe(s));

// ── GSAP Animations ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    gsap.from("#hero-name", { y: 40, opacity: 0, duration: 1 });
    gsap.from("#hero-desc", { y: 20, opacity: 0, delay: 0.3 });
    gsap.from(".stats .stat", { y: 30, opacity: 0, stagger: 0.2, delay: 0.6 });
});

initPortfolio();
