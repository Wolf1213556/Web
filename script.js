const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.getAttribute("data-category") || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll("form").forEach((form) => {
  const message = form.querySelector(".form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!message) {
      return;
    }

    const isCareerForm = form.id === "career-application";
    message.textContent = isCareerForm
      ? "Application submitted. Routed into the Nexora HR Discord review queue."
      : "Request submitted. Routed into the Nexora client intake workflow.";

    form.reset();
  });
});

// ======================================================
// NEXORA EMPLOYEE PORTAL
// ======================================================

const API_URL = "https://api.yourdomain.com";

const employeeLogin = document.getElementById("employee-login");
const employeeDashboard = document.getElementById("employee-dashboard");
const employeeError = document.getElementById("employee-error");


// ------------------------------------------------------
// Handle Discord OAuth callback
// ------------------------------------------------------

const urlParams = new URLSearchParams(window.location.search);
const oauthToken = urlParams.get("token");

if (oauthToken) {
  localStorage.setItem("nexora_token", oauthToken);

  // Remove token from URL after saving it
  const cleanUrl =
    window.location.origin +
    window.location.pathname +
    "#employee-portal";

  window.history.replaceState({}, "", cleanUrl);
}


// ------------------------------------------------------
// Get saved token
// ------------------------------------------------------

function getNexoraToken() {
  return localStorage.getItem("nexora_token");
}


// ------------------------------------------------------
// Logout
// ------------------------------------------------------

function logoutEmployee() {
  localStorage.removeItem("nexora_token");

  employeeDashboard?.classList.add("is-hidden");
  employeeLogin?.classList.remove("is-hidden");

  window.location.hash = "employee-portal";
}


// ------------------------------------------------------
// API request helper
// ------------------------------------------------------

async function nexoraApi(path) {
  const token = getNexoraToken();

  if (!token) {
    throw new Error("Not logged in.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    logoutEmployee();
    throw new Error("Your login session expired.");
  }

  if (response.status === 404) {
    throw new Error(
      "Your Discord account is not linked to a Nexora employee profile."
    );
  }

  if (!response.ok) {
    throw new Error("Could not load employee information.");
  }

  return response.json();
}


// ------------------------------------------------------
// Format date
// ------------------------------------------------------

function formatEmployeeDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


// ------------------------------------------------------
// Project card
// ------------------------------------------------------

function createEmployeeProject(project) {
  const wrapper = document.createElement("article");

  wrapper.className = "portal-project employee-project-item";

  const progress = Number(project.progress || 0);

  wrapper.innerHTML = `
    <div class="portal-header">
      <div>
        <h4>${escapeHtml(project.name || "Unnamed Project")}</h4>
        <p class="supporting-text">
          ${escapeHtml(project.client_name || "Nexora Project")}
        </p>
      </div>

      <span class="project-status">
        ${escapeHtml(project.status || "Pending")}
      </span>
    </div>

    <div class="progress-track">
      <span style="width: ${Math.min(Math.max(progress, 0), 100)}%"></span>
    </div>

    <div class="meta-grid">
      <p>
        <strong>Progress:</strong>
        ${progress}%
      </p>

      <p>
        <strong>Deadline:</strong>
        ${escapeHtml(project.deadline || "No deadline")}
      </p>
    </div>
  `;

  return wrapper;
}


// ------------------------------------------------------
// Basic HTML safety
// ------------------------------------------------------

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}


// ------------------------------------------------------
// Display employee
// ------------------------------------------------------

async function loadEmployeePortal() {
  const token = getNexoraToken();

  if (!token) {
    employeeLogin?.classList.remove("is-hidden");
    employeeDashboard?.classList.add("is-hidden");
    return;
  }

  if (employeeError) {
    employeeError.textContent = "";
  }

  try {
    const employee = await nexoraApi("/api/employee/me");

    employeeLogin?.classList.add("is-hidden");
    employeeDashboard?.classList.remove("is-hidden");


    // ----------------------------------------------
    // Main profile
    // ----------------------------------------------

    document.getElementById("employee-name").textContent =
      employee.username || "Employee";

    document.getElementById("employee-discord-id").textContent =
      `Discord ID: ${employee.discord_id}`;

    document.getElementById("employee-id").textContent =
      `#${employee.employee_id}`;

    document.getElementById("employee-rank").textContent =
      employee.rank || "—";

    document.getElementById("employee-department").textContent =
      employee.department || "—";

    document.getElementById("employee-status").textContent =
      employee.status || "Unknown";

    document.getElementById("employee-hours").textContent =
      `${employee.attendance?.hours ?? 0} hrs`;

    document.getElementById("employee-tasks").textContent =
      employee.tasks?.completed ?? 0;

    document.getElementById("employee-warnings").textContent =
      employee.warnings?.total ?? 0;

    document.getElementById("employee-project-count").textContent =
      employee.projects?.length ?? 0;

    document.getElementById("employee-hired").textContent =
      formatEmployeeDate(employee.hired_at);


    // ----------------------------------------------
    // Status color
    // ----------------------------------------------

    const statusElement =
      document.getElementById("employee-status");

    if (statusElement) {
      statusElement.classList.remove(
        "active",
        "inactive",
        "loa"
      );

      const status =
        String(employee.status || "").toLowerCase();

      if (status === "active") {
        statusElement.classList.add("active");
      } else if (
        status.includes("leave") ||
        status.includes("loa")
      ) {
        statusElement.classList.add("loa");
      } else {
        statusElement.classList.add("inactive");
      }
    }


    // ----------------------------------------------
    // Projects
    // ----------------------------------------------

    const projectsContainer =
      document.getElementById("employee-projects");

    if (projectsContainer) {
      projectsContainer.innerHTML = "";

      if (!employee.projects?.length) {
        projectsContainer.innerHTML = `
          <p class="supporting-text">
            You currently have no assigned projects.
          </p>
        `;
      } else {
        employee.projects.forEach((project) => {
          projectsContainer.appendChild(
            createEmployeeProject(project)
          );
        });
      }
    }


    // ----------------------------------------------
    // Discord Roles
    // ----------------------------------------------

    const rolesContainer =
      document.getElementById("employee-roles");

    if (rolesContainer) {
      rolesContainer.innerHTML = "";

      if (!employee.discord_roles?.length) {
        rolesContainer.innerHTML = `
          <p class="supporting-text">
            No Discord roles found.
          </p>
        `;
      } else {
        employee.discord_roles.forEach((role) => {
          const badge =
            document.createElement("span");

          badge.className = "role-badge";
          badge.textContent = role.name;

          rolesContainer.appendChild(badge);
        });
      }
    }

  } catch (error) {
    console.error(error);

    employeeLogin?.classList.add("is-hidden");
    employeeDashboard?.classList.remove("is-hidden");

    if (employeeError) {
      employeeError.textContent = error.message;
    }
  }
}


// ------------------------------------------------------
// Buttons
// ------------------------------------------------------

const refreshEmployeeButton =
  document.getElementById("employee-refresh");

const logoutEmployeeButton =
  document.getElementById("employee-logout");

refreshEmployeeButton?.addEventListener(
  "click",
  loadEmployeePortal
);

logoutEmployeeButton?.addEventListener(
  "click",
  logoutEmployee
);


// ------------------------------------------------------
// Load when site opens
// ------------------------------------------------------

loadEmployeePortal();
