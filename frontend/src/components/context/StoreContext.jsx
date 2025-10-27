import { createContext, useEffect, useState } from "react";
// import { food_list } from "../../assets/assets";
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token , setToken] = useState("");
  const [food_list , setFood_list] = useState([]);
  const [ _id , setId] = useState("");

  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if(token){
      await axios.post(url+"/api/cart/add",{itemId},{ headers: { authorization: `Bearer ${token}` } })
    }
  };

  const removeFromCart = async(itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{ headers: { authorization: `Bearer ${token}` } })
    }
  };

const getTotalCartAmount =()=>{
  let totalAmount = 0;
       for(let item in cartItems){
         if (cartItems[item]>0) {
          let itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) {
            totalAmount = totalAmount + itemInfo.price * cartItems[item];
          }
         }
       }
       return totalAmount;
}


const fetchFoodList=async()=>{
   const response = await axios.get(url+"/api/food/list");
   setFood_list(response.data.data);
}

const loadCartData = async(token)=>{
  const response = await axios.post(url+"/api/cart/get",{},{ headers: { authorization: `Bearer ${token}` } })
  setCartItems(response.data.cart)
}



useEffect(() => {
  async function loadData() {
    await fetchFoodList();

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const parsedPayload = JSON.parse(jsonPayload);
        setId(parsedPayload.id);
      } catch (error) {
        console.error("Failed to decode token:", error);
        // Handle the error, e.g., by clearing the token
        localStorage.removeItem("token");
        setToken("");
      }
      await loadCartData(storedToken);
    }
  }

  loadData(); // call the async function
}, []);



  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    _id
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
