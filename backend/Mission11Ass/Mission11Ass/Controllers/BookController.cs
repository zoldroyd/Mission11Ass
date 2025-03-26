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
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = null, [FromQuery] List<string>? bookCategories = null)
    {
        var query = _bookContext.Books.AsQueryable();

        if (bookCategories != null && bookCategories.Any())
        {
            query = query.Where(b => bookCategories.Contains(b.Category));
        }
        
        if (!string.IsNullOrEmpty(sortOrder))
        {
            query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
        }
        
        var totalNumBooks = query.Count();
        
        var data = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var result = new
        {
            Books = data,
            NumBooks = totalNumBooks
        };
        
        return Ok(result);
    }
    
    [HttpGet("GetCategories")]
    public IActionResult GetCategories()
    {
        var categories = _bookContext.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();

        return Ok(categories);
    }
}