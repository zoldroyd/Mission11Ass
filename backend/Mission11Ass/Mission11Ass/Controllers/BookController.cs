using Microsoft.AspNetCore.Mvc;
using Mission11Ass.Data;

namespace Mission11Ass.Controllers;

[Route("[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookstoreDbContext _bookContext;
    
    public BookController(BookstoreDbContext temp)
    {
        _bookContext = temp;
    }

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = null)
    {
        var books = _bookContext.Books.AsQueryable();
        
        if (!string.IsNullOrEmpty(sortOrder))
        {
            books = sortOrder.ToLower() == "desc" ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
        }
        
        var data = books
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var totalNumBooks = _bookContext.Books.Count();

        var result = new
        {
            Books = data,
            NumBooks = totalNumBooks
        };
        
        return Ok(result);
    }
}