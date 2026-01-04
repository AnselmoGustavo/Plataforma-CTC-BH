namespace Backend.DTOs;

public class VeiculoLocacaoDto
{
    public string NomeParceiro { get; set; } = null!;
    public string Espaco { get; set; } = null!;
    public DateTime DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
    public string NumeroVaga { get; set; } = null!;
    public string TipoVeiculo { get; set; } = null!;
    public string Modelo { get; set; } = null!;
    public string Placa { get; set; } = null!;
}
