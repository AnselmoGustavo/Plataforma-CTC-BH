using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssociadosController : ControllerBase
{
    private readonly AppDbContext _db;

    public AssociadosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Associados>>> GetAll()
    {
        var items = await _db.Associados
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Associados>> GetById(string id)
    {
        var item = await _db.Associados.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Associados>> Create([FromBody] AssociadosDto dto)
    {
        var entity = new Associados
        {
            id = Guid.NewGuid().ToString(),
            name = dto.name,
            email = dto.email,
            date_of_birth = dto.date_of_birth,
            membership_date = dto.membership_date,
            role = dto.role,
            phoneNumber = dto.phoneNumber,
            monthly_fee = dto.monthly_fee,
            active = dto.active
        };

        _db.Associados.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.id }, entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, [FromBody] AssociadosDto dto)
    {
        var entity = await _db.Associados.FindAsync(id);
        if (entity == null) return NotFound();

        entity.name = dto.name;
        entity.email = dto.email;
        entity.date_of_birth = dto.date_of_birth;
        entity.membership_date = dto.membership_date;
        entity.role = dto.role;
        entity.phoneNumber = dto.phoneNumber;
        entity.monthly_fee = dto.monthly_fee;
        entity.active = dto.active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var entity = await _db.Associados.FindAsync(id);
        if (entity == null) return NotFound();

        _db.Associados.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
