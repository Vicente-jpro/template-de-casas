/**
 * CasasPro – App JavaScript
 * Bootstrap 5.3 | Real-Estate Template
 */

'use strict';

/* ------------------------------------------------------------------ */
/* Utility helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Format currency (EUR by default)
 */
function formatPrice(value, locale = 'pt-PT', currency = 'EUR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

/**
 * Show a Bootstrap toast notification
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const id = 'toast-' + Date.now();
  const icons = { success: 'check-circle-fill', danger: 'x-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' };
  const icon  = icons[type] || icons.info;

  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-${icon}"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);

  const el = document.getElementById(id);
  const toast = new bootstrap.Toast(el, { delay: 4000 });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

/* ------------------------------------------------------------------ */
/* Image upload preview (up to 10 images)                              */
/* ------------------------------------------------------------------ */

const MAX_IMAGES = 10;

function initImageUpload(zoneId, inputId, previewId) {
  const zone    = document.getElementById(zoneId);
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!zone || !input || !preview) return;

  let uploadedFiles = [];

  function renderPreviews() {
    preview.innerHTML = '';
    uploadedFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = e => {
        const div = document.createElement('div');
        div.className = 'upload-preview-item';
        div.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${i + 1}">
          <button class="upload-preview-remove" data-index="${i}" title="Remove">
            <i class="bi bi-x"></i>
          </button>`;
        preview.appendChild(div);
        div.querySelector('.upload-preview-remove').addEventListener('click', () => {
          uploadedFiles.splice(i, 1);
          renderPreviews();
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function addFiles(files) {
    const remaining = MAX_IMAGES - uploadedFiles.length;
    const toAdd     = Array.from(files).slice(0, remaining);
    uploadedFiles   = uploadedFiles.concat(toAdd);
    if (files.length > remaining) showToast(`Máximo de ${MAX_IMAGES} imagens permitido.`, 'warning');
    renderPreviews();
  }

  zone.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    addFiles(input.files);
    input.value = '';
  });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });
}

/* ------------------------------------------------------------------ */
/* House form validation                                                */
/* ------------------------------------------------------------------ */

function initHouseForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', e => {
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      showToast('Por favor preencha todos os campos obrigatórios.', 'warning');
    } else {
      e.preventDefault();
      showToast('Casa guardada com sucesso!', 'success');
    }
    form.classList.add('was-validated');
  });
}

/* ------------------------------------------------------------------ */
/* Auth forms                                                            */
/* ------------------------------------------------------------------ */

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => { window.location.href = '../../index.html'; }, 1200);
  });
}

function initResetForm() {
  const form = document.getElementById('resetForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    showToast('Email de redefinição enviado!', 'success');
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    showToast('Mensagem enviada com sucesso!', 'success');
    form.reset();
    form.classList.remove('was-validated');
  });
}

/* ------------------------------------------------------------------ */
/* Gallery lightbox (using Bootstrap modal)                            */
/* ------------------------------------------------------------------ */

function initGallery() {
  const items = document.querySelectorAll('[data-gallery-src]');
  const modal = document.getElementById('lightboxModal');
  if (!items.length || !modal) return;

  const modalImg   = modal.querySelector('#lightboxImg');
  const modalTitle = modal.querySelector('#lightboxTitle');

  items.forEach((item, i) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      modalImg.src   = item.dataset.gallerySrc;
      modalImg.alt   = item.dataset.galleryTitle || '';
      if (modalTitle) modalTitle.textContent = item.dataset.galleryTitle || `Imagem ${i + 1}`;
      bootstrap.Modal.getOrCreateInstance(modal).show();
    });
  });
}

/* ------------------------------------------------------------------ */
/* Animate elements on scroll (Intersection Observer)                  */
/* ------------------------------------------------------------------ */

function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!('IntersectionObserver' in window) || !els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Filter panel toggle (mobile)                                        */
/* ------------------------------------------------------------------ */

function initFilterToggle() {
  const btn    = document.getElementById('filterToggleBtn');
  const panel  = document.getElementById('filterPanel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const collapse = bootstrap.Collapse.getOrCreateInstance(panel);
    collapse.toggle();
  });
}

/* ------------------------------------------------------------------ */
/* Price range slider                                                   */
/* ------------------------------------------------------------------ */

function initPriceRange() {
  const slider = document.getElementById('priceRange');
  const output = document.getElementById('priceRangeValue');
  if (!slider || !output) return;

  function update() {
    output.textContent = formatPrice(slider.value);
  }
  slider.addEventListener('input', update);
  update();
}

/* ------------------------------------------------------------------ */
/* Wishlist toggle                                                       */
/* ------------------------------------------------------------------ */

function initWishlist() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const active = icon.classList.contains('bi-heart-fill');
      icon.classList.toggle('bi-heart-fill', !active);
      icon.classList.toggle('bi-heart', active);
      icon.style.color = active ? '' : '#dc3545';
      showToast(active ? 'Removido dos favoritos.' : 'Adicionado aos favoritos!', active ? 'info' : 'success');
    });
  });
}

/* ------------------------------------------------------------------ */
/* Bootstrap tooltip init                                              */
/* ------------------------------------------------------------------ */

function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    bootstrap.Tooltip.getOrCreateInstance(el);
  });
}

/* ------------------------------------------------------------------ */
/* Password visibility toggle                                          */
/* ------------------------------------------------------------------ */

function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.querySelector('i').className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  });
}

/* ------------------------------------------------------------------ */
/* Back to top button                                                   */
/* ------------------------------------------------------------------ */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ------------------------------------------------------------------ */
/* DOMContentLoaded – init everything                                   */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initFilterToggle();
  initPriceRange();
  initWishlist();
  initTooltips();
  initPasswordToggle();
  initBackToTop();
  initGallery();
  initLoginForm();
  initResetForm();
  initContactForm();
  initHouseForm('createHouseForm');
  initHouseForm('editHouseForm');
  initImageUpload('uploadZone', 'imageInput', 'imagePreview');
});
