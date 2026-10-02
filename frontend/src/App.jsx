import { useEffect, useState } from 'react';
import api from './api/axios';

export default function App() {
  const [result, setResult] = useState('checking...');

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setResult(JSON.stringify(res.data)))
      .catch((err) => setResult('Error: ' + err.message));
  }, []);

  return <div className="p-6 text-brand-900">{result}</div>;
}