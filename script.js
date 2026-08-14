// ======================================================
// NEXORA WEBSITE
// ======================================================



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
  document.querySelectorAll(".filter-button");

const projectCards =
  document.querySelectorAll(".project-card");


filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const filter =
      button.getAttribute("data-filter");


    filterButtons.forEach((item) => {

      item.classList.remove("active");

    });


    button.classList.add("active");


    projectCards.forEach((card) => {

      const categories =
        card.getAttribute("data-category") || "";


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
      form.querySelector(".form-message");


    form.addEventListener("submit", (event) => {

      event.preventDefault();


      if (!message) {
        return;
      }


      const career =
        form.id === "career-application";


      if (career) {

        message.textContent =
          "Application submitted.";

      } else {

        message.textContent =
          "Request submitted.";

      }


      form.reset();

    });

  });



// ======================================================
// EMPLOYEE PORTAL CONFIGURATION
// ======================================================


// CHANGE THIS ONCE YOUR API HAS A PUBLIC URL
const API_URL = "https://api.nexorasolutions.com";



// ======================================================
// ELEMENTS
// ======================================================

const employeeLogin =
  document.getElementById(
    "employee-login"
  );


const employeeDashboard =
  document.getElementById(
    "employee-dashboard"
  );


const employeeError =
  document.getElementById(
    "employee-error"
  );


const refreshEmployeeButton =
  document.getElementById(
    "employee-refresh"
  );


const logoutEmployeeButton =
  document.getElementById(
    "employee-logout"
  );



// ======================================================
// DISCORD CALLBACK TOKEN
// ======================================================

const urlParameters =
  new URLSearchParams(
    window.location.search
  );


const discordToken =
  urlParameters.get(
    "token"
  );


if (discordToken) {

  localStorage.setItem(
    "nexora_token",
    discordToken
  );


  const cleanUrl =
    window.location.origin +
    window.location.pathname +
    "#employee-portal";


  window.history.replaceState(
    {},
    "",
    cleanUrl
  );

}



// ======================================================
// TOKEN
// ======================================================

function getToken() {

  return localStorage.getItem(
    "nexora_token"
  );

}



function removeToken() {

  localStorage.removeItem(
    "nexora_token"
  );

}



// ======================================================
// LOGGED OUT
// ======================================================

function showLoggedOut() {

  if (employeeLogin) {

    employeeLogin.classList.remove(
      "is-hidden"
    );

  }


  if (employeeDashboard) {

    employeeDashboard.classList.add(
      "is-hidden"
    );

  }

}



// ======================================================
// LOGGED IN
// ======================================================

function showLoggedIn() {

  if (employeeLogin) {

    employeeLogin.classList.add(
      "is-hidden"
    );

  }


  if (employeeDashboard) {

    employeeDashboard.classList.remove(
      "is-hidden"
    );

  }

}



// ======================================================
// LOGOUT
// ======================================================

function logoutEmployee() {

  removeToken();

  showLoggedOut();

  if (employeeError) {

    employeeError.textContent =
      "";

  }


  window.location.hash =
    "employee-portal";

}



// ======================================================
// SAFE TEXT
// ======================================================

function escapeHtml(value) {

  const element =
    document.createElement("div");


  element.textContent =
    String(value ?? "");


  return element.innerHTML;

}



// ======================================================
// SET TEXT
// ======================================================

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (!element) {

    return;

  }


  element.textContent =
    value ?? "—";

}



// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {

  if (!value) {

    return "—";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleDateString(
    undefined,
    {

      year: "numeric",

      month: "short",

      day: "numeric"

    }
  );

}



// ======================================================
// STATUS
// ======================================================

function updateEmployeeStatus(
  status
) {

  const element =
    document.getElementById(
      "employee-status"
    );


  if (!element) {

    return;

  }


  element.textContent =
    status || "Unknown";


  element.classList.remove(
    "active",
    "inactive",
    "loa"
  );


  const normalized =
    String(
      status || ""
    ).toLowerCase();


  if (normalized === "active") {

    element.classList.add(
      "active"
    );

  }

  else if (
    normalized.includes("loa") ||
    normalized.includes("leave")
  ) {

    element.classList.add(
      "loa"
    );

  }

  else {

    element.classList.add(
      "inactive"
    );

  }

}



// ======================================================
// PROJECTS
// ======================================================

function displayProjects(projects) {

  const container =
    document.getElementById(
      "employee-projects"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  if (
    !Array.isArray(projects) ||
    projects.length === 0
  ) {

    container.innerHTML = `

      <p class="supporting-text">
        No assigned projects.
      </p>

    `;


    return;

  }


  projects.forEach((project) => {

    const item =
      document.createElement(
        "article"
      );


    item.className =
      "employee-project-item";


    const progress =
      Math.min(
        Math.max(
          Number(
            project.progress || 0
          ),
          0
        ),
        100
      );


    item.innerHTML = `

      <div class="portal-header">

        <div>

          <h4>

            ${escapeHtml(
              project.name ||
              "Unnamed Project"
            )}

          </h4>

          <p class="supporting-text">

            ${escapeHtml(
              project.client_name ||
              "Nexora"
            )}

          </p>

        </div>


        <span class="project-status">

          ${escapeHtml(
            project.status ||
            "Pending"
          )}

        </span>

      </div>


      <div class="progress-track">

        <span
          style="width: ${progress}%"
        ></span>

      </div>


      <div class="meta-grid">

        <p>

          <strong>
            Progress:
          </strong>

          ${progress}%

        </p>


        <p>

          <strong>
            Deadline:
          </strong>

          ${escapeHtml(
            project.deadline ||
            "No deadline"
          )}

        </p>

      </div>

    `;


    container.appendChild(
      item
    );

  });

}



// ======================================================
// DISCORD ROLES
// ======================================================

function displayRoles(roles) {

  const container =
    document.getElementById(
      "employee-roles"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  if (
    !Array.isArray(roles) ||
    roles.length === 0
  ) {

    container.innerHTML = `

      <p class="supporting-text">
        No Discord roles found.
      </p>

    `;


    return;

  }


  roles.forEach((role) => {

    const badge =
      document.createElement(
        "span"
      );


    badge.className =
      "role-badge";


    badge.textContent =
      role.name ||
      "Unknown Role";


    container.appendChild(
      badge
    );

  });

}



// ======================================================
// LOADING
// ======================================================

function showLoading() {

  setText(
    "employee-name",
    "Loading..."
  );


  setText(
    "employee-discord-id",
    ""
  );


  setText(
    "employee-id",
    "—"
  );


  setText(
    "employee-rank",
    "—"
  );


  setText(
    "employee-department",
    "—"
  );


  setText(
    "employee-hours",
    "—"
  );


  setText(
    "employee-tasks",
    "—"
  );


  setText(
    "employee-warnings",
    "—"
  );


  setText(
    "employee-project-count",
    "—"
  );


  setText(
    "employee-hired",
    "—"
  );

}



// ======================================================
// LOAD EMPLOYEE
// ======================================================

async function loadEmployeePortal() {

  const token =
    getToken();



  // --------------------------------------------------
  // NO TOKEN = ONLY LOGIN BOX
  // --------------------------------------------------

  if (!token) {

    showLoggedOut();

    return;

  }



  // --------------------------------------------------
  // DON'T SHOW DASHBOARD YET
  //
  // We wait until API confirms the account.
  // --------------------------------------------------

  showLoggedOut();


  if (employeeError) {

    employeeError.textContent =
      "";

  }



  try {

    const response =
      await fetch(
        `${API_URL}/api/employee/me`,
        {

          method: "GET",

          headers: {

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json"

          }

        }
      );



    // ------------------------------------------------
    // EXPIRED / INVALID LOGIN
    // ------------------------------------------------

    if (
      response.status === 401
    ) {

      removeToken();

      showLoggedOut();

      return;

    }



    // ------------------------------------------------
    // DISCORD LOGGED IN BUT NOT EMPLOYEE
    // ------------------------------------------------

    if (
      response.status === 404
    ) {

      showLoggedOut();


      alert(
        "Your Discord account is not registered as a Nexora employee."
      );


      return;

    }



    // ------------------------------------------------
    // API ERROR
    // ------------------------------------------------

    if (!response.ok) {

      showLoggedOut();


      console.error(
        "Employee API error:",
        response.status
      );


      return;

    }



    // ------------------------------------------------
    // VALID EMPLOYEE
    // ------------------------------------------------

    const employee =
      await response.json();



    // ONLY NOW SHOW DASHBOARD

    showLoggedIn();

    showLoading();



    // ------------------------------------------------
    // BASIC INFO
    // ------------------------------------------------

    setText(
      "employee-name",
      employee.username ||
      "Employee"
    );


    setText(
      "employee-discord-id",
      `Discord ID: ${employee.discord_id}`
    );


    setText(
      "employee-id",
      `#${employee.employee_id}`
    );


    setText(
      "employee-rank",
      employee.rank ||
      "—"
    );


    setText(
      "employee-department",
      employee.department ||
      "—"
    );


    setText(
      "employee-hours",
      `${employee.attendance?.hours ?? 0} hrs`
    );


    setText(
      "employee-tasks",
      employee.tasks?.completed ??
      0
    );


    setText(
      "employee-warnings",
      employee.warnings?.total ??
      0
    );


    setText(
      "employee-project-count",
      employee.projects?.length ??
      0
    );


    setText(
      "employee-hired",
      formatDate(
        employee.hired_at
      )
    );



    // ------------------------------------------------
    // STATUS
    // ------------------------------------------------

    updateEmployeeStatus(
      employee.status
    );



    // ------------------------------------------------
    // PROJECTS
    // ------------------------------------------------

    displayProjects(
      employee.projects
    );



    // ------------------------------------------------
    // ROLES
    // ------------------------------------------------

    displayRoles(
      employee.discord_roles
    );


  }

  catch (error) {

    console.error(
      "Employee portal error:",
      error
    );


    showLoggedOut();

  }

}



// ======================================================
// REFRESH
// ======================================================

if (
  refreshEmployeeButton
) {

  refreshEmployeeButton.addEventListener(
    "click",
    async () => {

      refreshEmployeeButton.disabled =
        true;


      refreshEmployeeButton.textContent =
        "Refreshing...";


      await loadEmployeePortal();


      refreshEmployeeButton.disabled =
        false;


      refreshEmployeeButton.textContent =
        "Refresh Profile";

    }
  );

}



// ======================================================
// LOGOUT
// ======================================================

if (
  logoutEmployeeButton
) {

  logoutEmployeeButton.addEventListener(
    "click",
    () => {

      logoutEmployee();

    }
  );

}



// ======================================================
// START
// ======================================================

loadEmployeePortal();
