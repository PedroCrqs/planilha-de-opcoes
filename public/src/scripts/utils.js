/**
 * Utils - Majesto Real Estate
 * 
 * Funções utilitárias gerais
 */

/**
 * Debounce para limitar chamadas de função
 * @param {Function} func - Função a debounce
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para limitar chamadas de função
 * @param {Function} func - Função a throttle
 * @param {number} limit - Tempo limite em ms
 * @returns {Function} Função com throttle
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Verifica se o dispositivo é mobile
 * @returns {boolean} True se é mobile
 */
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Adiciona listener com suporte a remoção
 * @param {HTMLElement} element - Elemento
 * @param {string} event - Nome do evento
 * @param {Function} handler - Handler do evento
 * @returns {Function} Função para remover listener
 */
function addListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Scroll suave para um elemento
 * @param {HTMLElement} element - Elemento para scroll
 * @param {number} duration - Duração em ms
 */
function smoothScroll(element, duration = 300) {
  const targetPosition = element.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let start = null;

  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    window.scrollBy(0, distance * percentage - (distance * (progress - duration) / duration));

    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  });
}

/**
 * Cria um elemento com classes
 * @param {string} tag - Tag HTML
 * @param {string} className - Classes CSS
 * @param {string} content - Conteúdo HTML
 * @returns {HTMLElement} Elemento criado
 */
function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.innerHTML = content;
  return element;
}

/**
 * Obtém valor de um atributo data
 * @param {HTMLElement} element - Elemento
 * @param {string} key - Chave do atributo
 * @returns {string|null} Valor do atributo
 */
function getDataAttribute(element, key) {
  return element.getAttribute(`data-${key}`);
}

/**
 * Define valor de um atributo data
 * @param {HTMLElement} element - Elemento
 * @param {string} key - Chave do atributo
 * @param {string} value - Valor
 */
function setDataAttribute(element, key, value) {
  element.setAttribute(`data-${key}`, value);
}

/**
 * Verifica se um elemento está visível na viewport
 * @param {HTMLElement} element - Elemento
 * @returns {boolean} True se visível
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Cria um observer para lazy loading
 * @param {Function} callback - Callback quando elemento fica visível
 * @param {Object} options - Opções do observer
 * @returns {IntersectionObserver} Observer criado
 */
function createLazyObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, defaultOptions);
}

/**
 * Armazena valor no localStorage
 * @param {string} key - Chave
 * @param {*} value - Valor
 */
function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage não disponível:', e);
  }
}

/**
 * Recupera valor do localStorage
 * @param {string} key - Chave
 * @param {*} defaultValue - Valor padrão
 * @returns {*} Valor armazenado ou padrão
 */
function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn('localStorage não disponível:', e);
    return defaultValue;
  }
}

/**
 * Remove valor do localStorage
 * @param {string} key - Chave
 */
function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('localStorage não disponível:', e);
  }
}

/**
 * Cria um delay (Promise)
 * @param {number} ms - Milissegundos
 * @returns {Promise} Promise que resolve após o delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Trata erros de forma consistente
 * @param {Error} error - Erro
 * @param {string} context - Contexto do erro
 */
function handleError(error, context = '') {
  console.error(`Erro${context ? ` em ${context}` : ''}:`, error);
  // Aqui você pode adicionar lógica de logging, analytics, etc.
}

/**
 * Formata valor em moeda brasileira
 * @param {number} value - Valor em reais
 * @returns {string} Valor formatado
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function isDirectImageUrl(url) {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    return /\.(avif|gif|jpe?g|png|webp)$/i.test(parsedUrl.pathname);
  } catch (error) {
    return false;
  }
}

/**
 * Normaliza texto para buscas mais tolerantes a acentos e pontuação.
 * @param {string|number} value - Valor a normalizar
 * @returns {string} Texto normalizado
 */
function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Obtém o rótulo amigável do tipo de imóvel.
 * @param {string} type - Tipo do imóvel
 * @returns {string} Tipo formatado
 */
function getTypeLabel(type) {
  const labels = {
    casa: "Casa",
    apartamento: "Apartamento",
    cobertura: "Cobertura",
  };

  return labels[type] || String(type || "Imóvel");
}
