// import 'antd/dist/antd.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import { CartProvider } from './CartContex';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Outlet />
      </div>
    </CartProvider>
  );
}

export default App;
