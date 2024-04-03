import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../CartContex'; // Ensure the correct path to your context

const Navbar = () => {
    const { cartState: { items } } = useCart();
    const navigate = useNavigate();

    return (
        <div className='navbar-container'>
            <div
                className='navbar-logo-container'
            >
                <img onClick={() => navigate("/cart")} className='ultron-logo' src={"https://cylab-temp-testing-bucket.s3.amazonaws.com/images/ultron-logo.svg"} alt="Ultron Logo"></img>
                <img className="cart-logo" src={"https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/entropy-logo-3.png"} alt="Cart"></img>
            </div>
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