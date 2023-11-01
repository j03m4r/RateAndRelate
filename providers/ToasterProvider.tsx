'use client';

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
    return (
        <Toaster toastOptions={{
          style: {
            background: '#1E5F55',
            color: '#f7f1e0'
          }  
        }} />
    );
};

export default ToasterProvider;