namespace Backend.Models;

public class RelatorioFinanceiro
{
    public int Id { get; set; }
    public string? Entrada { get; set; }
    public DateTime? DataEntrada { get; set; }
    public decimal? ValorEntrada { get; set; }
    public string? Despesa { get; set; }
    public DateTime? DataDespesa { get; set; }
    public decimal? ValorDespesa { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
