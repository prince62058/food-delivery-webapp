import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'


const FoodDisplay = ({category}) => {
   const {food_list,isLoadingFood} = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
       <h2>Top dishes near you</h2>
       {isLoadingFood ? (
         <div className="loading-spinner">
           <div className="spinner"></div>
           <p>Loading...</p>
         </div>
       ) : (
         <div className="food-display-list">
           {food_list.map((item,index)=>{
             if (category === "All" || category.toLowerCase() === item.category.toLowerCase()) {
               return <FoodItem key={index} id={item._id} name={item.name} price={item.price} description={item.description} image={item.image}/>
             }
           })}
         </div>
       )}
    </div>
  )
}

export default FoodDisplay;
