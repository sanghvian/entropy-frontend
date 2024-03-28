import { useNavigate } from 'react-router-dom';
import './Navbar.css'
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className='navbar-container'>
            <img className='ultron-logo' src={"https://cylab-temp-testing-bucket.s3.amazonaws.com/images/ultron-logo.svg"}></img>
            <div onClick={() => {
                navigate("/checkout");
            }}>
                <img className="cart-logo" src={"https://cylab-temp-testing-bucket.s3.amazonaws.com/images/cart-logo.png"}></img>
            </div>
        </div>
    )
}

export default Navbar
