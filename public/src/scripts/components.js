function createPropertyMedia(property) {
  const media = document.createElement("div");
  media.className = "property-card__media";

  const mediaBadge = document.createElement("span");
  mediaBadge.className = "property-card__media-badge";
  mediaBadge.textContent = "Fotos no Drive";

  // Se tem link de pasta do Drive, busca as fotos via API
  if (property.link && property.link.includes("/folders/")) {
    media.append(createPropertyPlaceholder("Carregando fotos..."), mediaBadge);

    fetch(`/api/imoveis/${property.id}/fotos`)
      .then((r) => r.json())
      .then((urls) => {
        if (urls.length === 0) {
          media.replaceChildren(createPropertyPlaceholder(), mediaBadge);
          return;
        }
        mediaBadge.textContent = `${urls.length} foto${urls.length > 1 ? "s" : ""}`;
        media.replaceChildren(createCarousel(urls, property.nome), mediaBadge);
      })
      .catch(() => {
        media.replaceChildren(createPropertyPlaceholder(), mediaBadge);
      });

    return media;
  }

  // Sem link ou link não é pasta do Drive
  media.append(createPropertyPlaceholder(), mediaBadge);
  return media;
}

function createCarousel(urls, nomeImovel) {
  const carousel = document.createElement("div");
  carousel.className = "property-card__carousel";

  let current = 0;

  const img = document.createElement("img");
  img.className = "property-card__image";
  img.src = urls[0];
  img.alt = `Foto do imóvel ${nomeImovel}`;
  img.loading = "lazy";
  img.decoding = "async";

  const counter = document.createElement("span");
  counter.className = "property-card__carousel-counter";
  counter.textContent = `1 / ${urls.length}`;

  function goTo(index) {
    current = (index + urls.length) % urls.length;
    img.src = urls[current];
    img.alt = `Foto ${current + 1} do imóvel ${nomeImovel}`;
    counter.textContent = `${current + 1} / ${urls.length}`;
  }

  if (urls.length > 1) {
    const prev = document.createElement("button");
    prev.className =
      "property-card__carousel-btn property-card__carousel-btn--prev";
    prev.setAttribute("aria-label", "Foto anterior");
    prev.textContent = "‹";
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current - 1);
    });

    const next = document.createElement("button");
    next.className =
      "property-card__carousel-btn property-card__carousel-btn--next";
    next.setAttribute("aria-label", "Próxima foto");
    next.textContent = "›";
    next.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(current + 1);
    });

    carousel.append(img, prev, next, counter);
  } else {
    carousel.append(img);
  }

  return carousel;
}

function createPropertyPlaceholder(message = null) {
  const placeholder = document.createElement("div");
  placeholder.className = "property-card__placeholder";

  const mark = document.createElement("span");
  mark.className = "property-card__placeholder-mark";
  mark.setAttribute("aria-hidden", "true");

  const title = document.createElement("span");
  title.className = "property-card__placeholder-title";
  title.textContent = message || "Fotos disponíveis";

  const subtitle = document.createElement("span");
  subtitle.className = "property-card__placeholder-subtitle";
  subtitle.textContent = message
    ? ""
    : "Abra o Drive para ver imagens e detalhes";

  placeholder.append(mark, title, subtitle);
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

  const meta = document.createElement("p");
  meta.className = "property-card__meta";
  meta.textContent = "Opção para apresentação comercial";

  const badges = document.createElement("div");
  badges.className = "property-card__badges";
  badges.append(
    createBadge(getTypeLabel(property.tipo)),
    createBadge(property.tipologia, "property-card__badge--soft"),
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
  link.href = property.link || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Ver fotos e detalhes";
  link.setAttribute("aria-label", `Ver fotos e detalhes de ${property.nome}`);

  content.append(title, neighborhood, meta, badges, value, link);
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
  description.textContent =
    "Escolha uma categoria para reduzir a lista sem perder a visão geral.";

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

  const detail = document.createElement("p");
  detail.className = "results-summary__detail";
  detail.textContent =
    stats.total === stats.all
      ? "Lista completa de oportunidades disponíveis."
      : `Mostrando ${stats.total} de ${stats.all} opções da vitrine.`;

  section.append(text, detail);
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
    emptyMessage.textContent =
      "Nenhum imóvel encontrado. Tente outro bairro, valor ou quantidade de quartos.";
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
