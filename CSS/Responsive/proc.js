  let index = 0;
      const slides = document.querySelectorAll(".slide");

      function showSlide() {
        index++;

        if (index >= slides.length) {
          index = 0;
        }

        document.querySelector(".slides").style.transform =
          `translateX(-${index * 100}%)`;
      }

      // move every 4 seconds
      setInterval(showSlide, 4000);
      //Slide image
      let n = 0;
      const slider = document.getElementById("slider");
      const dots = document.querySelectorAll(".dots span");

      function slide() {
        n++;

        if (n >= 3) index = 0;

        slider.style.transform = `translateX(-${n * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[n].classList.add("active");
      }

      // 4 seconds pause
      setInterval(slide, 4000);