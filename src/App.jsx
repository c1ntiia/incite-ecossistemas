// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import InitialHome from './pages/InitialHome'
// import Home from './pages/Home'
// import Layout from './templates/layout'
// import './App.css'

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<InitialHome />} />
//         <Route element={<Layout />}>
//           <Route path="/home" element={<Home />} />
//         </Route>
//       </Routes>
//     </Router>
//   )
// }

import { useState, useEffect } from 'react';
import { api } from './api';

function App() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        // Coloque a rota correta do seu backend aqui:
        const response = await api.get('/'); 
        
        // Se a API retornar um objeto com os itens dentro (ex: response.data.items), ajuste aqui:
        setDados(response.data); 
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) return <p className="p-6">Carregando ecossistemas do servidor...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão: API Ecossistemas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dados.map((item, index) => (
          <div key={item.id || index} className="border p-4 rounded shadow">
            {/* Ajuste item.nome e item.descricao para as colunas exatas do seu banco */}
            <h2 className="text-xl font-semibold">{item.nome || 'Sem nome'}</h2>
            <p className="text-gray-600 mt-2">{item.descricao || 'Sem descrição'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;