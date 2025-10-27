// script.js

// DOM Elements
const elements = {
    bandwidthSlider: document.getElementById('bandwidth'),
    bandwidthValue: document.getElementById('bandwidth-value'),
    uptimeSlider: document.getElementById('uptime'),
    uptimeValue: document.getElementById('uptime-value'),
    devicesInput: document.getElementById('devices'),
    earningsResult: document.getElementById('earnings-result'),
    liveEarnings: document.getElementById('live-earnings'),
    faqQuestions: document.querySelectorAll('.faq-question'),
    navLinks: document.querySelectorAll('.nav-links a'),
    header: document.querySelector('header')
};

// State
let state = {
    totalEarnings: 125000,
    isScrolled: false,
    currentSection: 'home'
};

// Earnings Calculator
class EarningsCalculator {
    constructor() {
        this.baseRate = 15; // Rp 15 per MB
        this.init();
    }

    init() {
        // Event listeners untuk calculator
        elements.bandwidthSlider.addEventListener('input', this.updateBandwidth.bind(this));
        elements.uptimeSlider.addEventListener('input', this.updateUptime.bind(this));
        elements.devicesInput.addEventListener('input', this.calculateEarnings.bind(this));
        
        // Initial calculation
        this.calculateEarnings();
    }

    updateBandwidth() {
        elements.bandwidthValue.textContent = `${elements.bandwidthSlider.value} GB`;
        this.calculateEarnings();
    }

    updateUptime() {
        elements.uptimeValue.textContent = `${elements.uptimeSlider.value} Jam`;
        this.calculateEarnings();
    }

    calculateEarnings() {
        const bandwidth = parseInt(elements.bandwidthSlider.value);
        const devices = parseInt(elements.devicesInput.value);
        const uptime = parseInt(elements.uptimeSlider.value);
        
        // Realistic calculation
        const baseEarnings = bandwidth * devices * uptime * this.baseRate;
        const monthlyEarnings = baseEarnings * 30;
        
        elements.earningsResult.textContent = `Rp ${monthlyEarnings.toLocaleString('id-ID')}`;
        
        // Animate result
        this.animateValue(elements.earningsResult, monthlyEarnings);
    }

    animateValue(element, newValue) {
        const oldValue = parseInt(element.textContent.replace(/[^\d]/g, '') || 0);
        const duration = 1000;
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(oldValue + (newValue - oldValue) * progress);
            element.textContent = `Rp ${currentValue.toLocaleString('id-ID')}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };
        
        requestAnimationFrame(updateValue);
    }
}

// FAQ System
class FAQSystem {
    constructor() {
        this.init();
    }

    init() {
        elements.faqQuestions.forEach(question => {
            question.addEventListener('click', this.toggleFAQ.bind(this));
        });
    }

    toggleFAQ(event) {
        const question = event.currentTarget;
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        const faqItem = question.parentElement;

        // Toggle current item
        answer.classList.toggle('active');
        faqItem.classList.toggle('active');
        icon.style.transform = answer.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';

        // Close other FAQs
        this.closeOtherFAQs(faqItem);
    }

    closeOtherFAQs(currentItem) {
        elements.faqQuestions.forEach(question => {
            const otherItem = question.parentElement;
            if (otherItem !== currentItem) {
                const otherAnswer = question.nextElementSibling;
                const otherIcon = question.querySelector('i');
                
                otherAnswer.classList.remove('active');
                otherItem.classList.remove('active');
                otherIcon.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Navigation System
class NavigationSystem {
    constructor() {
        this.init();
    }

    init() {
        // Smooth scroll untuk semua anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Scroll event untuk active link dan header effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Initial update
        this.handleScroll();
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = elements.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL
            history.pushState(null, null, targetId);
        }
    }

    handleScroll() {
        // Header effect
        const scrollY = window.scrollY;
        if (scrollY > 100 && !state.isScrolled) {
            elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
            elements.header.style.backdropFilter = 'blur(10px)';
            state.isScrolled = true;
        } else if (scrollY <= 100 && state.isScrolled) {
            elements.header.style.background = 'white';
            elements.header.style.backdropFilter = 'none';
            state.isScrolled = false;
        }

        // Active nav link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                state.currentSection = sectionId;
            }
        });
        
        // Update nav links
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${state.currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Live Earnings System
class LiveEarningsSystem {
    constructor() {
        this.interval = null;
        this.init();
    }

    init() {
        // Start live earnings simulation
        this.startLiveEarnings();
    }

    startLiveEarnings() {
        this.interval = setInterval(() => {
            this.updateLiveEarnings();
        }, 5000);
    }

    updateLiveEarnings() {
        const randomEarning = Math.floor(Math.random() * 50) + 10;
        state.totalEarnings += randomEarning;
        
        // Animate the update
        this.animateLiveEarnings(state.totalEarnings);
    }

    animateLiveEarnings(newValue) {
        elements.liveEarnings.style.transform = 'scale(1.1)';
        elements.liveEarnings.style.color = '#f59e0b';
        
        setTimeout(() => {
            elements.liveEarnings.textContent = `Rp ${newValue.toLocaleString('id-ID')}`;
            elements.liveEarnings.style.transform = 'scale(1)';
            elements.liveEarnings.style.color = 'white';
        }, 300);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Notification System
class NotificationSystem {
    static show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Utility Functions
const utils = {
    // Copy text to clipboard
    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
            NotificationSystem.show('Berhasil disalin!', 'success');
        }).catch(() => {
            NotificationSystem.show('Gagal menyalin', 'error');
        });
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Referral System
class ReferralSystem {
    constructor() {
        this.referralCode = 'NETGAIN123';
        this.init();
    }

    init() {
        // Event listener untuk copy referral code
        const copyButton = document.querySelector('.btn-accent[onclick*="copyReferralCode"]');
        if (copyButton) {
            copyButton.addEventListener('click', this.copyReferralCode.bind(this));
        }
    }

    copyReferralCode() {
        utils.copyToClipboard(this.referralCode);
    }
}

// Main Application
class NetGainApp {
    constructor() {
        this.calculator = null;
        this.faqSystem = null;
        this.navigation = null;
        this.liveEarnings = null;
        this.referralSystem = null;
        this.init();
    }

    init() {
        // Initialize all systems
        this.calculator = new EarningsCalculator();
        this.faqSystem = new FAQSystem();
        this.navigation = new NavigationSystem();
        this.liveEarnings = new LiveEarningsSystem();
        this.referralSystem = new ReferralSystem();

        // Add loading animation
        this.showLoading();
        
        // Initialize animations
        this.initAnimations();

        console.log('NetGain App initialized successfully!');
    }

    showLoading() {
        // Simulate loading
        setTimeout(() => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        }, 500);
    }

    initAnimations() {
        // Intersection Observer untuk animasi scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements untuk animasi
        document.querySelectorAll('.feature-card, .calculator, .referral-box').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    destroy() {
        // Cleanup
        if (this.liveEarnings) {
            this.liveEarnings.stop();
        }
    }
}

// Global functions untuk HTML onclick attributes
window.copyReferralCode = function() {
    if (window.netGainApp && window.netGainApp.referralSystem) {
        window.netGainApp.referralSystem.copyReferralCode();
    }
};

// Initialize app ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    window.netGainApp = new NetGainApp();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Export untuk module (jika needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NetGainApp,
        EarningsCalculator,
        FAQSystem,
        NavigationSystem,
        LiveEarningsSystem,
        NotificationSystem,
        utils
    };
}
