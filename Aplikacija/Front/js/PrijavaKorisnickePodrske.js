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
          
            
            prijaviKorisnickuPodrsku(username, lozinka);
          });
          
          
          function prijaviKorisnickuPodrsku(username, lozinka) {
            if (!username || !lozinka) {
              alert('Molimo unesite korisničko ime i lozinku.');
              return;
            }
          
            const user = {
              Username: username,
              Password: lozinka
            };
    
            console.log(user);
          
            fetch('http://localhost:5016/KorisnickaPodrska/LogovanjeKorisnickePodrske', {
              method: 'POST',
              body: new URLSearchParams({
                podrskaJson: JSON.stringify(user)
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
                console.log(data.token);
                localStorage.setItem('token', data.token);
                console.log('Korisnik je uspešno prijavljen.');
                window.location.href = './PretragaKorisnika.html'; 
              })
              .catch(error => {
                console.error('Došlo je do greške prilikom prijavljivanja:', error);
                alert(error.message);
              });
          }
        
        function odjaviSe() {
          
          localStorage.removeItem('token');
          
          
          window.location.href = './index.html';
        }
  
  
  