import { useRef, useState } from 'react';

// Extend the Window interface to include the bootstrap property
declare global {
  interface Window {
    bootstrap: any;
  }
}
import { Book } from '../types/Book';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
// import { CartItem } from '../types/CartItem';

function Booklist({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toastRef = useRef(null);

  const handleAddToCart = (b: Book) => {
    const newItem: CartItem = {
      bookId: Number(b.bookID),
      title: String(b.title),
      author: String(b.author),
      quantity: 1,
      price: Number(b.price),
      subtotal: Number(b.price),
    };
    const toast = new window.bootstrap.Toast(toastRef.current);
    toast.show();

    addToCart(newItem);
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://bookstore-z-back-fgfgcxcafrhwd0fy.eastus-01.azurewebsites.net/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=title&sortOrder=${sortOrder || ''}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      console.log('Fetched books:', data.books);
      setBooks(data.books);
      setTotalItems(data.numBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]);

  const handleSort = (order: 'asc' | 'desc' | null) => {
    setSortOrder(order);
    setPageNum(1); // Reset to page 1 when sorting
  };

  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []); // Empty dependency array ensures it runs only once

  return (
    <>
      <label>
        Sort by title:
        <button
          onClick={() => handleSort('asc')}
          disabled={sortOrder === 'asc'}
        >
          A-Z
        </button>
        <button
          onClick={() => handleSort('desc')}
          disabled={sortOrder === 'desc'}
        >
          Z-A
        </button>
        <button onClick={() => handleSort(null)} disabled={sortOrder === null}>
          Original
        </button>
      </label>
      <br />
      {books.map((b) => (
        <div id="BookCard" className="card" key={b.bookID}>
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Title: </strong>
                {b.title}
              </li>
              <li>
                <strong>Author: </strong>
                {b.author}
              </li>
              <li>
                <strong>Publisher: </strong>
                {b.publisher}
              </li>
              <li>
                <strong>ISBN: </strong>
                {b.isbn}
              </li>
              <li>
                <strong>Classification: </strong>
                {b.classification}
              </li>
              <li>
                <strong>Category: </strong>
                {b.category}
              </li>
              <li>
                <strong>Number of Pages: </strong>
                {b.pageCount}
              </li>
              <li>
                <strong>Price: </strong>${b.price}
              </li>
            </ul>

            <button
              className="btn btn-success"
              onClick={() => handleAddToCart(b)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="THIS BOOK IS FIRE!"
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setPageNum(i + 1)}
          disabled={pageNum === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>

      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-primary border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">Adding to cart...</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Booklist;
