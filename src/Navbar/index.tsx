import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../CartContex'; // Ensure the correct path to your context

const Navbar = () => {
    const { cartState: { items } } = useCart();
    const navigate = useNavigate();

    return (
        <div className='navbar-container'>
            <img className='ultron-logo' src={"https://cylab-temp-testing-bucket.s3.amazonaws.com/images/ultron-logo.svg"} alt="Ultron Logo"></img>
            <div className="cart-icon-container" onClick={() => navigate("/checkout")}>
                <img className="cart-logo" src={"https://cylab-temp-testing-bucket.s3.amazonaws.com/images/cart-logo.png"} alt="Cart"></img>
                {items.length > 0 && (
                    <div className="cart-badge">{items.reduce(
                        (acc, item) => acc + item.numUnits, 0)
                    }</div>
                )}
            </div>
        </div>
    );
};

export default Navbar;