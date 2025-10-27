import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';



const List = ({Url}) => {
  const [list, setList] = useState([]);

  // ✅ Fetch all food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${Url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
      toast.error('Something went wrong while fetching the list!');
    }
  };

  // ✅ Remove a food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${Url}/api/food/remove`, { id: foodId });
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Something went wrong while deleting the food!');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div className='list-table-format' key={item._id}>
            <img src={`${Url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p onClick={() => removeFood(item._id)} className='delete-btn'>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
