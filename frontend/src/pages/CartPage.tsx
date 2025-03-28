import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const cartTotal = cart.reduce((total, item) => total + item.subtotal, 0);

  return (
    <div className="container mt-4">
      <div className="row bg-primary text-white p-3">
        <h1 className="col-12">Your Cart</h1>
      </div>

      <div className="row">
        <div className="col-12">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="list-group">
              {cart.map((item: CartItem) => (
                <li key={item.bookId} className="list-group-item">
                  <strong>{item.title}</strong>: ${item.price.toFixed(2)} <br />
                  <strong>Quantity</strong>: {item.quantity} <br />
                  <strong>Subtotal</strong>: ${item.subtotal.toFixed(2)} <br />
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => {
                      console.log(
                        'Remove button clicked:',
                        item.bookId,
                        typeof item.bookId
                      );
                      removeFromCart(item.bookId);
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <h3>
            <strong>Total:</strong> ${cartTotal.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
