using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
 
namespace Backend.Controllers;
 
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<EventsController> _logger;
    private readonly IServiceProvider _serviceProvider;
 
    public EventsController(AppDbContext db, IEmailService emailService, ILogger<EventsController> logger, IServiceProvider serviceProvider)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAll()
    {
        var items = await _db.Events
            .OrderByDescending(e => e.event_date)
            .ToListAsync();
        return Ok(items);
    }
 
    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetById(string id)
    {
        var item = await _db.Events.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }
 
    [HttpPost]
    public async Task<ActionResult<Event>> Create([FromBody] EventDto dto)
    {
        try
        {
            var entity = new Event
            {
                id = Guid.NewGuid().ToString(),
                title = dto.title,
                description = dto.description,
                event_date = dto.event_date,
                event_time = dto.event_time,
                location = dto.location
            };
 
            _db.Events.Add(entity);
            await _db.SaveChangesAsync();
 
            // Enviar notificações para os associados após criar o evento (em background com escopo novo)
            _ = Task.Run(async () =>
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    try
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                        var logger = scope.ServiceProvider.GetRequiredService<ILogger<EventsController>>();
 
                        logger.LogInformation("========== INICIANDO TAREFA DE BACKGROUND PARA NOTIFICAÇÕES ==========");
 
                        var associados = await dbContext.Associados
                            .Where(a => a.active == true && !string.IsNullOrEmpty(a.email))
                            .ToListAsync();
 
                        logger.LogInformation($"Encontrados {associados.Count} associados ativos com email para notificar");
 
                        if (associados.Any())
                        {
                            await emailService.SendEventNotificationAsync(entity, associados);
                        }
 
                        logger.LogInformation("========== FIM DA TAREFA DE BACKGROUND ==========");
                    }
                    catch (Exception ex)
                    {
                        var logger = scope.ServiceProvider.GetRequiredService<ILogger<EventsController>>();
                        logger.LogError(ex, $"❌ Erro ao enviar notificações do evento {entity.id}");
                    }
                }
            });
 
            return CreatedAtAction(nameof(GetById), new { id = entity.id }, entity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar evento");
            return StatusCode(500, new { message = "Erro ao criar evento", error = ex.Message });
        }
    }
 
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, [FromBody] EventDto dto)
    {
        var entity = await _db.Events.FindAsync(id);
        if (entity == null) return NotFound();
 
        entity.title = dto.title;
        entity.description = dto.description;
        entity.event_date = dto.event_date;
        entity.event_time = dto.event_time;
        entity.location = dto.location;
 
        await _db.SaveChangesAsync();
        return NoContent();
    }
 
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var entity = await _db.Events.FindAsync(id);
        if (entity == null) return NotFound();
 
        _db.Events.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
 
 