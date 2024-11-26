namespace Models;
[Table("Regularni Korisnik")]
public class RegularniKorisnik
{
    [Key]
    public int ID { get; set; }

    [MaxLength(50)]
    [Required]
    public string Ime { get; set; }

    [MaxLength(50)]
    [Required]
    public string ImeRoditelja { get; set; }

    [MaxLength(13)]
    [Required]
    public string JMBG { get; set; }

    [MaxLength(50)]
    [Required]
    public string Prezime { get; set; }

    [MaxLength(50)]
    [Required]
    public string Username { get; set; }

    [NotMapped]
    public string Password { get; set; }

    [MaxLength(100)]
    public string HashPassword { get; set; }
    
    [MaxLength(50)]
    [Required]
    public string Email { get; set; }

    [MaxLength(50)]
    [Required]
    public string Grad { get; set; }

    [MaxLength(50)]
    [Required]
    public string Opstina { get; set; }

    [MaxLength(50)]
    [Required]
    public string Ulica { get; set; }

    [Required]
    public string Broj { get; set; }

    [MaxLength(50)]
    [Required]
    public string Telefon { get; set; }

    [Required]
    public DateTime Datum_rodjenja { get; set; }

    [MaxLength(50)]
    [Required]
    public string Mesto_Rodjenja { get; set; }

    
    [Required]
    public char Pol { get; set; }
    
    public string Fotografija { get; set; }

    public bool SluzbenoLice {get;set;}

    public string TajniKljuc { get; set; }

    //VEZE 1:1
    public LicnaKarta LicnaKarta { get; set; }
    public Pasos Pasos { get; set; }    
    public VozackaDozvola VozackaDozvola { get; set; }
    public SaobracajnaDozvola SaobracajnaDozvola { get; set; }
    public DozvolaZaOruzje DozvolaZaOruzje { get; set; }

    //VEZA 1:N
    public List<Termin> Termini {get;set;}

    public bool Autentifikacija(string unesenaLozinka)
    {
        return BCrypt.Net.BCrypt.Verify(unesenaLozinka, HashPassword);
    }

    public void PostaviHash(string unesenaLozinka)
    {
        this.Password=unesenaLozinka;
        this.HashPassword= BCrypt.Net.BCrypt.HashPassword(this.Password);
    }

    public void GenerisiTajniKljuc()
    {
        // Definišite dužinu tajnog ključa koji želite da generišete
        int duzinaKljuca = 32;

        // Kreirajte niz bajtova sa dovoljno prostora za generisani tajni ključ
        byte[] kljucBytes = new byte[duzinaKljuca];

        // Koristite kriptografski generator slučajnih brojeva za generisanje tajnog ključa
        using (var generator = RandomNumberGenerator.Create())
        {
            generator.GetBytes(kljucBytes);
        }

        // Konvertujte bajtove ključa u string koristeći Base64 encoding
        string tajniKljuc = Convert.ToBase64String(kljucBytes);

        // Sačuvajte generisani tajni ključ u svojstvu TajniKljuc
        TajniKljuc = tajniKljuc;
    }

    public void PostaviSluzbenoLice()
    {
        this.SluzbenoLice=true;
    }

    public void UkloniSluzbenoLice()
    {
        this.SluzbenoLice=false;
    }

    public bool proveriStaruLozinku(string unetaStaraLozinka, RegularniKorisnik korisnik)
    {
        return korisnik.Autentifikacija(unetaStaraLozinka);
    }



}