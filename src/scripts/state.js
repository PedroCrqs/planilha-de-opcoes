const PROPERTY_FILTERS = [
  { id: "all", label: "Todos", type: "all" },
  { id: "casa", label: "Casas", type: "tipo", value: "casa" },
  { id: "apartamento", label: "Apartamentos", type: "tipo", value: "apartamento" },
  { id: "cobertura", label: "Coberturas", type: "tipo", value: "cobertura" },
  { id: "1-quarto", label: "1 quarto", type: "quartos", min: 1, max: 1 },
  { id: "2-quartos", label: "2 quartos", type: "quartos", min: 2, max: 2 },
  { id: "3-quartos", label: "3 quartos+", type: "quartos", min: 3 },
];

class AppState {
  constructor() {
    this.properties = [];
    this.filteredProperties = [];
    this.filters = {
      search: "",
      activeFilter: "all",
    };
    this.listeners = [];
  }

  setProperties(properties) {
    this.properties = Array.isArray(properties) ? properties : [];
    this.applyFilters();
  }

  setSearchFilter(search) {
    this.filters.search = String(search || "").trim();
    this.applyFilters();
  }

  setActiveFilter(filterId) {
    const filterExists = PROPERTY_FILTERS.some((filter) => filter.id === filterId);
    this.filters.activeFilter = filterExists ? filterId : "all";
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      search: "",
      activeFilter: "all",
    };
    this.applyFilters();
  }

  applyFilters() {
    const searchTerm = normalizeText(this.filters.search);
    const activeFilter = this.getActiveFilter();

    this.filteredProperties = this.properties.filter((property) => (
      this.matchesSearch(property, searchTerm) &&
      this.matchesActiveFilter(property, activeFilter)
    ));

    this.notifyListeners();
  }

  matchesSearch(property, searchTerm) {
    if (!searchTerm) return true;

    const searchableText = [
      property.nome,
      property.bairro,
      property.tipologia,
      getTypeLabel(property.tipo),
      property.tipo,
      formatCurrency(property.valor),
      String(property.valor),
    ].map(normalizeText).join(" ");

    return searchableText.includes(searchTerm);
  }

  matchesActiveFilter(property, filter) {
    if (!filter || filter.type === "all") return true;

    if (filter.type === "tipo") {
      return property.tipo === filter.value;
    }

    if (filter.type === "quartos") {
      const bedrooms = Number(property.quartos || 0);
      const minMatches = filter.min ? bedrooms >= filter.min : true;
      const maxMatches = filter.max ? bedrooms <= filter.max : true;
      return minMatches && maxMatches;
    }

    return true;
  }

  getActiveFilter() {
    return PROPERTY_FILTERS.find((filter) => filter.id === this.filters.activeFilter) || PROPERTY_FILTERS[0];
  }

  getStats() {
    return {
      total: this.filteredProperties.length,
      all: this.properties.length,
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this));
  }
}

const appState = new AppState();
