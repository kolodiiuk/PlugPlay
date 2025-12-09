using System.Text.Json.Serialization;

namespace PlugPlay.Domain.Entities;

public class WishList
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int ProductId { get; set; }

    [JsonIgnore]
    public User User { get; set; }

    [JsonIgnore]
    public Product Product { get; set; }
}