//@TODO Redo this localisation.
//@TODO Reimplement locatisation.

const en = {
  location: "Location",
  passphrase: "Passphrase",
  create: "Create Notebook",
  welcome: "Welcome to Txt",
  start: "Let's get started!",
  locationTip: "Txt uses a folder on your computer to save and encrypt your notebook.",
  passphraseTip: "Txt encrypts your notebook with PGP. Choose a strong phrase to best protect your entries.",
  unlock: "Unlock",
  showByDate: "Sort by Date",
  showByName: "Sort by Name",
  closeNotebook: "Close Notebook",
  showFavourites: "Show only 💜",
  rename: "Rename",
  unlockRetry: 'Try Again',
  moveHere: 'Move Here...',
  useLightTheme: 'Use Light Theme',
  emptyPane: 'No note! Click + to add one.'
}
const de = _.defaults({
  location: "Standort",
  passphrase: "Passwort",
  create: "Erstellen Notebook",
  welcome: "Willkommen im Txt",
  start: "Sich aufmachen",
  locationTip: "Txt speichert Ihr Notebook in einen Ordner auf Ihrem Computer.",
  passphraseTip: "Txt verschlüsselt Ihr Notebook mit PGP. Wählen Sie ein sicheres Passwort Ihre Eingaben zu schützen.",
  unlock: "Einloggen",
}, en)

const es = _.defaults({
  location: "Ubicación",
  passphrase: "Contraseña",
  create: "Crear Libreta",
  welcome: "Bienvenido a Txt",
  start: "¡Empecemos!",
  locationTip: "Txt utiliza una carpeta de su ordenador para guardar y cifrar su libreta.",
  passphraseTip: "Txt codifica su libreta con PGP. Elija una fuerte frase para proteger mejor a sus entradas.",
  unlock: "Desbloquear",
  showByDate: "Ordenar por Fecha",
  showByName: "Ordenar por Nombre",
  closeNotebook: "Cerrar Libreta",
  showFavourites: "Mostrar solo 💜",
  rename: "Cambiar nombre",
  unlockRetry: 'Inténtalo de nuevo',
}, en)
