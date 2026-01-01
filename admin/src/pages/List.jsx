import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { currency} from '../App'
const List = ({token}) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/listproduct`
      )

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(
        error.response?.data?.message || "Failed to fetch product list"
      )
    }
  }

  const removeproduct = async (id) => {
    try{
      const response = await axios.post(`${backendUrl}/api/product/removeproduct` , {id} , {headers: {token}})
      console.log(token)

      if (response.data.success){
        toast.success(response.data.message)

        await fetchList();
      } 
      else{
        toast.error(response.data.message)
      }
    }catch(error){
      console.log(error)
      toast.success(response.data.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2 font-semibold'>ALL Products List</p>

      <div className='flex flex-col gap-2'>
        <div className='md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item) => (
          <div
            key={item._id}
            className='grid grid-cols-[1fr_3fr_1fr] md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border text-sm gap-2 '
          >
            <img
              src={item.image?.[0]}
              alt={item.name}
              className='w-12 h-12 object-cover'
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div onClick={()=> removeproduct(item._id)} className='text-center text-red-600 cursor-pointer'>
              Delete
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default List
