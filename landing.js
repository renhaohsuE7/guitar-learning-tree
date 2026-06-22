// Render instrument cards on the landing page from the shared registry.
(function renderLanding() {
  const root = document.getElementById("landing");
  if (!root || typeof INSTRUMENTS === "undefined") return;
  INSTRUMENTS.forEach(inst => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = inst.page;
    card.innerHTML =
      `<div class="card-emoji">${inst.emoji}</div>` +
      `<div class="card-label">${inst.label}</div>`;
    root.appendChild(card);
  });
})();
