using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AssociadosContext : DbContext
{
    public AssociadosContext(DbContextOptions<AssociadosContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Associados> Associados { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Associados>(entity =>
        {
            entity.ToTable("Associados");
            entity.Property(r => r.id).HasMaxLength(200);
            entity.Property(r => r.name).HasMaxLength(200);
            entity.Property(r => r.email).HasMaxLength(200);
            entity.Property(r => r.date_of_birth).HasColumnType("datetime2");
            entity.Property(r => r.membership_date).HasColumnType("datetime2");
            entity.Property(r => r.role).HasMaxLength(200);
            entity.Property(r => r.phoneNumber).HasMaxLength(200);
            entity.Property(r => r.monthly_fee).HasMaxLength(200);
            entity.Property(r => r.active).HasMaxLength(200);
        });
    }
}
