namespace Models;
[Table("Vozacka Dozvola")]
public class VozackaDozvola : Dokument
{
        // Naziv="VozackaDozvola";

        [Required]
        public string BrojVozackeDozvole { get; set; }

        [Required]
        public string KategorijeVozila { get; set; }

        [ForeignKey("Korisnik")]
        public int IdKorisnika { get; set; }

        [System.Text.Json.Serialization.JsonIgnore] 
        public RegularniKorisnik Korisnik { get; set; }

}