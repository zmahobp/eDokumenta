window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);
    fillProfileFields(decodedToken,0);

    // Provera tipa korisnika
    if (decodedToken.tipNaloga === "korisnik") {
      proveriLicnuKartu(0);
      proveriPasos(0);
      proveriVozackuDozvolu(0);
      proveriSaobracajnuDozvolu(0);
      proveriDozvoluZaOruzje(0);
    } else if (decodedToken.tipNaloga === 'korisnickaPodrska') {
      window.location.href = './index.html';
    } else {
    }
  } else {
    window.location.href = './index.html';
  }
});

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.log('Došlo je do greške prilikom parsiranja tokena:', error);
    return null;
  }
}


function fillProfileFields(data,slucaj) {
  if(slucaj===0){
  pribaviTermin(data.userId);
  }

  document.getElementById('imePrezimeFunkcija').textContent = data.ime + ' ' + data.prezime;
  document.getElementById('jmbgFunkcija').textContent = data.jmbg;
  document.getElementById('adresaFunkcija').textContent = data.ulica + ' ' + data.broj;

  document.getElementById('imePrezime').textContent = data.ime + ' ' + data.prezime;
  document.getElementById('imeRoditelja').textContent = data.imeRoditelja;
  document.getElementById('jmbg').textContent = data.jmbg;
  document.getElementById('username').textContent = data.username;
  document.getElementById('email').textContent = data.email;
  document.getElementById('adresa').textContent = data.ulica + ' ' + data.broj;
  document.getElementById('gradOpstina').textContent =  data.grad + ', ' + data.opstina;
  document.getElementById('brojTelefona').textContent = data.telefon;
  document.getElementById('mestoRodjenja').textContent = data.mesto_Rodjenja;
  var datumRodjenja = new Date(data.datum_rodjenja);
  datumRodjenja.setMinutes(datumRodjenja.getMinutes() - datumRodjenja.getTimezoneOffset());
  var opcije = { year: 'numeric', month: 'numeric', day: 'numeric' };
  var formatiraniDatumRodjenja = datumRodjenja.toLocaleDateString('sr-RS', opcije);

  document.getElementById('datumRodjenja').textContent = formatiraniDatumRodjenja;
  document.getElementById('pol').textContent = data.pol;


  var putanjaDoSlike = "../bin/Debug/net7.0/Fotografije/" + data.ime + data.prezime + data.jmbg + ".jpg";
  
  var slikaElement = document.getElementById("profilnaSlika");
  slikaElement.src = putanjaDoSlike;

  
  
}


function odjaviSe() {
  
  localStorage.removeItem('token');
  
  
  window.location.href = './index.html';
}


var selectElement = document.getElementById("danpopupizmeni");


for (var i = 1; i <= 31; i++) {
  
  var option = document.createElement("option");
  option.value = i; 
  option.text = i; 

  
  selectElement.appendChild(option);
}


var selectElement = document.getElementById("godinapopupizmeni");


for (var i = 2023; i >= 1900; i--) {
  
  var option = document.createElement("option");
  option.value = i; 
  option.text = i; 

  
  selectElement.appendChild(option);
}


function sacuvajPodatke() {

  const token = localStorage.getItem('token');
  const decodedToken=decodeToken(token);
  const idKorisnika=decodedToken.userId;

  
  var ime = document.getElementById("imepopupizmeni").value;
  var prezime = document.getElementById("prezimepopupizmeni").value;
  var imeRoditelja = document.getElementById("imeRoditeljapopupizmeni").value;
  var jmbg = document.getElementById("jmbgpopupizmeni").value;
  var email = document.getElementById("emailpopupizmeni").value
  var username = document.getElementById("usernamepopupizmeni").value;
  var adresa = document.getElementById("adresapopupizmeni").value;
  var broj = document.getElementById("brojpopupizmeni").value;
  var grad = document.getElementById("gradselectpopup").value;
  var opstina = document.getElementById("opstinaselectpopup").value;
  var brojTelefona = document.getElementById("brojTelefonapopupizmeni").value;
  const dan = document.querySelector('#danpopupizmeni').value;
  const mesec = document.querySelector('#mesecpopupizmeni').value;
  const godina = document.querySelector('#godinapopupizmeni').value;
  const datumRodjenja = new Date(godina, mesec , dan);
  datumRodjenja.setMinutes(datumRodjenja.getMinutes() - datumRodjenja.getTimezoneOffset());
  const datumRodjenjaString = datumRodjenja.toISOString();
  console.log(datumRodjenja + " " + datumRodjenjaString);
  var mestoRodjenja=document.getElementById("mestoRodjenjapopupizmeni").value;
  const pol=document.getElementById('polpopupizmeni').value;

  
  var podaci = { 
    ime: ime,
    imeRoditelja: imeRoditelja,
    jmbg: jmbg,
    prezime: prezime,
    email: email,
    username: username,
    grad: grad,
    opstina: opstina,
    ulica: adresa,
    broj: broj,
    telefon: brojTelefona,
    datum_rodjenja:datumRodjenjaString,
    mesto_Rodjenja:mestoRodjenja,
    pol:pol
  };

  fetch('http://localhost:5016/RegularniKorisnik/IzmeniRegularnogKorisnika?id='+idKorisnika, { 
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(podaci)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Greška prilikom izmene korisnika.');
    }
  })
  .then(data => {
    fillProfileFields(data,1);
    console.log("OVO SU VRACENI PODACI IZ BAZE IZMENJENI: datum: "+data.datum_rodjenja);
  })
  .catch(error => {
    console.error("Proveri grešku:", error);
    alert('Došlo je do greške. Molimo pokušajte ponovo.');
  });
}



//prolaz 0 - znaci da se prvi put ulazi na stranicu i pozivaju se funkcije za proveru,
//prolaz 1 - znaci da se desilo brisanje dokumenta i potrebno je da se sadrzaj azurira
function proveriLicnuKartu(prolaz) {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var prikaziPDFBtn = document.getElementById('prikaziPDFLicnaKarta');
    var prikaziQRBtn = document.getElementById('prikaziQRLicnaKarta');
    var dodajDokumentBtn = document.getElementById('dodajLicnuKartu');
    var obrisiDokumentBtn = document.getElementById('obrisiLicnaKarta');
    var izmeniDokumentBtn = document.getElementById('izmeniLicnuKartu');

    var dodajDokumentPopupBtn = document.getElementById('dodajLicnuKartuBtn');
    var izmeniDokumentPopupBtn = document.getElementById('izmeniLicnuKartuBtn');

    fetch('http://localhost:5016/RegularniKorisnik/ProveriDokument?IdKorisnika=' + idKorisnika + '&nazivDokumenta=LicnaKarta')
      .then(response => response.json())
      .then(data => {
        
        var imaLicnuKartu = data.imaLicnuKartu;

        if (imaLicnuKartu) {
          
          
          dodajDokumentBtn.style.display = 'none'; 
          prikaziPDFBtn.style.display = 'block'; 
          prikaziQRBtn.style.display = 'block'; 
          obrisiDokumentBtn.style.display = 'block'; 
          izmeniDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("LicnaKarta");
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("LicnaKarta");
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiLicnuKartu();
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniLicnuKartu();
            });
          }

        } else {
          
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajLicnuKartu();
            });
          }
        }
      })
      .catch(error => {
        
        console.error('Greška prilikom provere lične karte:', error);
      });
  } else {
    window.location.href = './index.html';
  }
}

function sacuvajLicnuKartu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var brojLicneKarteInput = document.getElementById("brojLicneKarteInput").value;
    var datumIzdavanjaLicneKarteInput = document.getElementById("datumIzdavanjaLicneKarteInput").value;
    var datumIstekaLicneKarteInput = document.getElementById("datumIstekaLicneKarteInput").value;
    var izdatOdLicnaKartaInput = document.getElementById("izdatOdLicnaKartaInput").value;

    if (brojLicneKarteInput.length === 9 && /^\d+$/.test(brojLicneKarteInput)) {

      fetch('http://localhost:5016/Dokumenti/DodajLicnuKartu?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          brojLicneKarte: brojLicneKarteInput,
          datum_izdavanja: datumIzdavanjaLicneKarteInput,
          datum_isteka: datumIstekaLicneKarteInput,
          izdat_od: izdatOdLicnaKartaInput
        })
      })
        .then(response => {
          if (response.ok) {
            alert('Uspešno dodata lična karta!');
            //location.reload();
          } else {
            alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
            $('#popupLicnaKarta').modal('show');
          }
        })
        .catch(error => {
          console.error("Proveri grešku:", error);
          alert('Došlo je do greške. Molimo pokušajte ponovo.');
        });

    } else {
      alert("Neispravan broj lične karte. Molimo unesite devetocifreni broj.");
      $('#popupLicnaKarta').modal('show');
    }
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}

function izmeniLicnuKartu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var brojLicneKarteInput = document.getElementById("brojLicneKarteInputIzmeni").value;
    var datumIzdavanjaLicneKarteInput = document.getElementById("datumIzdavanjaLicneKarteInputIzmeni").value;
    var datumIstekaLicneKarteInput = document.getElementById("datumIstekaLicneKarteInputIzmeni").value;
    var izdatOdLicnaKartaInput = document.getElementById("izdatOdLicnaKartaInputIzmeni").value;

    
    var izmenjenaLicnaKarta = {
      brojLicneKarte: brojLicneKarteInput,
      datum_izdavanja: datumIzdavanjaLicneKarteInput,
      datum_isteka: datumIstekaLicneKarteInput,
      izdat_od: izdatOdLicnaKartaInput
    };

    
    fetch('http://localhost:5016/Dokumenti/IzmeniLicnuKartu?IdKorisnika=' + idKorisnika, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(izmenjenaLicnaKarta)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena lična karta!');
        //location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        $('#popupLicnaKartaIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}


function obrisiLicnuKartu() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);
    const idKorisnika = decodedToken.userId;

    
    var potvrda = confirm("Da li ste sigurni da želite da izbrišete ličnu kartu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiLicnuKartu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja lične karte. Status: ');
        }
        proveriLicnuKartu(1);
        alert("Uspešno obrisana lična karta!");
        
        
        //location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja lične karte:', error);
      });
    } else {
      
      window.close();
    }
  } else {
    
    console.error('Token not found');
  }
}




function proveriPasos(prolaz) {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var prikaziPDFBtn = document.getElementById('prikaziPDFPasos');
    var prikaziQRBtn = document.getElementById('prikaziQRPasos');
    var dodajDokumentBtn = document.getElementById('dodajPasos');
    var obrisiDokumentBtn = document.getElementById('obrisiPasos');
    var izmeniDokumentBtn = document.getElementById('izmeniPasos');

    var dodajDokumentPopupBtn = document.getElementById('dodajPasosBtn');
    var izmeniDokumentPopupBtn = document.getElementById('izmeniPasosBtn');

    fetch('http://localhost:5016/RegularniKorisnik/ProveriDokument?IdKorisnika=' + idKorisnika + '&nazivDokumenta=Pasos')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        
        var imaPasos = data.imaPasos;

        if (imaPasos) {
          
          
          dodajDokumentBtn.style.display = 'none'; 
          prikaziPDFBtn.style.display = 'block'; 
          prikaziQRBtn.style.display = 'block'; 
          obrisiDokumentBtn.style.display = 'block'; 
          izmeniDokumentBtn.style.display = 'block'; 
          
          if(prolaz===0)
          {
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("Pasos");
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("Pasos");
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiPasos();
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniPasos();
            });
          }

        } else {
          
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajPasos();
            });
          }
        }
      })
      .catch(error => {
        
        console.error('Greška prilikom provere pasoša:', error);
      });
  } else {
    window.location.href = './index.html';
  }
}

function sacuvajPasos() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var brojPasosaInput = document.getElementById("brojPasosaInput").value;
    var datumIzdavanjaPasosaInput = document.getElementById("datumIzdavanjaPasosaInput").value;
    var datumIstekaPasosaInput = document.getElementById("datumIstekaPasosaInput").value;
    var izdatOdPasosaInput = document.getElementById("izdatOdPasosInput").value;

    if (brojPasosaInput.length === 9 && /^\d+$/.test(brojPasosaInput)) {

      
      fetch('http://localhost:5016/Dokumenti/DodajPasos?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
          brojPasosa: brojPasosaInput,
          datum_izdavanja: datumIzdavanjaPasosaInput,
          datum_isteka: datumIstekaPasosaInput,
          izdat_od: izdatOdPasosaInput
        })
      })
      .then(response => {
        if (response.ok) {
          alert('Uspešno dodat pasoš!');
          //location.reload();
        } else {
          alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
          $('#popupPasos').modal('show');
        }
      })
      .catch(error => {
        console.error("Proveri grešku:", error);
        alert('Došlo je do greške. Molimo pokušajte ponovo.');
      });
    } else {
      alert("Neispravan broj pasoša. Molimo unesite devetocifreni broj.");
      $('#popupPasos').modal('show');
    }
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}

function izmeniPasos() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var brojPasosaInput = document.getElementById("brojPasosaInputIzmeni").value;
    var datumIzdavanjaPasosaInput = document.getElementById("datumIzdavanjaPasosaInputIzmeni").value;
    var datumIstekaPasosaInput = document.getElementById("datumIstekaPasosaInputIzmeni").value;
    var izdatOdPasosInput = document.getElementById("izdatOdPasosInputIzmeni").value;

    
    var izmenjenPasos = {
      BrojPasosa: brojPasosaInput,
      Datum_izdavanja: datumIzdavanjaPasosaInput,
      Datum_isteka: datumIstekaPasosaInput,
      izdat_od: izdatOdPasosInput
    };

    
    fetch('http://localhost:5016/Dokumenti/IzmeniPasos?IdKorisnika=' + idKorisnika, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(izmenjenPasos)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjen pasoš!');
        //location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        $('#popupPasosIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}

function obrisiPasos() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var potvrda = confirm("Da li ste sigurni da želite da izbrišete pasoš?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiPasos?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja pasoša. Status: ');
        }
        proveriPasos(1);
        alert("Uspešno obrisan pasoš!");
        
        
        //location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja pasoša:', error);
      });
    } else {
      
      window.close();
    }
  } else {
    
    console.error('Token not found');
  }
}






function proveriVozackuDozvolu(prolaz) {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var prikaziPDFBtn = document.getElementById('prikaziPDFVozacka');
    var prikaziQRBtn = document.getElementById('prikaziQRVozacka');
    var dodajDokumentBtn = document.getElementById('dodajVozacku'); //ovde dodajVozacku umesto dodajVozackubtn
    var obrisiDokumentBtn = document.getElementById('obrisiVozacka');
    var izmeniDokumentBtn = document.getElementById('izmeniVozacku');

    var dodajDokumentPopupBtn = document.getElementById('dodajVozackuBtn');
    var izmeniDokumentPopupBtn = document.getElementById('izmeniVozackuBtn');

    fetch('http://localhost:5016/RegularniKorisnik/ProveriDokument?IdKorisnika=' + idKorisnika + '&nazivDokumenta=VozackaDozvola')
      .then(response => response.json())
      .then(data => {
        
        var imaVozackuDozvolu = data.imaVozackuDozvolu;

        if (imaVozackuDozvolu) {
          
          dodajDokumentBtn.style.display = 'none'; 
          prikaziPDFBtn.style.display = 'block'; 
          prikaziQRBtn.style.display = 'block'; 
          obrisiDokumentBtn.style.display = 'block'; 
          izmeniDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("VozackaDozvola");
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("VozackaDozvola");
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiVozackuDozvolu();
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniVozackuDozvolu();
            });
          }

        } else {
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajVozackuDozvolu();
            });
          }
        }
      })
      .catch(error => {
        console.error('Greška prilikom provere vozačke dozvole:', error);
      });
  } else {
    window.location.href = './index.html';
  }
}

function sacuvajVozackuDozvolu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var brojVozackeDozvoleInput = document.getElementById("brojVozackeDozvoleInput").value;
    var kategorijaVozilaInput = document.getElementById("kategorijaVozilaInput").value;
    var datumIzdavanjaVozackeDozvoleInput = document.getElementById("datumIzdavanjaVozackeDozvoleInput").value;
    var datumIstekaVozackeDozvoleInput = document.getElementById("datumIstekaVozackeDozvoleInput").value;
    var izdatOdVozackeDozvoleInput = document.getElementById("izdatOdVozackaDozvolaInput").value;

    if (brojVozackeDozvoleInput.length === 9 && /^\d+$/.test(brojVozackeDozvoleInput)) {

      fetch('http://localhost:5016/Dokumenti/DodajVozackuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          brojVozackeDozvole: brojVozackeDozvoleInput,
          kategorijeVozila: kategorijaVozilaInput,
          datum_izdavanja: datumIzdavanjaVozackeDozvoleInput,
          datum_isteka: datumIstekaVozackeDozvoleInput,
          izdat_od: izdatOdVozackeDozvoleInput
        })
      })
        .then(response => {
          if (response.ok) {
            alert('Uspešno dodata vozačka dozvola!');
            //location.reload();
          } else {
            alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
            $('#popupVozackaDozvola').modal('show');
          }
        })
        .catch(error => {
          console.error("Proveri grešku:", error);
          alert('Došlo je do greške. Molimo pokušajte ponovo.');
        });
    } else {
      alert("Neispravan broj vozačke dozvole. Molimo unesite devetocifreni broj.");
      $('#popupVozackaDozvola').modal('show');
    }
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}

function izmeniVozackuDozvolu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var brojVozackeDozvoleInput = document.getElementById("brojVozackeDozvoleInputIzmeni").value;
    var datumIzdavanjaVozackeDozvoleInput = document.getElementById("datumIzdavanjaVozackeDozvoleInputIzmeni").value;
    var datumIstekaVozackeDozvoleInput = document.getElementById("datumIstekaVozackeDozvoleInputIzmeni").value;
    var izdatOdVozackaDozvolaInput = document.getElementById("izdatOdVozackaDozvolaInputIzmeni").value;
    var kategorijaVozilaInput = document.getElementById("kategorijaVozilaInputIzmeni").value;

    
    var izmenjenaVozackaDozvola = {
      BrojVozackeDozvole: brojVozackeDozvoleInput,
      Datum_izdavanja: datumIzdavanjaVozackeDozvoleInput,
      Datum_isteka: datumIstekaVozackeDozvoleInput,
      izdat_od: izdatOdVozackaDozvolaInput,
      KategorijeVozila: kategorijaVozilaInput
    };

    
    fetch('http://localhost:5016/Dokumenti/IzmeniVozackuDozvolu?IdKorisnika=' + idKorisnika, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(izmenjenaVozackaDozvola)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena vozačka dozvola!');
        //location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        $('#popupVozackaDozvolaIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}


function obrisiVozackuDozvolu() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var potvrda = confirm("Da li ste sigurni da želite da izbrišete vozačku dozvolu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiVozackuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja vozačke dozvole. Status: ');
        }
        proveriVozackuDozvolu(1);
        alert("Uspešno obrisana vozačka dozvola!");
        
        
        //location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja vozačke dozvole:', error);
      });
    } else {
      
      window.close();
    }
  } else {
    
    console.error('Token not found');
  }
}






function proveriSaobracajnuDozvolu(prolaz) {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var prikaziPDFBtn = document.getElementById('prikaziPDFSaobracajna');
    var prikaziQRBtn = document.getElementById('prikaziQRSaobracajna');
    var dodajDokumentBtn = document.getElementById('dodajSaobracajnu');
    var obrisiDokumentBtn = document.getElementById('obrisiSaobracajna');
    var izmeniDokumentBtn = document.getElementById('izmeniSaobracajnu');

    var dodajDokumentPopupBtn = document.getElementById('dodajSaobracajnuBtn');
    var izmeniDokumentPopupBtn = document.getElementById('izmeniSaobracajnuBtn');

    fetch('http://localhost:5016/RegularniKorisnik/ProveriDokument?IdKorisnika=' + idKorisnika + '&nazivDokumenta=SaobracajnaDozvola')
      .then(response => response.json())
      .then(data => {
        
        var imaSaobracajnuDozvolu = data.imaSaobracajnuDozvolu;

        if (imaSaobracajnuDozvolu) {
          
          
          dodajDokumentBtn.style.display = 'none'; 
          prikaziPDFBtn.style.display = 'block'; 
          prikaziQRBtn.style.display = 'block'; 
          obrisiDokumentBtn.style.display = 'block'; 
          izmeniDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("SaobracajnaDozvola");
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("SaobracajnaDozvola");
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiSaobracajnuDozvolu();
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniSaobracajnuDozvolu();
            });
          }

        } else {
          
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajSaobracajnuDozvolu();
            });
          }
        }
      })
      .catch(error => {
        console.error('Greška prilikom provere saobraćajne dozvole:', error);
      });
  } else {
    window.location.href = './index.html';
  }
}

function sacuvajSaobracajnuDozvolu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var brojSaobracajneDozvoleInput = document.getElementById("brojSaobracajneDozvoleInput").value;
    var brojRegistracijeInput = document.getElementById("brojRegistracijeInput").value;
    var datumPrvogRegistrovanjaInput = document.getElementById("datumPrvogRegistrovanjaInput").value;
    var nosivostInput = document.getElementById("nosivostInput").value;
    var masaInput = document.getElementById("masaInput").value;
    var brojSedistaInput = document.getElementById("brojSedistaInput").value;
    var godinaProizvodnjeInput = document.getElementById("godinaProizvodnjeInput").value;
    var brojMotoraInput = document.getElementById("brojMotoraInput").value;
    var brojSasijeInput = document.getElementById("brojSasijeInput").value;
    var markaInput = document.getElementById("markaInput").value;
    var tipInput = document.getElementById("tipInput").value;
    var datumIzdavanjaSaobracajneDozvoleInput = document.getElementById("datumIzdavanjaSaobracajneDozvoleInput").value;
    var datumIstekaSaobracajneDozvoleInput = document.getElementById("datumIstekaSaobracajneDozvoleInput").value;
    var izdatOdSaobracajnaDozvolaInput = document.getElementById("izdatOdSaobracajnaDozvolaInput").value;

    if (
      brojSaobracajneDozvoleInput.length === 8 &&
      /^[0-9]+$/.test(brojSaobracajneDozvoleInput) &&
      markaInput !== "" &&
      tipInput !== ""
    ) {

      var saobracajnaDozvola = {
        BrojSaobracajneDozvole: brojSaobracajneDozvoleInput,
        BrojRegistracije: brojRegistracijeInput,
        DatumPrvogRegistrovanja: datumPrvogRegistrovanjaInput,
        Nosivost: nosivostInput,
        Masa: masaInput,
        BrojSedista: brojSedistaInput,
        GodinaProizvodnje: godinaProizvodnjeInput,
        BrojMotora: brojMotoraInput,
        BrojSasije: brojSasijeInput,
        Marka: markaInput,
        Tip: tipInput,
        Datum_izdavanja: datumIzdavanjaSaobracajneDozvoleInput,
        Datum_isteka: datumIstekaSaobracajneDozvoleInput,
        Izdat_od: izdatOdSaobracajnaDozvolaInput
      };

      
      fetch('http://localhost:5016/Dokumenti/DodajSaobracajnuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(saobracajnaDozvola)
      })
        .then(response => response.text())
        .then(data => {
        })
        .catch(error => {
          console.error('Greska prilikom slanja zahteva:', error);
          
        });
    } else {
      alert("Unesite ispravne vrednosti za saobraćajnu dozvolu.");
    }
  } else {
    alert("Niste prijavljeni. Molimo prijavite se kako biste dodali saobraćajnu dozvolu.");
  }
}

function izmeniSaobracajnuDozvolu() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var brojSaobracajneDozvoleInput = document.getElementById("brojSaobracajneDozvoleIzmeniInput").value;
    var brojRegistracijeInput = document.getElementById("brojRegistracijeIzmeniInput").value;
    var datumPrvogRegistrovanjaInput = document.getElementById("datumPrvogRegistrovanjaIzmeniInput").value;
    var nosivostInput = document.getElementById("nosivostIzmeniInput").value;
    var masaInput = document.getElementById("masaIzmeniInput").value;
    var brojSedistaInput = document.getElementById("brojSedistaIzmeniInput").value;
    var godinaProizvodnjeInput = document.getElementById("godinaProizvodnjeIzmeniInput").value;
    var brojMotoraInput = document.getElementById("brojMotoraIzmeniInput").value;
    var brojSasijeInput = document.getElementById("brojSasijeIzmeniInput").value;
    var markaInput = document.getElementById("markaIzmeniInput").value;
    var tipInput = document.getElementById("tipIzmeniInput").value;
    var datumIzdavanjaSaobracajneDozvoleInput = document.getElementById("datumIzdavanjaSaobracajneDozvoleIzmeniInput").value;
    var datumIstekaSaobracajneDozvoleInput = document.getElementById("datumIstekaSaobracajneDozvoleIzmeniInput").value;
    var izdatOdSaobracajnaDozvolaInput = document.getElementById("izdatOdSaobracajnaDozvolaIzmeniInput").value;

    
    var izmenjenaSaobracajnaDozvola = {
      BrojSaobracajneDozvole: brojSaobracajneDozvoleInput,
      BrojRegistracije: brojRegistracijeInput,
      DatumPrvogRegistrovanja: datumPrvogRegistrovanjaInput,
      Nosivost: nosivostInput,
      Masa: masaInput,
      BrojSedista: brojSedistaInput,
      GodinaProizvodnje: godinaProizvodnjeInput,
      BrojMotora: brojMotoraInput,
      BrojSasije: brojSasijeInput,
      Marka: markaInput,
      Tip: tipInput,
      Datum_izdavanja: datumIzdavanjaSaobracajneDozvoleInput,
      Datum_isteka: datumIstekaSaobracajneDozvoleInput,
      Izdat_od: izdatOdSaobracajnaDozvolaInput
    };

    
    fetch('http://localhost:5016/Dokumenti/IzmeniSaobracajnuDozvolu?idKorisnika=' + idKorisnika, {
    
    method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(izmenjenaSaobracajnaDozvola)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena saobraćajna dozvola!');
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        $('#popupSaobracajnaDozvolaIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}


function obrisiSaobracajnuDozvolu() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var potvrda = confirm("Da li ste sigurni da želite da izbrišete saobraćajnu dozvolu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiSaobracajnuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja saobraćajne dozvole. Status: ');
        }
        proveriSaobracajnuDozvolu(1);
        alert("Uspešno obrisana saobraćajna dozvola!");
        
        
        //location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja saobraćajne dozvole:', error);
      });
    } else {
      
      window.close();
    }
  } else {
    
    console.error('Token not found');
  }
}





function proveriDozvoluZaOruzje(prolaz) {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var prikaziPDFBtn = document.getElementById('prikaziPDFOruzje');
    var prikaziQRBtn = document.getElementById('prikaziQROruzje');
    var dodajDokumentBtn = document.getElementById('dodajOruzje');
    var obrisiDokumentBtn = document.getElementById('obrisiOruzje');
    var izmeniDokumentBtn = document.getElementById('izmeniOruzje');

    var dodajDokumentPopupBtn = document.getElementById('dodajOruzjeBtn');
    var izmeniDokumentPopupBtn = document.getElementById('izmeniOruzjeBtn');

    fetch('http://localhost:5016/RegularniKorisnik/ProveriDokument?IdKorisnika=' + idKorisnika + '&nazivDokumenta=DozvolaZaOruzje')
      .then(response => response.json())
      .then(data => {
        
        var imaDozvoluZaOruzje = data.imaDozvoluZaOruzje;

        if (imaDozvoluZaOruzje) {
          
          
          dodajDokumentBtn.style.display = 'none'; 
          prikaziPDFBtn.style.display = 'block'; 
          prikaziQRBtn.style.display = 'block'; 
          obrisiDokumentBtn.style.display = 'block'; 
          izmeniDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("DozvolaZaOruzje");
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("DozvolaZaOruzje");
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiDozvoluZaOruzje();
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniDozvoluZaOruzje();
            });
          }

        } else {
          
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 

          if(prolaz===0)
          {
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajDozvoluZaOruzje();
            });
          }
        }
      })
      .catch(error => {
        console.error('Greška prilikom provere dozvole za oružje:', error);
      });
  } else {
    window.location.href = './index.html';
  }
}

function sacuvajDozvoluZaOruzje() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var brojDozvoleZaOruzjeInput = document.getElementById("brojDozvoleZaOruzjeInput").value;
      var vrsteOruzjaInput = document.getElementById("vrsteOruzjaInput").value;
      var kolicinaOruzjaInput = document.getElementById("kolicinaOruzjaInput").value;
      var brojOruzjaPoVrstiInput = document.getElementById("brojOruzjaPoVrstiInput").value;
      var kalibarOruzjaInput = document.getElementById("kalibarOruzjaInput").value;
      var mestoUpotrebeInput = document.getElementById("mestoUpotrebeInput").value;
      var svrhaUpotrebeInput = document.getElementById("svrhaUpotrebeInput").value;
      var datumIzdavanjaDozvoleZaOruzjeInput = document.getElementById("datumIzdavanjaDozvoleZaOruzjeInput").value;
      var datumIstekaDozvoleZaOruzjeInput = document.getElementById("datumIstekaDozvoleZaOruzjeInput").value;
      var izdatOdDozvolaZaOruzjeInput = document.getElementById("izdatOdDozvolaZaOruzjeInput").value;

    if (brojDozvoleZaOruzjeInput !== "" && datumIzdavanjaDozvoleZaOruzjeInput !== "" && datumIstekaDozvoleZaOruzjeInput !== "" && izdatOdDozvolaZaOruzjeInput !== "") {

      var dozvolaZaOruzje = {
        BrojDozvoleZaOruzje: brojDozvoleZaOruzjeInput,
        VrsteOruzja: vrsteOruzjaInput,
        KolicinaOruzja: kolicinaOruzjaInput,
        BrojOruzjaPoVrsti: brojOruzjaPoVrstiInput,
        KalibarOruzja: kalibarOruzjaInput,
        MestoUpotrebe: mestoUpotrebeInput,
        SvrhaUpotrebe: svrhaUpotrebeInput,
        Datum_izdavanja: datumIzdavanjaDozvoleZaOruzjeInput,
        Datum_isteka: datumIstekaDozvoleZaOruzjeInput,
        Izdat_od: izdatOdDozvolaZaOruzjeInput
      };
      
  
      
      
      
      fetch('http://localhost:5016/Dokumenti/DodajDozvoluZaOruzje?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dozvolaZaOruzje)
      })
        .then(response => response.text())
        .then(data => {
          console.log('Uspesno sacuvana dozvola za oruzje:', data);
          //location.reload();
        })
        .catch(error => {
          console.error('Greska prilikom slanja zahteva:', error);
          
        });
    } else {
      alert("Unesite ispravne vrednosti za dozvolu za oružje.");
    }
  } else {
    alert("Niste prijavljeni. Molimo prijavite se kako biste dodali dozvolu za oružje.");
  }
}

function izmeniDozvoluZaOruzje() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    
    var brojDozvoleZaOruzjeInput = document.getElementById("brojDozvoleZaOruzjeInputIzmeni").value;
    var vrsteOruzjaInput = document.getElementById("vrsteOruzjaInputIzmeni").value;
    var kolicinaOruzjaInput = document.getElementById("kolicinaOruzjaInputIzmeni").value;
    var brojOruzjaPoVrstiInput = document.getElementById("brojOruzjaPoVrstiInputIzmeni").value;
    var kalibarOruzjaInput = document.getElementById("kalibarOruzjaInputIzmeni").value;
    var mestoUpotrebeInput = document.getElementById("mestoUpotrebeInputIzmeni").value;
    var svrhaUpotrebeInput = document.getElementById("svrhaUpotrebeInputIzmeni").value;
    var datumIzdavanjaDozvoleZaOruzjeInput = document.getElementById("datumIzdavanjaDozvoleZaOruzjeInputIzmeni").value;
    var datumIstekaDozvoleZaOruzjeInput = document.getElementById("datumIstekaDozvoleZaOruzjeInputIzmeni").value;
    var izdatOdDozvolaZaOruzjeInput = document.getElementById("izdatOdDozvolaZaOruzjeInputIzmeni").value;

    
    var izmenjenaDozvolaZaOruzje = {
      BrojDozvoleZaOruzje: brojDozvoleZaOruzjeInput,
      VrsteOruzja: vrsteOruzjaInput,
      KolicinaOruzja: kolicinaOruzjaInput,
      BrojOruzjaPoVrsti: brojOruzjaPoVrstiInput,
      KalibarOruzja: kalibarOruzjaInput,
      MestoUpotrebe: mestoUpotrebeInput,
      SvrhaUpotrebe: svrhaUpotrebeInput,
      Datum_izdavanja: datumIzdavanjaDozvoleZaOruzjeInput,
      Datum_isteka: datumIstekaDozvoleZaOruzjeInput,
      Izdat_od: izdatOdDozvolaZaOruzjeInput
    };

    
    fetch('http://localhost:5016/Dokumenti/IzmeniDozvoluZaOruzje?idKorisnika=' + idKorisnika, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(izmenjenaDozvolaZaOruzje)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena dozvola za oružje!');
        //location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        $('#popupDozvolaZaOruzjeIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}


function obrisiDozvoluZaOruzje() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    var potvrda = confirm("Da li ste sigurni da želite da izbrišete dozvolu za oružje?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiDozvoluZaOruzje?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja dozvole za oružje. Status: ');
        }
        proveriDozvoluZaOruzje(1);
        alert("Uspešno obrisana dozvola za oružje!");
        
        
        //location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja dozvole za oružje:', error);
      });
    } else {
      
      window.close();
    }
  } else {
    
    console.error('Token not found');
  }
}
        

function updateOpstine() {
  const gradSelect = document.getElementById('gradselectpopup');
  const opstinaSelect = document.getElementById('opstinaselectpopup');
  const grad = gradSelect.value;

  
  if (gradSelect.value !== "") {
      opstinaSelect.disabled = false;
  } else {
      opstinaSelect.disabled = true;
  }
  
  while (opstinaSelect.options.length > 0) {
    opstinaSelect.remove(0);
  }

  if (grad === 'Beograd') {
    dodajOpstinu('Čukarica');
    dodajOpstinu('Novi Beograd');
    dodajOpstinu('Palilula');
    dodajOpstinu('Rakovica');
    dodajOpstinu('Savski venac');
    dodajOpstinu('Stari grad');
    dodajOpstinu('Voždovac');
    dodajOpstinu('Vračar');
    dodajOpstinu('Zemun');
    dodajOpstinu('Zvezdara');
    dodajOpstinu('Barajevo');
    dodajOpstinu('Grocka');
    dodajOpstinu('Lazarevac');
    dodajOpstinu('Mladenovac');
    dodajOpstinu('Obrenovac');
    dodajOpstinu('Sopot');
    dodajOpstinu('Surčin');
  } else if (grad === 'Novi Sad') {
    dodajOpstinu('Novi Sad');
    dodajOpstinu('Futog');
    dodajOpstinu('Veternik');
    dodajOpstinu('Begeč');
    dodajOpstinu('Kisač');
    dodajOpstinu('Rumenka');
    dodajOpstinu('Stepanovićevo');
    dodajOpstinu('Kač');
    dodajOpstinu('Čenej');
    dodajOpstinu('Budisava');
    dodajOpstinu('Kovilj');
  } else if (grad === 'Niš') {
    dodajOpstinu('Medijana');
    dodajOpstinu('Palilula');
    dodajOpstinu('Crveni Krst');
    dodajOpstinu('Pantelej');
    dodajOpstinu('Niška banja');
  } else if (grad === 'Kragujevac') {
    dodajOpstinu('Aerodrom');
    dodajOpstinu('Pivara');
    dodajOpstinu('Stanovo');
    dodajOpstinu('Stari grad');
    dodajOpstinu('Stragari');
  } else if (grad === 'Subotica' || grad === 'Pančevo' || grad === 'Novi Pazar' || grad === 'Čačak' || grad === 'Kruševac' || grad === 'Zrenjanin' || grad === 'Smederevo') {
    dodajOpstinu(grad);
  }

  function dodajOpstinu(opstina) {
    const option = document.createElement('option');
    option.text = opstina;
    option.value = opstina
    opstinaSelect.add(option);
  }
}




function popuniPopup() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    
    
    const ime = decodedToken.ime || '';
    const prezime = decodedToken.prezime || '';
    const imeRoditelja = decodedToken.imeRoditelja || '';
    const jmbg = decodedToken.jmbg || '';
    const email = decodedToken.email || '';
    const username = decodedToken.username || '';
    const adresa = decodedToken.ulica + ' ' ;
    const broj= decodedToken.broj || '';
    const brojTelefona = decodedToken.telefon || '';
    
    const mestoRodjenja = decodedToken.mesto_Rodjenja || '';
    const pol = decodedToken.pol || '';
    
    
    document.getElementById('imepopupizmeni').value = ime;
    document.getElementById('prezimepopupizmeni').value = prezime;
    document.getElementById('imeRoditeljapopupizmeni').value = imeRoditelja;
    document.getElementById('jmbgpopupizmeni').value = jmbg;
    document.getElementById('usernamepopupizmeni').value = username;
    document.getElementById('emailpopupizmeni').value = email;
    document.getElementById('adresapopupizmeni').value = adresa;
    document.getElementById('brojpopupizmeni').value = broj;
    document.getElementById('brojTelefonapopupizmeni').value = brojTelefona;
    document.getElementById('mestoRodjenjapopupizmeni').value = mestoRodjenja;
    document.getElementById('polpopupizmeni').value = pol;
    
    
  }
}

function izmeniSliku() 
{
  const slikaInput = document.getElementById('fotografijaInputIzmeni');
  const slika = slikaInput.files[0];
  if(slika !=null)
  {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = decodeToken(token);
      const idKorisnika = decodedToken.userId;

      const formData = new FormData();
      formData.append('slika', slika);

      console.log(formData);

      fetch('http://localhost:5016/RegularniKorisnik/IzmeniSliku?IdKorisnika=' + idKorisnika, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          return response.text(); 
        } else {
          throw new Error('Greška prilikom ažuriranja korisničke slike. Molimo pokušajte ponovo.');
        }
      })
      .then(data => {
        alert('Korisnička slika je uspešno ažurirana.');
        //location.reload();
      })
      .catch(error => {
        console.error("Proveri grešku:", error);
        alert('Došlo je do greške. Molimo pokušajte ponovo.');
      });
    } else {
      alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
    }
  }
  else{
  alert("Morate da izaberete sliku.");
  }
}

function pribaviTermin(IdKorisnika) {
  fetch('http://localhost:5016/Termini/PrikaziTermin?IdKorisnika=' + IdKorisnika , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        return null;
      } else {
        throw new Error('Greška prilikom pribavljanja termina.');
      }
    })
    .then(termin => {
      if (termin) {
        const div = document.getElementById('termini');
        const terminElement = document.createElement('div');
        var datumTermina = new Date(termin.datum_i_Vreme);
        var opcije = { year: 'numeric', month: 'numeric', day: 'numeric' };
        var formatiranoVreme = datumTermina.getHours().toString().padStart(2, '0') + ':' + datumTermina.getMinutes().toString().padStart(2, '0');
        var formatiraniDatum = datumTermina.toLocaleDateString('sr-RS', opcije);
        terminElement.classList.add('termin');
        terminElement.innerHTML = `
          <p><b>Stanica:</b> ${termin.nazivStanice}</p>
          <p><b>Lokacija:</b> ${termin.gradOpstina}</p>
          <p><b>Adresa:</b> ${termin.ulicaBroj}</p>
          <p><b>Datum:</b> ${formatiraniDatum}</p>
          <p><b>Vreme:</b> ${formatiranoVreme}</p>
          <p><b>Status:</b> ${termin.status}</p>
          <p><b>Opis:</b> ${termin.opis}</p>
        `;
        div.appendChild(terminElement);
      }
      else{
        console.log(IdKorisnika);
      }
    })
    .catch(error => {
      console.error(error);
      alert('Došlo je do greške prilikom pribavljanja termina. Molimo pokušajte ponovo.');
    });
}

function sacuvajNovuLozinku() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;

    console.log(idKorisnika);
    console.log(decodedToken);
    
    var staraLozinka = document.getElementById("staraLozinkaInput").value;
    var novaLozinka = document.getElementById("novaLozinkaInput").value;
    var potvrdaNoveLozinke = document.getElementById("potvrdaNoveLozinkeInput").value;

    
    if (staraLozinka !== decodedToken.password) {
      alert("Uneta stara lozinka nije ispravna.");
      return;
    }

    
    if (novaLozinka !== potvrdaNoveLozinke) {
      alert("Nova lozinka i potvrda nove lozinke se ne poklapaju.");
      return;
    }

    
    fetch('http://localhost:5016/RegularniKorisnik/IzmeniPassword?IdKorisnika=' + idKorisnika + '&password=' + novaLozinka, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      if (response.ok) {
        alert('Korisnička šifra je uspešno ažurirana.');
      } else {
        alert('Greška prilikom ažuriranja korisničke šifre. Molimo pokušajte ponovo.');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert('Nemate pristup ili vaš token je istekao. Molimo prijavite se ponovo.');
  }
}

function prikaziPDF(vrstaDokumenta) {
  const token = localStorage.getItem('token');
  const vrsta=vrstaDokumenta;
  if (token) {
    const decodedToken = decodeToken(token);
    const JMBG = decodedToken.jmbg;

    fetch('http://localhost:5016/Dokumenti/' + vrsta + 'PDF' + '?JMBG=' + JMBG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        var newTab = window.open(fileUrl, '_blank');
        
        newTab.document.title = "eDokumenta";

        var link = newTab.document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = 'assets/favicon.ico';
        newTab.document.head.appendChild(link);
      })
      .catch(error => console.error('Greška:', error));
  } else {
    window.location.href = './index.html';
  }
}

function prikaziQRKod(vrstaDokumenta) {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;
  fetch('http://localhost:5016/Dokumenti/' +vrstaDokumenta+ 'QR' + '?IdKorisnika=' + idKorisnika, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => response.blob())
    .then(blob => {
      
      const fileURL = window.URL.createObjectURL(blob);
      
      
      const qrCodeImg = document.createElement('img');
      qrCodeImg.src = fileURL;

      
      const qrCodeContainer = document.getElementById('qrCodeImage');
      qrCodeContainer.innerHTML = '';
      qrCodeContainer.appendChild(qrCodeImg);
      
      
      $('#popupQRKod').modal('show');
    })
    .catch(error => console.error('Greška:', error));
  } else{
    
    window.location.href = './index.html';
  }
}