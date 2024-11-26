namespace Models;
[Table("Dozvola za oruzje")]
public class DozvolaZaOruzje : Dokument
{
        // Naziv="DozvolaZaOruzje";
        [Required]
        public string BrojDozvoleZaOruzje { get; set; }

        [MaxLength(200)]
        [Required]
        public string VrsteOruzja { get; set; }

        [Required]
        public string KolicinaOruzja { get; set; }

        [Required]
        public string BrojOruzjaPoVrsti { get; set; }

        [Required]
        public string KalibarOruzja { get; set; }

        [MaxLength(200)]
        [Required]
        public string MestoUpotrebe { get; set; }

        [MaxLength(200)]
        [Required]
        public string SvrhaUpotrebe { get; set; }

        [ForeignKey("Korisnik")]
        public int IdKorisnika { get; set; }


        [System.Text.Json.Serialization.JsonIgnore] 
        public RegularniKorisnik Korisnik { get; set; }
}