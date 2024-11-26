using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aplikacija.Migrations
{
    /// <inheritdoc />
    public partial class final : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Korisnicka Podrska",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HashPassword = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TajniKljuc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Podrska = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnicka Podrska", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Regularni Korisnik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ImeRoditelja = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JMBG = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HashPassword = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Grad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Opstina = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ulica = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Broj = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Datum_rodjenja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Mesto_Rodjenja = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Pol = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    Fotografija = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SluzbenoLice = table.Column<bool>(type: "bit", nullable: false),
                    TajniKljuc = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regularni Korisnik", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Stanica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojTelefona = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Opstina = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ulica = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Broj = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stanica", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Dozvola za oruzje",
                columns: table => new
                {
                    IDdokumenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojDozvoleZaOruzje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VrsteOruzja = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    KolicinaOruzja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojOruzjaPoVrsti = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KalibarOruzja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MestoUpotrebe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SvrhaUpotrebe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IdKorisnika = table.Column<int>(type: "int", nullable: false),
                    QR_kod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum_izdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_isteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    izdat_od = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dozvola za oruzje", x => x.IDdokumenta);
                    table.ForeignKey(
                        name: "FK_Dozvola za oruzje_Regularni Korisnik_IdKorisnika",
                        column: x => x.IdKorisnika,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Licna Karta",
                columns: table => new
                {
                    IDdokumenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojLicneKarte = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdKorisnika = table.Column<int>(type: "int", nullable: false),
                    QR_kod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum_izdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_isteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    izdat_od = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Licna Karta", x => x.IDdokumenta);
                    table.ForeignKey(
                        name: "FK_Licna Karta_Regularni Korisnik_IdKorisnika",
                        column: x => x.IdKorisnika,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pasos",
                columns: table => new
                {
                    IDdokumenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojPasosa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdKorisnika = table.Column<int>(type: "int", nullable: false),
                    QR_kod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum_izdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_isteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    izdat_od = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pasos", x => x.IDdokumenta);
                    table.ForeignKey(
                        name: "FK_Pasos_Regularni Korisnik_IdKorisnika",
                        column: x => x.IdKorisnika,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Saobracajna Dozvola",
                columns: table => new
                {
                    IDdokumenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojSaobracajneDozvole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojRegistracije = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DatumPrvogRegistrovanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Nosivost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Masa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojSedista = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GodinaProizvodnje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojMotora = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojSasije = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Marka = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdKorisnika = table.Column<int>(type: "int", nullable: false),
                    QR_kod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum_izdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_isteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    izdat_od = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Saobracajna Dozvola", x => x.IDdokumenta);
                    table.ForeignKey(
                        name: "FK_Saobracajna Dozvola_Regularni Korisnik_IdKorisnika",
                        column: x => x.IdKorisnika,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vozacka Dozvola",
                columns: table => new
                {
                    IDdokumenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojVozackeDozvole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KategorijeVozila = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdKorisnika = table.Column<int>(type: "int", nullable: false),
                    QR_kod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum_izdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Datum_isteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    izdat_od = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vozacka Dozvola", x => x.IDdokumenta);
                    table.ForeignKey(
                        name: "FK_Vozacka Dozvola_Regularni Korisnik_IdKorisnika",
                        column: x => x.IdKorisnika,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Termin",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Datum_i_Vreme = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StanicaID = table.Column<int>(type: "int", nullable: false),
                    KorisnikID = table.Column<int>(type: "int", nullable: true),
                    Opis = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Termin", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Termin_Regularni Korisnik_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Regularni Korisnik",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Termin_Stanica_StanicaID",
                        column: x => x.StanicaID,
                        principalTable: "Stanica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dozvola za oruzje_IdKorisnika",
                table: "Dozvola za oruzje",
                column: "IdKorisnika",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Korisnicka Podrska_Email",
                table: "Korisnicka Podrska",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Korisnicka Podrska_Username",
                table: "Korisnicka Podrska",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Licna Karta_IdKorisnika",
                table: "Licna Karta",
                column: "IdKorisnika",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pasos_IdKorisnika",
                table: "Pasos",
                column: "IdKorisnika",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regularni Korisnik_Email",
                table: "Regularni Korisnik",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regularni Korisnik_JMBG",
                table: "Regularni Korisnik",
                column: "JMBG",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regularni Korisnik_Username",
                table: "Regularni Korisnik",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Saobracajna Dozvola_IdKorisnika",
                table: "Saobracajna Dozvola",
                column: "IdKorisnika",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Termin_KorisnikID",
                table: "Termin",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Termin_StanicaID",
                table: "Termin",
                column: "StanicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Vozacka Dozvola_IdKorisnika",
                table: "Vozacka Dozvola",
                column: "IdKorisnika",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dozvola za oruzje");

            migrationBuilder.DropTable(
                name: "Korisnicka Podrska");

            migrationBuilder.DropTable(
                name: "Licna Karta");

            migrationBuilder.DropTable(
                name: "Pasos");

            migrationBuilder.DropTable(
                name: "Saobracajna Dozvola");

            migrationBuilder.DropTable(
                name: "Termin");

            migrationBuilder.DropTable(
                name: "Vozacka Dozvola");

            migrationBuilder.DropTable(
                name: "Stanica");

            migrationBuilder.DropTable(
                name: "Regularni Korisnik");
        }
    }
}
