namespace Backend.Models;

public class Event
{
    public string? id { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public DateTime? event_date { get; set; }
    public string? event_time { get; set; }
    public string? location { get; set; }
}
