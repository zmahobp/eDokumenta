window.addEventListener('DOMContentLoaded', () => {

  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = decodeToken(token);


    const tipNaloga = decodedToken.tipNaloga;

    if (tipNaloga==='korisnickaPodrska') {

      console.log(tipNaloga);

    } else {
      window.location.href = './index.html';
    }
  } else {

    window.location.href = './index.html';
  }
});


var pretraziBtn = document.getElementById('pretraziBtn');
pretraziBtn.addEventListener('click', function() {
        pretraziPoJMBG();
});

document.getElementById("izmeniSlikuBtn").addEventListener("click", function() {
  var jmbg = document.getElementById("pretragaInput").value;
  izmeniSliku(jmbg);
});

document.getElementById("confirmUpgradeBtn").addEventListener("click", function() {
  var jmbg = document.getElementById("pretragaInput").value;
  upgradeKorisnika(jmbg);
});

document.getElementById("confirmRemoveBtn").addEventListener("click", function() {
  var jmbg = document.getElementById("pretragaInput").value;
  degradeKorisnika(jmbg);
});


document.getElementById('pretragaInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    pretraziPoJMBG();
  }
});

function proveriSluzbenoLice(jmbg) {
  console.log(jmbg);
  console.log("Proveravam" + jmbg);
  fetch('http://localhost:5016/KorisnickaPodrska/ProveriSluzbenoLice?jmbg=' + jmbg)
    .then(response => response.json())
    .then(data => {
      if (data) {
        
        document.getElementById('unaprediBtn').style.display = 'none';
        document.getElementById('unazadiBtn').style.display = 'block';
      } else {
        
        document.getElementById('unaprediBtn').style.display = 'block';
        document.getElementById('unazadiBtn').style.display = 'none';
      }
    })
    .catch(error => {
      console.error("Provera dugmica: " + error);
      
    });
}


async function upgradeKorisnika(jmbg) {
  try {
    const response = await fetch('http://localhost:5016/KorisnickaPodrska/PostaviSluzbenoLice?jmbg=' + jmbg, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Korisnik je uspešno postavljen kao službeno lice.');
      location.reload();
    } else {
      alert('Greška prilikom postavljanja korisnika kao službeno lice. Molimo pokušajte ponovo.');
    }
  } catch (error) {
    console.error("Proveri grešku:", error);
    alert('Došlo je do greške. Molimo pokušajte ponovo.');
  }
}

async function degradeKorisnika(jmbg) {
  try {
    const response = await fetch('http://localhost:5016/KorisnickaPodrska/UkloniSluzbenoLice?jmbg=' + jmbg, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Status službenog lica je uspešno uklonjen.');
      location.reload();
    } else {
      alert('Greška prilikom uklanjanja statusa službenog lica. Molimo pokušajte ponovo.');
    }
  } catch (error) {
    console.error("Proveri grešku:", error);
    alert('Došlo je do greške. Molimo pokušajte ponovo.');
  }
}


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

function pretraziPoJMBG() {
  var jmbg = document.getElementById('pretragaInput').value;
  console.log(jmbg);

  fetch('http://localhost:5016/KorisnickaPodrska/PretraziPoJMBG?JMBG=' + jmbg)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      document.getElementById('prvi').style.display = 'block';
      document.getElementById('drugi').style.display = 'block';
      document.getElementById('treci').style.display = 'block';       
      document.getElementById('cetvrti').style.display = 'block'; 

      var PotvrdiIzmeneBtn = document.getElementById('PotvrdiIzmeneBtn');
      PotvrdiIzmeneBtn.addEventListener("click", function(){
        sacuvajPodatke(data.id);
      })

      proveriLicnuKartu(data.id,data.jmbg);
      proveriPasos(data.id,data.jmbg);
      proveriVozackuDozvolu(data.id,data.jmbg);
      proveriSaobracajnuDozvolu(data.id,data.jmbg);
      proveriDozvoluZaOruzje(data.id,data.jmbg);
      proveriSluzbenoLice(data.jmbg);
      pribaviTermin(data.id);

      document.getElementById('imepopupizmeni').value = data.ime;
      document.getElementById('prezimepopupizmeni').value = data.prezime;
      document.getElementById('imeRoditeljapopupizmeni').value = data.imeRoditelja;
      document.getElementById('jmbgpopupizmeni').value = data.jmbg;
      document.getElementById('usernamepopupizmeni').value = data.username;
      document.getElementById('emailpopupizmeni').value = data.email;
      document.getElementById('adresapopupizmeni').value = data.ulica;
      document.getElementById('brojpopupizmeni').value = data.broj;
      document.getElementById('brojTelefonapopupizmeni').value = data.telefon;
      document.getElementById('mestoRodjenjapopupizmeni').value = data.mesto_Rodjenja;
      document.getElementById('polpopupizmeni').value = data.pol;
      



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
      document.getElementById('mestorodjenja').textContent = data.mesto_Rodjenja;
      var datumRodjenja = new Date(data.datum_rodjenja);
      var opcije = { year: 'numeric', month: 'numeric', day: 'numeric' };
      var formatiraniDatumRodjenja = datumRodjenja.toLocaleDateString('sr-RS', opcije);

      document.getElementById('datumrodjenja').textContent = formatiraniDatumRodjenja;
      document.getElementById('pol').textContent = data.pol;
    
      var putanjaDoSlike = "../bin/Debug/net7.0/Fotografije/" + data.ime + data.prezime + data.jmbg + ".jpg";
      var slikaElement = document.getElementById("profilnaSlika");
      slikaElement.src = putanjaDoSlike;
    })
    .catch(error => {
      alert("Korisnik ne postoji");
      console.error('Došlo je do greške prilikom pretrage po JMBG-u:', error);
    });
}


function proveriLicnuKartu(idKorisnika,JMBG) {
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

          prikaziPDFBtn.addEventListener('click', function () {
            prikaziPDF("LicnaKarta",JMBG);
          });

          prikaziQRBtn.addEventListener('click', function () {
            prikaziQRKod("LicnaKarta",idKorisnika);
          });

          obrisiDokumentBtn.addEventListener('click', function () {
            obrisiLicnuKartu(idKorisnika);
          });

          izmeniDokumentPopupBtn.addEventListener('click', function () {
            izmeniLicnuKartu(idKorisnika);
          });

        } else {
          
          
          prikaziPDFBtn.style.display = 'none'; 
          prikaziQRBtn.style.display = 'none'; 
          obrisiDokumentBtn.style.display = 'none'; 
          izmeniDokumentBtn.style.display = 'none'; 
          dodajDokumentBtn.style.display = 'block'; 
          

          dodajDokumentPopupBtn.addEventListener('click', function () {
            sacuvajLicnuKartu(idKorisnika);
          });
          
          
        }
      })
      .catch(error => {
        
        console.error('Greška prilikom provere lične karte:', error);
      });
}
function sacuvajLicnuKartu(idKorisnika) {
  console.log(idKorisnika);
    var brojLicneKarteInput = document.getElementById("brojLicneKarteInput").value;
    var datumIzdavanjaLicneKarteInput = document.getElementById("datumIzdavanjaLicneKarteInput").value;
    var datumIstekaLicneKarteInput = document.getElementById("datumIstekaLicneKarteInput").value;
    var izdatOdLicnaKartaInput = document.getElementById("izdatOdLicnaKartaInput").value;

    if (brojLicneKarteInput.length === 9 && /^\d+$/.test(brojLicneKarteInput)) {

      fetch('http://localhost:5016/Dokumenti/DodajLicnuKartu?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
            location.reload();
          } else {
            alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
            //$('#popupLicnaKarta').modal('show');
          }
        })
        .catch(error => {
          console.error("Proveri grešku:", error);
          alert('Došlo je do greške. Molimo pokušajte ponovo.');
        });

    } else {
      alert("Neispravan broj lične karte. Molimo unesite devetocifreni broj.");
      //$('#popupLicnaKarta').modal('show');
    }
} 
function izmeniLicnuKartu(idKorisnika) {
    console.log(idKorisnika);
    
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

    console.log(izmenjenaLicnaKarta);
    console.log(idKorisnika);
    
    fetch('http://localhost:5016/Dokumenti/IzmeniLicnuKartu?IdKorisnika=' + idKorisnika, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(izmenjenaLicnaKarta)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena lična karta!');
      } else { 
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        //$('#popupLicnaKartaIzmeni').modal('show'); 
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
} 
function obrisiLicnuKartu(idKorisnika) {
    
    var potvrda = confirm("Da li ste sigurni da želite da izbrišete ličnu kartu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiLicnuKartu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja lične karte. Status: ' + response.status);
        }
        console.log(response.statusText + " Uspešno obrisana lična karta!"); 
        alert("Uspešno obrisana lična karta!");
        
        
        location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja lične karte:', error);
      });
    } else {
      
      window.close();
    }
} 



function proveriPasos(idKorisnika,JMBG) {
      
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
  
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("Pasos",JMBG);
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("Pasos",idKorisnika);
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiPasos(idKorisnika);
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniPasos(idKorisnika);
            });
  
          } else {
            
            
            prikaziPDFBtn.style.display = 'none'; 
            prikaziQRBtn.style.display = 'none'; 
            obrisiDokumentBtn.style.display = 'none'; 
            izmeniDokumentBtn.style.display = 'none'; 
            dodajDokumentBtn.style.display = 'block'; 
  
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajPasos(idKorisnika);
            });
          }
        })
        .catch(error => {
          
          console.error('Greška prilikom provere pasoša:', error);
        });
} 
function sacuvajPasos(idKorisnika){
    var brojPasosaInput = document.getElementById("brojPasosaInput").value;
    var datumIzdavanjaPasosaInput = document.getElementById("datumIzdavanjaPasosaInput").value;
    var datumIstekaPasosaInput = document.getElementById("datumIstekaPasosaInput").value;
    var izdatOdPasosaInput = document.getElementById("izdatOdPasosInput").value;

    if (brojPasosaInput.length === 9 && /^\d+$/.test(brojPasosaInput)) {
      
      
      fetch('http://localhost:5016/Dokumenti/DodajPasos?IdKorisnika=' + idKorisnika, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
          //$('#popupPasos').modal('show');
        }
      })
      .catch(error => {
        console.error("Proveri grešku:", error);
        alert('Došlo je do greške. Molimo pokušajte ponovo.');
      });
    } else {
      alert("Neispravan broj pasoša. Molimo unesite devetocifreni broj.");
      //$('#popupPasos').modal('show');
    }
}
function izmeniPasos(idKorisnika){
      
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(izmenjenPasos)
      })
      .then(response => {
        if (response.ok) {
          alert('Uspešno izmenjen pasoš!');
        } else {
          alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
          //$('#popupPasosIzmeni').modal('show');
        }
      })
      .catch(error => {
        console.error("Proveri grešku:", error);
        alert('Došlo je do greške. Molimo pokušajte ponovo.');
      });
}
function obrisiPasos(idKorisnika){
  
  var potvrda = confirm("Da li ste sigurni da želite da izbrišete pasoš?");

  if (potvrda) {
    fetch('http://localhost:5016/Dokumenti/IzbrisiPasos?IdKorisnika=' + idKorisnika, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška prilikom brisanja pasoša. Status: ' + response.status);
      }
      console.log(response.statusText + " Uspešno obrisan pasoš!"); 
      alert("Uspešno obrisan pasoš!");
      
      
      location.reload();
    })
    .catch(error => {
      console.error('Greška prilikom brisanja pasoša:', error);
    });
  } else {
    
    window.close();
  }
}



function proveriVozackuDozvolu(idKorisnika,JMBG) {
      
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
  
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("VozackaDozvola",JMBG);
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("VozackaDozvola",idKorisnika);
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiVozackuDozvolu(idKorisnika);
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniVozackuDozvolu(idKorisnika);
            });
  
          } else {
            
            
            prikaziPDFBtn.style.display = 'none'; 
            prikaziQRBtn.style.display = 'none'; 
            obrisiDokumentBtn.style.display = 'none'; 
            izmeniDokumentBtn.style.display = 'none'; 
            dodajDokumentBtn.style.display = 'block'; 
  
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajVozackuDozvolu(idKorisnika);
            });
          }
        })
        .catch(error => {
          console.error('Greška prilikom provere vozačke dozvole:', error);
        });
}
function sacuvajVozackuDozvolu(idKorisnika) {
  var brojVozackeDozvoleInput = document.getElementById("brojVozackeDozvoleInput").value;
  var kategorijaVozilaInput = document.getElementById("kategorijaVozilaInput").value;
  var datumIzdavanjaVozackeDozvoleInput = document.getElementById("datumIzdavanjaVozackeDozvoleInput").value;
  var datumIstekaVozackeDozvoleInput = document.getElementById("datumIstekaVozackeDozvoleInput").value;
  var izdatOdVozackeDozvoleInput = document.getElementById("izdatOdVozackaDozvolaInput").value;

  
  if (brojVozackeDozvoleInput.length !== 9 || !/^\d+$/.test(brojVozackeDozvoleInput)) {
    alert("Neispravan broj vozačke dozvole. Molimo unesite devetocifreni broj.");
    return;
  }

  fetch('http://localhost:5016/Dokumenti/DodajVozackuDozvolu?IdKorisnika=' + idKorisnika, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
        location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        //$('#popupVozackaDozvola').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
      return;
    });
}
function izmeniVozackuDozvolu(idKorisnika){

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
  },
  body: JSON.stringify(izmenjenaVozackaDozvola)
})
.then(response => {
  if (response.ok) {
    alert('Uspešno izmenjena vozačka dozvola!');
  } else {
    alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
  //$('#popupVozackaDozvolaIzmeni').modal('show');
  }
})
.catch(error => {
  console.error("Proveri grešku:", error);
  alert('Došlo je do greške. Molimo pokušajte ponovo.');
});
}
function obrisiVozackuDozvolu(idKorisnika){
  var potvrda = confirm("Da li ste sigurni da želite da izbrišete vozačku dozvolu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiVozackuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja vozačke dozvole. Status: ' + response.status);
        }
        console.log(response.statusText + " Uspešno obrisana vozačka dozvola!"); 
        alert("Uspešno obrisana vozačka dozvola!");
        
        
        location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja vozačke dozvole:', error);
      });
    } else {
      
      window.close();
    }
}



function proveriSaobracajnuDozvolu(idKorisnika,JMBG) {
console.log(idKorisnika,JMBG);
  
      
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
  
            prikaziPDFBtn.addEventListener('click', function () {
              prikaziPDF("SaobracajnaDozvola",JMBG);
            });

            prikaziQRBtn.addEventListener('click', function () {
              prikaziQRKod("SaobracajnaDozvola",idKorisnika);
            });

            obrisiDokumentBtn.addEventListener('click', function () {
              obrisiSaobracajnuDozvolu(idKorisnika);
            });

            izmeniDokumentPopupBtn.addEventListener('click', function () {
              izmeniSaobracajnuDozvolu(idKorisnika);
            });
  
          } else {
            
            
            prikaziPDFBtn.style.display = 'none'; 
            prikaziQRBtn.style.display = 'none'; 
            obrisiDokumentBtn.style.display = 'none'; 
            izmeniDokumentBtn.style.display = 'none'; 
            dodajDokumentBtn.style.display = 'block'; 
            
            dodajDokumentPopupBtn.addEventListener('click', function () {
              sacuvajSaobracajnuDozvolu(idKorisnika);
            });
          }
        })
        .catch(error => {
          console.error('Greška prilikom provere saobraćajne dozvole:', error);
        });
}
function sacuvajSaobracajnuDozvolu(idKorisnika) {
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
      izdat_od: izdatOdSaobracajnaDozvolaInput
    };
  

  
    fetch('http://localhost:5016/Dokumenti/DodajSaobracajnuDozvolu?IdKorisnika=' + idKorisnika, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saobracajnaDozvola)
    })
      .then(response => response.text())
      .then(data => {
        alert('Saobraćajna dozvola uspešno sačuvana!');
        window.location.reload();
      })
      .catch(error => {
        alert('Došlo je do greške prilikom čuvanja saobraćajne dozvole. Molimo pokušajte ponovo.');
        
      });
  }
  else
  {
    alert("Unesite ispravne vrednosti za saobraćajnu dozvolu.");
    return;
  }
}
function izmeniSaobracajnuDozvolu(idKorisnika) {
  
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

  
  if (
    brojSaobracajneDozvoleInput === "" ||
    brojRegistracijeInput === "" ||
    datumPrvogRegistrovanjaInput === "" ||
    nosivostInput === "" ||
    masaInput === "" ||
    brojSedistaInput === "" ||
    godinaProizvodnjeInput === "" ||
    brojMotoraInput === "" ||
    brojSasijeInput === "" ||
    markaInput === "" ||
    tipInput === "" ||
    datumIzdavanjaSaobracajneDozvoleInput === "" ||
    datumIstekaSaobracajneDozvoleInput === "" ||
    izdatOdSaobracajnaDozvolaInput === ""
  ) {
    alert("Molimo popunite sva polja.");
    return;
  }

  
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
    izdat_od: izdatOdSaobracajnaDozvolaInput
  };

  
  fetch('http://localhost:5016/Dokumenti/IzmeniSaobracajnuDozvolu?idKorisnika=' + idKorisnika, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(izmenjenaSaobracajnaDozvola)
  })
    .then(response => {
      if (response.ok) {
        alert('Uspešno izmenjena saobraćajna dozvola!');
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        //$('#popupSaobracajnaDozvolaIzmeni').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
}
function obrisiSaobracajnuDozvolu(idKorisnika){
  var potvrda = confirm("Da li ste sigurni da želite da izbrišete saobraćajnu dozvolu?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiSaobracajnuDozvolu?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja saobraćajne dozvole. Status: ' + response.status);
        }
        console.log(response.statusText + " Uspešno obrisana saobraćajna dozvola!"); 
        alert("Uspešno obrisana saobraćajna dozvola!");
        
        
        location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja saobraćajne dozvole:', error);
      });
    } else {
      
      window.close();
    }
}



function proveriDozvoluZaOruzje(idKorisnika,JMBG) {

      
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

        prikaziPDFBtn.addEventListener('click', function () {
          prikaziPDF("DozvolaZaOruzje",JMBG);
        });

        prikaziQRBtn.addEventListener('click', function () {
          prikaziQRKod("DozvolaZaOruzje",idKorisnika);
        });

        obrisiDokumentBtn.addEventListener('click', function () {
          obrisiDozvoluZaOruzje(idKorisnika);
        });

        izmeniDokumentPopupBtn.addEventListener('click', function () {
          izmeniDozvoluZaOruzje(idKorisnika);
        });

      } else {
        
        
        prikaziPDFBtn.style.display = 'none'; 
        prikaziQRBtn.style.display = 'none'; 
        obrisiDokumentBtn.style.display = 'none'; 
        izmeniDokumentBtn.style.display = 'none'; 
        dodajDokumentBtn.style.display = 'block'; 

        dodajDokumentPopupBtn.addEventListener('click', function () {
          sacuvajDozvoluZaOruzje(idKorisnika);
        });
      }
    })
    .catch(error => {
      console.error('Greška prilikom provere dozvole za oružje:', error);
    });
} 
function sacuvajDozvoluZaOruzje(idKorisnika) {
  var brojDozvoleZaOruzjeInput = document.getElementById("brojDozvoleZaOruzjeInput").value;
  var vrsteOruzjaInput = document.getElementById("vrsteOruzjaInput").value;
  var kolicinaOruzjaInput = document.getElementById("kolicinaOruzjaInput").value;
  var brojOruzjaPoVrstiInput = document.getElementById("brojOruzjaPoVrstiInput").value;
  var kalibarOruzjaInput = document.getElementById("kalibarOruzjaInput").value;
  var mestoUpotrebeInput = document.getElementById("mestoUpotrebeInput").value;
  var svrhaUpotrebeInput = document.getElementById("svrhaUpotrebeInput").value;
  var datumIzdavanjaInput = document.getElementById("datumIzdavanjaDozvoleZaOruzjeInput").value;
  var datumIstekaInput = document.getElementById("datumIstekaDozvoleZaOruzjeInput").value;
  var izdatOdInput = document.getElementById("izdatOdDozvolaZaOruzjeInput").value;


  if (brojDozvoleZaOruzjeInput !== "" && vrsteOruzjaInput !== "" && kolicinaOruzjaInput !== "" && brojOruzjaPoVrstiInput !== "" && kalibarOruzjaInput !== "" && mestoUpotrebeInput !== "" && svrhaUpotrebeInput !== "") {

    var dozvolaZaOruzje = {
      brojDozvoleZaOruzje: brojDozvoleZaOruzjeInput,
      vrsteOruzja: vrsteOruzjaInput,
      kolicinaOruzja: kolicinaOruzjaInput,
      brojOruzjaPoVrsti: brojOruzjaPoVrstiInput,
      kalibarOruzja: kalibarOruzjaInput,
      mestoUpotrebe: mestoUpotrebeInput,
      svrhaUpotrebe: svrhaUpotrebeInput,
      datum_izdavanja: datumIzdavanjaInput, 
      datum_isteka: datumIstekaInput, 
      izdat_od: izdatOdInput
    };
    

    console.log(dozvolaZaOruzje);
    
    fetch('http://localhost:5016/Dokumenti/DodajDozvoluZaOruzje?IdKorisnika=' + idKorisnika, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dozvolaZaOruzje)
    })
    .then(response => {
      if (response.ok) {
        alert('Uspešno dodata dozvola za oružje!');
        location.reload();
      } else {
        alert('Greška prilikom slanja podataka na server. Molimo pokušajte ponovo.');
        //$('#popupDozvolaZaOruzje').modal('show');
      }
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
  } else {
    alert("Greška pri unosu podataka. Molimo pokušajte ponovo");
    return;
  }
}
function izmeniDozvoluZaOruzje(idKorisnika) {
  
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

  
  if (
    brojDozvoleZaOruzjeInput === "" ||
    vrsteOruzjaInput === "" ||
    kolicinaOruzjaInput === "" ||
    brojOruzjaPoVrstiInput === "" ||
    kalibarOruzjaInput === "" ||
    mestoUpotrebeInput === "" ||
    svrhaUpotrebeInput === "" ||
    datumIzdavanjaDozvoleZaOruzjeInput === "" ||
    datumIstekaDozvoleZaOruzjeInput === "" ||
    izdatOdDozvolaZaOruzjeInput === ""
  ) {
    alert("Molimo popunite sva polja.");
    return;
  }

  
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(izmenjenaDozvolaZaOruzje)
  })
    .then(response => response.text())
    .then(data => {
      alert('Uspešno izmenjena dozvola za oružje!');
    })
    .catch(error => {
      console.error("Proveri grešku:", error);
      alert('Došlo je do greške. Molimo pokušajte ponovo.');
    });
}
function obrisiDozvoluZaOruzje(idKorisnika){
  var potvrda = confirm("Da li ste sigurni da želite da izbrišete dozvolu za oružje?");

    if (potvrda) {
      fetch('http://localhost:5016/Dokumenti/IzbrisiDozvoluZaOruzje?IdKorisnika=' + idKorisnika, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Greška prilikom brisanja dozvole za oružje. Status: ' + response.status);
        }
        console.log(response.statusText + " Uspešno obrisana dozvola za oružje!"); 
        alert("Uspešno obrisana dozvola za oružje!");
        
        
        location.reload();
      })
      .catch(error => {
        console.error('Greška prilikom brisanja dozvole za oružje:', error);
      });
    } else {
      
      window.close();
    }
}


function izmeniSliku(jmbg) {
  const slikaInput = document.getElementById('fotografijaInputIzmeni');
  const slika = slikaInput.files[0];
  if(slika!=null)
  {
    const formData = new FormData();
    formData.append('slika', slika);

    console.log(formData);

    fetch('http://localhost:5016/KorisnickaPodrska/IzmeniSliku?jmbg=' + jmbg, {
      method: 'PUT',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.text(); // Parse the response body as text
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
  }
  else{
    alert("Morate odabrati sliku.");
  }
}

function odjaviSe() {
  
  localStorage.removeItem('token');
  
  
  window.location.href = './index.html';
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

function prikaziQRKod(vrstaDokumenta,idKorisnika) {
  const qrCodeContainer = document.getElementById('qrCodeImage');
  qrCodeContainer.innerHTML = '';
  fetch('http://localhost:5016/Dokumenti/' +vrstaDokumenta+ 'QR' + '?IdKorisnika=' + idKorisnika, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.blob())
    .then(blob => {
      
      const fileURL = window.URL.createObjectURL(blob);
      
      
      const qrCodeImg = document.createElement('img');
      qrCodeImg.src = fileURL;

      
      
      qrCodeContainer.appendChild(qrCodeImg);
      
      
      $('#popupQRKod').modal('show');
    })
    .catch(error => console.error('Greška:', error));
} 

function pribaviTermin(IdKorisnika) {
  const izmeniTerminDugme = document.getElementById("izmeniTerminDugme");

  fetch('http://localhost:5016/Termini/PrikaziTermin?IdKorisnika=' + IdKorisnika , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
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
        izmeniTerminDugme.addEventListener("click", function() {
          izmeniTerminPopup(termin);
        });

        const div = document.getElementById('termin');
        div.innerHTML='';
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
      }
    })
    .catch(error => {
      console.error(error);
      alert('Došlo je do greške prilikom pribavljanja termina. Molimo pokušajte ponovo.');
    });
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

function sacuvajPodatke(idKorisnika) {

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
      'Content-Type': 'application/json'
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
    window.location.reload();
  })
  .catch(error => {
    console.error("Proveri grešku:", error);
    alert('Došlo je do greške. Molimo pokušajte ponovo.');
  });
}


function izmeniTerminPopup(termin)
{

  document.getElementById("statusTerminaInputIzmeni").value=termin.status;
  document.getElementById("opisTerminaIzmeni").value=termin.opis;
  const izmeniTerminPopupBtn = document.getElementById("izmeniTerminPopupBtn");
  izmeniTerminPopupBtn.addEventListener("click",function(){
    IzmeniTermin(termin);
  })
}

function IzmeniTermin(termin)
{
  const status = document.getElementById("statusTerminaInputIzmeni").value;
  const opis = document.getElementById("opisTerminaIzmeni").value;
  var izmenjeni_termin= {
    Id: termin.id,
    Opis: opis,
    Status: status
  }
    fetch('http://localhost:5016/Termini/IzmeniTermin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(izmenjeni_termin)
    })
    .then(response => {
      if (response.ok) {
        alert("Uspesno izmenjen termin.");
        return response.text();
      } else {
        
        throw new Error('Došlo je do greške prilikom izmene termina.');
      }
    })
    .then(data => {
      pribaviTermin(termin.idkorisnika);
    })
    .catch(error => {
      alert("Doslo je do greske.");
    });

}

                                        