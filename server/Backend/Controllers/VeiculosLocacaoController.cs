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
public class VeiculosLocacaoController : ControllerBase
{
    private readonly AppDbContext _db;

    public VeiculosLocacaoController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VeiculoLocacao>>> GetAll(
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        [FromQuery] string? vehicleType = null)
    {
        var query = _db.VeiculosLocacao.AsQueryable();

        // Filtro por status (active/inactive)
        if (!string.IsNullOrEmpty(status))
        {
            var now = DateTime.UtcNow;
            if (status.ToLower() == "active")
            {
                query = query.Where(v => v.DataSaida == null || v.DataSaida > now);
            }
            else if (status.ToLower() == "inactive")
            {
                query = query.Where(v => v.DataSaida != null && v.DataSaida <= now);
            }
        }

        // Filtro por busca (nome ou placa)
        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(v => 
                v.NomeParceiro.ToLower().Contains(searchLower) ||
                v.Placa.ToLower().Contains(searchLower));
        }

        // Filtro por tipo de veículo
        if (!string.IsNullOrEmpty(vehicleType))
        {
            query = query.Where(v => v.TipoVeiculo.ToLower().Contains(vehicleType.ToLower()));
        }

        var items = await query
            .OrderByDescending(v => v.CriadoEm)
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VeiculoLocacao>> GetById(int id)
    {
        var item = await _db.VeiculosLocacao.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<VeiculoLocacao>> Create([FromBody] VeiculoLocacaoDto dto)
    {
        var entity = new VeiculoLocacao
        {
            NomeParceiro = dto.NomeParceiro,
            Espaco = dto.Espaco,
            DataEntrada = dto.DataEntrada,
            DataSaida = dto.DataSaida,
            NumeroVaga = dto.NumeroVaga,
            TipoVeiculo = dto.TipoVeiculo,
            Modelo = dto.Modelo,
            Placa = dto.Placa,
            CriadoEm = DateTime.UtcNow
        };

        _db.VeiculosLocacao.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] VeiculoLocacaoDto dto)
    {
        var entity = await _db.VeiculosLocacao.FindAsync(id);
        if (entity == null) return NotFound();

        entity.NomeParceiro = dto.NomeParceiro;
        entity.Espaco = dto.Espaco;
        entity.DataEntrada = dto.DataEntrada;
        entity.DataSaida = dto.DataSaida;
        entity.NumeroVaga = dto.NumeroVaga;
        entity.TipoVeiculo = dto.TipoVeiculo;
        entity.Modelo = dto.Modelo;
        entity.Placa = dto.Placa;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var entity = await _db.VeiculosLocacao.FindAsync(id);
        if (entity == null) return NotFound();

        _db.VeiculosLocacao.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
