namespace Models;
[Table("Dokument")]
public class Dokument
{
    [Key]
    public int IDdokumenta { get; set; }

    [MaxLength(50)]
    public string QR_kod { get; set; }

    [Required]
    public DateTime Datum_izdavanja { get; set; }

    [Required]
    public DateTime Datum_isteka { get; set; }

    [MaxLength(50)]
    [Required]
    public string izdat_od { get; set; }

    [MaxLength(20)]
    public string Naziv {get; set;}

    //generisanje QR koda sa logom za dokument
    public byte[] GenerateQRCode()
    {
        //kreiranje QR koda
        var logoBitmap = GetLogo();
        AnyBitmap logoImage = new AnyBitmap(logoBitmap);
        QRCodeLogo qrCodeLogo = new QRCodeLogo(logoImage);
        var qrCode = QRCodeWriter.CreateQrCodeWithLogo(this.QR_kod,qrCodeLogo, 200, 0);
        var qrCodeBitmapPNG = qrCode.ToPngBinaryData();
        return qrCodeBitmapPNG;
    }

    public byte[] GetLogo()
    {
        var putanjaDoLoga = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Fotografije", "logo.jpg");
        var bitmap = new System.Drawing.Bitmap(putanjaDoLoga);

        using (var memoryStream = new MemoryStream())
        {
            bitmap.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
            return memoryStream.ToArray();
        }
    }
}