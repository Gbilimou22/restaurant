document.addEventListener('DOMContentLoaded', function() {
  const formCommande = document.getElementById('form-commande');
  const commandeList = document.getElementById('commande-list');
  let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');

  function renderCommandes() {
    commandeList.innerHTML = '';
    if (commandes.length === 0) {
      commandeList.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">Aucune commande pour aujourd'hui.</td></tr>`;
      return;
    }
    commandes.forEach(cmd => {
      // Détail plats + quantités
      let details = '';
      for (let i = 0; i < cmd.plats.length; i++) {
        details += `<span class="plat-detail">${cmd.plats[i]} <span class="qte">x${cmd.quantites[i] || 1}</span></span>`;
        if (i < cmd.plats.length - 1) details += ', ';
      }
      commandeList.innerHTML += `
        <tr>
          <td><span class="heure">${cmd.heure}</span></td>
          <td><span class="client">${cmd.client}</span></td>
          <td>${details}</td>
          <td>
            <span class="badge ${cmd.paiement === 'Payée' ? 'badge-success' : 'badge-warning'}">${cmd.paiement}</span>
          </td>
          <td>
            <button class="action-btn delete" aria-label="Supprimer la commande" onclick="deleteCommande('${cmd.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  formCommande.onsubmit = function(e) {
    e.preventDefault();
    const client = document.getElementById('cmd-client').value.trim();
    const plats = document.getElementById('cmd-plats').value.split(',').map(p => p.trim());
    const quantites = document.getElementById('cmd-quantites').value.split(',').map(q => parseInt(q.trim(), 10));
    const paiement = document.getElementById('cmd-paiement').value;
    const heure = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    commandes.push({
      id: Date.now().toString(),
      client,
      plats,
      quantites,
      paiement,
      heure
    });
    localStorage.setItem('commandes', JSON.stringify(commandes));
    renderCommandes();
    formCommande.reset();
  };

  window.deleteCommande = function(id) {
    commandes = commandes.filter(cmd => cmd.id !== id);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    renderCommandes();
  };

  renderCommandes();
});