
  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const options = { threshold: 0.5 };

  const startCounter = (entry) => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const increment = target / 200;

      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
      observer.unobserve(counter);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(startCounter);
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });

  // Scroll-triggered staggered animations
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        elementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scrollElements.forEach(el => {
    elementObserver.observe(el);
  });

  // Parallax background effect
  const impactSection = document.querySelector('.impact-section');
  const impactBg = document.querySelector('.impact-bg');

  window.addEventListener('scroll', () => {
    const rect = impactSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = rect.top + scrollTop;
    const yPos = (scrollTop - offset) * 0.2; // adjust speed
    impactBg.style.transform = `translateY(${yPos}px)`;
  });
  document.addEventListener("DOMContentLoaded", () => {
    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, offset = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("visible");
    };

    const hideScrollElement = (element) => {
      element.classList.remove("visible");
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
          displayScrollElement(el);
        } else {
          hideScrollElement(el);
        }
      });
    };

    window.addEventListener("scroll", () => {
      handleScrollAnimation();
    });

    // Run once on load
    handleScrollAnimation();
  });
 document.querySelectorAll(".impact-card").forEach(card => {
    // Ripple on click
    card.addEventListener("click", function(e) {
      createRipple(e, this);
    });

    // Ripple on hover (centered)
    card.addEventListener("mouseenter", function(e) {
      const rect = this.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      };
      createRipple(fakeEvent, this);
    });
  });

  
  
    
