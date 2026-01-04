namespace Backend.Models;
 
public class EventNotification
{
    public string? id { get; set; }
    public string? event_id { get; set; }
    public string? associado_id { get; set; }
    public string? email { get; set; }
    public DateTime? sent_date { get; set; }
    public string? status { get; set; }
    public string? error_message { get; set; }
}
 
 