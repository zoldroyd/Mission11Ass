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
    
    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _bookContext.Books.Add(newBook);
        _bookContext.SaveChanges();

        return Ok(newBook);
    }

    [HttpPut("updateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _bookContext.Books.Find(bookId);

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _bookContext.Books.Update(existingBook);
        _bookContext.SaveChanges();

        return Ok(existingBook);

    }

    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _bookContext.Books.Find(bookId);

        if (book == null)
        {
            return NotFound(new { message = "Project not found" });
        }

        _bookContext.Books.Remove(book);
        _bookContext.SaveChanges();

        return NoContent();
    }
}
