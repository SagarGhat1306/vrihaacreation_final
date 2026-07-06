import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL, apiGet, apiPost } from '../api';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹'

    const delivary_fee = 10;
    const backendurl = BASE_URL

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setproducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    // helper — find live stock for a product+size from loaded products
    const getStock = (itemId, size) => {
        const product = products.find(p => p._id === itemId)
        const sizeInfo = product?.sizes?.find(s => s.size === size)
        return sizeInfo ? sizeInfo.stock : 0
    }

    const AddToCart = async ({ itemId, size }) => {

        // stock check before adding (availability)
        const currentQty = cartItems?.[itemId]?.[size] || 0
        if (getStock(itemId, size) < currentQty + 1) {
            toast.error("Out of stock for this size")
            return
        }

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1
        }

        setCartItems(cartData)
        toast.success("Added to cart")

        if (token) {
            try {
                const data = await apiPost('/api/cart/add', { itemId, size }, token)
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const GetcartCount = () => {
        let totalCount = 0;

        for (const productID in cartItems) {
            for (const size in cartItems[productID]) {
                const quantity = cartItems[productID][size];
                if (quantity > 0) {
                    totalCount += quantity;
                }
            }
        }

        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {

        // stock check before increasing quantity
        if (quantity > 0 && getStock(itemId, size) < quantity) {
            toast.error(`Only ${getStock(itemId, size)} left in stock`)
            return
        }

        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)

        if (token) {
            try {
                const data = await apiPost('/api/cart/update', { itemId, size, quantity }, token)
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getUsercart = async (token) => {
        try {
            const data = await apiGet('/api/cart/get', token)
            if (data.success) {
                setCartItems(data.cartData)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const productID in cartItems) {
            const itemInfo = products.find(product => product._id === productID);

            if (!itemInfo) continue;

            for (const size in cartItems[productID]) {
                const quantity = cartItems[productID][size];

                if (quantity > 0) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }

        return totalAmount;
    };

    const getProductData = async () => {
        try {
            const data = await apiGet('/api/product/listproduct')
            if (data.success) {
                setproducts(data.products)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // dynamic Meesho-style categories for navbar + collection filters
    const getCategories = async () => {
        try {
            const data = await apiGet('/api/category/list')
            if (data.success) {
                setCategories(data.categories)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProductData();
        getCategories();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUsercart(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products, currency, delivary_fee,
        search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, AddToCart,
        GetcartCount, updateQuantity, getCartAmount, navigate, backendurl, token, setToken,
        categories, getStock, getProductData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
