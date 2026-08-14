// ======================================================
// MOBILE NAVIGATION
// ======================================================

const navToggle =
  document.querySelector(".nav-toggle");

const navLinks =
  document.querySelector(".nav-links");


if (navToggle && navLinks) {

  navToggle.addEventListener("click", () => {

    const isOpen =
      navLinks.classList.toggle("open");


    navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });

}



// ======================================================
// PROJECT FILTERING
// ======================================================

const filterButtons =
  document.querySelectorAll(
    ".filter-button"
  );


const projectCards =
  document.querySelectorAll(
    ".project-card"
  );


filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const filter =
      button.getAttribute(
        "data-filter"
      );


    filterButtons.forEach((item) => {

      item.classList.remove(
        "active"
      );

    });


    button.classList.add(
      "active"
    );


    projectCards.forEach((card) => {

      const categories =
        card.getAttribute(
          "data-category"
        ) || "";


      const shouldShow =
        filter === "all" ||
        categories.includes(filter);


      card.classList.toggle(
        "is-hidden",
        !shouldShow
      );

    });

  });

});



// ======================================================
// WEBSITE FORMS
// ======================================================

document
  .querySelectorAll("form")
  .forEach((form) => {

    const message =
      form.querySelector(
        ".form-message"
      );


    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        if (!message) {
          return;
        }


        if (
          form.id ===
          "career-application"
        ) {

          message.textContent =
            "Thank you. Your Nexora application has been submitted.";

        }

        else if (
          form.id ===
          "contact-form"
        ) {

          message.textContent =
            "Thank you. Your request has been submitted.";

        }


        form.reset();

      }
    );

  });
