// Modern Portfolio - Enhanced JavaScript with Sidebar Layout
document.addEventListener('DOMContentLoaded', () => {
  // Add class to indicate JavaScript has loaded
  document.body.classList.add('js-loaded');
  // Theme Management
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle__icon');
  const body = document.body;
  
  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  setTheme(savedTheme);
  
  function setTheme(theme) {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      themeIcon.className = 'ph-moon theme-toggle__icon';
    } else {
      body.removeAttribute('data-theme');
      themeIcon.className = 'ph-sun theme-toggle__icon';
    }
    localStorage.setItem('portfolio-theme', theme);
  }
  
  function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // System theme preference detection
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (!localStorage.getItem('portfolio-theme')) {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }
  
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Mobile Menu Management
  const sidebar = document.querySelector('.sidebar');
  const mobileToggle = document.createElement('button');
  const mobileOverlay = document.createElement('div');
  
  // Create mobile toggle button
  mobileToggle.className = 'mobile-toggle';
  mobileToggle.innerHTML = '<i class="ph-list"></i>';
  mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
  document.body.appendChild(mobileToggle);
  
  // Create mobile overlay
  mobileOverlay.className = 'mobile-overlay';
  document.body.appendChild(mobileOverlay);
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isOpen = sidebar.classList.contains('sidebar--open');
    if (isOpen) {
      sidebar.classList.remove('sidebar--open');
      mobileOverlay.classList.remove('mobile-overlay--visible');
      mobileToggle.innerHTML = '<i class="ph-list"></i>';
    } else {
      sidebar.classList.add('sidebar--open');
      mobileOverlay.classList.add('mobile-overlay--visible');
      mobileToggle.innerHTML = '<i class="ph-x"></i>';
    }
  }
  
  mobileToggle.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('sidebar--open');
        mobileOverlay.classList.remove('mobile-overlay--visible');
        mobileToggle.innerHTML = '<i class="ph-list"></i>';
      }
    });
  });
  
  // Enhanced smooth scroll with offset and visual feedback
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Add click effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Scroll to target
        const offset = window.innerWidth > 768 ? 0 : 60;
        const mainContent = document.querySelector('.main');
        
        if (mainContent) {
          const targetPosition = target.offsetTop - offset;
          mainContent.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          // Fallback for window scroll
          const targetPosition = target.offsetTop - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
        
        // Update active state immediately for better UX
        updateActiveLink(this.getAttribute('href').substring(1));
      }
    });
  });
  
  // Portfolio filter functionality
  const filterButtons = document.querySelectorAll('.filter__btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('filter__btn--active'));
      button.classList.add('filter__btn--active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filter portfolio items
      portfolioItems.forEach(item => {
        if (filter === '*' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(30px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-30px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Portfolio item click interactions
  portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
      // Add click effect
      this.style.transform = 'translateY(-5px) scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      // Optional: Add some feedback or action here
      const title = this.querySelector('h3').textContent;
      console.log(`Portfolio item clicked: ${title}`);
      
      // You could add modal opening, navigation, or other actions here
    });
    
    // Add ripple effect
    item.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: portfolioRipple 0.6s linear;
        pointer-events: none;
        z-index: 10;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });
  
  // Update active sidebar link on scroll
  const sections = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar__link');
  let ticking = false;
  
  function updateActiveLink(forcedSection = null) {
    const mainContent = document.querySelector('.main');
    const scrollPosition = mainContent ? mainContent.scrollTop + 100 : window.scrollY + 100;
    let current = forcedSection || '';
    
    if (!forcedSection) {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
    }
    
    sidebarLinks.forEach(link => {
      link.classList.remove('sidebar__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('sidebar__link--active');
      }
    });
    
    ticking = false;
  }
  
  // Get main content area for scroll events
  const mainContent = document.querySelector('.main');
  
  if (mainContent) {
    mainContent.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => updateActiveLink());
        ticking = true;
      }
    });
  } else {
    // Fallback for window scroll
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => updateActiveLink());
        ticking = true;
      }
    });
  }
  
  // Initial call to set active link
  setTimeout(() => updateActiveLink(), 100);
  
  // Intersection Observer for scroll animations with improved debugging
  const observerOptions = {
    threshold: 0.15, // Increased threshold for better triggering
    rootMargin: '0px 0px -20px 0px', // Reduced margin for easier triggering
    root: mainContent // Observe within the scrollable main content
  };

  console.log('Setting up intersection observer with root:', mainContent);

  const observer = new IntersectionObserver((entries) => {
    console.log('Observer triggered with', entries.length, 'entries');
    entries.forEach(entry => {
      console.log('Entry:', entry.target.className, 'isIntersecting:', entry.isIntersecting);
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        console.log('Animating element with delay:', delay);
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          console.log('Added animate-in class to:', entry.target.className);

          // Trigger counter animation if element has counter
          const counter = entry.target.querySelector('.counter');
          if (counter) {
            animateCounter(counter);
          }
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  console.log('Found', animatedElements.length, 'elements to animate');

  animatedElements.forEach(el => {
    observer.observe(el);
    console.log('Observing element:', el.className, el.tagName);
  });

  // Immediate fallback for critical content
  setTimeout(() => {
    const sectionTitles = document.querySelectorAll('.section__title.animate-on-scroll:not(.animate-in)');
    sectionTitles.forEach(el => {
      el.classList.add('animate-in');
      console.log('Immediate fallback for section title:', el.textContent);
    });
  }, 100);

  // General fallback: Force animation if observer doesn't work
  setTimeout(() => {
    const stillHidden = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
    if (stillHidden.length > 0) {
      console.log('Fallback triggered for', stillHidden.length, 'elements');
      stillHidden.forEach(el => {
        el.classList.add('animate-in');
        console.log('Fallback animated:', el.className);
      });
    }
  }, 2000);
  
  // Counter animation function
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  // Particles Background System
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    // Initialize particles
    function createParticles() {
      const particleCount = Math.min(50, Math.floor(canvas.width / 20));
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    createParticles();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    
    // Pause animation when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }
  
  // Initialize particles
  initParticles();
  
  // Typing Effect
  function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const messages = [
      'This unique blend positions me to tackle complex challenges at the intersection of energy and technology',
      'Bridging 13+ years of field operations with cutting-edge analytics',
      'From MWD/LWD technologies to machine learning applications',
      'Acoustic monitoring expertise meets modern data science',
      'Turning oil & gas experience into strategic competitive advantage'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
      const currentMessage = messages[messageIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentMessage.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingElement.textContent = currentMessage.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentMessage.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        typeSpeed = 500; // Pause before next message
      }
      
      setTimeout(type, typeSpeed);
    }
    
    // Start typing effect after initial animations
    setTimeout(type, 3000);
  }
  
  // Initialize typing effect
  initTypingEffect();
  
  // AI Assistant iframe handling (simplified)
  function initAIAssistant() {
    const iframe = document.getElementById('ai-iframe');
    const loading = document.getElementById('ai-loading');
    const fallback = document.getElementById('ai-fallback');
    const status = document.getElementById('ai-status');
    
    if (!iframe || !fallback) return;
    
    let hasLoaded = false;
    let loadTimeout;
    let wakeupTimeout;
    
    // Show status message initially
    if (status) {
      status.style.display = 'block';
    }
    
    // Hugging Face Spaces can take time to wake up
    wakeupTimeout = setTimeout(() => {
      if (!hasLoaded && status) {
        status.innerHTML = '<p style="text-align: center; color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">🔄 Space is waking up... Please wait a moment longer.</p>';
      }
    }, 10000);
    
    // Set a longer timeout for spaces that need to wake up
    loadTimeout = setTimeout(() => {
      if (!hasLoaded) {
        console.warn('AI Assistant failed to load after extended wait');
        if (status) status.style.display = 'none';
        iframe.style.display = 'none';
        fallback.style.display = 'flex';
      }
    }, 30000); // 30 seconds for space wake-up
    
    // Handle iframe load success
    iframe.addEventListener('load', () => {
      hasLoaded = true;
      clearTimeout(loadTimeout);
      clearTimeout(wakeupTimeout);
      if (status) status.style.display = 'none';
      console.log('AI Assistant loaded successfully');
    });
    
    // Handle iframe load error
    iframe.addEventListener('error', () => {
      console.error('AI Assistant failed to load');
      clearTimeout(loadTimeout);
      clearTimeout(wakeupTimeout);
      if (status) status.style.display = 'none';
      iframe.style.display = 'none';
      fallback.style.display = 'flex';
    });
    
    // Check if iframe is actually loading content (additional check)
    let checkInterval = setInterval(() => {
      if (hasLoaded) {
        clearInterval(checkInterval);
        return;
      }
      
      try {
        // If iframe src is loading, the readyState might help us understand the state
        if (iframe.contentDocument || iframe.contentWindow) {
          // Cross-origin - can't access but no error thrown means it's working
          hasLoaded = true;
          clearTimeout(loadTimeout);
          clearTimeout(wakeupTimeout);
          clearInterval(checkInterval);
          if (status) status.style.display = 'none';
          console.log('AI Assistant detected as loaded (cross-origin check)');
        }
      } catch (e) {
        // Expected for cross-origin, this means it's loading
      }
    }, 2000);
    
    // Clear interval after 30 seconds regardless
    setTimeout(() => clearInterval(checkInterval), 30000);
    
    // Retry button functionality
    const retryButton = document.getElementById('retry-ai');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        console.log('Manual retry initiated');
        
        // Reset everything
        hasLoaded = false;
        clearTimeout(loadTimeout);
        clearTimeout(wakeupTimeout);
        
        // Reset UI
        fallback.style.display = 'none';
        iframe.style.display = 'block';
        if (status) {
          status.style.display = 'block';
          status.innerHTML = '<p style="text-align: center; color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">⚡ AI Assistant is starting up... This may take a moment for Hugging Face Spaces to wake up.</p>';
        }
        
        // Force reload iframe
        iframe.src = iframe.src;
        
        // Set new timeouts
        wakeupTimeout = setTimeout(() => {
          if (!hasLoaded && status) {
            status.innerHTML = '<p style="text-align: center; color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">🔄 Space is waking up... Please wait a moment longer.</p>';
          }
        }, 10000);
        
        loadTimeout = setTimeout(() => {
          if (!hasLoaded) {
            if (status) status.style.display = 'none';
            iframe.style.display = 'none';
            fallback.style.display = 'flex';
          }
        }, 30000);
      });
    }
  }
  
  // Initialize AI Assistant
  initAIAssistant();
  
  // Enhanced button interactions
  function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
      
      // Add focus effects for accessibility
      button.addEventListener('focus', function() {
        this.style.outline = '3px solid rgba(255, 255, 255, 0.5)';
        this.style.outlineOffset = '2px';
      });
      
      button.addEventListener('blur', function() {
        this.style.outline = 'none';
        this.style.outlineOffset = '0';
      });
    });
  }
  
  // Add CSS for ripple animation
  const rippleCSS = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    @keyframes portfolioRipple {
      to {
        transform: scale(3);
        opacity: 0;
      }
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = rippleCSS;
  document.head.appendChild(style);
  
  // Initialize button effects
  addButtonEffects();
  
  // Contact form handling
  function initContactForm() {
    const form = document.querySelector('.contact__form');
    const submitBtn = form?.querySelector('button[type="submit"]');
    
    if (!form || !submitBtn) return;
    
    const originalBtnText = submitBtn.textContent;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      
      // Validate required fields
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      // Update button state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';
      
      // Prepare email template parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'kalebendale@protonmail.com'
      };
      
      // Send email using EmailJS
      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_portfolio', 'template_contact', templateParams, 'YOUR_PUBLIC_KEY')
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
          })
          .catch(function(error) {
            console.log('FAILED...', error);
            // Fallback to mailto for now
            openMailtoLink(name, email, subject, message);
          })
          .finally(function() {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
          });
      } else {
        // Fallback to mailto if EmailJS is not loaded
        openMailtoLink(name, email, subject, message);
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = '1';
      }
    });
    
    function openMailtoLink(name, email, subject, message) {
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoLink = `mailto:kalebendale@protonmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      showFormMessage('Opening your default email client...', 'success');
      form.reset();
    }
    
    function showFormMessage(message, type) {
      // Remove existing message
      const existingMessage = form.querySelector('.form-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Create new message
      const messageDiv = document.createElement('div');
      messageDiv.className = `form-message form-message--${type}`;
      messageDiv.textContent = message;
      messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        ${type === 'success' ? 
          'background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #16a34a;' :
          'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #dc2626;'
        }
      `;
      
      // Insert message before submit button
      form.insertBefore(messageDiv, submitBtn);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }
  
  // Initialize contact form
  initContactForm();
  
  // Add keyboard navigation for sidebar
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      // Enhance tab navigation
      const focusableElements = document.querySelectorAll('.sidebar__link, .btn, .theme-toggle');
      const focusedElement = document.activeElement;
      const focusedIndex = Array.from(focusableElements).indexOf(focusedElement);
      
      if (e.shiftKey && focusedIndex === 0) {
        // Wrap to last element when shift+tab on first element
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
        // Wrap to first element when tab on last element
        e.preventDefault();
        focusableElements[0].focus();
      }
    }
    
    // Add Enter key support for sidebar links
    if (e.key === 'Enter' && document.activeElement.classList.contains('sidebar__link')) {
      document.activeElement.click();
    }
  });
  
  // Add loading states for navigation
  function showLoadingState(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }, 500);
  }
  
  // Add click handlers for enhanced UX
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Visual feedback for navigation
      this.style.transform = 'translateX(12px) scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });
});

// Export for module usage
// End of main.js