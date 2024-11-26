namespace Aplikacija.Controllers;
[ApiController]
[Route("[controller]")]
public class KorisnickaPodrskaController : ControllerBase
{
    public BazaContext Context{get; set;}
    public KorisnickaPodrskaController(BazaContext context)
    {
        Context=context;
    }

    [HttpPost("KreirajKorisnickuPodrsku")]
    public async Task<ActionResult> KreirajKorisnickuPodrsku([FromForm] string podrskaJson)
    {
        try
        {
        var podrska = JsonConvert.DeserializeObject<KorisnickaPodrska>(podrskaJson); //deserijalizuju se podaci o kor podrsci
        var support = await Context.ListaKorisnickePodrske.FirstOrDefaultAsync(u=> u.Username==podrska.Username);
        var user = await Context.RegularniKorisnici.FirstOrDefaultAsync(u=>u.Username==podrska.Username);
        if(support!=null || user !=null)
            return BadRequest("Korisnik sa ovim username-om vec postoji.");
        //ako korisnik sa ovim username-om postoji onda se vraca BadRequest, u suprotnom se nastavlja dalje
        
            podrska.PostaviPodrsku();
            podrska.PostaviHash(); //ovim se postavlja HashPassword vrednost
            podrska.GenerisiTajniKljuc(); //ovim se generise tajni kljuc 
            await Context.ListaKorisnickePodrske.AddAsync(podrska); //dodaje se korisnik u context
            await Context.SaveChangesAsync();
            return Ok("Nalog korisnicke podrske je uspesno registrovan.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpDelete("IzbrisiKorisnickuPodrsku")]
    public async Task<ActionResult> IzbrisiKorisnickuPodrsku(int Idpodrske)
    {
        try
        {
            var podrska = await Context.ListaKorisnickePodrske.FindAsync(Idpodrske);
            Context.ListaKorisnickePodrske.Remove(podrska);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisan nalog korisnicke podrske.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("LogovanjeKorisnickePodrske")]
    public async Task<ActionResult> LogovanjeKorisnickePodrske([FromForm] string podrskaJson )
    {
        var podrska = JsonConvert.DeserializeObject<KorisnickaPodrska>(podrskaJson);
        var user = await Context.ListaKorisnickePodrske.FirstOrDefaultAsync(u => u.Username == podrska.Username);

        Console.WriteLine("podrskaJson: " + podrskaJson);
        Console.WriteLine("podrska: " + podrska);
        Console.WriteLine("user: " + user);

        if (user != null && user.Autentifikacija(podrska.Password))
        {
            // Generisanje JWT tokena
            var token = GenerateJwtToken(user);

            // Vraćanje tokena kao deo odgovora
            return Ok(new { Token = token });
        }
        else
        {
        var errorResponse = new
        {
            Message = "Neispravno korisničko ime ili lozinka.",
            PodrskaJson = podrskaJson,
            User = user
        };

        // Vraćanje BadRequest sa dodatnim podacima
        return BadRequest(errorResponse);
    }
    }

    private string GenerateJwtToken(KorisnickaPodrska user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(user.TajniKljuc);

        var claims = new List<Claim>
        {
            new Claim("tipNaloga", "korisnickaPodrska"),
            new Claim("userId", user.ID.ToString()),
            new Claim("ime", user.Ime),
            new Claim("prezime", user.Prezime),
            new Claim("username", user.Username),
            new Claim("email", user.Email)
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

    [HttpGet("ProveriSluzbenoLice")]
    public async Task<ActionResult<bool>> ProveriSluzbenoLice(string jmbg)
    {
        try
        {
            var korisnik = await Context.RegularniKorisnici.FirstOrDefaultAsync(u => u.JMBG == jmbg);

            if (korisnik != null && korisnik.SluzbenoLice)
            {
                return true; // Korisnik je sluzbeno lice
            }

            return false; // Korisnik nije sluzbeno lice ili nije pronađen
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("PostaviSluzbenoLice")]
    public async Task<ActionResult> PostaviSluzbenoLice(string jmbg)
    {
        try
        {
            var user = await Context.RegularniKorisnici.FirstOrDefaultAsync(u => u.JMBG == jmbg);
            
            if (user == null)
            {
                return NotFound("Korisnik sa datim JMBG-om nije pronađen.");
            }

            if (user.SluzbenoLice)
            {
                return BadRequest("Korisnik je postavljen kao službeno lice.");
            }
            
            user.PostaviSluzbenoLice();
            Context.RegularniKorisnici.Update(user);
            await Context.SaveChangesAsync();
            
            return Ok("Uspešno postavljeno službeno lice.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UkloniSluzbenoLice")]
    public async Task<ActionResult> UkloniSluzbenoLice(string jmbg)
    {
        try
        {
            var korisnik = await Context.RegularniKorisnici.FirstOrDefaultAsync(u => u.JMBG == jmbg);

            if (korisnik == null)
            {
                return NotFound("Korisnik sa datim JMBG-om nije pronađen.");
            }

            if (!korisnik.SluzbenoLice)
            {
                return BadRequest("Korisnik nije postavljen kao službeno lice.");
            }

            korisnik.UkloniSluzbenoLice();
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();

            return Ok("Uspešno uklonjen status sluzbenog lica.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PretraziPoJMBG")]
    public async Task<ActionResult>PretraziPoJMBG(string JMBG)
    {
        try
        {
            var user = await Context.RegularniKorisnici
                                    .Include(korisnik => korisnik.LicnaKarta)
                                    .Include(korisnik => korisnik.Pasos)
                                    .Include(korisnik => korisnik.VozackaDozvola)
                                    .Include(korisnik => korisnik.SaobracajnaDozvola)
                                    .Include(korisnik => korisnik.DozvolaZaOruzje)
                                    .Include(korisnik => korisnik.Termini)
                                    .FirstOrDefaultAsync(korisnik => korisnik.JMBG == JMBG);
            if(user!=null)
            {
                user.TajniKljuc="";//ovde se ovo ostavlja prazno da se ne bi slao tajni kljuc na front
                user.HashPassword="";//ovde takodje, ovo je privatni podatak
                return Ok(user);
            }
            else{
                return BadRequest("Korisnik sa ovim JMBG-om ne postoji u bazi.");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniSliku")]
    public async Task<ActionResult> IzmeniSliku(string JMBG, IFormFile slika) 
    {
        try
        {
            var user = await Context.RegularniKorisnici.FirstOrDefaultAsync(x => x.JMBG == JMBG);
            if (user == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            if (slika != null && slika.Length > 0)
            {
                var nazivSlike = $"{user.Ime}{user.Prezime}{user.JMBG}{Path.GetExtension(slika.FileName)}"; // ime slike: <Ime><Prezime><JMBG><ekstenzija>
                var putanjaDoSlike = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Fotografije", nazivSlike); // kreiranje putanje do slike, cuva se u folderu Fotografije koji je u Root folderu aplikacije

                // Proveri da li postoji prethodni fajl i obriši ga
                if (System.IO.File.Exists(putanjaDoSlike))
                {
                    System.IO.File.Delete(putanjaDoSlike);
                }

                using (var stream = new FileStream(putanjaDoSlike, FileMode.Create))
                {
                    slika.CopyTo(stream);   // cuvanje slike na odgovarajucu putanju
                }

                // dodaje se putanja do slike korisniku
                user.Fotografija = putanjaDoSlike;
            }

            // zavrsena logika za izmenu slike
            Context.RegularniKorisnici.Update(user); // Korisnik se azurira
            await Context.SaveChangesAsync();

            return Ok("Korisnička slika je uspešno ažurirana.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

