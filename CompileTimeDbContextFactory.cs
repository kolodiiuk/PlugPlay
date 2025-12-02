using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PlugPlay.Infrastructure;

public class CompileTimeDbContextFactory : IDesignTimeDbContextFactory<PlugPlayDbContext>
{
    public PlugPlayDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PlugPlayDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=plugplay-db-1;Port=5432;Database=plugplay;Username=myuser;Password=mypassword");

        return new PlugPlayDbContext(optionsBuilder.Options);
    }
}
