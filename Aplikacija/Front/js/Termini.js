
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);

    // Provera tipa korisnika
    if (decodedToken.tipNaloga=== 'korisnik') {
      proveraTermina();
    } else {
      // Preusmeri sve druge korisnike na index.html
      window.location.href = './index.html';
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
var imaTermin;
var IdStanice =0;
var StanicaNaziv='';
var StanicaGrad='';
var StanicaOpstina='';
var StanicaUlicaiBroj='';
var StanicaTelefon='';
var StanicaTermini;

function postaviPodatke(stanica)
{
    IdStanice=stanica.id;
    StanicaNaziv=stanica.naziv;
    StanicaGrad=stanica.grad;
    StanicaOpstina=stanica.opstina;
    StanicaUlicaiBroj=stanica.ulica+", "+stanica.broj;
    StanicaTelefon=stanica.brojTelefona;
    StanicaTermini=stanica.termini;
}

function odjaviSe() {
  
  localStorage.removeItem('token');
  
  
  window.location.href = './index.html';
}

function proveraTermina()
{
  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);
  const IdKorisnika = decodedToken.userId;
  fetch('http://localhost:5016/Termini/PrikaziTermin?IdKorisnika=' + IdKorisnika , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        imaTermin=true;
      } else if (response.status === 400) {
        imaTermin=false;
      } else {
        throw new Error('Greška prilikom pribavljanja termina.');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Došlo je do greške prilikom provere termina. Molimo pokušajte ponovo.');
    });
}

function pretrazi()
{
  const grad = document.getElementById('gradselect').value;
  const opstina = document.getElementById('opstinaselect').value;
  proveraTermina();

  fetch('http://localhost:5016/Stanica/PretraziStanice?grad='+grad+'&opstina='+opstina, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 400) {
      alert("Stanica ne postoji"); 
      return null;
    } else {
      throw new Error('Došlo je do greške prilikom izvršavanja zahteva.');
    }
  })
  .then(result => {
    if (result!=null) {
      prikaziStanicu(result);
    }
    else{
      reset();
    }
  })
  .catch(error => {
    console.error(error);
  });
}

function reset()
{
  var TerminiDiv = document.getElementById("terminiDiv");
  TerminiDiv.classList.add("hidden");
  var stanicaInfoDiv = document.getElementById("stanicaInfo");
  stanicaInfoDiv.innerHTML = '';
}

function prikaziStanicu(stanica) {
  postaviPodatke(stanica);
  generateTimetable();
  var stanicaInfoDiv = document.getElementById("stanicaInfo");
  stanicaInfoDiv.innerHTML = '';
  
  var stanicaDiv = document.createElement("div");
  stanicaDiv.classList.add("col-md-12");

  var nazivElement = document.createElement("h3");
  nazivElement.textContent = "Stanica " + StanicaNaziv;

  var gradElement = document.createElement("p");
  gradElement.textContent = "Grad: " + StanicaGrad;

  var opstinaElement = document.createElement("p");
  opstinaElement.textContent = "Opština: " + StanicaOpstina;

  var ulicaElement = document.createElement("p");
  ulicaElement.textContent = "Adresa: " + StanicaUlicaiBroj;

  var telefonElement = document.createElement("p");
  telefonElement.textContent = "Telefon: " + StanicaTelefon;

  
  stanicaDiv.appendChild(nazivElement);
  stanicaDiv.appendChild(gradElement);
  stanicaDiv.appendChild(opstinaElement);
  stanicaDiv.appendChild(ulicaElement);
  stanicaDiv.appendChild(telefonElement);

  
  stanicaInfoDiv.appendChild(stanicaDiv);
}

function updateOpstine() {
  const gradSelect = document.getElementById('gradselect');
  const opstinaSelect = document.getElementById('opstinaselect');
  const dugmePretrazi = document.getElementById('pretrazibutton');
  const grad = gradSelect.value;

  
  if (gradSelect.value !== "") {
      opstinaSelect.disabled = false;
      dugmePretrazi.disabled = false;
  } else {
      dugmePretrazi.disabled = true;
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

function prikaziPopup(praviDatum,cell)
{
  if(uporediVreme(praviDatum))        //ako se desi da je korisnik ulogovan kad prodje neki termin a njemu se to jos uvek nije azuriralo
  {
    
    const podaciDiv = document.getElementById('podaci');
    const praviDatumObjekat = new Date(praviDatum);
    praviDatumObjekat.setHours(praviDatumObjekat.getHours()-2);
    const formatiraniDatum = praviDatumObjekat.toLocaleDateString('en-GB');
    const formatiranoVreme = praviDatumObjekat.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    console.log("PRIKAZI POPUP +" +praviDatum +  formatiraniDatum+formatiranoVreme);
    podaciDiv.innerHTML = `
      <div style="text-align: center;">
        <div class="station-info">
            <h5>${StanicaNaziv}</h5>
            <p><b>Opština:</b> ${StanicaOpstina}</p>
            <p><b>Grad:</b> ${StanicaGrad}</p>
            <p><b>Adresa:</b> ${StanicaUlicaiBroj}</p>
            <p><b>Telefon:</b> ${StanicaTelefon}</p>
        </div>
        <div class="date-info">
            <p><b>Datum:</b> ${formatiraniDatum}</p>
            <p><b>Vreme:</b> ${formatiranoVreme}</p>
        </div>
        <div class="description-info">
            <p><b>Opis termina:</b></p>
            <textarea id="opis" class="form-control" placeholder="Unesite opis..." style="height: 150px;"></textarea>
        </div>
      <div>
    `;

    const potvrdiDugme = document.createElement('button');
    potvrdiDugme.classList.add('btn', 'btn-primary', 'btn-success');
    potvrdiDugme.textContent = 'Potvrdi';
    if(!imaTermin)
    {
      potvrdiDugme.onclick = function() {
        const opis = document.getElementById('opis').value;
        zakaziTermin(opis, praviDatum,cell);
        closeModal();
      };
    }
    else
    {
        potvrdiDugme.onclick = function() {
        alert("Vec imate zakazan termin u toku ove nedelje.");
        closeModal();
      };
    }
    
    const modalFooter = document.querySelector('#popupTermin .modal-footer');
    modalFooter.innerHTML = '';
    modalFooter.appendChild(potvrdiDugme);

    const modal = document.getElementById('popupTermin');
    modal.classList.add('show');
    modal.style.display = 'block';

    const closeModal = function() {
      const modal = document.getElementById('popupTermin');
      modal.classList.remove('show');
      modal.style.display = 'none';
    };
    
    const closeBtn = document.querySelector('#popupTermin .close');
    closeBtn.addEventListener('click', closeModal);
  }
  else{
    alert("Nije moguce izabrati taj termin.");
    cell.innerHTML ='';
    const div2 = document.createElement('div');//opis
    div2.classList.add('font-size13', 'margin-10px-top');
    div2.innerHTML = 'TERMIN <br> ZATVOREN'; 
    zatvoriTermin(cell);
    cell.appendChild(div2);
  }
}

async function zakaziTermin(opis, praviDatum, cell) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = './index.html';
  }
  
    const decodedToken = decodeToken(token);
    const idKorisnika = decodedToken.userId;
    const terminPodaci = new URLSearchParams();
    terminPodaci.append('podaciJson', JSON.stringify({
      IdKorisnika: idKorisnika,
      IdStanice: IdStanice,
      Opis: opis,
      Datum_i_Vreme: praviDatum
    }));

    try {
      const response = await fetch('http://localhost:5016/Termini/ZakaziTermin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      },
      body: terminPodaci.toString()
    });

    if (response.ok) {
      const data = await response.json();  // Obrada odgovora kao JSON
      console.log(data);
      const terminC = data;
      console.log("ZAKAZI TERMIN" + terminC.id + terminC.datum_i_Vreme);
      alert("Vas termin se zakazuje...");
        imaTermin = true;
        izvrsiDugmeOtkazi(cell, terminC);
    } else {
      throw new Error('Greška prilikom zakazivanja termina.');
    }

    } catch (error) {
      console.error(error);
    }
}

function uporediVreme(praviDatum) {
  const terminDate = new Date(praviDatum);
  terminDate.setHours(terminDate.getHours()-2);
  const currentDate = new Date();
  if (terminDate <= currentDate) {
    return false;
  } else {
    return true;
  }
}

const selectGrad = document.getElementById('gradselect'); 
selectGrad.addEventListener('change', (event) => {
  reset();
});

const selectOpstina = document.getElementById('opstinaselect');
selectOpstina.addEventListener('change', (event) => {
  reset();
});

function generateTimetable() {
  const token = localStorage.getItem('token');
  const decodedToken = decodeToken(token);
  const idKorisnika = parseInt(decodedToken.userId,10);
  const startTime = 8; // Početak termina (u satima)
  const endTime = 19; // Kraj termina (u satima)
  const timeSlots = []; // Niz za čuvanje vremenskih termina
  const daysOfWeek = ['NED', 'PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB'];

  const currentDate = new Date(); // Trenutni datum
  const currentDayIndex = currentDate.getDay(); // Indeks trenutnog dana u nedelji

  const firstDayIndex = currentDayIndex; // Indeks prvog dana u nedelji (0 za nedelju, 1 za ponedeljak, ...)
  const updatedDaysOfWeek = daysOfWeek.slice(firstDayIndex).concat(daysOfWeek.slice(0, firstDayIndex));

  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  const headerCells = document.querySelectorAll('th[id^="day-header-"]');
  for (let i = 0; i < 7; i++) {
      const cellDate = new Date();
      cellDate.setDate(currentDate.getDate() + i);
      const dateString = `${cellDate.getDate()}.${cellDate.getMonth() + 1}.${cellDate.getFullYear()}.`;
      headerCells[i].innerHTML = updatedDaysOfWeek[i] + '<br>' + dateString;
  }

  for (let i = 0; i < (endTime - startTime + 1) * 2; i++) {
      const hour = startTime + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const hour24 = hour.toString().padStart(2, '0');
      const timeSlot = hour24 + ':' + minute.toString().padStart(2, '0');
      timeSlots.push(timeSlot);

      const row = document.createElement('tr');
      const timeCell = document.createElement('td');
      timeCell.classList.add('align-middle');
      timeCell.textContent = timeSlot;
      row.appendChild(timeCell);

      for (let j = 0; j < 7; j++) {
          const cellDate = new Date();
          cellDate.setDate(currentDate.getDate() + j % 7);
          const [hours, minutes] = timeSlot.split(':');
          cellDate.setHours(Number(hours));
          cellDate.setMinutes(Number(minutes));
          cellDate.setSeconds(0);
          cellDate.setMilliseconds(0);
          let praviDatum = new Date(cellDate.getTime());
          praviDatum.setHours(praviDatum.getHours() + 2);
          praviDatum=praviDatum.toISOString();

          const cell = document.createElement('td'); //celija
          const div2 = document.createElement('div');//opis
          div2.classList.add('font-size13', 'margin-10px-top');

          //dugme se samo pravi ako vreme termina tek treba da bude i ako nisu SUB I NED
          if(cellDate.getDay()!=6&&cellDate.getDay()!=0)
          {
            if(uporediVreme(praviDatum))
            {
              let imaPodudaranja=false;
              if(StanicaTermini.length!=0)
              {
                for (let i = 0; i < StanicaTermini.length; i++) {
                  const terminC = StanicaTermini[i];
                  const datumCelije = cellDate;
                  const datumTermina = new Date(terminC.datum_i_Vreme);
                  if (datumCelije.getTime() === datumTermina.getTime()) {
                    if (terminC.idKorisnika === idKorisnika) {
                      imaTermin=true;
                      console.log("GENERATE TABLE" + terminC.id);
                      izvrsiDugmeOtkazi(cell,terminC);
                    } else {
                      div2.innerHTML = 'TERMIN <br> REZERVISAN';
                      cell.style.backgroundColor = '#f8f9fa';     
                      cell.style.width = '165px';
                    }
                    imaPodudaranja = true;
                    break;
                  }
                }
              }
              if(!imaPodudaranja)                                     //ako termin nije nadjen u bazi onda se radi dugme zakazi
              {
                defaultnaObrada(cell,praviDatum);
              }

              
              }
            else{
              div2.innerHTML = 'TERMIN <br> ZATVOREN'; 
              zatvoriTermin(cell);
            }
           }
          else{
            div2.innerHTML = '';
            zatvoriTermin(cell);             //ovo je slucaj ako je dan SUB ili NED
          }

          
          cell.appendChild(div2);
          row.appendChild(cell);
      }
      tableBody.appendChild(row);
  }
  var TerminiDiv = document.getElementById("terminiDiv");
  TerminiDiv.classList.remove("hidden");
}

function zatvoriTermin(cell)
{
  cell.style.backgroundColor = '#f8f9fa';     
  cell.style.width = '165px';
}

function defaultnaObrada(cell,praviDatum)
{
  cell.innerHTML = '';
  const div2 = document.createElement('div');//opis
  div2.classList.add('font-size13', 'margin-10px-top');
  const dugme = document.createElement('button');
  dugme.onclick = function() {
      prikaziPopup(praviDatum,cell);
  };
  dugme.classList.add('btn-primary', 'btn');
  dugme.textContent = 'Zakazi';
  div2.textContent = 'DOSTUPAN';
  cell.appendChild(dugme);
  cell.appendChild(div2);
}

function izvrsiDugmeOtkazi(cell, terminC) {
  console.log("izvrsiDugmeOtkazi" + terminC.id + terminC.datum_i_Vreme);
  cell.innerHTML='';
  const div2 = document.createElement('div');//opis
  div2.classList.add('font-size13', 'margin-10px-top');
  const dugme = document.createElement('button');
  dugme.onclick = function() {
    prikaziModal(cell,terminC);
  };
  dugme.classList.add('btn-primary', 'btn', 'btn-danger'); // Dodata klasa "btn-danger"
  dugme.textContent = 'Otkazi';
  div2.textContent = 'REZERVISAN';
  cell.appendChild(dugme);
  cell.appendChild(div2);
}

function prikaziModal(cell,terminC) {
      console.log("Prikazi MODAL" + terminC.id);
      const podaci2Div = document.getElementById('podaci2');
      podaci2Div.innerHTML='';
      const pitanje = document.createElement('p');
      pitanje.textContent = 'Da li ste sigurni da želite da otkažete termin?';
      podaci2Div.appendChild(pitanje);


      const dugmePotvrda = document.createElement('button');
      dugmePotvrda.classList.add('btn', 'btn-primary', 'btn-success');
      dugmePotvrda.textContent = 'Potvrdi';
      dugmePotvrda.onclick = function() {
        otkaziTermin(cell,terminC);
        imaTermin=false;
        closeModal();
      };

      const dugmeOdustani = document.createElement('button');
      dugmeOdustani.classList.add('btn', 'btn-primary', 'btn-danger');
      dugmeOdustani.textContent = 'Odustani';
      dugmeOdustani.onclick = function() {
        closeModal();
      };
      
      const modalFooter = document.querySelector('#popupPotvrdi .modal-footer');
      modalFooter.innerHTML = '';
      modalFooter.appendChild(dugmePotvrda);
      modalFooter.appendChild(dugmeOdustani);
  
      const modal = document.getElementById('popupPotvrdi');
      modal.classList.add('show');
      modal.style.display = 'block';
  
      const closeModal = function() {
        const modal = document.getElementById('popupPotvrdi');
        modal.classList.remove('show');
        modal.style.display = 'none';
      };
      
      const closeBtn = document.querySelector('#popupPotvrdi .close');
      closeBtn.addEventListener('click', closeModal);
  }

  function otkaziTermin(cell, terminC) {//mala

    console.log("OTKAZI TERMIN" + terminC.id + terminC.datum_i_Vreme);
    fetch('http://localhost:5016/Termini/OtkaziTermin?IdTermina=' + terminC.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Greška prilikom slanja zahteva. Status: ' + response.status);
        }

        defaultnaObrada(cell, terminC.datum_i_Vreme);

      })
      .catch((error) => {
        alert('Greška: ' + error);
      });
      
  }
  