namespace Models;
[Table("Stanica")]
public class Stanica
{
    [Key]
    public int ID { get; set; }

    [MaxLength(50)]
    [Required]
    public string Naziv { get; set; }
    
    [Required]
    public string BrojTelefona { get; set; }

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
 
    public List<Termin> Termini { get; set; }
}