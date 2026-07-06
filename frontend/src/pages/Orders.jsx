import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { apiPost, imgUrl } from '../api';

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const data = await apiPost('/api/order/userorders', {}, token)

      if (data.success) {
        let allOrdersItem = [];

        data.Orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* LEFT SECTION */}
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={imgUrl(item.image?.[0])} alt="" />

              <div>
                <p className="sm:text-base font-medium">{item.name}</p>

                <div className="flex items-center gap-3 mt-2 text-gray-700">
                  <p className="text-lg">{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>

                <p className="mt-2">
                  Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-2">
                  Payment: <span className="text-gray-400">{item.paymentMethod} {item.payment ? '(Paid)' : '(Pending)'}</span>
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>

              <button onClick={loadOrderData} className="bg-black text-white py-2 px-5">
                TRACK ORDER
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
