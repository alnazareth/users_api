using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private static readonly List<User> _users = new()
    {
        new User { Id = 1, Name = "Jhon Doe" },
        new User { Id = 2, Name = "Jane Doe" }
    };

    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(_users);
    }

    [HttpPost]
    public IActionResult AddUser([FromBody] User newUser)
    {
        
        if (newUser == null || string.IsNullOrWhiteSpace(newUser.Name))
        {
            return BadRequest("Datos de usuario inválidos");
        }

       
        var newId = _users.Any() ? _users.Max(u => u.Id) + 1 : 1;
        newUser.Id = newId;

        _users.Add(newUser);

       
        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);

        return user == null ? NotFound() : Ok(user);

       
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);


        return user == null ? NotFound() : Ok(_users.Remove(user));

      
    }
}