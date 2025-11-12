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
  const [isLoadingFood, setIsLoadingFood] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

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
   setIsLoadingFood(true);
   const response = await axios.get(url+"/api/food/list");
   setFood_list(response.data.data);
   setIsLoadingFood(false);
}

const loadCartData = async(token)=>{
  const response = await axios.post(url+"/api/cart/get",{},{ headers: { authorization: `Bearer ${token}` } })
  setCartItems(response.data.cart)
}

const fetchUserAddresses = async () => {
  if (token && _id) {
    try {
      const response = await axios.post(url + "/api/user/get-addresses", { userId: _id }, { headers: { authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setUserAddresses(response.data.addresses || []);
        if (response.data.addresses && response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
    }
  }
};

const addUserAddress = async (address) => {
  if (token && _id) {
    try {
      console.log("Adding address in frontend:", address);
      const response = await axios.post(url + "/api/user/add-address", { userId: _id, address }, { headers: { authorization: `Bearer ${token}` } });
      console.log("Response from add address:", response.data);
      if (response.data.success) {
        setUserAddresses(prev => [...prev, address]);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Failed to add user address:", error);
      return { success: false, message: "Something went wrong" };
    }
  }
};

const deleteUserAddress = async (index) => {
  if (token && _id) {
    try {
      console.log("Deleting address at index:", index);
      const response = await axios.post(url + "/api/user/delete-address", { userId: _id, addressIndex: index }, { headers: { authorization: `Bearer ${token}` } });
      console.log("Response from delete address:", response.data);
      if (response.data.success) {
        setUserAddresses(prev => prev.filter((_, i) => i !== index));
        // If the deleted address was selected, reset selectedAddress
        if (selectedAddress === userAddresses[index]) {
          setSelectedAddress({
            firstname: "",
            lastname: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
            phone: ""
          });
        }
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Failed to delete user address:", error);
      return { success: false, message: "Something went wrong" };
    }
  }
};



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
        setId(parsedPayload.userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
        // Handle the error, e.g., by clearing the token
        localStorage.removeItem("token");
        setToken("");
      }
      await loadCartData(storedToken);
      await fetchUserAddresses();
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
    _id,
    isLoadingFood,
    userAddresses,
    selectedAddress,
    setSelectedAddress,
    fetchUserAddresses,
    addUserAddress,
    deleteUserAddress
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
