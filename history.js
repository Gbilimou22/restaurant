document.addEventListener('DOMContentLoaded', function() {
  const historyList = document.getElementById('history-list');
  let commandes = JSON.parse(localStorage.getItem('commandes') || '[]');

  if (!Array.isArray(commandes) || commandes.length === 0) {
    historyList.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">Aucune commande enregistrée.</td></tr>`;
    return;
  }

  // Trie par date/heure décroissante si la date existe
  commandes.sort((a, b) => {
    const dateA = a.date ? a.date + ' ' + (a.heure || '') : (a.heure || '');
    const dateB = b.date ? b.date + ' ' + (b.heure || '') : (b.heure || '');
    return dateB.localeCompare(dateA);
  });

  commandes.forEach(cmd => {
    // Si tu veux stocker la date, ajoute-la lors de l'enregistrement d'une commande
    const date = cmd.date || new Date().toISOString().slice(0,10);
    let details = '';
    for (let i = 0; i < cmd.plats.length; i++) {
      details += `<span class="plat-detail">${cmd.plats[i]} <span class="qte">x${cmd.quantites[i] || 1}</span></span>`;
      if (i < cmd.plats.length - 1) details += ', ';
    }
    historyList.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${cmd.heure || ''}</td>
        <td>${cmd.client}</td>
        <td>${details}</td>
        <td>
          <span class="badge ${cmd.paiement === 'Payée' ? 'badge-success' : 'badge-warning'}">${cmd.paiement}</span>
        </td>
      </tr>
    `;
  });
});