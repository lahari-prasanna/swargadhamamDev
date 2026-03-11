

  // Lightbox
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let currentIndex = 0;

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      lightbox.classList.add('active');
      lightboxImg.src = img.src;
      currentIndex = index;
    });
  });

  // Close lightbox
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Close lightbox on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Close lightbox on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      lightbox.classList.remove('active');
    }
  });

  // Navigation arrows
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  });

  // Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          item.style.opacity = 0;
          setTimeout(() => {
            item.style.opacity = 1;
            item.style.transition = "opacity 0.5s ease";
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Scroll-triggered animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = `all 0.6s ease ${i * 0.1}s`; // staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  galleryImages.forEach(img => {
    observer.observe(img);
  });

  const video = document.getElementById('missionVideo');
  const playPause = document.getElementById('playPause');
  const seekBar = document.getElementById('seekBar');
  const muteBtn = document.getElementById('muteBtn');
  const volumeBar = document.getElementById('volumeBar');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Play/Pause toggle
  playPause.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      video.muted = false;
      playPause.textContent = "⏸";
    } else {
      video.pause();
      playPause.textContent = "▶";
    }
  });

  // Update seek bar
  video.addEventListener('timeupdate', () => {
    const value = (100 / video.duration) * video.currentTime;
    seekBar.value = value;
  });

  // Seek video
  seekBar.addEventListener('input', () => {
    const time = video.duration * (seekBar.value / 100);
    video.currentTime = time;
  });

   // Mute/Unmute
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  // Volume control
  volumeBar.addEventListener('input', () => {
    video.volume = volumeBar.value;
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  });

  // Auto-hide controls after 3s of inactivity
  const videoContainer = document.querySelector('.video-container');
  const controls = document.querySelector('.video-controls');
  let controlsTimeout;

  function showControls() {
    controls.style.opacity = 1;
    controls.style.transition = "opacity 0.5s ease";
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      controls.style.opacity = 0;
    }, 3000);
  }

  videoContainer.addEventListener('mousemove', showControls);
  videoContainer.addEventListener('mouseenter', showControls);
  videoContainer.addEventListener('mouseleave', () => {
    controls.style.opacity = 0;
  });

  video.addEventListener('pause', () => {
    controls.style.opacity = 1;
  });

  video.addEventListener('play', showControls);

    document.querySelector('.support-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#donate').scrollIntoView({ behavior: 'smooth' });
  });

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Add your gallery filtering logic here
  });
});


  // Initialize controls visibility
  showControls();
