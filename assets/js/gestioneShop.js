//variabile per il conteggio carrello salvata in local storage
var conteggio;
//localStorage.clear();

//Gestione conteggio
conteggio =
  localStorage.getItem("acquisti") == null
    ? 0
    : localStorage.getItem("acquisti");

//gestione prodotti. caricamento e fetch file json
start();

window.addEventListener("DOMContentLoaded", () => {
  fetch("../assets/js/prodotti.json")
    .then((res) => res.json())
    .then((prodotti) => {
      const container = document.getElementById("griglia");

      prodotti.forEach((p) => {
        const box = document.createElement("div");
        box.classList.add("product-box");
        box.innerHTML = `
            <img src="${p.immagine}" alt="${p.nome}" />
            <h3>${p.nome}</h3>
            <p class="marca">${p.marca}</p>
            <p class="descrizione">${p.descrizione}</p>
            <p class="prezzo">${p.costo.toFixed(2)} €</p>
            <button type= 'button' class = 'btn' onclick= 'carrello(${
              p.id
            })'><i class='fa-solid fa-cart-shopping'></i> Aggiungi al carrello</button>
          `;
        container.appendChild(box);
      });
    })
    .catch((err) => console.error("Errore nel caricamento JSON:", err));
});

//Gestione scroll
const header = document.querySelector("header");

// Imposta colore iniziale all'avvio
header.style.backgroundColor = "rgba(245, 245, 245, 0.9)";
header.style.transition =
  "background-color 0.9s ease, backdrop-filter 0.9s ease";

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 170) {
    // Dopo scroll > 50px: diventa più grigia e trasparente
    header.style.backgroundColor = "rgba(211, 211, 211, 0.691)"; // grigio scuro con trasparenza
    header.style.backdropFilter = "blur(8px)";
  } else {
    // Torna chiara e opaca
    header.style.backgroundColor = "rgba(245, 245, 245, 0.9)";
    header.style.backdropFilter = "blur(10px)";
  }
});

//start
function start() {
  if (conteggio > 0) {
    document.getElementById("advise").style.display = "block";
    document.getElementById("advise").innerHTML = conteggio;
  }
}

//Gestione bottone carrello
document.getElementById("carrello").addEventListener("click", () => {
  window.open("carrello.html", "_self");
});

//Gestione salvataggio elementi in carrello
function carrello(id) {
  conteggio++;
  console.log(conteggio);
  if (conteggio > 0) {
    document.getElementById("advise").style.display = "block";
    document.getElementById("advise").innerHTML = conteggio;
    //salvo il conteggio in localstorage
    localStorage.setItem("acquisti", conteggio);
    salva(id); //richiamo funzione salva
  }
}
//Funzione salva nel carrello
function salva(id) {
  console.log("ciao bellissimo");
  fetch("../assets/js/prodotti.json")
    .then((res) => res.json())
    .then((prodotti) => {
      const prodotto = prodotti.find((p) => p.id === id);

      if (prodotto) {
        // Recupera il carrello esistente o crea un array vuoto
        let carrello = JSON.parse(localStorage.getItem("prodotti")) || [];

        // Aggiungi il nuovo prodotto
        carrello.push(prodotto);

        // Salva di nuovo l'array aggiornato nel localStorage
        localStorage.setItem("prodotti", JSON.stringify(carrello));

        console.log("PRODOTTO AGGIUNTO AL CARRELLO: " + prodotto);
      }
    });
}
