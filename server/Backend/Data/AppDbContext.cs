using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RelatorioFinanceiro> RelatoriosFinanceiros { get; set; } = null!;
    public DbSet<VeiculoLocacao> VeiculosLocacao { get; set; } = null!;
    public DbSet<Associados> Associados { get; set; } = null!;
    public DbSet<Voluntarios> Voluntarios { get; set; } = null!;
    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventNotification> EventNotifications { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<RelatorioFinanceiro>(entity =>
        {
            entity.ToTable("RelatoriosFinanceiros");
            entity.Property(r => r.Entrada).HasMaxLength(200);
            entity.Property(r => r.Despesa).HasMaxLength(200);
            entity.Property(r => r.ValorEntrada).HasColumnType("decimal(18,2)");
            entity.Property(r => r.ValorDespesa).HasColumnType("decimal(18,2)");
            entity.Property(r => r.CriadoEm).HasColumnType("datetime2");
        });

        modelBuilder.Entity<VeiculoLocacao>(entity =>
        {
            entity.ToTable("VeiculosLocacao");
            entity.Property(v => v.NomeParceiro).HasMaxLength(200).IsRequired();
            entity.Property(v => v.Espaco).HasMaxLength(100).IsRequired();
            entity.Property(v => v.NumeroVaga).HasMaxLength(50).IsRequired();
            entity.Property(v => v.TipoVeiculo).HasMaxLength(100).IsRequired();
            entity.Property(v => v.Modelo).HasMaxLength(200).IsRequired();
            entity.Property(v => v.Placa).HasMaxLength(20).IsRequired();
            entity.Property(v => v.DataEntrada).HasColumnType("datetime2");
            entity.Property(v => v.DataSaida).HasColumnType("datetime2");
            entity.Property(v => v.CriadoEm).HasColumnType("datetime2");
            entity.HasIndex(v => v.Placa);
        });

        modelBuilder.Entity<Associados>(entity =>
        {
            entity.ToTable("Associados");
            entity.Property(a => a.name).HasMaxLength(200).IsRequired();
            entity.Property(a => a.email).HasMaxLength(200);
            entity.Property(a => a.phoneNumber).HasMaxLength(20);
            entity.Property(a => a.date_of_birth).HasColumnType("datetime2");
            entity.Property(a => a.membership_date).HasColumnType("datetime2");
            entity.Property(a => a.role).HasMaxLength(100);
            entity.Property(a => a.monthly_fee).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Voluntarios>(entity =>
        {
            entity.ToTable("Voluntarios");
            entity.Property(v => v.id).HasMaxLength(200);
            entity.Property(v => v.name).HasMaxLength(200).IsRequired();
            entity.Property(v => v.email).HasMaxLength(200);
            entity.Property(v => v.date_of_birth).HasColumnType("datetime2");
            entity.Property(v => v.phoneNumber).HasMaxLength(20);
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("Events");
            entity.Property(e => e.id).HasMaxLength(200);
            entity.Property(e => e.title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.description).HasMaxLength(1000);
            entity.Property(e => e.event_date).HasColumnType("datetime2");
            entity.Property(e => e.event_time).HasMaxLength(8);
            entity.Property(e => e.location).HasMaxLength(500);
        });

        modelBuilder.Entity<EventNotification>(entity =>
        {
            entity.ToTable("EventNotifications");
            entity.Property(n => n.id).HasMaxLength(200);
            entity.Property(n => n.event_id).HasMaxLength(200);
            entity.Property(n => n.associado_id).HasMaxLength(200);
            entity.Property(n => n.email).HasMaxLength(200);
            entity.Property(n => n.sent_date).HasColumnType("datetime2");
            entity.Property(n => n.status).HasMaxLength(50);
            entity.Property(n => n.error_message).HasMaxLength(1000);
        });
 
    }
}
