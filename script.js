/* ---------------------------
   script.js (COMPLETO Y CORREGIDO)
   --------------------------- */

/* Función global para los onclick inline que ya tienes en los botones */
function toggleInfo(button) {
  const info = button.nextElementSibling;
  if (!info) return;
  info.classList.toggle('active');
  button.textContent = info.classList.contains('active') ? 'Ver Menos' : 'Ver Más';
}
window.toggleInfo = toggleInfo;

document.addEventListener('DOMContentLoaded', () => {
  // ===== ELEMENTOS =====
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('main-menu');
  const menuLinks = document.querySelectorAll('#main-menu a');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const cards = Array.from(document.querySelectorAll('.card'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  // ===== HEADER SCROLLED =====
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== FUNCIONES MENU =====
  const openMenu = () => {
    if (!navMenu) return;
    navMenu.classList.add('show');
    if (menuToggle) {
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('menu-open');
    if (drawerOverlay) drawerOverlay.classList.add('active');

    navMenu.querySelectorAll('ul li').forEach((li, i) => {
      li.style.transition = `transform 0.45s cubic-bezier(0.2,0.8,0.2,1) ${i * 70}ms, opacity 0.35s ${i * 70}ms`;
      li.style.transform = 'translateX(0)';
      li.style.opacity = '1';
    });
  };

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('show');
    if (menuToggle) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');

    navMenu.querySelectorAll('ul li').forEach(li => {
      li.style.transition = '';
      li.style.transform = '';
      li.style.opacity = '';
    });
  };

  // ===== LOGO CLICKEABLE =====
  window.addEventListener('load', () => {
    const headerLogo = document.querySelector('.header-logo');
    const logo = document.querySelector('.logo');
  
    function irAlInicio(e) {
      e.preventDefault();
      e.stopPropagation();
    
      const historiaSection = document.getElementById('historia');
    
      if (historiaSection && historiaSection.classList.contains('show')) {
        // Cerrar historia primero
        toggleHistoria();
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
      } else {
        // Ir directo al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  
    if (headerLogo) {
      headerLogo.style.cursor = 'pointer';
      headerLogo.addEventListener('click', irAlInicio);
    }
  
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', irAlInicio);
    }
  });

  // Toggle menú (si existe el botón)
  if (menuToggle) {
    menuToggle.addEventListener('click', e => {
      e.stopPropagation();
      navMenu && navMenu.classList.contains('show') ? closeMenu() : openMenu();
    });
  }

  
  // Cerrar menú al click en links o fuera (MODIFICADO)
if (menuLinks && menuLinks.length) {
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // NO cerrar el menú si es el botón de "Nuestra Historia"
      if (link.getAttribute('onclick') && link.getAttribute('onclick').includes('toggleHistoria')) {
        return; // No ejecuta closeMenu() para el botón de historia
      }
      closeMenu(); // Solo cierra el menú para otros enlaces
    });
  });
}
  document.addEventListener('click', e => {
    if (!navMenu || !menuToggle) return;
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('show')) closeMenu();
  });

  drawerOverlay && drawerOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 600) closeMenu(); });

  // ===== SWIPER (PRODUCTOS) =====
  if (typeof Swiper !== 'undefined') {
      const swiperSlides = document.querySelectorAll('.mySwiper .swiper-slide');
      const middleIndex = Math.floor(swiperSlides.length / 2);

      new Swiper('.mySwiper', {
          spaceBetween: 24,
          grabCursor: true,
          centeredSlides: true,
          speed: 800,
          effect: 'coverflow',
          coverflowEffect: {
              rotate: 25,
              stretch: 0,
              depth: 120,
              modifier: 1,
              slideShadows: true
          },
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          pagination: {
              el: '.swiper-pagination',
              clickable: true
          },
          breakpoints: {
              0: { slidesPerView: 1, spaceBetween: 20, loop: true, coverflowEffect: { rotate: 15, depth: 80 } },
              600: { slidesPerView: 2, spaceBetween: 25, loop: true, coverflowEffect: { rotate: 20, depth: 100 } },
              900: { slidesPerView: 3, spaceBetween: 30, loop: false, coverflowEffect: { rotate: 25, depth: 120 } }
          },
          on: {
              init: function () {
                  if (this.params.loop === false) {
                      this.slideToLoop(middleIndex, 0);
                  }
              }
          }
      });
  }

  // ===== AOS ANIMACIONES =====
  if (typeof AOS !== 'undefined') AOS.init({ once: false, duration: 1000, easing: 'ease-in-out' });

  // ===== FORMULARIO CONTACTO =====
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (formMessage) {
        formMessage.style.display = 'block';
        formMessage.style.opacity = '1';
        formMessage.textContent = '¡Gracias! Nos pondremos en contacto contigo.';
        setTimeout(() => { formMessage.style.opacity = '0'; setTimeout(() => formMessage.style.display = 'none', 500); }, 3000);
      }
      contactForm.reset();
    });
  }

  // ===== BOTONES VER MÁS PREMIUM =====
  document.querySelectorAll('.btn-product').forEach(btn => {
    if (btn.getAttribute('onclick')) return;
    btn.addEventListener('click', () => {
      const info = btn.nextElementSibling;
      if (!info) return;
      const isOpen = info.classList.contains('active');
      info.classList.toggle('active');
      btn.textContent = isOpen ? 'Ver Más' : 'Ver Menos';
    });
  });

  // ===== EFECTO FLOTANTE DORADO EN LAS CARDS =====
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.classList.remove('touch-hover');
    });
  });

  // ===== VIDEO SOBRE NOSOTROS =====
  const videoSobreNosotros = document.getElementById('videoSobreNosotros');
  if (videoSobreNosotros) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoSobreNosotros.play();
        } else {
          videoSobreNosotros.pause();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(videoSobreNosotros);
  }
}); // FIN de DOMContentLoaded

// ===== FUNCIÓN PARA MOSTRAR/OCULTAR HISTORIA =====
function toggleHistoria() {
  const historiaSection = document.getElementById('historia');
  const allOtherSections = document.querySelectorAll('section:not(#historia), footer');
  const body = document.body;

  if (historiaSection.classList.contains('show')) {
    // CERRAR HISTORIA
    historiaSection.classList.remove('show');
    body.classList.remove('historia-mode');
    
    // Muestra las otras secciones
    allOtherSections.forEach(section => {
      section.style.display = 'block';
    });
    
    if (typeof AOS !== 'undefined') AOS.refreshHard();

  } else {
    // ABRIR HISTORIA
    body.classList.add('historia-mode');
    
    // Oculta las otras secciones
    allOtherSections.forEach(section => {
      section.style.display = 'none';
    });
    
    historiaSection.classList.add('show');
    // Inicia la animación de los bloques de adentro
    initScrollReveal();
  }
}
window.toggleHistoria = toggleHistoria;


// ===== FUNCIÓN PARA ANIMACIONES DE SCROLL DENTRO DE HISTORIA (CORREGIDA) =====
function initScrollReveal() {
  const sections = document.querySelectorAll('.historia-bloque');
  
  if (!sections.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  sections.forEach(section => observer.observe(section));
}

// ===== FUNCIÓN HISTORIA SIMPLIFICADA Y CORREGIDA =====
function toggleHistoria() {
  const historiaSection = document.getElementById('historia');
  const allOtherSections = document.querySelectorAll('section:not(#historia), footer');
  const body = document.body;

  if (historiaSection.classList.contains('show')) {
    // CERRAR HISTORIA
    historiaSection.classList.remove('show');
    body.classList.remove('historia-mode');
    
    allOtherSections.forEach(section => {
      section.style.display = 'block';
    });
    
    if (typeof AOS !== 'undefined') AOS.refreshHard();

  } else {
    // ABRIR HISTORIA
    body.classList.add('historia-mode');
    
    allOtherSections.forEach(section => {
      section.style.display = 'none';
    });
    
    historiaSection.classList.add('show');
    initScrollReveal();
  }
}
window.toggleHistoria = toggleHistoria;

// ===== NAVEGACIÓN DESDE HISTORIA (FUNCIÓN SEPARADA) =====
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('#main-menu a[href^="#"]:not([onclick*="toggleHistoria"])');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const historiaSection = document.getElementById('historia');
      
      if (historiaSection && historiaSection.classList.contains('show')) {
        e.preventDefault();
        
        const targetHref = this.getAttribute('href');
        
        // Cerrar historia primero
        toggleHistoria();
        
        // Luego navegar después de un delay
        setTimeout(() => {
          if (targetHref === '#inicio') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const targetSection = document.querySelector(targetHref);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 700); // Un poco más de tiempo para asegurar que historia se cierre
      }
    });
  });
});

// ===== CERRAR MENÚ MÓVIL AUTOMÁTICAMENTE =====
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('#main-menu a');
  const navMenu = document.getElementById('main-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const drawerOverlay = document.getElementById('drawer-overlay');

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Cerrar el menú móvil
      if (navMenu) navMenu.classList.remove('show');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('menu-open');
    });
  });
});