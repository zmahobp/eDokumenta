namespace Aplikacija.Controllers;
[ApiController]
[Route("[controller]")]
public class StanicaController : ControllerBase
{
    public BazaContext Context{get; set;}
    public StanicaController(BazaContext context)
    {
        Context=context;
    }

    [HttpPost("DodajStanicu")]
    public async Task<ActionResult> DodajStanicu([FromBody]Stanica S)
    {
        if(S==null)
        return BadRequest("Neispravni podaci");
        bool postoji=false;
        foreach(Stanica st in Context.Stanice)
        {
            if(st.Grad==S.Grad && st.Opstina==S.Opstina)
            {
                postoji=true;
            }
        }
        if(postoji)
        return BadRequest("U ovoj opstini vec postoji stanica.");
        try
        {
            S.Termini= new List<Termin>();
            await Context.Stanice.AddAsync(S);
            await Context.SaveChangesAsync();
            return Ok("Stanica je uspesno dodata.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("ListaStanica")]
    public List<Stanica> ListaStanica()
    {
        List<Stanica>stanice = new List<Stanica>();
        foreach(var s in Context.Stanice)
        {
            stanice.Add(s);
        }
        return stanice;
    }

    [HttpGet("PretraziStanice")]
    public async Task<ActionResult> PretraziStanice(string grad, string opstina)
    {
        try
        {
            var stanica = await Context.Stanice
                                        .Include(stan => stan.Termini)
                                        .ThenInclude(term => term.Korisnik)
                                        .Where(stan => stan.Grad == grad && stan.Opstina == opstina)
                                        .Select(stan => new 
                                        {
                                            ID = stan.ID,
                                            Naziv = stan.Naziv,
                                            BrojTelefona = stan.BrojTelefona,
                                            Grad = stan.Grad,
                                            Opstina = stan.Opstina,
                                            Ulica = stan.Ulica,
                                            Broj = stan.Broj,
                                            Termini = stan.Termini
                                            .Where(term => term.Datum_i_Vreme > DateTime.Now) // Samo termini koji tek treba da se dese
                                            .Select(term => new
                                            {
                                                ID = term.ID,
                                                Datum_i_Vreme = term.Datum_i_Vreme,
                                                IdStanice = stan.ID,
                                                IdKorisnika = term.Korisnik.ID,
                                                Opis = term.Opis,
                                                Status = term.Status
                                            }).OrderByDescending(term => term.Datum_i_Vreme)
                                            .ToList()
                                        })
                                        .FirstOrDefaultAsync();
            if(stanica==null)
            return BadRequest("Stanica nije pronadjena.");
            return Ok(stanica);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}