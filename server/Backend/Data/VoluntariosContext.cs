using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class VoluntariosContext : DbContext
{
    public VoluntariosContext(DbContextOptions<VoluntariosContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Voluntarios> Voluntarios { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Voluntarios>(entity =>
        {
            entity.ToTable("Voluntarios");
            entity.Property(r => r.id).HasMaxLength(200);
            entity.Property(r => r.name).HasMaxLength(200);
            entity.Property(r => r.email).HasMaxLength(200);
            entity.Property(r => r.date_of_birth).HasColumnType("datetime2");
            entity.Property(r => r.phoneNumber).HasMaxLength(200);
        });
    }
}
