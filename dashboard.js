// Affichage dynamique de l'heure
function updateHeureFlottante() {
  const heureElem = document.getElementById('heure-actuelle');
  if (heureElem) {
    const now = new Date();
    heureElem.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'});
  }
}
setInterval(updateHeureFlottante, 1000);
updateHeureFlottante();

// Navigation (pour éviter le rechargement complet si besoin)
window.goTo = function(page) {
  window.location.href = page; // PAS window.location.replace
};

// Statistiques dynamiques (exemple avec localStorage)
function updateStats() {
  // Exemple : à remplacer par tes vraies données
  const plats = JSON.parse(localStorage.getItem('plats') || '[]');
  const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  document.getElementById('stats-plats').textContent = plats.length;
  document.getElementById('stats-commandes').textContent = commandes.length;
  document.getElementById('stats-reservations').textContent = reservations.length;
}
updateStats();