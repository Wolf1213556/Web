// ======================================================
// NEXORA WEBSITE
// script.js
// ======================================================



// ======================================================
// MOBILE NAVIGATION
// ======================================================

const navToggle =
  document.querySelector(".nav-toggle");

const navLinks =
  document.querySelector(".nav-links");


if (navToggle && navLinks) {

  navToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        navLinks.classList.toggle("open");


      navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    }
  );

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


filterButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const filter =
          button.getAttribute(
            "data-filter"
          );


        filterButtons.forEach(
          (item) => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        projectCards.forEach(
          (card) => {

            const categories =
              card.getAttribute(
                "data-category"
              ) || "";


            const shouldShow =
              filter === "all" ||
              categories.includes(
                filter
              );


            card.classList.toggle(
              "is-hidden",
              !shouldShow
            );

          }
        );

      }
    );

  }
);



// ======================================================
// WEBSITE FORMS
// ======================================================

document
  .querySelectorAll("form")
  .forEach(
    (form) => {

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


          const isCareerForm =
            form.id ===
            "career-application";


          message.textContent =
            isCareerForm
              ? "Application submitted. Routed into the Nexora HR Discord review queue."
              : "Request submitted. Routed into the Nexora client intake workflow.";


          form.reset();

        }
      );

    }
  );



// ======================================================
// EMPLOYEE PORTAL CONFIG
// ======================================================


// CHANGE THIS ONCE YOUR API IS PUBLIC
const API_URL =
  "http://localhost:8000";



// ======================================================
// EMPLOYEE PORTAL ELEMENTS
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
// DISCORD OAUTH CALLBACK
// ======================================================

const currentUrlParams =
  new URLSearchParams(
    window.location.search
  );


const oauthToken =
  currentUrlParams.get(
    "token"
  );


if (oauthToken) {

  localStorage.setItem(
    "nexora_token",
    oauthToken
  );


  // Remove token from visible browser URL
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
// TOKEN FUNCTIONS
// ======================================================

function getNexoraToken() {

  return localStorage.getItem(
    "nexora_token"
  );

}



function saveNexoraToken(
  token
) {

  localStorage.setItem(
    "nexora_token",
    token
  );

}



function removeNexoraToken() {

  localStorage.removeItem(
    "nexora_token"
  );

}



// ======================================================
// LOGOUT
// ======================================================

function logoutEmployee() {

  removeNexoraToken();


  if (employeeDashboard) {

    employeeDashboard.classList.add(
      "is-hidden"
    );

  }


  if (employeeLogin) {

    employeeLogin.classList.remove(
      "is-hidden"
    );

  }


  if (employeeError) {

    employeeError.textContent =
      "";

  }


  window.location.hash =
    "employee-portal";

}



// ======================================================
// API REQUEST
// ======================================================

async function nexoraApi(
  path
) {

  const token =
    getNexoraToken();


  if (!token) {

    throw new Error(
      "You are not logged in."
    );

  }


  let response;


  try {

    response =
      await fetch(
        `${API_URL}${path}`,
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

  } catch (error) {

    console.error(
      "Nexora API connection error:",
      error
    );


    throw new Error(
      "Could not connect to the Nexora API."
    );

  }



  // SESSION EXPIRED

  if (
    response.status === 401
  ) {

    removeNexoraToken();


    throw new Error(
      "Your login session expired. Please sign in again."
    );

  }



  // NOT EMPLOYEE

  if (
    response.status === 404
  ) {

    throw new Error(
      "Your Discord account is not linked to a Nexora employee profile."
    );

  }



  // PERMISSION DENIED

  if (
    response.status === 403
  ) {

    throw new Error(
      "You do not have permission to access the employee portal."
    );

  }



  // OTHER ERROR

  if (!response.ok) {

    let detail =
      "Could not load employee information.";


    try {

      const data =
        await response.json();


      if (data.detail) {

        detail =
          data.detail;

      }

    } catch {

      // Invalid JSON response

    }


    throw new Error(
      detail
    );

  }


  return response.json();

}



// ======================================================
// SET TEXT
// ======================================================

function setText(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );


  if (!element) {
    return;
  }


  element.textContent =
    value ?? "—";

}



// ======================================================
// SAFE HTML
// ======================================================

function escapeHtml(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(
      value ?? ""
    );


  return div.innerHTML;

}



// ======================================================
// FORMAT DATE
// ======================================================

function formatEmployeeDate(
  value
) {

  if (!value) {

    return "—";

  }


  const date =
    new Date(
      value
    );


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
// FORMAT HOURS
// ======================================================

function formatHours(
  hours
) {

  const number =
    Number(
      hours || 0
    );


  if (
    !Number.isFinite(
      number
    )
  ) {

    return "0 hrs";

  }


  if (
    number === 1
  ) {

    return "1 hr";

  }


  return `${number} hrs`;

}



// ======================================================
// EMPLOYEE STATUS
// ======================================================

function updateEmployeeStatus(
  status
) {

  const statusElement =
    document.getElementById(
      "employee-status"
    );


  if (!statusElement) {
    return;
  }


  statusElement.textContent =
    status || "Unknown";


  statusElement.classList.remove(
    "active",
    "inactive",
    "loa"
  );


  const normalizedStatus =
    String(
      status || ""
    ).toLowerCase();



  if (
    normalizedStatus ===
    "active"
  ) {

    statusElement.classList.add(
      "active"
    );


    return;

  }



  if (
    normalizedStatus.includes(
      "leave"
    ) ||
    normalizedStatus.includes(
      "loa"
    )
  ) {

    statusElement.classList.add(
      "loa"
    );


    return;

  }



  statusElement.classList.add(
    "inactive"
  );

}



// ======================================================
// CREATE PROJECT CARD
// ======================================================

function createEmployeeProject(
  project
) {

  const wrapper =
    document.createElement(
      "article"
    );


  wrapper.className =
    "portal-project employee-project-item";


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


  wrapper.innerHTML = `

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
            "Nexora Project"
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


    <div
      class="progress-track"
      aria-label="Project progress"
    >

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


  return wrapper;

}



// ======================================================
// DISPLAY PROJECTS
// ======================================================

function displayEmployeeProjects(
  projects
) {

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
    !Array.isArray(
      projects
    ) ||
    projects.length === 0
  ) {

    container.innerHTML = `

      <p class="supporting-text">
        You currently have no assigned projects.
      </p>

    `;


    return;

  }


  projects.forEach(
    (project) => {

      container.appendChild(
        createEmployeeProject(
          project
        )
      );

    }
  );

}



// ======================================================
// CREATE ROLE BADGE
// ======================================================

function createRoleBadge(
  role
) {

  const badge =
    document.createElement(
      "span"
    );


  badge.className =
    "role-badge";


  badge.textContent =
    role.name ||
    "Unknown Role";


  return badge;

}



// ======================================================
// DISPLAY DISCORD ROLES
// ======================================================

function displayEmployeeRoles(
  roles
) {

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
    !Array.isArray(
      roles
    ) ||
    roles.length === 0
  ) {

    container.innerHTML = `

      <p class="supporting-text">
        No Discord roles found.
      </p>

    `;


    return;

  }


  roles.forEach(
    (role) => {

      container.appendChild(
        createRoleBadge(
          role
        )
      );

    }
  );

}



// ======================================================
// LOADING STATE
// ======================================================

function showEmployeeLoading() {

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


  const projects =
    document.getElementById(
      "employee-projects"
    );


  if (projects) {

    projects.innerHTML = `

      <p class="supporting-text">
        Loading projects...
      </p>

    `;

  }


  const roles =
    document.getElementById(
      "employee-roles"
    );


  if (roles) {

    roles.innerHTML = `

      <p class="supporting-text">
        Loading roles...
      </p>

    `;

  }

}



// ======================================================
// LOAD EMPLOYEE PORTAL
// ======================================================

async function loadEmployeePortal() {

  const token =
    getNexoraToken();



  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!token) {

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


    return;

  }



  // ====================================================
  // LOGGED IN
  // ====================================================

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


  if (employeeError) {

    employeeError.textContent =
      "";

  }


  showEmployeeLoading();



  try {

    const employee =
      await nexoraApi(
        "/api/employee/me"
      );



    // ==================================================
    // BASIC EMPLOYEE INFORMATION
    // ==================================================

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
      formatHours(
        employee.attendance?.hours
      )
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
      formatEmployeeDate(
        employee.hired_at
      )
    );



    // ==================================================
    // STATUS
    // ==================================================

    updateEmployeeStatus(
      employee.status
    );



    // ==================================================
    // PROJECTS
    // ==================================================

    displayEmployeeProjects(
      employee.projects
    );



    // ==================================================
    // DISCORD ROLES
    // ==================================================

    displayEmployeeRoles(
      employee.discord_roles
    );



  } catch (error) {

    console.error(
      "Employee portal error:",
      error
    );


    if (employeeError) {

      employeeError.textContent =
        error.message;

    }



    // Session expired
    if (!getNexoraToken()) {

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

  }

}



// ======================================================
// REFRESH EMPLOYEE PROFILE
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
// LOGOUT BUTTON
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
// START EMPLOYEE PORTAL
// ======================================================

loadEmployeePortal();
