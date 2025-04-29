//gestione script index

//funzione che gestisce il 'bottone' occhio
function gestionePassword() {
  let input = document.getElementById("psw");
  let eyeClosed = document.getElementById("chiuso");
  let eyeOpen = document.getElementById("aperto");

  input.type = input.type === "password" ? "text" : "password";

  //modifica immagine occhio
  if (input.type === "text") {
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  } else {
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  }
}

//controllo sulla data-> Valido solo per registrati
function registrati() {
  let nome = document.getElementById("nome");
  let cognome = document.getElementById("cognome");
  let password = document.getElementById("psw");
  let mail = document.getElementById("mail");
  let error = document.getElementById("error-message");
  let emailRegex = /@.*\./;

  // Controllo che tutti i campi siano pieni
  if (
    nome.value === "" ||
    cognome.value === "" ||
    password.value === "" ||
    mail.value === ""
  ) {
    error.style.display = "block";
    error.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> Attenzione, devi compilare tutti i campi!';
  } else if (password.value.length < 5) {
    error.style.display = "block";
    error.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> La password deve essere lunga almeno 5 caratteri.';
  } else if (!emailRegex.test(mail.value)) {
    error.style.display = "block";
    error.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> La mail inserita non è valida';
  } else {
    error.innerHTML = " ";
    error.style.display = "block";
    window.open("shop.html", "_self");
  }
}

function log() {
  let mail = document.getElementById("email");
  let password = document.getElementById("psw");
  let er = document.getElementById("error-message");

  console.log("dentro");

  // Reset del messaggio di errore
  er.style.display = "none";
  er.innerHTML = "";

  // Verifica che i campi siano compilati
  if (mail.value === "" || password.value === "") {
    er.style.display = "block";
    er.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation"></i> Attenzione, devi compilare tutti i campi!';
    return;
  }

  //TODO INSERIRE CONTROLLO SU MAIL E PSW PRIMA DEL CARICAMENTO JSON

  // Carica il file JSON (per la pagina index)
  fetch("assets/js/accedi.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nell'importazione del file JSON.");
      }
      return response.json();
    })
    .then((data) => {
      // Verifica se l'email esiste nel JSON
      const user = data.users.find((user) => user.email === mail.value);

      // Se l'utente non esiste nel JSON
      if (!user) {
        er.style.display = "block";
        er.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation"></i> Email non trovata.';
        return;
      }

      console.log("STO ENTRANDO.");
      // Verifica la password
      if (user.password !== password.value) {
        er.style.display = "block";
        er.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation"></i> Password errata.';
        return;
      }

      // Se email e password sono corretti
      er.style.display = "none";
      window.open("pages/shop.html", "_self");
      // Puoi aggiungere ulteriori azioni come il redirect qui, ad esempio:
      // window.location.href = "paginaSuccesso.html";
    })
    .catch((error) => {
      console.error("Errore nel recupero del file JSON:", error);
    });
}
