
import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from "./ErrorPage";
import HomePage from "./HomePage";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "/cart",
                element: <CartPage />
            },
            {
                path: "/checkout",
                element: <CheckoutPage />
            },
        ],
    },
]);