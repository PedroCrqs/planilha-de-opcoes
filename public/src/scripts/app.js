class MajestoApp {
  constructor() {
    this.elements = {};
    this.removeListeners = [];
  }

  async init() {
    try {
      this.cacheElements();
      this.setupEventListeners();
      appState.subscribe(() => this.render());

      const properties = await fetchProperties();
      appState.setProperties(properties);
    } catch (error) {
      handleError(error, "inicialização da aplicação");
      this.showError("Erro ao carregar os imóveis. Recarregue a página e tente novamente.");
    }
  }

  cacheElements() {
    this.elements = {
      searchInput: document.getElementById("search-input"),
      statsContainer: document.getElementById("stats-container"),
      filtersContainer: document.getElementById("filters-container"),
      propertiesContainer: document.getElementById("properties-container"),
      clearFiltersBtn: document.getElementById("clear-filters-btn"),
      searchSubmitBtn: document.getElementById("search-submit-btn"),
      sortSelect: document.getElementById("sort-select"),
    };
  }

  setupEventListeners() {
    if (this.elements.searchInput) {
      const handleSearch = debounce((event) => {
        appState.setSearchFilter(event.target.value);
      }, 250);

      this.elements.searchInput.addEventListener("input", handleSearch);
      this.removeListeners.push(() => this.elements.searchInput.removeEventListener("input", handleSearch));
    }

    if (this.elements.searchSubmitBtn && this.elements.searchInput) {
      const submitSearch = () => {
        appState.setSearchFilter(this.elements.searchInput.value);
        this.elements.searchInput.focus();
      };

      this.elements.searchSubmitBtn.addEventListener("click", submitSearch);
      this.removeListeners.push(() => this.elements.searchSubmitBtn.removeEventListener("click", submitSearch));
    }

    if (this.elements.sortSelect) {
      const handleSort = (event) => {
        appState.setSort(event.target.value);
      };

      this.elements.sortSelect.addEventListener("change", handleSort);
      this.removeListeners.push(() => this.elements.sortSelect.removeEventListener("change", handleSort));
    }

    if (this.elements.clearFiltersBtn) {
      const clearFilters = () => {
        appState.clearFilters();

        if (this.elements.searchInput) {
          this.elements.searchInput.value = "";
          this.elements.searchInput.focus();
        }

        if (this.elements.sortSelect) {
          this.elements.sortSelect.value = appState.filters.sort;
        }
      };

      this.elements.clearFiltersBtn.addEventListener("click", clearFilters);
      this.removeListeners.push(() => this.elements.clearFiltersBtn.removeEventListener("click", clearFilters));
    }
  }

  render() {
    this.renderStats();
    this.renderFilters();
    this.renderProperties();
    this.updateClearButton();
    this.updateSortSelect();
  }

  renderStats() {
    if (!this.elements.statsContainer) return;

    this.elements.statsContainer.replaceChildren(createStatsSection(appState.getStats()));
  }

  renderFilters() {
    if (!this.elements.filtersContainer) return;

    this.elements.filtersContainer.replaceChildren(
      createFiltersSection(
        PROPERTY_FILTERS,
        appState.filters.activeFilter,
        (filterId) => appState.setActiveFilter(filterId)
      )
    );
  }

  renderProperties() {
    if (!this.elements.propertiesContainer) return;

    this.elements.propertiesContainer.replaceChildren(createPropertiesList(appState.filteredProperties));
  }

  updateClearButton() {
    if (!this.elements.clearFiltersBtn) return;

    const hasActiveFilters = Boolean(appState.filters.search) || appState.filters.activeFilter !== "all" || appState.filters.sort !== "featured";
    this.elements.clearFiltersBtn.hidden = !hasActiveFilters;
  }

  updateSortSelect() {
    if (!this.elements.sortSelect) return;

    this.elements.sortSelect.value = appState.filters.sort;
  }

  showError(message) {
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.setAttribute("role", "alert");
    errorMessage.textContent = message;
    document.body.prepend(errorMessage);
  }

  destroy() {
    this.removeListeners.forEach((removeListener) => removeListener());
    appState.listeners = [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new MajestoApp();
  app.init();
  window.majestoApp = app;
});
