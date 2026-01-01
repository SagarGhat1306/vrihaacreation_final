import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { products } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$'
    
    const delivary_fee = 10;
    const backendurl = import.meta.env.VITE_BACKEND
    console.log(backendurl)

    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems , setCartItems] = useState({});
    const [products , setproducts] = useState([]);
    const [token , setToken] = useState('')
    const navigate = useNavigate()

    const AddToCart = async ({itemId, size}) => {
            

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }

            else {
                cartData[itemId][size] = 1;
            }
        }

        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1
        }

        setCartItems(cartData)
        console.log(cartData)

        if(token){
            try{
                await axios.post(`http://localhost:5000/api/cart/add`,   { itemId, size },{ headers: { token } })

            }catch(error){
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    useEffect(()=> {
        console.log(cartItems)
    },[cartItems])


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

        const updateQuantity =  async (itemId, size , quantity) => {
            let cartData = structuredClone(cartItems);

            cartData[itemId][size] = quantity;

            setCartItems(cartData)

            if(token){
            try{
                await axios.post(`${backendurl}/api/cart/update`, {itemId,size,quantity}, {headers:{token}})

            }catch(error){
                console.log(error)
                toast.error(error.message)
            }
        }
        }


        const getUsercart = async(token) => {
            try{
                const response =  await axios.get(`${backendurl}/api/cart/get`,  {headers:{token}})

                if (response.data.success){
                    setCartItems(response.data.cartData)
                }
            }
            catch(error){
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


        const getProductData = async() => {
            try{
                const response = await axios.get(`${backendurl}/api/product/listproduct`)
                if(response.data.success){
                    setproducts(response.data.products)
                }
                else{
                    toast.error(response.data.message)
                }
                console.log(response.data)
            }
            catch(error){
                console.log(error)
                toast.error(error.message)
            }
        }

        useEffect(()=>{
            getProductData();
        },[])

        useEffect(()=>{
            if(!token && localStorage.getItem('token')){
                setToken(localStorage.getItem('token'))
                getUsercart(localStorage.getItem('token'))
            }
        },[])





    const value = {
        products, currency , delivary_fee , 
        search , setSearch, showSearch , setShowSearch ,cartItems,  setCartItems , AddToCart,
        GetcartCount ,updateQuantity,getCartAmount,navigate,backendurl,token,setToken

    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
