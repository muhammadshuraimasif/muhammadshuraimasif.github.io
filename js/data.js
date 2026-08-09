export const portfolioData = {
  about: {
    text: "",
    skills: []
  },
  projects: []
};

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
        bioContainer.innerHTML = data.text.split('\n')
          .filter(t => t.trim() !== '')
          .map(p => `<p>${p}</p>`)
          .join('');
      }
      
      if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(s => 
          `<span class="tag" style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-mono); font-size: 0.9rem;">${s}</span>`
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
    const tagHtml = (proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    
    return `
      <a class="project-card reveal ${isFlagship ? 'flagship' : ''} is-visible" href="${proj.url || '#'}">
        <div class="card-top">
          <span class="status-badge ${proj.status === 'Learning Project' ? 'neutral' : ''}">${proj.status || 'Project'}</span>
          <span class="card-arrow" aria-hidden="true">&nearr;</span>
        </div>
        <div class="card-preview" style="--tile-color: ${proj.color || 'rgba(255,255,255,0.1)'};">
          <div class="chrome"><span></span><span></span><span></span></div>
          ${proj.image ? `<img class="art-shot" src="${proj.image}" alt="${proj.title}" loading="lazy" />` : ''}
        </div>
        <h3>${proj.title}</h3>
        <p class="desc">${proj.desc}</p>
        <div class="tags">
          ${tagHtml}
        </div>
      </a>
    `;
  }).join('');
  
  container.innerHTML = html;
}
