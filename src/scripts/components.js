function createPropertyMedia(property) {
  const media = document.createElement("div");
  media.className = "property-card__media";

  const imageUrl = property.imagem || property.imageUrl;

  if (isDirectImageUrl(imageUrl)) {
    const image = document.createElement("img");
    image.className = "property-card__image";
    image.src = imageUrl;
    image.alt = `Foto do imóvel ${property.nome}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      media.replaceChildren(createPropertyPlaceholder());
    });
    media.appendChild(image);
    return media;
  }

  media.appendChild(createPropertyPlaceholder());
  return media;
}

function createPropertyPlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.className = "property-card__placeholder";

  const title = document.createElement("span");
  title.className = "property-card__placeholder-title";
  title.textContent = "Fotos disponíveis";

  const subtitle = document.createElement("span");
  subtitle.className = "property-card__placeholder-subtitle";
  subtitle.textContent = "Abra o Drive para ver imagens e detalhes";

  placeholder.append(title, subtitle);
  return placeholder;
}

function createBadge(text, modifier = "") {
  const badge = document.createElement("span");
  badge.className = `property-card__badge ${modifier}`.trim();
  badge.textContent = text;
  return badge;
}

function createPropertyCard(property) {
  const card = document.createElement("article");
  card.className = "property-card";
  card.setAttribute("aria-labelledby", `property-title-${property.id}`);

  const content = document.createElement("div");
  content.className = "property-card__content";

  const title = document.createElement("h3");
  title.id = `property-title-${property.id}`;
  title.className = "property-card__title";
  title.textContent = property.nome;

  const neighborhood = document.createElement("p");
  neighborhood.className = "property-card__neighborhood";
  neighborhood.textContent = property.bairro;

  const badges = document.createElement("div");
  badges.className = "property-card__badges";
  badges.append(
    createBadge(getTypeLabel(property.tipo)),
    createBadge(property.tipologia, "property-card__badge--soft")
  );

  const value = document.createElement("p");
  value.className = "property-card__value";

  const valueLabel = document.createElement("span");
  valueLabel.textContent = "Valor";

  const valueText = document.createElement("strong");
  valueText.textContent = formatCurrency(property.valor);

  value.append(valueLabel, valueText);

  const link = document.createElement("a");
  link.className = "property-card__button";
  link.href = property.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Ver fotos e detalhes";
  link.setAttribute("aria-label", `Ver fotos e detalhes de ${property.nome}`);

  content.append(title, neighborhood, badges, value, link);
  card.append(createPropertyMedia(property), content);
  return card;
}

function createFilterButton(filter, activeFilterId, onSelect) {
  const button = document.createElement("button");
  const isActive = filter.id === activeFilterId;

  button.type = "button";
  button.className = `filter-button ${isActive ? "filter-button--active" : ""}`;
  button.textContent = filter.label;
  button.setAttribute("aria-pressed", String(isActive));
  button.addEventListener("click", () => onSelect(filter.id));
  return button;
}

function createFiltersSection(filters, activeFilterId, onSelect) {
  const section = document.createElement("section");
  section.className = "filters-section";
  section.setAttribute("aria-labelledby", "filters-title");

  const title = document.createElement("h2");
  title.id = "filters-title";
  title.className = "section-title";
  title.textContent = "Filtros rápidos";

  const description = document.createElement("p");
  description.className = "section-description";
  description.textContent = "Use os botões para encontrar rapidamente o tipo de imóvel ideal.";

  const buttons = document.createElement("div");
  buttons.className = "filter-buttons";
  buttons.setAttribute("role", "group");
  buttons.setAttribute("aria-label", "Filtrar imóveis");

  filters.forEach((filter) => {
    buttons.appendChild(createFilterButton(filter, activeFilterId, onSelect));
  });

  section.append(title, description, buttons);
  return section;
}

function createStatsSection(stats) {
  const section = document.createElement("section");
  section.className = "results-summary";
  section.setAttribute("aria-live", "polite");
  section.setAttribute("aria-atomic", "true");

  const text = document.createElement("p");
  text.className = "results-summary__text";
  text.textContent = `Encontramos ${stats.total} ${stats.total === 1 ? "imóvel" : "imóveis"}`;

  section.appendChild(text);
  return section;
}

function createPropertiesList(properties) {
  const section = document.createElement("section");
  section.className = "properties-section";
  section.setAttribute("aria-labelledby", "properties-title");

  const header = document.createElement("div");
  header.className = "properties-section__header";

  const title = document.createElement("h2");
  title.id = "properties-title";
  title.className = "section-title";
  title.textContent = "Imóveis disponíveis";

  header.appendChild(title);
  section.appendChild(header);

  if (properties.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "Nenhum imóvel encontrado. Tente outro bairro, valor ou quantidade de quartos.";
    section.appendChild(emptyMessage);
    return section;
  }

  const container = document.createElement("div");
  container.className = "properties-grid";

  properties.forEach((property) => {
    container.appendChild(createPropertyCard(property));
  });

  section.appendChild(container);
  return section;
}
