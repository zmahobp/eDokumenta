window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    
    window.location.href = './index.html';
  } else {
    

  }
});


const form = document.querySelector('#prijavaID');


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const usernameInput = document.querySelector('#usernameInput');
  const lozinkaInput = document.querySelector('#lozinkaInput');
  const username = usernameInput.value;
  const lozinka = lozinkaInput.value;

  console.log('Korisnicko ime:', username);
  console.log('Lozinka:', lozinka);

  
  prijaviKorisnika(username, lozinka);
});


function prijaviKorisnika(username, lozinka) {
  if (!username || !lozinka) {
    alert('Molimo unesite korisničko ime i lozinku.');
    return;
  }

  const user = {
    Username: username,
    Password: lozinka
  };

  fetch('http://localhost:5016/RegularniKorisnik/LogovanjeKorisnika', {
  method: 'POST',
  body: new URLSearchParams({
    korisnikJson: JSON.stringify(user)
  })
})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Neispravan username ili lozinka.");
    }
  })
  .then(data => {
    console.log(data); 

    if (data && data.token) { 
      const token = data.token; 
      localStorage.setItem('token', token);
      console.log('Korisnik je uspešno prijavljen.');
      window.location.href = './Profil.html'; 
    } else {
      throw new Error("Token nije pronađen u odgovoru servera.");
    }
  })
  .catch(error => {
    console.error('Došlo je do greške prilikom prijavljivanja:', error);
    alert(error.message);
  });
}



