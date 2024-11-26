window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);

    // Provera tipa korisnika
    if (decodedToken.tipNaloga === 'korisnik') {
      // Ostaviti korisnika na stranici
    } else if (decodedToken.tipNaloga === 'korisnickaPodrska') {
      window.location.href = './index.html';
    } else {
      alert('Nepoznat tip korisnika. Molimo kontaktirajte podršku.');
    }
  } else {
    window.location.href = './index.html';
  }
});







function onScanSuccess(decodedText) {

const stopButton = document.getElementById("html5-qrcode-button-camera-stop");
stopButton.dispatchEvent(new Event("click"));


const [vrstaDokumenta, JMBG] = decodedText.split(",");


prikaziPDF(vrstaDokumenta,JMBG);
}

function onScanFailure(error) {


console.warn(`Code scan error = ${error}`);
}

function prikaziPDF(vrstaDokumenta,JMBG) {
  fetch('http://localhost:5016/Dokumenti/' + vrstaDokumenta + 'PDF' + '?JMBG=' + JMBG, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const file = new Blob([blob], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    })
    .catch(error => console.error('Greška:', error));
}

function odjaviSe() {

localStorage.removeItem('token');


window.location.href = './index.html';
}