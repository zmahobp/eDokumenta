/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', () => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    


    const token = localStorage.getItem('token');
  
    if (token) {
      const decodedToken = parseJwt(token);
      const sluzbenoLice = decodedToken.sluzbenoLice;
      const tipNaloga = decodedToken.tipNaloga;
      if (tipNaloga === 'korisnik') {
        
        if (sluzbenoLice === 'True') {
          // Regularni korisnik sa atributom sluzbenoLice=true
          prikaziElemente('.samoPrijavljeni, .samoSluzbenaLica');
        } else {
          // Običan regularni korisnik
          prikaziElemente('.samoPrijavljeni');
        }
      } else if (tipNaloga === 'korisnickaPodrska') {
        // Korisnička podrška
        prikaziElemente('.samoPodrska');
      }
    } else {
      // Neprijavljeni korisnik
      prikaziElemente('.samoNeprijavljeni');
    }

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

  
    function prikaziElemente(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'block';
      });
    }

    function parseJwt(token) {
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
  
});


