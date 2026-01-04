using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoluntariosController : ControllerBase
{
    private readonly AppDbContext _db;

    public VoluntariosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Voluntarios>>> GetAll()
    {
        var items = await _db.Voluntarios
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Voluntarios>> GetById(string id)
    {
        var item = await _db.Voluntarios.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Voluntarios>> Create([FromBody] VoluntariosDto dto)
    {
        var entity = new Voluntarios
        {
            id = Guid.NewGuid().ToString(),
            name = dto.name,
            email = dto.email,
            date_of_birth = dto.date_of_birth,
            phoneNumber = dto.phoneNumber
        };

        _db.Voluntarios.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.id }, entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, [FromBody] VoluntariosDto dto)
    {
        var entity = await _db.Voluntarios.FindAsync(id);
        if (entity == null) return NotFound();

        entity.name = dto.name;
        entity.email = dto.email;
        entity.date_of_birth = dto.date_of_birth;
        entity.phoneNumber = dto.phoneNumber;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var entity = await _db.Voluntarios.FindAsync(id);
        if (entity == null) return NotFound();

        _db.Voluntarios.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
