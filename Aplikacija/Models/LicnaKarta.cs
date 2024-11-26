
namespace Models;
[Table("Licna Karta")]
public class LicnaKarta : Dokument
{
        // Naziv="LicnaKarta";
        [Required]
        public string BrojLicneKarte { get; set; }


        [ForeignKey("Korisnik")]
        public int IdKorisnika { get; set; }

        [System.Text.Json.Serialization.JsonIgnore] 
        public RegularniKorisnik Korisnik { get; set; }

}