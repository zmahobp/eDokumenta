

namespace Aplikacija.Controllers;
[ApiController]
[Route("[controller]")]
public class DokumentiController : ControllerBase
{
    public BazaContext Context{get; set;}
    public DokumentiController(BazaContext context)
    {
        Context=context;
    }
    
    ///////////////////////////////////////////LICNA KARTA//////////////////////////////////////////////////////////////////////////////////////
    [HttpGet("PrikaziLicnuKartu")]
    public async Task<ActionResult> PrikaziLicnuKartu(int IdKorisnika)
    {        
        var licna = await Context.LicneKarte
                                 .Where(l => l.IdKorisnika==IdKorisnika)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + licne karte
                                    BrojLicneKarte=l.BrojLicneKarte,
                                    Datum_izdavanja=l.Datum_izdavanja,
                                    Datum_isteka=l.Datum_isteka,
                                    izdat_od=l.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.Korisnik.JMBG,
                                    Ime=l.Korisnik.Ime,
                                    ImeRoditelja=l.Korisnik.ImeRoditelja,
                                    Prezime=l.Korisnik.Prezime,
                                    Grad=l.Korisnik.Grad,
                                    Opstina=l.Korisnik.Opstina,
                                    Ulica=l.Korisnik.Ulica,
                                    Broj=l.Korisnik.Broj,
                                    Datum_rodjenja=l.Korisnik.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Korisnik.Mesto_Rodjenja,
                                    Pol=l.Korisnik.Pol,
                                    Fotografija=l.Korisnik.Fotografija,
                                    QR_kod=l.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                             
        if(licna==null)
        return BadRequest("Nije pronadjena licna karta za ovog korisnika.");
        try
        {
            
            return Ok(licna);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniLicnuKartu")]
    public async Task<ActionResult> IzmeniLicnuKartu(int IdKorisnika, LicnaKarta L) 
    {
        var licna = await Context.LicneKarte.FirstOrDefaultAsync(l=>l.IdKorisnika==IdKorisnika);

        if(L==null || licna==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            licna.BrojLicneKarte=L.BrojLicneKarte;
            licna.Datum_izdavanja=L.Datum_izdavanja;
            licna.Datum_isteka=L.Datum_isteka;
            licna.izdat_od=L.izdat_od;

            Context.LicneKarte.Update(licna);
            await Context.SaveChangesAsync();
            return Ok("Uspesno izmenjena licna karta.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajLicnuKartu")]
    public async Task<ActionResult> DodajLicnuKartu(int IdKorisnika,[FromBody]LicnaKarta L)
    {                                                                       
        if(L!=null)
        {
            try
            {
                var korisnik = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
                
                L.Naziv="LicnaKarta";
                L.QR_kod=$"{L.Naziv},{korisnik.JMBG}";//format podataka koji se embeduju u qr kod
                L.Korisnik=korisnik;
                korisnik.LicnaKarta=L;
                await Context.LicneKarte.AddAsync(L);
                Context.RegularniKorisnici.Update(korisnik);
                await Context.SaveChangesAsync();
                return Ok("Uspesno dodata licna karta.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }

    [HttpDelete("IzbrisiLicnuKartu")]
    public async Task<ActionResult> IzbrisiLicnuKartu(int IdKorisnika)
    {
        var korisnik = await Context.RegularniKorisnici.Include(l=>l.LicnaKarta).FirstOrDefaultAsync(l=> l.ID==IdKorisnika);
        if(IdKorisnika==0 || korisnik==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            Context.LicneKarte.Remove(korisnik.LicnaKarta);
            korisnik.LicnaKarta=null;
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisana licna karta.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    

    [HttpPost("LicnaKartaPDF")]
    public async Task<ActionResult> LicnaKartaPDF(string JMBG)
    {   
        var user = await Context.RegularniKorisnici
                                 .Where(l => l.JMBG==JMBG)
                                 .Include(l=>l.LicnaKarta)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + licne karte
                                    BrojLicneKarte=l.LicnaKarta.BrojLicneKarte,
                                    Datum_izdavanja=l.LicnaKarta.Datum_izdavanja,
                                    Datum_isteka=l.LicnaKarta.Datum_isteka,
                                    izdat_od=l.LicnaKarta.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.JMBG,
                                    Ime=l.Ime,
                                    ImeRoditelja=l.ImeRoditelja,
                                    Prezime=l.Prezime,
                                    Grad=l.Grad,
                                    Opstina=l.Opstina,
                                    Ulica=l.Ulica,
                                    Broj=l.Broj,
                                    Datum_rodjenja=l.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Mesto_Rodjenja,
                                    Pol=l.Pol,
                                    Fotografija=l.Fotografija,
                                    QR_kod=l.LicnaKarta.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                                                                    
        if(user!=null)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                       // Kreiranje dokumenta
                        Document document = new Document(PageSize.A4,25,25,30,30); 

                        // Kreiranje PDF writer-a i povezivanje sa dokumentom i fajlom
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        // Otvoranje dokumenta za pisanje
                        document.Open();
                        
                        // Dodavanje sadrzaja u dokument
                        var line = new Chunk(new iTextSharp.text.pdf.draw.LineSeparator());
                        var font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,13);
                        var razmak = new Paragraph(" ");
                        razmak.Font.Size=4;

                        //slika korisnika
                        var image = iTextSharp.text.Image.GetInstance(user.Fotografija);
                        image.Alignment = Element.ALIGN_LEFT;
                        image.ScaleToFit(200, 200);

                        PdfPTable table = new PdfPTable(2);

                        PdfPCell cell1 = new PdfPCell(image);
                        cell1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        cell1.HorizontalAlignment = Element.ALIGN_LEFT;
                        cell1.VerticalAlignment = Element.ALIGN_MIDDLE;
                        table.AddCell(cell1);
                        
                        //QR kod kao PNG
                        using (MemoryStream qrCodeStream = new MemoryStream(user.QR_kod))
                        {
                            var qrCodeImage = iTextSharp.text.Image.GetInstance(qrCodeStream);
                            qrCodeImage.ScaleToFit(100, 100);
                            
                            PdfPCell cell2 = new PdfPCell(qrCodeImage);
                            cell2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
                            cell2.VerticalAlignment = Element.ALIGN_MIDDLE;
                            table.AddCell(cell2);
                        }
                        document.Add(line);
                        document.Add(new Paragraph("EDOKUMENTA: LICNA KARTA STAMPA PODATAKA", font));
                        document.Add(line);
                        document.Add(razmak);

                        //dodavanje slika
                        document.Add(table);

                        document.Add(line);
                        document.Add(new Paragraph("Podaci o gradjaninu", font));
                        document.Add(line);

                        // Funkcija za dodavanje naziva i podataka u tabeli
                        void DodajPodatak(string naziv, string podatak)
                        {
                            var table = new PdfPTable(2);
                            table.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

                            var nazivCell = new PdfPCell(new Phrase(naziv, font));
                            nazivCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            nazivCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(nazivCell);

                            var podatakCell = new PdfPCell(new Phrase(podatak, font));
                            podatakCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            podatakCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(podatakCell);

                            document.Add(table);
                            document.Add(razmak);
                        }

                        DodajPodatak("Prezime:", user.Prezime.ToUpper());
                        DodajPodatak("Ime:", user.Ime.ToUpper());
                        DodajPodatak("Ime jednog roditelja:", user.ImeRoditelja.ToUpper());
                        DodajPodatak("Datum rodjenja:", user.Datum_rodjenja.ToShortDateString());
                        DodajPodatak("Mesto rodjenja:", $"{user.Mesto_Rodjenja.ToUpper()}, REPUBLIKA SRBIJA");
                        DodajPodatak("Prebivaliste i adresa stana:", $"{user.Grad.ToUpper()}, {user.Opstina.ToUpper()}, {user.Ulica.ToUpper()} {user.Broj.ToUpper()}");
                        DodajPodatak("JMBG:", user.JMBG);
                        DodajPodatak("Pol:", user.Pol.ToString());                        
                        document.Add(line);
                        document.Add(new Paragraph("Podaci o dokumentu", font));
                        document.Add(line);
                        DodajPodatak("Dokument izdaje:", user.izdat_od.ToUpper());
                        DodajPodatak("Broj dokumenta:", user.BrojLicneKarte);
                        DodajPodatak("Datum izdavanja:", user.Datum_izdavanja.ToShortDateString());
                        DodajPodatak("Vazi do:", user.Datum_isteka.ToShortDateString());
                        document.Add(line);
                        document.Add(razmak);
                        document.Add(line);

                        // Zatvaranje dokumenta
                        document.Close();
                        //zatvaranje writera
                        writer.Close();
                        var podaci = ms.ToArray();
                       return File(podaci, "application/pdf", "Licna_karta.pdf", true);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }

    [HttpPost("LicnaKartaQR")]
    public async Task<ActionResult> LicnaKartaQR(int IdKorisnika)
    {  
    var user = await Context.RegularniKorisnici
                     .Where(l => l.ID==IdKorisnika)
                     .Include(l=> l.LicnaKarta)
                     .Select(l =>
                     new 
                     {
                        QR_kod=l.LicnaKarta.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                     }).FirstAsync();   
        if(user!=null)
        {                                                               
            try{
                    //QR kod kao PNG
                    return new FileContentResult(user.QR_kod, "image/png");
                }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    ///////////////////////////////////////////PASOS//////////////////////////////////////////////////////////////////////////////////////
    [HttpGet("PrikaziPasos")]
    public async Task<ActionResult> PrikaziPasos(int IdKorisnika)
    {        
        var pasos = await Context.Pasosi
                                 .Where(l => l.IdKorisnika==IdKorisnika)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + pasos
                                    BrojPasosa=l.BrojPasosa,
                                    Datum_izdavanja=l.Datum_izdavanja,
                                    Datum_isteka=l.Datum_isteka,
                                    izdat_od=l.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.Korisnik.JMBG,
                                    Ime=l.Korisnik.Ime,
                                    ImeRoditelja=l.Korisnik.ImeRoditelja,
                                    Prezime=l.Korisnik.Prezime,
                                    Grad=l.Korisnik.Grad,
                                    Opstina=l.Korisnik.Opstina,
                                    Ulica=l.Korisnik.Ulica,
                                    Broj=l.Korisnik.Broj,
                                    Datum_rodjenja=l.Korisnik.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Korisnik.Mesto_Rodjenja,
                                    Pol=l.Korisnik.Pol,
                                    Fotografija=l.Korisnik.Fotografija,
                                    QR_kod=l.GenerateQRCode()
                                 }).FirstAsync();                             
        if(pasos==null)
        return BadRequest("Nije pronadjen pasos za ovog korisnika.");
        try
        {
            return Ok(pasos);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniPasos")]
    public async Task<ActionResult> IzmeniPasos(int IdKorisnika,Pasos L) 
    {
        var pasos = await Context.Pasosi.FirstOrDefaultAsync(l => l.IdKorisnika==IdKorisnika);
        if(L==null || pasos==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            pasos.BrojPasosa=L.BrojPasosa;
            pasos.Datum_izdavanja=L.Datum_izdavanja;
            pasos.Datum_isteka=L.Datum_isteka;
            pasos.izdat_od=L.izdat_od;

            Context.Pasosi.Update(pasos);
            await Context.SaveChangesAsync();
            return Ok("Uspesno izmenjen pasos.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajPasos")]
    public async Task<ActionResult> DodajPasos(int IdKorisnika,[FromBody]Pasos L)
    {                                                                       
        if(L==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            var korisnik = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            L.Naziv="Pasos";
            L.QR_kod=$"{L.Naziv},{korisnik.JMBG}";//format podataka koji se embeduju u qr kod
            L.Korisnik=korisnik;
            korisnik.Pasos=L;
            await Context.Pasosi.AddAsync(L);
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno dodat pasos.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("IzbrisiPasos")]
    public async Task<ActionResult> IzbrisiPasos(int IdKorisnika) 
    {
        var korisnik = await Context.RegularniKorisnici.Include(l=>l.Pasos).FirstOrDefaultAsync(l=> l.ID==IdKorisnika);
        if(IdKorisnika==0 || korisnik==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            Context.Pasosi.Remove(korisnik.Pasos);
            korisnik.Pasos=null;
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisan pasos.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("PasosPDF")]
    public async Task<ActionResult> PasosPDF(string JMBG)
    {  
    var user = await Context.RegularniKorisnici
                                 .Where(l => l.JMBG==JMBG)
                                 .Include(l=>l.Pasos)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + pasosa
                                    BrojPasosa=l.Pasos.BrojPasosa,
                                    Datum_izdavanja=l.Pasos.Datum_izdavanja,
                                    Datum_isteka=l.Pasos.Datum_isteka,
                                    izdat_od=l.Pasos.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.JMBG,
                                    Ime=l.Ime,
                                    ImeRoditelja=l.ImeRoditelja,
                                    Prezime=l.Prezime,
                                    Grad=l.Grad,
                                    Opstina=l.Opstina,
                                    Ulica=l.Ulica,
                                    Broj=l.Broj,
                                    Datum_rodjenja=l.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Mesto_Rodjenja,
                                    Pol=l.Pol,
                                    Fotografija=l.Fotografija,
                                    QR_kod=l.Pasos.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                                                                    
        if(user!=null)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                       // Kreiranje dokumenta
                        Document document = new Document(PageSize.A4,25,25,30,30); 

                        // Kreiranje PDF writer-a i povezivanje sa dokumentom i fajlom
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        // Otvoranje dokumenta za pisanje
                        document.Open();
                        
                        // Dodavanje sadrzaja u dokument
                        var line = new Chunk(new iTextSharp.text.pdf.draw.LineSeparator());
                        var font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,13);
                        var razmak = new Paragraph(" ");
                        razmak.Font.Size=4;

                        //slika korisnika
                        var image = iTextSharp.text.Image.GetInstance(user.Fotografija);
                        image.Alignment = Element.ALIGN_LEFT;
                        image.ScaleToFit(200, 200);

                        PdfPTable table = new PdfPTable(2);

                        PdfPCell cell1 = new PdfPCell(image);
                        cell1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        cell1.HorizontalAlignment = Element.ALIGN_LEFT;
                        cell1.VerticalAlignment = Element.ALIGN_MIDDLE;
                        table.AddCell(cell1);
                        
                        //QR kod kao PNG
                        using (MemoryStream qrCodeStream = new MemoryStream(user.QR_kod))
                        {
                            var qrCodeImage = iTextSharp.text.Image.GetInstance(qrCodeStream);
                            qrCodeImage.ScaleToFit(100, 100);
                            
                            PdfPCell cell2 = new PdfPCell(qrCodeImage);
                            cell2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
                            cell2.VerticalAlignment = Element.ALIGN_MIDDLE;
                            table.AddCell(cell2);
                        }
                        document.Add(line);
                        document.Add(new Paragraph("EDOKUMENTA: PASOS STAMPA PODATAKA", font));
                        document.Add(line);
                        document.Add(razmak);

                        //dodavanje slika
                        document.Add(table);

                        document.Add(line);
                        document.Add(new Paragraph("Podaci o gradjaninu", font));
                        document.Add(line);

                        // Funkcija za dodavanje naziva i podataka u tabeli
                        void DodajPodatak(string naziv, string podatak)
                        {
                            var table = new PdfPTable(2);
                            table.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

                            var nazivCell = new PdfPCell(new Phrase(naziv, font));
                            nazivCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            nazivCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(nazivCell);

                            var podatakCell = new PdfPCell(new Phrase(podatak, font));
                            podatakCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            podatakCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(podatakCell);

                            document.Add(table);
                            document.Add(razmak);
                        }

                        DodajPodatak("Prezime:", user.Prezime.ToUpper());
                        DodajPodatak("Ime:", user.Ime.ToUpper());
                        DodajPodatak("Ime jednog roditelja:", user.ImeRoditelja.ToUpper());
                        DodajPodatak("Datum rodjenja:", user.Datum_rodjenja.ToShortDateString());
                        DodajPodatak("Mesto rodjenja:", $"{user.Mesto_Rodjenja.ToUpper()}, REPUBLIKA SRBIJA");
                        DodajPodatak("Prebivaliste i adresa stana:", $"{user.Grad.ToUpper()}, {user.Opstina.ToUpper()}, {user.Ulica.ToUpper()} {user.Broj.ToUpper()}");
                        DodajPodatak("JMBG:", user.JMBG);
                        DodajPodatak("Pol:", user.Pol.ToString());                        
                        document.Add(line);
                        document.Add(new Paragraph("Podaci o dokumentu", font));
                        document.Add(line);
                        DodajPodatak("Dokument izdaje:", user.izdat_od.ToUpper());
                        DodajPodatak("Broj dokumenta:", user.BrojPasosa);
                        DodajPodatak("Datum izdavanja:", user.Datum_izdavanja.ToShortDateString());
                        DodajPodatak("Vazi do:", user.Datum_isteka.ToShortDateString());
                        document.Add(line);
                        document.Add(razmak);
                        document.Add(line);

                        // Zatvaranje dokumenta
                        document.Close();
                        //zatvaranje writera
                        writer.Close();
                        var podaci = ms.ToArray();
                        return File(podaci, "application/pdf", "Pasos.pdf");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    
    [HttpPost("PasosQR")]
    public async Task<ActionResult> PasosQR(int IdKorisnika)
    {  
    var user = await Context.RegularniKorisnici
                     .Where(l => l.ID==IdKorisnika)
                     .Include(l=> l.Pasos)
                     .Select(l =>
                     new 
                     {
                        QR_kod=l.Pasos.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                     }).FirstAsync();   
        if(user!=null)
        {                                                               
            try{
                    //QR kod kao PNG
                    return new FileContentResult(user.QR_kod, "image/png");
                }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    ///////////////////////////////////////////VOZACKA DOZVOLA//////////////////////////////////////////////////////////////////////////////////////
    [HttpGet("PrikaziVozackuDozvolu")]
    public async Task<ActionResult> PrikaziVozackuDozvolu(int IdKorisnika)
    {        
        var vozacka = await Context.VozackeDozvole
                                 .Where(l => l.IdKorisnika==IdKorisnika)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + vozacka
                                    BrojVozackeDozvole=l.BrojVozackeDozvole,
                                    KategorijeVozila=l.KategorijeVozila,
                                    Datum_izdavanja=l.Datum_izdavanja,
                                    Datum_isteka=l.Datum_isteka,
                                    izdat_od=l.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.Korisnik.JMBG,
                                    Ime=l.Korisnik.Ime,
                                    ImeRoditelja=l.Korisnik.ImeRoditelja,
                                    Prezime=l.Korisnik.Prezime,
                                    Grad=l.Korisnik.Grad,
                                    Opstina=l.Korisnik.Opstina,
                                    Ulica=l.Korisnik.Ulica,
                                    Broj=l.Korisnik.Broj,
                                    Datum_rodjenja=l.Korisnik.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Korisnik.Mesto_Rodjenja,
                                    Pol=l.Korisnik.Pol,
                                    Fotografija=l.Korisnik.Fotografija,
                                    QR_kod=l.GenerateQRCode()
                                 }).FirstAsync();                             
        if(vozacka==null)
        return BadRequest("Nije pronadjena vozacka dozvola za ovog korisnika.");
        try
        {
            return Ok(vozacka);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniVozackuDozvolu")]
    public async Task<ActionResult> IzmeniVozackuDozvolu(int IdKorisnika,VozackaDozvola L) 
    {
        var vozacka = await Context.VozackeDozvole.FirstOrDefaultAsync(l=>l.IdKorisnika==IdKorisnika);
        if(L==null || vozacka==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            vozacka.BrojVozackeDozvole=L.BrojVozackeDozvole;
            vozacka.KategorijeVozila=L.KategorijeVozila;
            vozacka.Datum_izdavanja=L.Datum_izdavanja;
            vozacka.Datum_isteka=L.Datum_isteka;
            vozacka.izdat_od=L.izdat_od;
            
            Context.VozackeDozvole.Update(vozacka);
            await Context.SaveChangesAsync();
            return Ok("Uspesno izmenjena vozacka dozvola.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajVozackuDozvolu")]
    public async Task<ActionResult> DodajVozackuDozvolu(int IdKorisnika,[FromBody]VozackaDozvola L)
    {                                                                       
        if(L==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            var korisnik = await Context.RegularniKorisnici.FindAsync(IdKorisnika);

            L.Naziv="VozackaDozvola";
            L.QR_kod=$"{L.Naziv},{korisnik.JMBG}";//format podataka koji se embeduju u qr kod
            L.Korisnik=korisnik;
            korisnik.VozackaDozvola=L;
            await Context.VozackeDozvole.AddAsync(L);
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno dodata vozacka dozvola.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("IzbrisiVozackuDozvolu")]
    public async Task<ActionResult> IzbrisiVozackuDozvolu(int IdKorisnika) 
    {
        var korisnik = await Context.RegularniKorisnici.Include(l=>l.VozackaDozvola).FirstOrDefaultAsync(l=> l.ID==IdKorisnika);
        if(IdKorisnika==0 || korisnik==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            Context.VozackeDozvole.Remove(korisnik.VozackaDozvola);
            korisnik.VozackaDozvola=null;
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisana vozacka dozvola.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("VozackaDozvolaPDF")]
    public async Task<ActionResult> VozackaDozvolaPDF(string JMBG)
    {  
    var user = await Context.RegularniKorisnici
                                 .Where(l => l.JMBG==JMBG)
                                 .Include(l=>l.VozackaDozvola)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + vozacke
                                    BrojVozackeDozvole=l.VozackaDozvola.BrojVozackeDozvole,
                                    KategorijeVozila=l.VozackaDozvola.KategorijeVozila,
                                    Datum_izdavanja=l.VozackaDozvola.Datum_izdavanja,
                                    Datum_isteka=l.VozackaDozvola.Datum_isteka,
                                    izdat_od=l.VozackaDozvola.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.JMBG,
                                    Ime=l.Ime,
                                    ImeRoditelja=l.ImeRoditelja,
                                    Prezime=l.Prezime,
                                    Grad=l.Grad,
                                    Opstina=l.Opstina,
                                    Ulica=l.Ulica,
                                    Broj=l.Broj,
                                    Datum_rodjenja=l.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Mesto_Rodjenja,
                                    Pol=l.Pol,
                                    Fotografija=l.Fotografija,
                                    QR_kod=l.VozackaDozvola.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                                                                    
        if(user!=null)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                       // Kreiranje dokumenta
                        Document document = new Document(PageSize.A4,25,25,30,30); 

                        // Kreiranje PDF writer-a i povezivanje sa dokumentom i fajlom
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        // Otvoranje dokumenta za pisanje
                        document.Open();
                        
                        // Dodavanje sadrzaja u dokument
                        var line = new Chunk(new iTextSharp.text.pdf.draw.LineSeparator());
                        var font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,13);
                        var razmak = new Paragraph(" ");
                        razmak.Font.Size=4;

                        //slika korisnika
                        var image = iTextSharp.text.Image.GetInstance(user.Fotografija);
                        image.Alignment = Element.ALIGN_LEFT;
                        image.ScaleToFit(200, 200);

                        PdfPTable table = new PdfPTable(2);

                        PdfPCell cell1 = new PdfPCell(image);
                        cell1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        cell1.HorizontalAlignment = Element.ALIGN_LEFT;
                        cell1.VerticalAlignment = Element.ALIGN_MIDDLE;
                        table.AddCell(cell1);
                        
                        //QR kod kao PNG
                        using (MemoryStream qrCodeStream = new MemoryStream(user.QR_kod))
                        {
                            var qrCodeImage = iTextSharp.text.Image.GetInstance(qrCodeStream);
                            qrCodeImage.ScaleToFit(100, 100);
                            
                            PdfPCell cell2 = new PdfPCell(qrCodeImage);
                            cell2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
                            cell2.VerticalAlignment = Element.ALIGN_MIDDLE;
                            table.AddCell(cell2);
                        }
                        document.Add(line);
                        document.Add(new Paragraph("EDOKUMENTA: VOZACKA DOZVOLA STAMPA PODATAKA", font));
                        document.Add(line);
                        document.Add(razmak);

                        //dodavanje slika
                        document.Add(table);

                        document.Add(line);
                        document.Add(new Paragraph("Podaci o gradjaninu", font));
                        document.Add(line);

                        // Funkcija za dodavanje naziva i podataka u tabeli
                        void DodajPodatak(string naziv, string podatak)
                        {
                            var table = new PdfPTable(2);
                            table.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

                            var nazivCell = new PdfPCell(new Phrase(naziv, font));
                            nazivCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            nazivCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(nazivCell);

                            var podatakCell = new PdfPCell(new Phrase(podatak, font));
                            podatakCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            podatakCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(podatakCell);

                            document.Add(table);
                            document.Add(razmak);
                        }

                        DodajPodatak("Prezime:", user.Prezime.ToUpper());
                        DodajPodatak("Ime:", user.Ime.ToUpper());
                        DodajPodatak("Ime jednog roditelja:", user.ImeRoditelja.ToUpper());
                        DodajPodatak("Datum rodjenja:", user.Datum_rodjenja.ToShortDateString());
                        DodajPodatak("Mesto rodjenja:", $"{user.Mesto_Rodjenja.ToUpper()}, REPUBLIKA SRBIJA");
                        DodajPodatak("Prebivaliste i adresa stana:", $"{user.Grad.ToUpper()}, {user.Opstina.ToUpper()}, {user.Ulica.ToUpper()} {user.Broj.ToUpper()}");
                        DodajPodatak("JMBG:", user.JMBG);
                        DodajPodatak("Pol:", user.Pol.ToString());                        
                        document.Add(line);
                        document.Add(new Paragraph("Podaci o dokumentu", font));
                        document.Add(line);
                        DodajPodatak("Dokument izdaje:", user.izdat_od.ToUpper());
                        DodajPodatak("Broj dokumenta:", user.BrojVozackeDozvole);
                        DodajPodatak("Kategorije vozila:",user.KategorijeVozila.ToUpper());
                        DodajPodatak("Datum izdavanja:", user.Datum_izdavanja.ToShortDateString());
                        DodajPodatak("Vazi do:", user.Datum_isteka.ToShortDateString());
                        document.Add(line);
                        document.Add(razmak);
                        document.Add(line);

                        // Zatvaranje dokumenta
                        document.Close();
                        //zatvaranje writera
                        writer.Close();
                        var podaci = ms.ToArray();
                        return File(podaci, "application/pdf", "Vozacka_dozvola.pdf");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    
    [HttpPost("VozackaDozvolaQR")]
    public async Task<ActionResult> VozackaDozvolaQR(int IdKorisnika)
    {  
    var user = await Context.RegularniKorisnici
                     .Where(l => l.ID==IdKorisnika)
                     .Include(l=> l.VozackaDozvola)
                     .Select(l =>
                     new 
                     {
                        QR_kod=l.VozackaDozvola.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                     }).FirstAsync();   
        if(user!=null)
        {                                                               
            try{
                    //QR kod kao PNG
                    return new FileContentResult(user.QR_kod, "image/png");
                }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    ///////////////////////////////////////////DOZVOLA ZA ORUZJE//////////////////////////////////////////////////////////////////////////////////////

    [HttpGet("PrikaziDozvoluZaOruzje")]
    public async Task<ActionResult> PrikaziDozvoluZaOruzje(int IdKorisnika)
    {        
        var dozvola = await Context.DozvoleZaOruzje
                                 .Where(l => l.IdKorisnika==IdKorisnika)
                                 .Select(l =>
                                 new 
                                 {
                                    BrojDozvoleZaOruzje=l.BrojDozvoleZaOruzje,
                                    VrsteOruzja=l.VrsteOruzja,
                                    KolicinaOruzja=l.KolicinaOruzja,
                                    BrojOruzjaPoVrsti=l.BrojOruzjaPoVrsti,
                                    KalibarOruzja=l.KalibarOruzja,
                                    MestoUpotrebe=l.MestoUpotrebe,
                                    SvrhaUpotrebe=l.SvrhaUpotrebe,
                                    Datum_izdavanja=l.Datum_izdavanja,
                                    Datum_isteka=l.Datum_isteka,
                                    izdat_od=l.izdat_od,

                                    JMBG = l.Korisnik.JMBG,
                                    Ime=l.Korisnik.Ime,
                                    ImeRoditelja=l.Korisnik.ImeRoditelja,
                                    Prezime=l.Korisnik.Prezime,
                                    Grad=l.Korisnik.Grad,
                                    Opstina=l.Korisnik.Opstina,
                                    Ulica=l.Korisnik.Ulica,
                                    Broj=l.Korisnik.Broj,
                                    Datum_rodjenja=l.Korisnik.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Korisnik.Mesto_Rodjenja,
                                    Pol=l.Korisnik.Pol,
                                    Fotografija=l.Korisnik.Fotografija,
                                    QR_kod=l.GenerateQRCode()
                                 }).FirstAsync();                             
        if(dozvola==null)
        return BadRequest("Nije pronadjena dozvola za oruzje za ovog korisnika.");
        try
        {
            return Ok(dozvola);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniDozvoluZaOruzje")]
    public async Task<ActionResult> IzmeniDozvoluZaOruzje(int IdKorisnika,DozvolaZaOruzje L) 
    {
        var dozvola = await Context.DozvoleZaOruzje.FirstOrDefaultAsync(l=>l.IdKorisnika==IdKorisnika);
        if(L==null || dozvola==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            dozvola.BrojDozvoleZaOruzje=L.BrojDozvoleZaOruzje;
            dozvola.VrsteOruzja=L.VrsteOruzja;
            dozvola.KolicinaOruzja=L.KolicinaOruzja;
            dozvola.BrojOruzjaPoVrsti=L.BrojOruzjaPoVrsti;
            dozvola.KalibarOruzja=L.KalibarOruzja;
            dozvola.MestoUpotrebe=L.MestoUpotrebe;
            dozvola.SvrhaUpotrebe=L.SvrhaUpotrebe;
            dozvola.Datum_izdavanja=L.Datum_izdavanja;
            dozvola.Datum_isteka=L.Datum_isteka;
            dozvola.izdat_od=L.izdat_od;

            Context.DozvoleZaOruzje.Update(dozvola);
            await Context.SaveChangesAsync();
            return Ok("Uspesno izmenjena dozvola za oruzje.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajDozvoluZaOruzje")]
    public async Task<ActionResult> DodajDozvoluZaOruzje(int IdKorisnika,[FromBody]DozvolaZaOruzje L)
    {                                                                       
        if(L==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            var korisnik = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            L.Naziv="DozvolaZaOruzje";  
            L.QR_kod=$"{L.Naziv},{korisnik.JMBG}";//format podataka koji se embeduju u qr kod
            L.Korisnik=korisnik;
            korisnik.DozvolaZaOruzje=L;
            await Context.DozvoleZaOruzje.AddAsync(L);
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno dodata dozvola za oruzje.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("IzbrisiDozvoluZaOruzje")]
    public async Task<ActionResult> IzbrisiDozvoluZaOruzje(int IdKorisnika) 
    {
        var korisnik = await Context.RegularniKorisnici.Include(l=>l.DozvolaZaOruzje).FirstOrDefaultAsync(l=> l.ID==IdKorisnika);
        if(IdKorisnika==0 || korisnik==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            Context.DozvoleZaOruzje.Remove(korisnik.DozvolaZaOruzje);
            korisnik.DozvolaZaOruzje=null;
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisana dozvola za oruzje.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DozvolaZaOruzjePDF")]
    public async Task<ActionResult> DozvolaZaOruzjePDF(string JMBG)
    {  
    var user = await Context.RegularniKorisnici
                                 .Where(l => l.JMBG==JMBG)
                                 .Include(l=>l.DozvolaZaOruzje)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + dozvole za oruzje
                                    BrojDozvoleZaOruzje=l.DozvolaZaOruzje.BrojDozvoleZaOruzje,
                                    VrsteOruzja=l.DozvolaZaOruzje.VrsteOruzja,
                                    KolicinaOruzja=l.DozvolaZaOruzje.KolicinaOruzja,
                                    BrojOruzjaPoVrsti=l.DozvolaZaOruzje.BrojOruzjaPoVrsti,
                                    KalibarOruzja=l.DozvolaZaOruzje.KalibarOruzja,
                                    MestoUpotrebe=l.DozvolaZaOruzje.MestoUpotrebe,
                                    SvrhaUpotrebe=l.DozvolaZaOruzje.SvrhaUpotrebe,
                                    Datum_izdavanja=l.DozvolaZaOruzje.Datum_izdavanja,
                                    Datum_isteka=l.DozvolaZaOruzje.Datum_isteka,
                                    izdat_od=l.DozvolaZaOruzje.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.JMBG,
                                    Ime=l.Ime,
                                    ImeRoditelja=l.ImeRoditelja,
                                    Prezime=l.Prezime,
                                    Grad=l.Grad,
                                    Opstina=l.Opstina,
                                    Ulica=l.Ulica,
                                    Broj=l.Broj,
                                    Datum_rodjenja=l.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Mesto_Rodjenja,
                                    Pol=l.Pol,
                                    Fotografija=l.Fotografija,
                                    QR_kod=l.DozvolaZaOruzje.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                                                                    
        if(user!=null)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                       // Kreiranje dokumenta
                        Document document = new Document(PageSize.A4,25,25,30,30); 

                        // Kreiranje PDF writer-a i povezivanje sa dokumentom i fajlom
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        // Otvoranje dokumenta za pisanje
                        document.Open();
                        
                        // Dodavanje sadrzaja u dokument
                        var line = new Chunk(new iTextSharp.text.pdf.draw.LineSeparator());
                        var font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,13);
                        var razmak = new Paragraph(" ");
                        razmak.Font.Size=4;

                        //slika korisnika
                        var image = iTextSharp.text.Image.GetInstance(user.Fotografija);
                        image.Alignment = Element.ALIGN_LEFT;
                        image.ScaleToFit(200, 200);

                        PdfPTable table = new PdfPTable(2);

                        PdfPCell cell1 = new PdfPCell(image);
                        cell1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        cell1.HorizontalAlignment = Element.ALIGN_LEFT;
                        cell1.VerticalAlignment = Element.ALIGN_MIDDLE;
                        table.AddCell(cell1);
                        
                        //QR kod kao PNG
                        using (MemoryStream qrCodeStream = new MemoryStream(user.QR_kod))
                        {
                            var qrCodeImage = iTextSharp.text.Image.GetInstance(qrCodeStream);
                            qrCodeImage.ScaleToFit(100, 100);
                            
                            PdfPCell cell2 = new PdfPCell(qrCodeImage);
                            cell2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
                            cell2.VerticalAlignment = Element.ALIGN_MIDDLE;
                            table.AddCell(cell2);
                        }
                        document.Add(line);
                        document.Add(new Paragraph("EDOKUMENTA: DOZVOLA ZA ORUZJE STAMPA PODATAKA", font));
                        document.Add(line);
                        document.Add(razmak);

                        //dodavanje slika
                        document.Add(table);

                        document.Add(line);
                        document.Add(new Paragraph("Podaci o gradjaninu", font));
                        document.Add(line);

                        // Funkcija za dodavanje naziva i podataka u tabeli
                        void DodajPodatak(string naziv, string podatak)
                        {
                            var table = new PdfPTable(2);
                            table.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

                            var nazivCell = new PdfPCell(new Phrase(naziv, font));
                            nazivCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            nazivCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(nazivCell);

                            var podatakCell = new PdfPCell(new Phrase(podatak, font));
                            podatakCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            podatakCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(podatakCell);

                            document.Add(table);
                            document.Add(razmak);
                        }

                        DodajPodatak("Prezime:", user.Prezime.ToUpper());
                        DodajPodatak("Ime:", user.Ime.ToUpper());
                        DodajPodatak("Ime jednog roditelja:", user.ImeRoditelja.ToUpper());
                        DodajPodatak("Datum rodjenja:", user.Datum_rodjenja.ToShortDateString());
                        DodajPodatak("Mesto rodjenja:", $"{user.Mesto_Rodjenja.ToUpper()}, REPUBLIKA SRBIJA");
                        DodajPodatak("Prebivaliste i adresa stana:", $"{user.Grad.ToUpper()}, {user.Opstina.ToUpper()}, {user.Ulica.ToUpper()} {user.Broj.ToUpper()}");
                        DodajPodatak("JMBG:", user.JMBG);
                        DodajPodatak("Pol:", user.Pol.ToString());                        
                        document.Add(line);
                        document.Add(new Paragraph("Podaci o dokumentu", font));
                        document.Add(line);
                        DodajPodatak("Dokument izdaje:", user.izdat_od.ToUpper());
                        DodajPodatak("Broj dokumenta:", user.BrojDozvoleZaOruzje);
                        DodajPodatak("Vrste oruzja:",user.VrsteOruzja.ToUpper());
                        DodajPodatak("Kolicina oruzja:",user.KolicinaOruzja);
                        DodajPodatak("Broj oruzja po vrsti:",user.BrojOruzjaPoVrsti.ToUpper());
                        DodajPodatak("Kalibar oruzja:",user.KalibarOruzja.ToUpper());
                        DodajPodatak("Mesto upotrebe:",user.MestoUpotrebe.ToUpper());
                        DodajPodatak("Svrha upotrebe:",user.SvrhaUpotrebe.ToUpper());
                        DodajPodatak("Datum izdavanja:", user.Datum_izdavanja.ToShortDateString());
                        DodajPodatak("Vazi do:", user.Datum_isteka.ToShortDateString());
                        document.Add(line);
                        document.Add(razmak);
                        document.Add(line);
                        // Zatvaranje dokumenta
                        document.Close();
                        //zatvaranje writera
                        writer.Close();
                        var podaci = ms.ToArray();
                        return File(podaci, "application/pdf", "Dozvola_za_oruzje.pdf");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }

    [HttpPost("DozvolaZaOruzjeQR")]
    public async Task<ActionResult> DozvolaZaOruzjeQR(int IdKorisnika)
    {  
    var user = await Context.RegularniKorisnici
                     .Where(l => l.ID==IdKorisnika)
                     .Include(l=> l.DozvolaZaOruzje)
                     .Select(l =>
                     new 
                     {
                        QR_kod=l.DozvolaZaOruzje.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                     }).FirstAsync();   
        if(user!=null)
        {                                                               
            try{
                    //QR kod kao PNG
                    return new FileContentResult(user.QR_kod, "image/png");
                }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }
    ///////////////////////////////////////////SAOBRACAJNA DOZVOLA//////////////////////////////////////////////////////////////////////////////////////
    [HttpGet("PrikaziSaobracajnuDozvolu")]
    public async Task<ActionResult> PrikaziSaobracajnuDozvolu(int IdKorisnika)
    {        
        var dozvola = await Context.SaobracajneDozvole
                                 .Where(l => l.IdKorisnika==IdKorisnika)
                                 .Select(l =>
                                 new 
                                 {
                                    BrojSaobracajneDozvole=l.BrojSaobracajneDozvole,
                                    BrojRegistracije=l.BrojRegistracije,
                                    DatumPrvogRegistrovanja=l.DatumPrvogRegistrovanja,
                                    Nosivost=l.Nosivost,
                                    Masa=l.Masa,
                                    BrojSedista=l.BrojSedista,
                                    GodinaProizvodnje=l.GodinaProizvodnje,
                                    BrojMotora=l.BrojMotora,
                                    BrojSasije=l.BrojSasije,
                                    Marka=l.Marka,
                                    Tip=l.Tip,
                                    Datum_izdavanja=l.Datum_izdavanja,
                                    Datum_isteka=l.Datum_isteka,
                                    izdat_od=l.izdat_od,

                                    JMBG = l.Korisnik.JMBG,
                                    Ime=l.Korisnik.Ime,
                                    ImeRoditelja=l.Korisnik.ImeRoditelja,
                                    Prezime=l.Korisnik.Prezime,
                                    Grad=l.Korisnik.Grad,
                                    Opstina=l.Korisnik.Opstina,
                                    Ulica=l.Korisnik.Ulica,
                                    Broj=l.Korisnik.Broj,
                                    Datum_rodjenja=l.Korisnik.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Korisnik.Mesto_Rodjenja,
                                    Pol=l.Korisnik.Pol,
                                    Fotografija=l.Korisnik.Fotografija,
                                    QR_kod=l.GenerateQRCode()
                                 }).FirstAsync();                             
        if(dozvola==null)
        return BadRequest("Nije pronadjena saobracajna dozvola za ovog korisnika.");
        try
        {
            return Ok(dozvola);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniSaobracajnuDozvolu")]
    public async Task<ActionResult> IzmeniSaobracajnuDozvolu(int IdKorisnika,SaobracajnaDozvola L) 
    {
        var dozvola = await Context.SaobracajneDozvole.FirstOrDefaultAsync(l=>l.IdKorisnika==IdKorisnika);
        if(L==null || dozvola==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            dozvola.BrojSaobracajneDozvole=L.BrojSaobracajneDozvole;
            dozvola.BrojRegistracije=L.BrojRegistracije;
            dozvola.DatumPrvogRegistrovanja=L.DatumPrvogRegistrovanja;
            dozvola.Nosivost=L.Nosivost;
            dozvola.Masa=L.Masa;
            dozvola.BrojSedista=L.BrojSedista;
            dozvola.GodinaProizvodnje=L.GodinaProizvodnje;
            dozvola.BrojMotora=L.BrojMotora;
            dozvola.BrojSasije=L.BrojSasije;
            dozvola.Marka=L.Marka;
            dozvola.Tip=L.Tip;
            dozvola.Datum_izdavanja=L.Datum_izdavanja;
            dozvola.Datum_isteka=L.Datum_isteka;
            dozvola.izdat_od=L.izdat_od;

            Context.SaobracajneDozvole.Update(dozvola);
            await Context.SaveChangesAsync();
            return Ok("Uspesno izmenjena saobracajna dozvola.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajSaobracajnuDozvolu")]
    public async Task<ActionResult> DodajSaobracajnuDozvolu(int IdKorisnika,[FromBody]SaobracajnaDozvola L)
    {                                                                       
        if(L==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            var korisnik = await Context.RegularniKorisnici.FindAsync(IdKorisnika);
            L.Naziv="SaobracajnaDozvola";  
            L.QR_kod=$"{L.Naziv},{korisnik.JMBG}";//format podataka koji se embeduju u qr kod
            L.Korisnik=korisnik;
            korisnik.SaobracajnaDozvola=L;
            await Context.SaobracajneDozvole.AddAsync(L);
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno dodata saobracajna dozvola.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("IzbrisiSaobracajnuDozvolu")]
    public async Task<ActionResult> IzbrisiSaobracajnuDozvolu(int IdKorisnika) 
    {
        var korisnik = await Context.RegularniKorisnici.Include(l=>l.SaobracajnaDozvola).FirstOrDefaultAsync(l=> l.ID==IdKorisnika);
        if(IdKorisnika==0 || korisnik==null)
        return BadRequest("Neispravni podaci.");
        try
        {
            Context.SaobracajneDozvole.Remove(korisnik.SaobracajnaDozvola);
            korisnik.SaobracajnaDozvola=null;
            Context.RegularniKorisnici.Update(korisnik);
            await Context.SaveChangesAsync();
            return Ok("Uspesno obrisana saobracajna dozvola.");      
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("SaobracajnaDozvolaPDF")]
    public async Task<ActionResult> SaobracajnaDozvolaPDF(string JMBG)
    {  
    var user = await Context.RegularniKorisnici
                                 .Where(l => l.JMBG==JMBG)
                                 .Include(l=>l.SaobracajnaDozvola)
                                 .Select(l =>
                                 new 
                                 {
                                    //podaci iz dokumenta + saobracajna
                                    BrojSaobracajneDozvole=l.SaobracajnaDozvola.BrojSaobracajneDozvole,
                                    BrojRegistracije=l.SaobracajnaDozvola.BrojRegistracije,
                                    DatumPrvogRegistrovanja=l.SaobracajnaDozvola.DatumPrvogRegistrovanja,
                                    Nosivost=l.SaobracajnaDozvola.Nosivost,
                                    Masa=l.SaobracajnaDozvola.Masa,
                                    BrojSedista=l.SaobracajnaDozvola.BrojSedista,
                                    GodinaProizvodnje=l.SaobracajnaDozvola.GodinaProizvodnje,
                                    BrojMotora=l.SaobracajnaDozvola.BrojMotora,
                                    BrojSasije=l.SaobracajnaDozvola.BrojSasije,
                                    Marka=l.SaobracajnaDozvola.Marka,
                                    Tip=l.SaobracajnaDozvola.Tip,
                                    Datum_izdavanja=l.SaobracajnaDozvola.Datum_izdavanja,
                                    Datum_isteka=l.SaobracajnaDozvola.Datum_isteka,
                                    izdat_od=l.SaobracajnaDozvola.izdat_od,

                                    //podaci iz korisnika
                                    JMBG = l.JMBG,
                                    Ime=l.Ime,
                                    ImeRoditelja=l.ImeRoditelja,
                                    Prezime=l.Prezime,
                                    Grad=l.Grad,
                                    Opstina=l.Opstina,
                                    Ulica=l.Ulica,
                                    Broj=l.Broj,
                                    Datum_rodjenja=l.Datum_rodjenja,
                                    Mesto_Rodjenja=l.Mesto_Rodjenja,
                                    Pol=l.Pol,
                                    Fotografija=l.Fotografija,
                                    QR_kod=l.SaobracajnaDozvola.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                                 }).FirstAsync();                                                                    
        if(user!=null)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                       // Kreiranje dokumenta
                        Document document = new Document(PageSize.A4,25,25,30,30); 

                        // Kreiranje PDF writer-a i povezivanje sa dokumentom i fajlom
                        PdfWriter writer = PdfWriter.GetInstance(document, ms);

                        // Otvoranje dokumenta za pisanje
                        document.Open();
                        
                        // Dodavanje sadrzaja u dokument
                        var line = new Chunk(new iTextSharp.text.pdf.draw.LineSeparator());
                        var font = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,13);
                        var razmak = new Paragraph(" ");
                        razmak.Font.Size=4;

                        //slika korisnika
                        var image = iTextSharp.text.Image.GetInstance(user.Fotografija);
                        image.Alignment = Element.ALIGN_LEFT;
                        image.ScaleToFit(200, 200);

                        PdfPTable table = new PdfPTable(2);

                        PdfPCell cell1 = new PdfPCell(image);
                        cell1.Border = iTextSharp.text.Rectangle.NO_BORDER;
                        cell1.HorizontalAlignment = Element.ALIGN_LEFT;
                        cell1.VerticalAlignment = Element.ALIGN_MIDDLE;
                        table.AddCell(cell1);
                        
                        //dodavanje loga
                        
                        
                        //QR kod kao PNG
                        using (MemoryStream qrCodeStream = new MemoryStream(user.QR_kod))
                        {
                            var qrCodeImage = iTextSharp.text.Image.GetInstance(qrCodeStream);
                            qrCodeImage.ScaleToFit(100, 100);
                            
                            PdfPCell cell2 = new PdfPCell(qrCodeImage);
                            cell2.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
                            cell2.VerticalAlignment = Element.ALIGN_MIDDLE;
                            table.AddCell(cell2);
                        }
                        document.Add(line);
                        document.Add(new Paragraph("EDOKUMENTA: SAOBRACAJNA DOZVOLA STAMPA PODATAKA", font));
                        document.Add(line);
                        document.Add(razmak);

                        //dodavanje slika
                        document.Add(table);

                        document.Add(line);
                        document.Add(new Paragraph("Podaci o gradjaninu", font));
                        document.Add(line);

                        // Funkcija za dodavanje naziva i podataka u tabeli
                        void DodajPodatak(string naziv, string podatak)
                        {
                            var table = new PdfPTable(2);
                            table.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

                            var nazivCell = new PdfPCell(new Phrase(naziv, font));
                            nazivCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            nazivCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(nazivCell);

                            var podatakCell = new PdfPCell(new Phrase(podatak, font));
                            podatakCell.HorizontalAlignment = Element.ALIGN_LEFT;
                            podatakCell.Border = iTextSharp.text.Rectangle.NO_BORDER;
                            table.AddCell(podatakCell);

                            document.Add(table);
                            document.Add(razmak);
                        }

                        DodajPodatak("Prezime:", user.Prezime.ToUpper());
                        DodajPodatak("Ime:", user.Ime.ToUpper());
                        DodajPodatak("Ime jednog roditelja:", user.ImeRoditelja.ToUpper());
                        DodajPodatak("Datum rodjenja:", user.Datum_rodjenja.ToShortDateString());
                        DodajPodatak("Mesto rodjenja:", $"{user.Mesto_Rodjenja.ToUpper()}, REPUBLIKA SRBIJA");
                        DodajPodatak("Prebivaliste i adresa stana:", $"{user.Grad.ToUpper()}, {user.Opstina.ToUpper()}, {user.Ulica.ToUpper()} {user.Broj.ToUpper()}");
                        DodajPodatak("JMBG:", user.JMBG);
                        DodajPodatak("Pol:", user.Pol.ToString());                        
                        document.Add(line);
                        document.Add(new Paragraph("Podaci o dokumentu", font));
                        document.Add(line);
                        DodajPodatak("Dokument izdaje:", user.izdat_od.ToUpper());
                        DodajPodatak("Broj dokumenta:", user.BrojSaobracajneDozvole);
                        DodajPodatak("Registarski broj:",user.BrojRegistracije.ToUpper());
                        DodajPodatak("Datum prvog registrovanja:",user.DatumPrvogRegistrovanja.ToShortDateString());
                        DodajPodatak("Nosivost:",user.Nosivost.ToUpper());
                        DodajPodatak("Masa:",user.Masa.ToUpper());
                        DodajPodatak("Broj sedista:",user.BrojSedista);
                        DodajPodatak("Godina proizvodnje:",user.GodinaProizvodnje);
                        DodajPodatak("Broj motora:",user.BrojMotora.ToUpper());
                        DodajPodatak("Broj sasije:",user.BrojSasije.ToUpper());
                        DodajPodatak("Marka:",user.Marka.ToUpper());
                        DodajPodatak("Tip:",user.Tip.ToUpper());
                        DodajPodatak("Datum izdavanja:", user.Datum_izdavanja.ToShortDateString());
                        DodajPodatak("Vazi do:", user.Datum_isteka.ToShortDateString());
                        document.Add(line);
                        document.Add(razmak);
                        document.Add(line);
                        // Zatvaranje dokumenta
                        document.Close();
                        //zatvaranje writera
                        writer.Close();
                        var podaci = ms.ToArray();
                        return File(podaci, "application/pdf", "Saobracajna_dozvola.pdf");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }


    [HttpPost("SaobracajnaDozvolaQR")]
    public async Task<ActionResult> SaobracajnaDozvolaQR(int IdKorisnika)
    {  
    var user = await Context.RegularniKorisnici
                     .Where(l => l.ID==IdKorisnika)
                     .Include(l=> l.SaobracajnaDozvola)
                     .Select(l =>
                     new 
                     {
                        QR_kod=l.SaobracajnaDozvola.GenerateQRCode() //ovo je byte[] vrednost. Binarna vrednost PNG slike QR koda
                     }).FirstAsync();   
        if(user!=null)
        {                                                               
            try{
                    //QR kod kao PNG
                    return new FileContentResult(user.QR_kod, "image/png");
                }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        return BadRequest("Neispravni podaci.");
    }

    
}