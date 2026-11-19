/**
 * Alex Morgan Portfolio - Main JavaScript
 * Production-ready ES6 implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light / Dark mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElement = document.documentElement;

  // Safe wrapper for localStorage
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      console.warn('Unable to access localStorage for theme preference:', e);
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage:', e);
    }
  };

  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-bs-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill';
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
      } else {
        themeIcon.className = 'bi bi-moon-fill';
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
      }
    }
  };

  // Initial theme initialization
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Listen for system theme changes if user hasn't chosen manually
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      setStoredTheme(newTheme);
    });
  }

  // ==========================================
  // 2. Mobile Navbar Collapse Auto-close
  // ==========================================
  const navbarCollapse = document.getElementById('menu');
  if (navbarCollapse) {
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // If collapsible menu is currently expanded on small screens, collapse it
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      });
    });
  }

  // ==========================================
  // 3. Project Details Modal Dynamic Content
  // ==========================================
  const projModal = document.getElementById('projModal');
  if (projModal) {
    projModal.addEventListener('show.bs.modal', (event) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      if (!button) return;

      // Extract info from data-title and data-desc attributes
      const title = button.getAttribute('data-title') || 'Project Details';
      const desc = button.getAttribute('data-desc') || 'No description provided.';

      // Update the modal's title and body safely using textContent
      const modalTitle = projModal.querySelector('.modal-title');
      const modalBody = projModal.querySelector('.modal-body');

      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) modalBody.textContent = desc;
    });
  }

  // ==========================================
  // 4. Contact Form Validation & Submission
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formAlertContainer = document.getElementById('formAlertContainer');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Check form validity using HTML5 constraint validation
      if (!contactForm.checkValidity()) {
        event.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      // Note: No backend service is connected. This is client-side simulation.
      // Display accessible Bootstrap success alert
      if (formAlertContainer) {
        formAlertContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i>
            <strong>Thank you!</strong> Your message has been sent.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      }

      // Reset form and remove validation styling
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }

  // ==========================================
  // 5. In-Browser Edit Mode & Save HTML
  // ==========================================
  const toggleEditBtn = document.getElementById('toggleEditBtn');
  const saveHtmlBtn = document.getElementById('saveHtmlBtn');
  let isEditMode = false;

  const editableSelectors = 'h1, h2, h3, p, .list-group-item';

  if (toggleEditBtn) {
    toggleEditBtn.addEventListener('click', () => {
      isEditMode = !isEditMode;
      const mainElement = document.querySelector('main');
      const footerElement = document.querySelector('footer');

      const elementsToEdit = [];
      if (mainElement) {
        elementsToEdit.push(...mainElement.querySelectorAll(editableSelectors));
      }
      if (footerElement) {
        elementsToEdit.push(...footerElement.querySelectorAll(editableSelectors));
      }

      if (isEditMode) {
        document.body.classList.add('edit-mode');
        elementsToEdit.forEach((el) => {
          el.setAttribute('contenteditable', 'true');
        });
        toggleEditBtn.classList.remove('btn-primary');
        toggleEditBtn.classList.add('btn-warning');
        toggleEditBtn.setAttribute('title', 'Turn Off Edit Mode');
      } else {
        document.body.classList.remove('edit-mode');
        elementsToEdit.forEach((el) => {
          el.removeAttribute('contenteditable');
        });
        toggleEditBtn.classList.remove('btn-warning');
        toggleEditBtn.classList.add('btn-primary');
        toggleEditBtn.setAttribute('title', 'Toggle Edit Mode');
      }
    });
  }

  if (saveHtmlBtn) {
    saveHtmlBtn.addEventListener('click', () => {
      // 1. Clone document.documentElement
      const clone = document.documentElement.cloneNode(true);

      // 2. Remove all contenteditable attributes
      const editableElements = clone.querySelectorAll('[contenteditable]');
      editableElements.forEach((el) => {
        el.removeAttribute('contenteditable');
      });

      // 3. Remove edit-mode class from body if present
      const cloneBody = clone.querySelector('body');
      if (cloneBody) {
        cloneBody.classList.remove('edit-mode');
      }

      // 4. Remove floating buttons container
      const floatingControls = clone.querySelector('#floatingControls');
      if (floatingControls) {
        floatingControls.remove();
      }

      // 5. Remove any .alert elements
      const alerts = clone.querySelectorAll('.alert');
      alerts.forEach((alert) => {
        alert.remove();
      });

      // 6. Remove "show" class from the modal if present
      const modalInClone = clone.querySelector('#projModal');
      if (modalInClone) {
        modalInClone.classList.remove('show');
        modalInClone.removeAttribute('style');
        modalInClone.setAttribute('aria-hidden', 'true');
      }

      // Remove any leftover modal backdrops
      const backdrops = clone.querySelectorAll('.modal-backdrop');
      backdrops.forEach((b) => b.remove());

      // 7. Serialize with <!DOCTYPE html>
      const serializedHtml = '<!DOCTYPE html>\n' + clone.outerHTML;

      // 8. Create Blob and trigger download
      const blob = new Blob([serializedHtml], { type: 'text/html;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'index.html';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    });
  }

  // ==========================================
  // 6. Dynamic Copyright Year
  // ==========================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
