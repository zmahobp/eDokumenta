namespace Models;
[Table("Pasos")]
public class Pasos : Dokument
{
        //Naziv="Pasos";
        [Required]
        public string BrojPasosa { get; set; }


        [ForeignKey("Korisnik")]
        public int IdKorisnika { get; set; }
        
        [System.Text.Json.Serialization.JsonIgnore] 
        public RegularniKorisnik Korisnik { get; set; }

}