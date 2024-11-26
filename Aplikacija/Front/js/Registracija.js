
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (token) {
    
    window.location.href = './index.html';
  } else {
  }
});

      
        const registracijaBtn = document.querySelector('#registracijaBtn');
        console.log(registracijaBtn);
        registracijaBtn.addEventListener('click', function () {
          registrujRegularnogKorisnika();
        });


        function registrujRegularnogKorisnika() {
        const jmbg = document.querySelector('#jmbginput').value;
        const ime = document.querySelector('#imeinput').value;
        const imeRoditelja = document.querySelector('#imeroditeljainput').value;
        const prezime = document.querySelector('#prezimeinput').value;
        const username = document.querySelector('#usernameinput').value;
        const email = document.querySelector('#emailinput').value;
        const lozinka = document.querySelector('#lozinkainput').value;
        const lozinkaPotvrda = document.querySelector('#potvrdilozinkuinput').value;
      
        if (lozinka !== lozinkaPotvrda) {
          alert('Lozinke se ne poklapaju.');
          return;
        }
      
        const grad = document.querySelector('#gradselect').value;
        const opstina = document.querySelector('#opstinaselect').value;
        const ulica = document.querySelector('#ulicainput').value;
        const broj = document.querySelector('#brojinput').value;
        const dan = document.querySelector('#dan').value;
        const mesec = document.querySelector('#mesec').value;
        const godina = document.querySelector('#godina').value;
        const brojTelefona = document.querySelector('#telefoninput').value;
        const mestoRodjenja = document.querySelector('#mestorodjenjainput').value;
        const pol = document.querySelector('#polinput').value;
      
        const datumRodjenja = new Date(godina, mesec , dan);
        datumRodjenja.setMinutes(datumRodjenja.getMinutes() - datumRodjenja.getTimezoneOffset());
        const datumRodjenjaString = datumRodjenja.toISOString();
      
        const slikaInput = document.querySelector('#slikainput');
        const slika = slikaInput.files[0]; 
      
        const korisnikJson = {
          ime: ime,
          imeRoditelja: imeRoditelja,
          jmbg: jmbg,
          prezime: prezime,
          username: username,
          email: email,
          password: lozinka,
          grad: grad,
          opstina: opstina,
          ulica: ulica,
          broj: broj,
          telefon: brojTelefona,
          datum_rodjenja: datumRodjenjaString,
          mesto_rodjenja: mestoRodjenja,
          pol: pol
        };
      
        
        const formData = new FormData();
        formData.append('slika', slika);
        formData.append('korisnikJson', JSON.stringify(korisnikJson));
      
        console.log(korisnikJson);
        console.log(slika);
        console.log(formData);
      
        fetch('http://localhost:5016/RegularniKorisnik/RegistrujRegularnogKorisnika', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Došlo je do greške prilikom slanja zahteva.');
            }
          })
          .then(data => {
            
            alert('Uspešno ste se registrovali!');
          })
          .catch(error => {
            console.log('Došlo je do greške prilikom slanja zahteva:', error);
            console.log(formData);
          });
      }

      function updateOpstine() {
        const gradSelect = document.getElementById('gradselect');
        const opstinaSelect = document.getElementById('opstinaselect');
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


      
      var startYear = 1920;
      var godinaSelect = document.getElementById("godina");
      var yearOptions = generateYearOptions(startYear);
      godinaSelect.innerHTML += yearOptions;
      function generateYearOptions(startYear) {
        var currentYear = new Date().getFullYear();
        var yearOptions = '';

        for (var year = currentYear; year >= startYear; year--) {
          yearOptions += '<option value="' + year + '">' + year + '</option>';
        }

        return yearOptions;
      }


      
      var danSelect = document.getElementById("dan");
      for (var dan = 1; dan <= 31; dan++) {
        var option = document.createElement("option");
        option.value = dan;
        option.text = dan;
        danSelect.appendChild(option);
      }
  
      





