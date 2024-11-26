namespace Models;
[Table("Saobracajna Dozvola")]
public class SaobracajnaDozvola : Dokument
{
        // Naziv="SaobracajnaDozvola";
        [Required]
        public string BrojSaobracajneDozvole { get; set; }

        [MaxLength(20)]
        [Required]
        public string BrojRegistracije { get; set; }

        [Required]
        public DateTime DatumPrvogRegistrovanja { get; set; }

        [Required]
        public string Nosivost { get; set; }

        [Required]
        public string Masa { get; set; }

        [Required]
        public string BrojSedista { get; set; }

        [Required]
        public string GodinaProizvodnje { get; set; }

        [MaxLength(50)]
        [Required]
        public string BrojMotora { get; set; }

        [MaxLength(50)]
        [Required]
        public string BrojSasije { get; set; }

        [MaxLength(50)]
        [Required]
        public string Marka { get; set; }

        [MaxLength(50)]
        [Required]
        public string Tip { get; set; }

        [ForeignKey("Korisnik")]
        public int IdKorisnika { get; set; }

        [System.Text.Json.Serialization.JsonIgnore] 
        public RegularniKorisnik Korisnik { get; set; }
}