import { portfolioData } from './data.js';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Forms
const aboutForm = document.getElementById('about-form');
const aboutText = document.getElementById('about-text');
const skillsList = document.getElementById('skills-list');
const saveStatus = document.getElementById('save-status');

const projectsForm = document.getElementById('projects-form');
const projectsJson = document.getElementById('projects-json');
const projSaveStatus = document.getElementById('proj-save-status');

// Tabs
const tabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).style.display = 'block';
  });
});

// Authentication State Observer (using sessionStorage)
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
  if (isLoggedIn) {
    loginSection.classList.remove('active');
    dashboardSection.classList.add('active');
    loadDashboardData();
  } else {
    loginSection.classList.add('active');
    dashboardSection.classList.remove('active');
  }
}

// Initial Check
checkAuth();

// Login Handler
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  
  loginError.style.display = 'none';
  
  // HARDCODED CREDENTIALS
  if (email === 'admin@shuraim.dev' && password === 'admin123') {
    sessionStorage.setItem('adminLoggedIn', 'true');
    checkAuth();
  } else {
    loginError.textContent = 'Invalid credentials.';
    loginError.style.display = 'block';
  }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('adminLoggedIn');
  checkAuth();
});

// Load Data from static data.js
function loadDashboardData() {
  // Load About & Skills
  if (portfolioData.about) {
    aboutText.value = portfolioData.about.text || "";
    skillsList.value = (portfolioData.about.skills || []).join(", ");
  }

  // Load Projects
  if (portfolioData.projects) {
    projectsJson.value = JSON.stringify(portfolioData.projects, null, 2);
  } else {
    projectsJson.value = "[\n  \n]";
  }
}

// Function to generate and download the new data.js
function downloadNewDataJS(newData) {
  const fileContent = `export const portfolioData = ${JSON.stringify(newData, null, 2)};

document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.getElementById("dynamic-projects-container");
  const bioContainer = document.getElementById("dynamic-bio");
  const skillsContainer = document.getElementById("dynamic-skills");

  // Only run if one of these containers exists on the page
  if (projectsContainer || bioContainer || skillsContainer) {
    
    // Render Projects
    if (projectsContainer && portfolioData.projects && portfolioData.projects.length > 0) {
      renderProjects(portfolioData.projects, projectsContainer);
    }

    // Render About and Skills
    if (portfolioData.about) {
      const data = portfolioData.about;

      if (bioContainer && data.text) {
        bioContainer.innerHTML = data.text.split('\\n')
          .filter(t => t.trim() !== '')
          .map(p => \`<p>\${p}</p>\`)
          .join('');
      }
      
      if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(s => 
          \`<span class="tag" style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-mono); font-size: 0.9rem;">\${s}</span>\`
        ).join('');
        skillsContainer.style.display = "flex";
        skillsContainer.style.flexWrap = "wrap";
        skillsContainer.style.gap = "0.5rem";
      }
    }
  }
});

function renderProjects(projects, container) {
  const html = projects.map(proj => {
    const isFlagship = proj.status === 'Flagship';
    const tagHtml = (proj.tags || []).map(t => \`<span class="tag">\${t}</span>\`).join('');
    
    return \`
      <a class="project-card reveal \${isFlagship ? 'flagship' : ''} is-visible" href="\${proj.url || '#'}">
        <div class="card-top">
          <span class="status-badge \${proj.status === 'Learning Project' ? 'neutral' : ''}">\${proj.status || 'Project'}</span>
          <span class="card-arrow" aria-hidden="true">&nearr;</span>
        </div>
        <div class="card-preview" style="--tile-color: \${proj.color || 'rgba(255,255,255,0.1)'};">
          <div class="chrome"><span></span><span></span><span></span></div>
          \${proj.image ? \`<img class="art-shot" src="\${proj.image}" alt="\${proj.title}" loading="lazy" />\` : ''}
        </div>
        <h3>\${proj.title}</h3>
        <p class="desc">\${proj.desc}</p>
        <div class="tags">
          \${tagHtml}
        </div>
      </a>
    \`;
  }).join('');
  
  container.innerHTML = html;
}
`;

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Save About & Skills
aboutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = aboutText.value;
  const skills = skillsList.value.split(',').map(s => s.trim()).filter(s => s !== "");
  
  // Clone current data
  const newData = JSON.parse(JSON.stringify(portfolioData));
  newData.about = { text, skills };
  
  downloadNewDataJS(newData);
  
  saveStatus.style.opacity = '1';
  setTimeout(() => { saveStatus.style.opacity = '0'; }, 3000);
});

// Save Projects
projectsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  try {
    const list = JSON.parse(projectsJson.value);
    if (!Array.isArray(list)) throw new Error("Projects must be a JSON array.");
    
    // Clone current data
    const newData = JSON.parse(JSON.stringify(portfolioData));
    newData.projects = list;
    
    downloadNewDataJS(newData);
    
    projSaveStatus.style.opacity = '1';
    setTimeout(() => { projSaveStatus.style.opacity = '0'; }, 3000);
  } catch (error) {
    console.error("Error formatting projects data:", error);
    alert("Invalid JSON format: " + error.message);
  }
});
