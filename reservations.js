// Gestion professionnelle du formulaire de réservation et de l'affichage

document.addEventListener('DOMContentLoaded', function() {
  const formReservation = document.getElementById('form-reservation');
  const reservationList = document.getElementById('reservation-list');

  let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  // Affiche les réservations du jour, triées par heure
  function renderReservations() {
    reservationList.innerHTML = '';
    const today = new Date().toISOString().slice(0, 10);
    const todayReservations = reservations
      .filter(r => r.date === today)
      .sort((a, b) => a.heure.localeCompare(b.heure));

    if (todayReservations.length === 0) {
      reservationList.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;">Aucune réservation pour aujourd'hui.</td></tr>`;
      return;
    }

    todayReservations.forEach(r => {
      reservationList.innerHTML += `
        <tr>
          <td>${r.heure}</td>
          <td>${escapeHTML(r.nom)}</td>
          <td>${r.personnes}</td>
          <td>
            <button class="action-btn delete" title="Supprimer" onclick="deleteReservation('${r.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  // Sécurise l'affichage du nom
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Ajoute une réservation avec validation
  formReservation.onsubmit = function(e) {
    e.preventDefault();
    const nom = document.getElementById('res-nom').value.trim();
    const date = document.getElementById('res-date').value;
    const heure = document.getElementById('res-heure').value;
    const personnes = parseInt(document.getElementById('res-personnes').value, 10);

    if (!nom || !date || !heure || !personnes || personnes < 1) {
      alert("Merci de remplir tous les champs correctement.");
      return;
    }

    // Vérifie les doublons (même nom, date, heure)
    const doublon = reservations.some(r => r.date === date && r.heure === heure && r.nom.toLowerCase() === nom.toLowerCase());
    if (doublon) {
      alert("Une réservation existe déjà pour ce nom à cette heure.");
      return;
    }

    const reservation = {
      id: Date.now().toString(),
      nom,
      date,
      heure,
      personnes
    };
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    renderReservations();
    formReservation.reset();
  };

  // Supprime une réservation
  window.deleteReservation = function(id) {
    if (confirm("Supprimer cette réservation ?")) {
      reservations = reservations.filter(r => r.id !== id);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      renderReservations();
    }
  };

  // Initialisation
  renderReservations();
});