// Variabili globali
var conteggio;
var carrello;

// Avvio iniziale
start();

// Funzione principale
function start() {
  conteggio =
    localStorage.getItem("acquisti") == null
      ? 0
      : parseInt(localStorage.getItem("acquisti"));

  carrello = JSON.parse(localStorage.getItem("prodotti")) || [];

  aggiornaMessaggioCarrello();

  // Pulisci il contenuto prima di riempirlo
  document.getElementById("contenitore_generale").innerHTML = "";

  carrello.forEach((p, index) => {
    let contenitoreGenerale = document.getElementById("contenitore_generale");

    const box = document.createElement("div");
    box.classList.add("box-prodotto");
    box.id = `prodotto-${index}`;
    box.innerHTML = `
      <div id="superiore">
          <img src="${p.immagine}" alt="${p.nome}">
          <div class="box-info">
              <span id="title">${p.nome}</span>
              <span id="marca">${p.marca}</span>
              <span id="description">${p.descrizione}</span>
              <span id="costo">€ ${p.costo}</span>
          </div>
      </div>
      <div id="inferiore">
          <button type="button" class="rmv" onclick="elimina(${index})">
              <i class="fa-solid fa-trash"></i> Rimuovi
          </button>
      </div>
    `;
    contenitoreGenerale.appendChild(box);
  });

  creaBottoniFinali();
}

// Mostra o nasconde il messaggio "carrello vuoto"
function aggiornaMessaggioCarrello() {
  const advise = document.getElementById("advise");
  const testo = document.getElementById("testo");

  if (carrello.length === 0) {
    testo.style.display = "block";
    advise.style.display = "none";
  } else {
    testo.style.display = "none";
    advise.style.display = "block";
    advise.innerHTML = conteggio;
  }
}

// Funzione per rimuovere singolo prodotto
function elimina(index) {
  carrello.splice(index, 1);
  localStorage.setItem("prodotti", JSON.stringify(carrello));

  conteggio--;
  localStorage.setItem("acquisti", conteggio);

  document.getElementById(`prodotto-${index}`)?.remove();

  aggiornaMessaggioCarrello();

  console.log("Prodotto rimosso con successo");
}

// Bottoni finali sotto la lista prodotti
function creaBottoniFinali() {
  let contenitoreGenerale = document.getElementById("contenitore_generale");

  let boxBottoni = document.createElement("div");
  boxBottoni.classList.add("bottoni-finali");
  boxBottoni.innerHTML = `
    <button type="button" id="pulisci-carrello">
      <i class="fa-solid fa-trash"></i> Svuota carrello
    </button>
    <button type="button" id="compra-tutto">
      <i class="fa-solid fa-bag-shopping"></i> Compra prodotti
    </button>
  `;
  contenitoreGenerale.appendChild(boxBottoni);

  // Ri-aggancia gli eventi (in caso di rigenerazione DOM)
  document
    .getElementById("pulisci-carrello")
    .addEventListener("click", svuotaCarrello);
  document.getElementById("compra-tutto").addEventListener("click", generaPDF);
}

// Funzione per svuotare il carrello
function svuotaCarrello() {
  localStorage.clear();
  carrello = [];
  conteggio = 0;

  // Nascondi tutte le box prodotto
  document.querySelectorAll(".box-prodotto").forEach((el) => {
    el.style.display = "none";
  });

  // Rimuovi anche i bottoni finali
  document.querySelectorAll(".bottoni-finali").forEach((el) => el.remove());

  aggiornaMessaggioCarrello();
}

// Funzione PDF
async function generaPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "px", "a4", true);
  const pageWidth = pdf.internal.pageSize.getWidth();

  let y = 60;
  let total = 0;

  // Titolo
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  const title = "RICEVUTA FISCALE - ERCE";
  pdf.text(title, (pageWidth - pdf.getTextWidth(title)) / 2, 40);

  const carrello = JSON.parse(localStorage.getItem("prodotti"));

  for (const prodotto of carrello) {
    const imgBase64 = await convertToBase64(prodotto.immagine);

    pdf.addImage(imgBase64, "JPEG", 20, y, 60, 60);

    let textX = 90;
    let textY = y + 12;

    pdf.setFont("helvetica", "bold").setFontSize(12);
    pdf.text(prodotto.nome, textX, textY);
    textY += 14;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Marca: ${prodotto.marca}`, textX, textY);
    textY += 14;
    pdf.text(`Descrizione: ${prodotto.descrizione}`, textX, textY);
    textY += 14;
    pdf.text(`Prezzo: € ${prodotto.costo.toFixed(2)}`, textX, textY);

    total += prodotto.costo;
    y = Math.max(y + 70, textY + 10);

    pdf.setDrawColor(180);
    pdf.line(20, y, pageWidth - 20, y);
    y += 10;

    if (y > 750) {
      pdf.addPage();
      y = 40;
    }
  }

  // Totale
  pdf.setFont("helvetica", "bold");
  pdf.text(`TOTALE: € ${total.toFixed(2)}`, 20, y + 20);

  // Nota
  pdf.setFont("helvetica", "normal").setFontSize(8);
  const nota = "Ricevuta commerciale, ERCE. Il tuo E-commerce Online";
  pdf.text(nota, (pageWidth - pdf.getTextWidth(nota)) / 2, 500);

  // Salva e pulisci
  pdf.save("ricevuta_erce.pdf");
  svuotaCarrello();
}

// Converti immagine da URL a base64
function convertToBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = function () {
      resolve(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAACklEQVR4nGNgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=="
      );
    };
  });
}
