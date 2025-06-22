// This file manages the menu operations, including adding, modifying, and deleting dishes, and updating the displayed list.

document.addEventListener('DOMContentLoaded', () => {
    const menuList = document.getElementById('menu-list');
    const addDishForm = document.getElementById('add-dish-form');
    const dishNameInput = document.getElementById('dish-name');
    const dishCategoryInput = document.getElementById('dish-category');
    const dishPriceInput = document.getElementById('dish-price');

    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

    function renderMenu() {
        menuList.innerHTML = '';
        menuItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.category} - $${item.price.toFixed(2)}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteDish(index);
            li.appendChild(deleteButton);
            menuList.appendChild(li);
        });
    }

    function addDish(event) {
        event.preventDefault();
        const newDish = {
            name: dishNameInput.value,
            category: dishCategoryInput.value,
            price: parseFloat(dishPriceInput.value)
        };
        menuItems.push(newDish);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderMenu();
        addDishForm.reset();
    }

    function deleteDish(index) {
        menuItems.splice(index, 1);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        renderMenu();
    }

    addDishForm.addEventListener('submit', addDish);
    renderMenu();
});

// Gestion du menu (plats) avec localStorage

const menuList = document.getElementById('menu-list');
const btnAjouter = document.getElementById('btn-ajouter-plat');
const modal = document.getElementById('modal-plat');
const closeModalBtn = document.getElementById('close-modal');
const formPlat = document.getElementById('form-plat');
const modalTitle = document.getElementById('modal-title');

let plats = JSON.parse(localStorage.getItem('plats') || '[]');
let editIndex = null;

// Affiche la liste des plats
function renderMenu() {
  menuList.innerHTML = '';
  if (plats.length === 0) {
    menuList.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;">Aucun plat pour le moment.</td></tr>`;
    return;
  }
  plats.forEach((plat, i) => {
    menuList.innerHTML += `
      <tr>
        <td>${plat.image ? `<img src="${plat.image}" alt="plat">` : '-'}</td>
        <td>${plat.nom}</td>
        <td>${plat.categorie}</td>
        <td>${plat.description || ''}</td>
        <td>${plat.prix ? plat.prix + ' €' : ''}</td>
        <td>
          <button class="action-btn edit" title="Modifier" onclick="editPlat(${i})"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" title="Supprimer" onclick="deletePlat(${i})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

// Ouvre la modale pour ajouter un plat
btnAjouter.onclick = () => {
  formPlat.reset();
  modalTitle.textContent = "Ajouter un plat";
  editIndex = null;
  modal.style.display = "flex";
};

// Ferme la modale
closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

// Ferme la modale si clic en dehors
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Ajouter ou modifier un plat
formPlat.onsubmit = function(e) {
  e.preventDefault();
  const plat = {
    nom: document.getElementById('plat-nom').value.trim(),
    categorie: document.getElementById('plat-categorie').value,
    description: document.getElementById('plat-description')?.value.trim() || '',
    prix: parseFloat(document.getElementById('plat-prix').value).toFixed(2),
    image: document.getElementById('plat-image').value.trim()
  };
  if (editIndex !== null) {
    plats[editIndex] = plat;
  } else {
    plats.push(plat);
  }
  localStorage.setItem('plats', JSON.stringify(plats));
  renderMenu();
  modal.style.display = "none";
};

// Modifier un plat
window.editPlat = function(index) {
  const plat = plats[index];
  document.getElementById('plat-nom').value = plat.nom;
  document.getElementById('plat-categorie').value = plat.categorie;
  if(document.getElementById('plat-description')) document.getElementById('plat-description').value = plat.description;
  document.getElementById('plat-prix').value = plat.prix;
  document.getElementById('plat-image').value = plat.image;
  modalTitle.textContent = "Modifier le plat";
  editIndex = index;
  modal.style.display = "flex";
};

// Supprimer un plat
window.deletePlat = function(index) {
  if (confirm("Supprimer ce plat ?")) {
    plats.splice(index, 1);
    localStorage.setItem('plats', JSON.stringify(plats));
    renderMenu();
  }
};

// Suggestions d'images de plats (exemple avec Unsplash)
const platNomInput = document.getElementById('plat-nom');
const platImageInput = document.getElementById('plat-image');

// Création du conteneur pour les suggestions
let suggestionBox = document.createElement('div');
suggestionBox.id = 'image-suggestions';
suggestionBox.style.display = 'none';
suggestionBox.style.position = 'absolute';
suggestionBox.style.background = '#fff';
suggestionBox.style.border = '1px solid #eee';
suggestionBox.style.zIndex = 1002;
suggestionBox.style.padding = '8px';
suggestionBox.style.borderRadius = '8px';
suggestionBox.style.boxShadow = '0 2px 8px rgba(44,62,80,0.07)';
suggestionBox.style.maxWidth = '320px';
suggestionBox.style.maxHeight = '120px';
suggestionBox.style.overflowX = 'auto';
suggestionBox.style.gap = '8px';
suggestionBox.style.display = 'flex';

platImageInput.parentNode.insertBefore(suggestionBox, platImageInput.nextSibling);

platNomInput.addEventListener('input', async function() {
  const query = platNomInput.value.trim();
  if (query.length < 3) {
    suggestionBox.style.display = 'none';
    return;
  }
  // Utilisation de l'API Unsplash (clé de démo, limité)
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_ACCESS_KEY&per_page=5`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    suggestionBox.innerHTML = '';
    if (data.results && data.results.length > 0) {
      data.results.forEach(img => {
        const thumb = document.createElement('img');
        thumb.src = img.urls.thumb;
        thumb.alt = img.alt_description || query;
        thumb.style.width = '56px';
        thumb.style.height = '40px';
        thumb.style.objectFit = 'cover';
        thumb.style.borderRadius = '6px';
        thumb.style.marginRight = '6px';
        thumb.style.cursor = 'pointer';
        thumb.onclick = () => {
          platImageInput.value = img.urls.small;
          suggestionBox.style.display = 'none';
        };
        suggestionBox.appendChild(thumb);
      });
      // Positionne la box sous le champ image
      const rect = platImageInput.getBoundingClientRect();
      suggestionBox.style.left = rect.left + 'px';
      suggestionBox.style.top = (rect.bottom + window.scrollY + 4) + 'px';
      suggestionBox.style.display = 'flex';
    } else {
      suggestionBox.style.display = 'none';
    }
  } catch (e) {
    suggestionBox.style.display = 'none';
  }
});

// Masquer les suggestions si on clique ailleurs
document.addEventListener('click', function(e) {
  if (!suggestionBox.contains(e.target) && e.target !== platNomInput) {
    suggestionBox.style.display = 'none';
  }
});

// Initialisation
renderMenu();

const imageSuggestions = {
  pizza: ['assets/images/pizza1.jpg', 'assets/images/pizza2.jpg'],
  burger: ['assets/images/burger1.jpg', 'assets/images/burger2.jpg'],
  salade: ['assets/images/salade1.jpg'],
  // Ajoute d'autres plats ici
};

platNomInput.addEventListener('input', function() {
  const query = platNomInput.value.trim().toLowerCase();
  suggestionBox.innerHTML = '';
  if (!query || !imageSuggestions[query]) {
    suggestionBox.style.display = 'none';
    return;
  }
  imageSuggestions[query].forEach(url => {
    const thumb = document.createElement('img');
    thumb.src = url;
    thumb.alt = query;
    thumb.style.width = '56px';
    thumb.style.height = '40px';
    thumb.style.objectFit = 'cover';
    thumb.style.borderRadius = '6px';
    thumb.style.marginRight = '6px';
    thumb.style.cursor = 'pointer';
    thumb.onclick = () => {
      platImageInput.value = url;
      suggestionBox.style.display = 'none';
    };
    suggestionBox.appendChild(thumb);
  });
  suggestionBox.style.display = 'flex';
});