// Blood Donation Camp Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initAnimations();
    initFormHandling();
    initSmoothScrolling();
    initStatsCounter();
    initModalHandling();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    console.log('Initializing smooth scrolling...');
    
    const navLinks = document.querySelectorAll('a[href^="#"]');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            console.log(`Clicked on: ${targetId}, Target section:`, targetSection);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                console.log(`Scrolling to: ${targetId} at position: ${offsetTop}`);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Update active navigation immediately
                setTimeout(() => {
                    updateActiveNavigation();
                }, 100);
            } else {
                console.warn(`Target section not found: ${targetId}`);
            }
        });
        
        console.log(`Added click listener to link ${index + 1}: ${link.getAttribute('href')}`);
    });
    
    // Also handle footer links
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle campaign card buttons
    const campaignButtons = document.querySelectorAll('.campaign-card .btn');
    campaignButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Open donor registration modal
            const donorModal = new bootstrap.Modal(document.getElementById('donorModal'));
            donorModal.show();
        });
    });
}

// Animate elements on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.about-card, .campaign-card, .process-step, .contact-info');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Animated statistics counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    };

    // Start animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
}

// Form handling
function initFormHandling() {
    // Donor registration form
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', handleDonorRegistration);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Eligibility form
    const eligibilityForm = document.getElementById('eligibilityForm');
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', handleEligibilityCheck);
    }
}

// API base URLs
const API_BASE = window.location.origin + '/api';
const PHP_BASE = window.location.origin + '/php';
const IS_FILE = window.location.origin.startsWith('file://');

// Detect backend preference
const SPRING_BASE = 'http://localhost:8080/api';

async function resolveApiBase() {
    // Try Spring Boot first
    try {
        const r = await fetch(`${SPRING_BASE}/donors`, { method: 'GET' });
        if (r.ok) return SPRING_BASE;
    } catch (e) {}
    // Fallback to Node only if not file:// and same origin can exist
    if (!IS_FILE) {
        try {
            const r2 = await fetch(`${API_BASE}/health`);
            if (r2.ok) return API_BASE;
        } catch (e) {}
    }
    // No backend reachable
    return null;
}

let ACTIVE_API_BASE = null;

document.addEventListener('DOMContentLoaded', async function() {
    ACTIVE_API_BASE = await resolveApiBase();
    initStock();
    initSearch();
});

// Local storage fallback
function saveLocal(key, value) {
    try {
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.unshift({ ...value, _savedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(arr));
        return true;
    } catch (e) {
        return false;
    }
}

// Extend donor submission with location when available
function handleDonorRegistration(e) {
    e.preventDefault();
    
    const donorData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        weight: document.getElementById('weight').value,
        bloodType: document.getElementById('bloodType').value,
        preferredCamp: document.getElementById('preferredCamp').value,
        medicalHistory: document.getElementById('medicalHistory').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
    };

    if (validateDonorData(donorData)) {
        const submitBtn = document.querySelector('#donorModal .modal-footer button[type="submit"]');
        const stopLoading = showLoading(submitBtn || { textContent: '', innerHTML: '', disabled: false });

        const submitToApi = async () => {
            if (ACTIVE_API_BASE) {
                const res = await fetch(`${ACTIVE_API_BASE.replace(/\/api$/, '')}/api/donors`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(donorData)
                });
                if (!res.ok) {
                    let detail = '';
                    try { detail = JSON.stringify(await res.json()); } catch (_) {}
                    throw new Error(`API failed (${res.status}) ${detail}`);
                }
                return res.json();
            }
            // Fallback existing Node/PHP path (only if not file://)
            if (!IS_FILE) {
                try {
                    const tryNode = await fetch(`${API_BASE}/donors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(donorData)});
                    if (tryNode.ok) return tryNode.json();
                } catch (_) {}
                try {
                    const tryPhp = await fetch(`${PHP_BASE}/donor.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(donorData)});
                    if (tryPhp.ok) return tryPhp.json();
                } catch (_) {}
            }
            // Save locally when nothing reachable
            const ok = saveLocal('donors_local', donorData);
            if (!ok) throw new Error('No backend reachable and local save failed');
            return { local: true };
        };

        submitToApi()
        .then((res) => {
            const local = res && res.local;
            showNotification(local ? 'Saved locally. Start backend to sync later.' : 'Registration submitted successfully! We will contact you soon.', 'success');
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('donorModal'));
            if (modal) modal.hide();
            updateDonorStats();
        })
        .catch(err => {
            console.error(err);
            showNotification(`Failed to submit registration. ${err.message || ''}`.trim(), 'danger');
        })
        .finally(() => stopLoading());
    }
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    const contactData = {
        name: e.target.querySelector('input[placeholder="Your Name"]').value,
        email: e.target.querySelector('input[type="email"]').value,
        subject: e.target.querySelector('input[placeholder="Subject"]').value,
        message: e.target.querySelector('textarea').value
    };

    if (validateContactData(contactData)) {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const stopLoading = showLoading(submitBtn || { textContent: '', innerHTML: '', disabled: false });

        const submitToApi = async () => {
            // Prefer Spring only if it had contacts (not implemented) -> use Node/PHP when available
            if (!IS_FILE) {
                try {
                    const r = await fetch(`${API_BASE}/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactData) });
                    if (r.ok) return r.json();
                } catch (_) {}
                try {
                    const r2 = await fetch(`${PHP_BASE}/contact.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactData) });
                    if (r2.ok) return r2.json();
                } catch (_) {}
            }
            const ok = saveLocal('contacts_local', contactData);
            if (!ok) throw new Error('No backend reachable and local save failed');
            return { local: true };
        };

        submitToApi()
        .then(res => {
            const local = res && res.local;
            showNotification(local ? 'Message saved locally. Start backend to send later.' : 'Message sent successfully! We will get back to you soon.', 'success');
            e.target.reset();
        })
        .catch(err => {
            console.error(err);
            showNotification(`Failed to send message. ${err.message || ''}`.trim(), 'danger');
        })
        .finally(() => stopLoading());
    }
}

// Handle eligibility check
function handleEligibilityCheck(e) {
    e.preventDefault();
    
    const age = parseInt(document.getElementById('checkAge').value);
    const weight = parseInt(document.getElementById('checkWeight').value);
    const health = document.getElementById('checkHealth').value;
    const recent = document.getElementById('checkRecent').value;

    const isEligible = checkEligibility(age, weight, health, recent);
    
    if (isEligible) {
        showNotification('Congratulations! You are eligible to donate blood.', 'success');
    } else {
        showNotification('You may not be eligible to donate blood at this time. Please consult with medical staff.', 'warning');
    }
}

// Check eligibility function
function checkEligibility(age, weight, health, recent) {
    // Basic eligibility criteria
    if (age < 18 || age > 65) return false;
    if (weight < 50) return false;
    if (health === 'poor') return false;
    if (recent === 'tattoo' || recent === 'surgery') return false;
    
    return true;
}

// Validate donor data
function validateDonorData(data) {
    if (!data.firstName || !data.lastName) {
        showNotification('Please enter your full name.', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.length < 10) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    if (!data.age || data.age < 18 || data.age > 65) {
        showNotification('Age must be between 18 and 65 years.', 'error');
        return false;
    }
    
    if (!data.weight || data.weight < 50) {
        showNotification('Weight must be at least 50 kg.', 'error');
        return false;
    }
    
    if (!data.bloodType) {
        showNotification('Please select your blood type.', 'error');
        return false;
    }
    
    return true;
}

// Validate contact data
function validateContactData(data) {
    if (!data.name || data.name.trim().length < 2) {
        showNotification('Please enter your name.', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        showNotification('Please enter a subject (minimum 5 characters).', 'error');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showNotification('Please enter your message (minimum 10 characters).', 'error');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Update donor statistics
function updateDonorStats() {
    const donorCountElement = document.querySelector('.stat-number[data-target="2500"]');
    if (donorCountElement) {
        const currentCount = parseInt(donorCountElement.textContent);
        donorCountElement.textContent = currentCount + 1;
    }
}

// Modal handling
function initModalHandling() {
    // Auto-focus first input in modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });
}

// Scroll to section function (for hero buttons)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect and active navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation based on scroll position
    updateActiveNavigation();
});

// Update active navigation based on current section
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Show/hide back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add loading animation for form submissions
function showLoading(element) {
    const originalText = element.textContent;
    element.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalText;
        element.disabled = false;
    };
}

// tooltips if Bootstrap is available
if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to campaign cards
    const campaignCards = document.querySelectorAll('.campaign-card');
    campaignCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.checkEligibility = checkEligibility;
window.scrollToTop = scrollToTop;

// Init stock cards
async function initStock() {
    const grid = document.getElementById('stockGrid');
    if (!grid) return;

    const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
    const stockMap = {};

    if (ACTIVE_API_BASE) {
        try {
            const res = await fetch(`${ACTIVE_API_BASE.replace(/\/api$/, '')}/api/stock`);
            if (res.ok) {
                const data = await res.json();
                data.forEach(s => stockMap[s.bloodGroup] = s.units);
            }
        } catch (e) {}
    }

    grid.innerHTML = groups.map(g => {
        const units = stockMap[g] ?? Math.floor(Math.random() * 50 + 10); // placeholder if no backend
        return `
        <div class="col-6 col-md-3">
            <div class="card text-center p-3">
                <div class="card-body">
                    <h5 class="card-title">${g}</h5>
                    <div class="unit-badge">${units} units</div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Init donor search
function initSearch() {
    const form = document.getElementById('searchForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const blood = document.getElementById('searchBlood').value;
        const city = document.getElementById('searchCity').value.trim();
        const state = document.getElementById('searchState').value.trim();
        const pin = document.getElementById('searchPincode').value.trim();
        const results = document.getElementById('searchResults');
        results.innerHTML = '';

        try {
            if (!ACTIVE_API_BASE) throw new Error('No API');
            const params = new URLSearchParams({ bloodType: blood });
            if (city) params.append('city', city);
            if (state) params.append('state', state);
            if (pin) params.append('pincode', pin);
            const url = `${ACTIVE_API_BASE.replace(/\/api$/, '')}/api/donors/search?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            if (!data.length) {
                results.innerHTML = '<p class="text-muted">No donors found.</p>';
                return;
            }
            results.innerHTML = data.map(d => `
                <div class="col-md-4">
                    <div class="donor-card">
                        <h6>${d.firstName} ${d.lastName} <span class="badge bg-danger ms-2">${d.bloodType}</span></h6>
                        <div class="donor-meta">${d.city || ''} ${d.state || ''} ${d.pincode || ''}</div>
                        <div class="donor-meta">${d.email} • ${d.phone}</div>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            results.innerHTML = '<p class="text-muted">Search unavailable. Start backend to enable.</p>';
        }
    });
}

// Auth helpers
function getAuth() {
    try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch(e){ return null; }
}
function setAuth(user, remember) {
    if (remember) localStorage.setItem('auth_user', JSON.stringify(user)); else sessionStorage.setItem('auth_user', JSON.stringify(user));
}
function clearAuth() {
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
}
function isLoggedIn() {
    return !!(getAuth() || (function(){ try { return JSON.parse(sessionStorage.getItem('auth_user') || 'null'); } catch(e){ return null; } })());
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();
    const remember = document.getElementById('rememberMe').checked;

    // Demo credentials; replace with real backend auth later
    const demoAdmin = (email.toLowerCase() === 'admin@bloodcare.org' && pass === 'admin123');
    const user = demoAdmin ? { email, role: 'admin', name: 'Administrator' } : { email, role: 'user', name: email.split('@')[0] };

    setAuth(user, remember);
    showNotification('Logged in successfully', 'success');
    setTimeout(() => { window.location.href = demoAdmin ? 'admin.html' : 'index.html'; }, 600);
}

// Guard admin page
(function guardAdmin(){
    if (location.pathname.endsWith('/admin.html') || location.pathname.endsWith('admin.html')) {
        const user = getAuth() || (function(){ try { return JSON.parse(sessionStorage.getItem('auth_user') || 'null'); } catch(e){ return null; } })();
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html';
        }
    }
})();

// Optional: Add logout function globally
function logout() {
    clearAuth();
    showNotification('Logged out', 'success');
    setTimeout(()=>{ window.location.href = 'index.html'; }, 400);
}
window.logout = logout;

// Require login for all pages except login/thankyou
(function requireLogin() {
    try {
        const p = (location.pathname || '').toLowerCase();
        const isAllowed = p.endsWith('/login.html') || p.endsWith('login.html') || p.endsWith('/thankyou.html') || p.endsWith('thankyou.html');
        if (!isAllowed) {
            // Check login from localStorage or sessionStorage
            const stored = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
            if (!stored) {
                location.replace('login.html');
            }
        }
    } catch (e) {}
})();
