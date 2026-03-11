// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

const stars = document.querySelectorAll(".star-rating span");
const starsInput = document.getElementById("stars");

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    const rating = index + 1;
    starsInput.value = rating;

    stars.forEach((s, i) => {
      s.classList.toggle("active", i < rating);
    });
  });
});
