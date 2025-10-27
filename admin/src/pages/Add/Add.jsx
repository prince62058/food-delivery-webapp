import React, { useState } from 'react'
import './Add.css'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const Add = ({Url}) => {

  
  //store image in image
  const [image , setImage] = useState(false);
  const [data , setData] = useState({
    name : '',
    description : '',
    category : '',
    price : ''
  })

  const onChaneHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData({...data , [name] : value})
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Form submit hone par page reload nahi hoga

    try {
      // FormData create kar rahe hain
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price);

      // POST request bhejte hain server pe
      const response = await axios.post(`${Url}/api/food/add`, formData);

      // Agar server ne success true bheja
      if (response.data.success) {
        setData({
          name: '',
          description: '',
          category: '',
          price: ''
        });
        setImage(false);
        toast.success(response.data.message);
        console.log('Food added successfully!');
      } else {
        console.log('Server error: Could not add food.');
        toast.error('Server error: Could not add food.');
      }

    } catch (error) {
      // Network ya koi bhi axios error catch ho jayega
      console.error('Error while adding food:', error);
      toast.error('Something went wrong! Please try again.');
    }
  };

  return (
    <div className='add'>
      <form action="" className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image" className='img-box'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required/>
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChaneHandler}  value={data.name} name="name" type="text" placeholder='Product Name' required/>
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChaneHandler}  value={data.description} name="description" rows='6' placeholder='Write Content here ...'></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Prduct Category</p>
            <select onChange={onChaneHandler}  value={data.category} name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChaneHandler} value={data.price} type="number" name='price' placeholder='₹40' required/>
          </div>
        </div>

        <button type='submit'>Add Product</button>
      </form>
    </div>
  )
}

export default Add
