namespace Backend.DTOs;

public class AssociadosDto
{
    public string? name { get; set; }
    public string? email  { get; set; }
    public DateTime? date_of_birth { get; set; }
    public DateTime? membership_date { get; set; }
    public string? role { get; set; }
    public string? phoneNumber { get; set; }
    public double? monthly_fee { get; set; }
    public bool? active { get; set; }
}