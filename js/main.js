document.addEventListener('DOMContentLoaded', () => {
    // ============ MOBILE MENU ============
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';

      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
      });

      navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
        });
      });

      document.addEventListener('click', (e) => {
        if (
          !hamburger.contains(e.target) &&
          !navLinks.contains(e.target)
        ) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          // Also close dropdown
          const menu = document.querySelector('.dropdown-menu');
          const drop = document.querySelector('.dropdown');
          if (menu) menu.classList.remove('open');
          if (drop) drop.classList.remove('open');
        }
      });
    }

    // FAQ accordion open/close
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Toggle open classes
            question.classList.toggle('open');
            answer.classList.toggle('open');
            
            // Optional: Close other open FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('open')) {
                    otherQuestion.classList.remove('open');
                    otherQuestion.nextElementSibling.classList.remove('open');
                }
            });
        });
    });

    // Navbar active link highlight based on current page
    const currentPath = window.location.pathname;
    const navLinksElements = document.querySelectorAll('.nav-links a:not(.btn-primary)');
    
    navLinksElements.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        // Check if the link path matches the current path, or if we are at root and link is index.html
        if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                }
            }
        });
    });

    // ============ MOBILE DROPDOWN ============
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdown && dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        // Only run on mobile
        if (window.innerWidth > 768) return;

        e.preventDefault();
        e.stopPropagation();

        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;

        const isOpen = menu.classList.contains('open');

        if (isOpen) {
          menu.classList.remove('open');
          dropdown.classList.remove('open');
        } else {
          menu.classList.add('open');
          dropdown.classList.add('open');
        }
      });

      // Prevent clicks inside dropdown from closing the nav
      dropdown.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.stopPropagation();
      });
    }
    // ============ END MOBILE DROPDOWN ============
});

// Scroll fade-up animation — lightweight IntersectionObserver
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target); // fires once only — no choppiness
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// Web3Forms Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const formResult = document.getElementById('formResult');
    
    // UI Loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formResult.className = 'form-result';
    formResult.textContent = '';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let jsonResponse = await response.json();
      if (response.status == 200) {
        formResult.textContent = 'Message sent successfully. We will get back within 24 hours.';
        formResult.classList.add('success');
        contactForm.reset();
      } else {
        console.log(response);
        formResult.textContent = 'Something went wrong. Please try again.';
        formResult.classList.add('error');
      }
    })
    .catch(error => {
      console.log(error);
      formResult.textContent = 'Something went wrong. Please try again.';
      formResult.classList.add('error');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}
