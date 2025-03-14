import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      {/* ... otro contenido ... */}
      <Link 
        to="/register" 
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Registrarse
      </Link>
      {/* ... otro contenido ... */}
    </div>
  );
};

export default Landing; 