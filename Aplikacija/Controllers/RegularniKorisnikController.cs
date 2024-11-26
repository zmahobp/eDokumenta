namespace Aplikacija.Controllers;
[ApiController]
[Route("[controller]")]
public class RegularniKorisnikController : ControllerBase
{
    public BazaContext Context{get; set;}
    public RegularniKorisnikController(BazaContext context)
    {
        Context=context;
    }

    [HttpPost("RegistrujRegularnogKorisnika")]
    public async Task<ActionResult> RegistrujRegularnogKorisnika(IFormFile slika, [FromForm] string korisnikJson)
    {
        var korisnik = JsonConvert.DeserializeObject<RegularniKorisnik>(korisnikJson); //deserijalizuju se podaci o korisniku
        var user = await Context.RegularniKorisnici.FirstOrDefaultAsync(u=> u.Username==korisnik.Username);
        var support = await Context.ListaKorisnickePodrske.FirstOrDefaultAsync(u=> u.Username==korisnik.Username);
        if(user!=null || support!=null)
            return BadRequest("Korisnik sa ovim username-om vec postoji.");
        //ako korisnik sa ovim username-om postoji onda se vraca BadRequest, u suprotnom se nastavlja dalje
        try
        {
            if (slika != null && slika.Length > 0)
                {
                    var nazivSlike = $"{korisnik.Ime}{korisnik.Prezime}{korisnik.JMBG}{Path.GetExtension(slika.FileName)}"; // ime slike: <Ime><Prezime><JMBG><ekstenzija>
                    var putanjaDoSlike = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"Fotografije", nazivSlike); //kreiranje putanje do slike, cuva se u folderu Fotografije koji je u Root folderu aplikacije

                    using (var stream = new FileStream(putanjaDoSlike, FileMode.Create))
                        {
                            slika.CopyTo(stream);   //cuvanje slike na odgovarajucu putanju
                        }
                    // dodaje se putanja do slike korisniku
                    korisnik.Fotografija = putanjaDoSlike;
                }
            
            korisnik.SluzbenoLice=false;
            //zavrsena logika za dodavanje slike
            korisnik.PostaviHash(korisnik.Password); //ovim se postavlja HashPassword vrednost
            korisnik.GenerisiTajniKljuc(); //ovim se generise tajni kljuc 
            await Context.RegularniKorisnici.AddAsync(korisnik); //dodaje se korisnik u context
            await Context.SaveChangesAsync();
            return Ok("Korisnik je uspesno registrovan.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("LogovanjeKorisnika")]
    public async Task<ActionResult> LogovanjeKorisnika([FromForm] string korisnikJson)
    {
        var korisnik = JsonConvert.DeserializeObject<RegularniKorisnik>(korisnikJson);
        var user = await Context.RegularniKorisnici.FirstOrDefaultAsync(u => u.Username == korisnik.Username);

        if (user != null && user.Autentifikacija(korisnik.Password))
        {
            // Generisanje JWT tokena
            var token = GenerateJwtToken(user,korisnik.Password);

            // Vraćanje tokena kao deo odgovora
            return Ok(new { Token = token });
        }
        else
        {
            return BadRequest("Neispravno korisničko ime ili lozinka.");
        }
    }

    private string GenerateJwtToken(RegularniKorisnik user, string Password)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(user.TajniKljuc);

        var claims = new List<Claim>
        {
            new Claim("userId", user.ID.ToString()),
            new Claim("ime", user.Ime),
            new Claim("imeRoditelja", user.ImeRoditelja),
            new Claim("jmbg", user.JMBG),
            new Claim("prezime", user.Prezime),
            new Claim("username", user.Username),
            new Claim("email", user.Email),
            new Claim("grad", user.Grad),
            new Claim("opstina", user.Opstina),
            new Claim("ulica", user.Ulica),
            new Claim("broj", user.Broj),
            new Claim("telefon", user.Telefon),
            new Claim("datum_rodjenja", user.Datum_rodjenja.ToString("o")),
            new Claim("mesto_Rodjenja", user.Mesto_Rodjenja),
            new Claim("pol", user.Pol.ToString()),
            new Claim("sluzbenoLice",user.SluzbenoLice.ToString()),
            new Claim("tipNaloga","korisnik"),
            new Claim("password",Password)
            
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7), // Postavite vreme isteka tokena prema potrebama
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }


   [HttpPut("IzmeniRegularnogKorisnika")]
    public async Task<ActionResult> IzmeniRegularnogKorisnika(int id, RegularniKorisnik L) 
    {
        var user = await Context.RegularniKorisnici.FindAsync(id);
        if (L == null || user == null || id == 0)
        {
            return BadRequest("Neispravni podaci. (Potrebno je proslediti i ID korisnika).");
        }
        
        try
        {
            // Username, Password i Fotografija korisnika se menjaju iz druge funkcije
            user.Ime = L.Ime;
            user.ImeRoditelja = L.ImeRoditelja;
            user.JMBG = L.JMBG;
            user.Prezime = L.Prezime;
            user.Email = L.Email;
            user.Grad = L.Grad;
            user.Opstina = L.Opstina;
            user.Ulica = L.Ulica;
            user.Broj = L.Broj;
            user.Telefon = L.Telefon;
            user.Datum_rodjenja = L.Datum_rodjenja;
            user.Mesto_Rodjenja = L.Mesto_Rodjenja;
            user.Pol = L.Pol;
            user.Username=L.Username;
            
            Context.RegularniKorisnici.Update(user);
            await Context.SaveChangesAsync();
            
            return Ok(user);      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
}

    [HttpPut("IzmeniSliku")]
    public async Task<ActionResult> IzmeniSliku(int IdKorisnika, IFormFile slika) 
    {
        try
        {
            var user = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            if (slika != null && slika.Length > 0)
                {
                    var nazivSlike = $"{user.Ime}{user.Prezime}{user.JMBG}{Path.GetExtension(slika.FileName)}"; // ime slike: Fotografija<JMBG><ekstenzija>
                    var putanjaDoSlike = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"Fotografije", nazivSlike); //kreiranje putanje do slike, cuva se u folderu Fotografije koji je u Root folderu aplikacije
                    // Provjeri da li postoji prethodni fajl i obriši ga
                    if (System.IO.File.Exists(putanjaDoSlike))
                    {
                        System.IO.File.Delete(putanjaDoSlike);
                    }
                    using (var stream = new FileStream(putanjaDoSlike, FileMode.Create))
                        {
                            slika.CopyTo(stream);   //cuvanje slike na odgovarajucu putanju
                        }
                    // dodaje se putanja do slike korisniku
                    user.Fotografija = putanjaDoSlike;
                }
            //zavrsena logika za izmenu slike
            Context.RegularniKorisnici.Update(user); //Korisnik se azurira
            await Context.SaveChangesAsync();
            return Ok("Korisnicka slika je uspesno azurirana.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniUsername")]
    public async Task<ActionResult> IzmeniUsername(int IdKorisnika, string username) 
    {
        try
        {
            if(string.IsNullOrWhiteSpace(username))
            return BadRequest("Neispravan unos.");
            var postojeci = await Context.RegularniKorisnici.FirstOrDefaultAsync(l=>l.Username==username);
            if(postojeci!=null)
            return BadRequest("Korisnik sa ovim username-om vec postoji.");
            
            var user = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            user.Username=username;
            Context.RegularniKorisnici.Update(user); //Korisnik se azurira
            await Context.SaveChangesAsync();
            return Ok("Korisnicko ime je uspesno azurirano.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniPassword")]
    public async Task<ActionResult> IzmeniPassword(int IdKorisnika, string password) 
    {
        try
        {
            if(string.IsNullOrWhiteSpace(password))
            return BadRequest("Neispravan unos.");
            var user = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            user.PostaviHash(password);
            Context.RegularniKorisnici.Update(user); //Korisnik se azurira
            await Context.SaveChangesAsync();
            return Ok("Korisnicka sifra je uspesno azurirana.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    //string nazivDokumenta vrednosti : "DozvolaZaOruzje", "LicnaKarta", "Pasos", "SaobracajnaDozvola", "VozackaDozvola"
    [HttpGet("ProveriDokument")]
    public async Task<ActionResult> ProveriDokument(int IdKorisnika, string nazivDokumenta)
    {

        var user = await Context.RegularniKorisnici
            .Include(korisnik => korisnik.LicnaKarta)
            .Include(korisnik => korisnik.Pasos)
            .Include(korisnik => korisnik.VozackaDozvola)
            .Include(korisnik => korisnik.SaobracajnaDozvola)
            .Include(korisnik => korisnik.DozvolaZaOruzje)
            .FirstOrDefaultAsync(korisnik => korisnik.ID == IdKorisnika);

        switch (nazivDokumenta)
        {
            case "LicnaKarta":
                return Ok(new { imaLicnuKartu = user.LicnaKarta != null });
            case "Pasos":
                return Ok(new { imaPasos = user.Pasos != null });
            case "DozvolaZaOruzje":
                return Ok(new { imaDozvoluZaOruzje = user.DozvolaZaOruzje != null });
            case "VozackaDozvola":
                return Ok(new { imaVozackuDozvolu = user.VozackaDozvola != null });
            case "SaobracajnaDozvola":
                return Ok(new { imaSaobracajnuDozvolu = user.SaobracajnaDozvola != null });
            default:
                return BadRequest("Neispravno ime klase.");
        }

    }

    [HttpDelete("IzbrisiRegularnogKorisnika")]
    public async Task<ActionResult> IzbrisiRegularnogKorisnika(int IdKorisnika)
    {
        try
        {
            var user = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            Context.RegularniKorisnici.Remove(user);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisan korisnik.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }



}
