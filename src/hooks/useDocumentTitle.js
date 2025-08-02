import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Get the current pathname and remove the leading slash
    const path = location.pathname.substring(1);
    
    // Format the title (e.g., 'login' becomes 'Login')
    const pageName = path 
      ? path.charAt(0).toUpperCase() + path.slice(1).split('/')[0].replace(/-/g, ' ')
      : 'Home';
    
    // Set the document title
    document.title = pageName ? `${pageName} | MyTeacher` : 'MyTeacher';
    
    // Cleanup function to reset the title when component unmounts
    return () => {
      document.title = 'MyTeacher';
    };
  }, [location]);
};

export default useDocumentTitle;
