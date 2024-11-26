namespace Aplikacija.Controllers;
[ApiController]
[Route("[controller]")]
public class TerminiController : ControllerBase
{
    public BazaContext Context{get; set;}
    public TerminiController(BazaContext context)
    {
        Context=context;
    }


    [HttpGet("PrikaziTermin")]
    public async Task<ActionResult> PrikaziTermin(int IdKorisnika)
    {     
        try
        {   
        var korisnik = await Context.RegularniKorisnici
                            .Include(k => k.Termini)
                            .ThenInclude(t=>t.Stanica)
                            .Where(k => k.ID == IdKorisnika)
                            .Select(k => new
                            {
                                NajskorijiTermin = k.Termini
                                    .OrderByDescending(t => t.Datum_i_Vreme)
                                    .Select(t => new
                                    {
                                        ID = t.ID,
                                        idkorisnika=IdKorisnika,
                                        Datum_i_Vreme = t.Datum_i_Vreme,
                                        NazivStanice = t.Stanica.Naziv,
                                        GradOpstina = t.Stanica.Grad + ", " + t.Stanica.Opstina,
                                        UlicaBroj = t.Stanica.Ulica + ", " + t.Stanica.Broj,
                                        Opis = t.Opis,
                                        Status = t.Status
                                    })
                                    .FirstOrDefault()
                            })
                            .FirstOrDefaultAsync();
                
        if(korisnik==null)
        {
        return BadRequest("Nije pronadjen korisnik.");
        }
            if(korisnik.NajskorijiTermin.Datum_i_Vreme>DateTime.Now)
            {
                
                return Ok(korisnik.NajskorijiTermin);
            }
            else
            return BadRequest();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("ZakaziTermin")]
    public async Task<ActionResult> ZakaziTermin([FromForm]string podaciJson) //podaciJson { IdKorisnika, IdStanice, Opis, Datum_i_Vreme}
    {
        try
        {
            var termin = JsonConvert.DeserializeObject<TerminData>(podaciJson); 
        
            if(termin==null)
            return BadRequest("Neispravni podaci.");

            var korisnik = await Context.RegularniKorisnici.FindAsync(termin.IdKorisnika);
            var stanica = await Context.Stanice.FindAsync(termin.IdStanice);
            
            if(korisnik==null || stanica==null)
            return BadRequest("Stanica ili korisnik ne postoje u bazi.");

            Termin t = new Termin{
                Datum_i_Vreme=termin.Datum_i_Vreme,
                Stanica=stanica,
                Korisnik=korisnik,
                Opis=termin.Opis,
                Status="zakazan" //kad se termin doda on je zakazan jer se dodaje samo pri zakazivanju
            };

            await Context.Termini.AddAsync(t);
            await Context.SaveChangesAsync();
            var vrati_termin= new {
                                    id = t.ID,
                                    datum_i_Vreme = t.Datum_i_Vreme,
                                    idStanice = t.Stanica.ID,
                                    idKorisnika = t.Korisnik.ID,
                                    opis = t.Opis,
                                    status = t.Status
            };
            return Ok(vrati_termin);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("OtkaziTermin")]
    public async Task<ActionResult> OtkaziTermin(int IdTermina)
    {
        try
        {
            var termin = await Context.Termini.FindAsync(IdTermina); 
            if(termin==null)
            return BadRequest("Neispravni podaci.");

            Context.Termini.Remove(termin);
            await Context.SaveChangesAsync();
            return Ok("Termin je uspesno otkazan.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniTermin")]
    public async Task<ActionResult> IzmeniTermin([FromForm]string podaciJson) 
    {
        try
        {
            var terminJson = JsonConvert.DeserializeObject<Termin>(podaciJson); 
            var termin = await Context.Termini.FindAsync(terminJson.ID);
        
            if(termin==null||terminJson==null)
            return BadRequest("Neispravni podaci.");

            termin.Opis=terminJson.Opis;
            termin.Status=terminJson.Status;
            
            Context.Termini.Update(termin);
            await Context.SaveChangesAsync();
            return Ok("Termin je uspesno izmenjen.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    public class TerminData
    {
        public int IdKorisnika { get; set; }
        public int IdStanice { get; set; }
        public DateTime Datum_i_Vreme { get; set; }
        public string Opis { get; set; }
    }
}