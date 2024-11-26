namespace Models;
[Table("Korisnicka Podrska")]
public class KorisnickaPodrska
{
    [Key]
    public int ID { get; set; }

    [MaxLength(50)]
    [Required]
    public string Ime { get; set; }

    [MaxLength(50)]
    [Required]
    public string Prezime { get; set; }

    [MaxLength(50)]
    [Required]
    public string Username { get; set; }

    [NotMapped]
    public string Password { get; set; }

    [MaxLength(100)]
    [Required]
    public string HashPassword { get; set; }

    [MaxLength(50)]
    [Required]
    public string Email { get; set; }

    public string TajniKljuc {get;set;}

    public bool Podrska { get; set; }

    public bool Autentifikacija(string unesenaLozinka)
    {
        return BCrypt.Net.BCrypt.Verify(unesenaLozinka, HashPassword);
    }

    public void PostaviHash()
    {
        this.HashPassword= BCrypt.Net.BCrypt.HashPassword(this.Password);
    }

    public void PostaviPodrsku()
    {
        Podrska=true;
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

}