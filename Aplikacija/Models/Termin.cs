namespace Models;
[Table("Termin")]
public class Termin
{
    [Key]
    public int ID { get; set; }

    [Required]
    public DateTime Datum_i_Vreme { get; set; }

    [Required]
    [System.Text.Json.Serialization.JsonIgnore] 
    public Stanica Stanica { get; set; }
     
    [System.Text.Json.Serialization.JsonIgnore] 
    public RegularniKorisnik Korisnik { get; set; }

    [MaxLength(200)]
    public string Opis { get; set; }

    [MaxLength(20)]
    [Required]
    public string Status { get; set; }
}