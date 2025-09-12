import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      toast.success('Payment successful! Your certificate is being processed.');
      // You can add additional logic here, like fetching certificate status
    } else {
      navigate('/certificates');
    }
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your certificate is being processed.</p>
        <p className="text-sm text-gray-500 mb-6">Reference: {reference}</p>
        <button
          onClick={() => navigate('/certificates')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View My Certificates
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
