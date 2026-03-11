// Play flip sound when clicking a page/card
  function playFlipSound() {
    const audio = new Audio('sounds/page-flip.mp3'); // place your sound file in /sounds folder
    audio.play();
  }

  AOS.init({ duration: 1000 });

  const pages = document.querySelectorAll('.page');
  for (let i = 0; i < pages.length; i++) {
    if (i % 2 === 0) pages[i].style.zIndex = pages.length - i;
  }

  pages.forEach((page, index) => {
    page.pageNum = index + 1;
    page.addEventListener('click', function() {
      if (this.pageNum % 2 === 0) {
        this.classList.remove('flipped');
        this.previousElementSibling.classList.remove('flipped');
      } else {
        this.classList.add('flipped');
        this.nextElementSibling.classList.add('flipped');
      }
    });
  });

  

  