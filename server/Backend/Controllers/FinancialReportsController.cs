using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FinancialReportsController : ControllerBase
{
    private readonly AppDbContext _db;

    public FinancialReportsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RelatorioFinanceiro>>> GetAll()
    {
        var items = await _db.RelatoriosFinanceiros
            .OrderByDescending(r => r.CriadoEm)
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RelatorioFinanceiro>> GetById(int id)
    {
        var item = await _db.RelatoriosFinanceiros.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<RelatorioFinanceiro>> Create([FromBody] FinancialReportDto dto)
    {
        var entity = new RelatorioFinanceiro
        {
            Entrada = dto.Entrada,
            DataEntrada = dto.DataEntrada,
            ValorEntrada = dto.ValorEntrada,
            Despesa = dto.Despesa,
            DataDespesa = dto.DataDespesa,
            ValorDespesa = dto.ValorDespesa,
            CriadoEm = DateTime.UtcNow
        };

        _db.RelatoriosFinanceiros.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] FinancialReportDto dto)
    {
        var entity = await _db.RelatoriosFinanceiros.FindAsync(id);
        if (entity == null) return NotFound();

        entity.Entrada = dto.Entrada;
        entity.DataEntrada = dto.DataEntrada;
        entity.ValorEntrada = dto.ValorEntrada;
        entity.Despesa = dto.Despesa;
        entity.DataDespesa = dto.DataDespesa;
        entity.ValorDespesa = dto.ValorDespesa;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var entity = await _db.RelatoriosFinanceiros.FindAsync(id);
        if (entity == null) return NotFound();

        _db.RelatoriosFinanceiros.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
