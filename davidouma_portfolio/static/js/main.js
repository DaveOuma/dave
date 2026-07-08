        // ============================================
// THEME TOGGLE (defaults to DARK)
// ============================================
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

const storedTheme = localStorage.getItem('theme');
const darkMode = storedTheme !== null ? storedTheme === 'dark' : true; // 👈 Default: true (dark)

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}
setTheme(darkMode);

themeToggle.addEventListener('click', () => setTheme(!darkMode));

        // ============================================
        // NAVBAR SCROLL
        // ============================================
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 60);
            lastScroll = y;
        });

        // ============================================
        // MOBILE NAV
        // ============================================
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');

        hamburger.addEventListener('click', () => {
            const open = mobileNav.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', open);
        });

        // Close mobile nav on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // ============================================
        // TYPING EFFECT
        // ============================================
        const titles = [
            'Software Engineer',
            'Senior Scientific Editor',
            'Educationist',
            'Backend Developer',
            'FinTech Engineer',
            'Technology Consultant',
            'Python & Django Expert'
        ];
        let idx = 0,
            charIdx = 0,
            isDeleting = false;
        const typingEl = document.getElementById('typing');

        function type() {
            const current = titles[idx];
            if (!isDeleting) {
                typingEl.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 80);
            } else {
                typingEl.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    idx = (idx + 1) % titles.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 40);
            }
        }
        type();

        // ============================================
        // SCROLL REVEAL (Intersection Observer)
        // ============================================
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => observer.observe(el));

        // ============================================
        // COUNTER ANIMATION
        // ============================================
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    let current = 0;
                    const duration = 2000;
                    const steps = 60;
                    const increment = target / steps;
                    let step = 0;
                    const timer = setInterval(() => {
                        step++;
                        current += increment;
                        if (step >= steps) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current);
                    }, duration / steps);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(el => counterObserver.observe(el));

        // ============================================
        // BACK TO TOP
        // ============================================
        const backTop = document.getElementById('backTop');
        window.addEventListener('scroll', () => {
            backTop.classList.toggle('visible', window.scrollY > 400);
        });
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ============================================
        // COPY TILL NUMBER
        // ============================================
        function copyTill() {
            const till = '4555378';
            navigator.clipboard.writeText(till).then(() => {
                const btn = document.querySelector('.till-box button');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => btn.innerHTML = orig, 1800);
            }).catch(() => {
                alert('Till number: ' + till);
            });
        }

        // ============================================
        // PUBLICATION FILTERS
        // ============================================
        document.querySelectorAll('.publication-filters button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.publication-filters button').forEach(b => b.classList.remove(
                'active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.publication-item').forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // ============================================
        // ACTIVE NAV LINK ON SCROLL
        // ============================================
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 120;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        });

        // ============================================
        // KEYBOARD ACCESSIBILITY: ESC closes mobile nav
        // ============================================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // ============================================
        // REDUCED MOTION PREFERENCE
        // ============================================
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
                el.style.transition = 'none';
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }

        // ============================================
        // CONTACT FORM SUBMISSION
        // ============================================
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const contactUrl = this.dataset.contactUrl;
                fetch(contactUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                    body: formData
                })
                .then(async (response) => {
                    const data = await response.json().catch(() => ({}));
                    if (response.ok && data.success) {
                        alert(data.message);
                        this.reset();
                        return;
                    }
                    alert(data.message || data.errors || 'Could not send your message. Please try again.');
                })
                .catch(() => alert('Network error. Please try again.'));
            });
        }

        // ============================================
        // CV DOWNLOAD — track first successful download
        // ============================================
        const cvDownloadBtn = document.getElementById('cvDownloadBtn');
        const CV_DOWNLOAD_KEY = 'cv_downloaded';

        function setCvDownloadState(btn, state) {
            const icon = btn.querySelector('i');
            const label = btn.querySelector('.cv-download-label');
            if (!icon || !label) return;

            const isDownloaded = state === 'downloaded' || state === 'repeat';
            btn.classList.toggle('is-downloaded', isDownloaded);

            if (state === 'downloading') {
                icon.className = 'fas fa-spinner fa-spin';
                label.textContent = 'Downloading…';
                btn.setAttribute('aria-label', 'Downloading CV');
                return;
            }

            if (state === 'downloaded') {
                icon.className = 'fas fa-check-circle';
                label.textContent = btn.dataset.downloadedLabel || 'CV Downloaded';
                btn.setAttribute('aria-label', 'CV downloaded successfully');
                return;
            }

            if (state === 'repeat') {
                icon.className = 'fas fa-redo';
                label.textContent = btn.dataset.repeatLabel || 'Download Again';
                btn.setAttribute('aria-label', 'Download CV again');
                btn.title = 'You already downloaded this CV — click for another copy';
                return;
            }

            icon.className = 'fas fa-file-pdf';
            label.textContent = btn.dataset.defaultLabel || 'Download CV';
            btn.setAttribute('aria-label', 'Download CV');
            btn.removeAttribute('title');
        }

        async function triggerCvDownload(btn) {
            const response = await fetch(btn.href);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = blobUrl;
            tempLink.download = btn.getAttribute('download') || 'David_Ouma_CV_programming.pdf';
            document.body.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();
            URL.revokeObjectURL(blobUrl);
        }

        if (cvDownloadBtn) {
            if (sessionStorage.getItem(CV_DOWNLOAD_KEY) === 'true') {
                setCvDownloadState(cvDownloadBtn, 'repeat');
            }

            cvDownloadBtn.addEventListener('click', async (event) => {
                event.preventDefault();

                const alreadyDownloaded = sessionStorage.getItem(CV_DOWNLOAD_KEY) === 'true';
                cvDownloadBtn.classList.add('is-busy');
                setCvDownloadState(cvDownloadBtn, 'downloading');

                try {
                    await triggerCvDownload(cvDownloadBtn);
                    sessionStorage.setItem(CV_DOWNLOAD_KEY, 'true');

                    if (!alreadyDownloaded) {
                        setCvDownloadState(cvDownloadBtn, 'downloaded');
                        window.setTimeout(() => {
                            setCvDownloadState(cvDownloadBtn, 'repeat');
                        }, 2000);
                    } else {
                        setCvDownloadState(cvDownloadBtn, 'repeat');
                    }
                } catch {
                    cvDownloadBtn.classList.remove('is-busy');
                    setCvDownloadState(
                        cvDownloadBtn,
                        alreadyDownloaded ? 'repeat' : 'idle'
                    );
                    window.location.assign(cvDownloadBtn.href);
                    return;
                }

                cvDownloadBtn.classList.remove('is-busy');
            });
        }

        console.log('David Ouma · Premium Portfolio · Built with L❤️ve');
        console.log('📧 davidomuga@gmail.com · 🔗 https://github.com/DaveOuma');
   