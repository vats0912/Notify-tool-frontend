import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast';
const socket = io('http://localhost:3000')

function Notify() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification-receive', (data) => {
      toast(`${data.message}`, {
        icon: '🔔',
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: '#333',
        },
      });
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off('notification-receive');
  }, []);

  const styleMap = {
    success: 'border-green-800',
    warning: 'border-red-800',
    error: 'border-red-800',
    info: 'border-blue-800'
  };


  const requestNotification = () => {
    socket.emit('real-time-notification')
  }

  function formatTime(value) {
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Invalid Time' : date.toLocaleTimeString();
  }


  return (
    <div className='min-h-screen bg-gray-600 flex flex-col items-center p-10'>
      <h1 className='mb-6 font-bold text-3xl text-black'>🔔Live Notifications</h1>
      <button onClick={requestNotification} className='px-4 py-2 bg-blue-600 text-white rounded shadow cursor-pointer hover:bg-blue-800'>Request Notification</button>
      <ul className='mt-6 w-full max-w-md space-y-4 '>
        {notifications ?
          notifications.map((notification, index) => (
            <li key={index} className={`bg-white p-4 rounded shadow border-2 flex justify-between ${styleMap[notification.type]}`}>
              <span className='text-black'>{notification.message}</span>
              <time className='text-gray-500 text-sm'>{formatTime(notification.timeStamp)}</time>
            </li>
          ))
          :
          <li className='bg-white rounded shadow border-2 p-4 text-center text-gray-500 text-bold'>No notifications yet</li>
        }
      </ul>
    </div>
  )
}

export default Notify