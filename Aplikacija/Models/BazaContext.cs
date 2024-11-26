namespace Models;
public class BazaContext : DbContext
{
    //public required DbSet<Dokument> Dokumenta { get; set;}
    public required DbSet<DozvolaZaOruzje> DozvoleZaOruzje { get; set; }
    public required DbSet<LicnaKarta> LicneKarte { get; set; }
    public required DbSet<Pasos> Pasosi { get; set; }
    public required DbSet<VozackaDozvola> VozackeDozvole { get; set; }
    public required DbSet<SaobracajnaDozvola> SaobracajneDozvole { get; set; }
    public required DbSet<Stanica> Stanice { get; set; }
    public required DbSet<Termin> Termini { get; set; }
    public required DbSet<KorisnickaPodrska> ListaKorisnickePodrske { get; set; }
    public required DbSet<RegularniKorisnik> RegularniKorisnici { get; set; }

    public BazaContext(DbContextOptions options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RegularniKorisnik>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<RegularniKorisnik>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<RegularniKorisnik>()
        .HasIndex(u => u.JMBG)
        .IsUnique();

        modelBuilder.Entity<KorisnickaPodrska>()
        .HasIndex(u => u.Email)
        .IsUnique();

        modelBuilder.Entity<KorisnickaPodrska>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }
}