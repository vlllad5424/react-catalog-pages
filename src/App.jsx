import { useEffect, useState } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    const controller = new AbortController();
    const url = import.meta.env.BASE_URL + 'products.json';

    async function loadProducts() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Ожидается массив');
        if (controller.signal.aborted) return;
        setProducts(data);
        setStatus('success');
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
        setStatus('error');
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [attempt]);   if (status === 'loading') return <p>Загрузка…</p>;

  if (status === 'error') {
    return (
      <main>
        <p role="alert">Ошибка: {error}</p>
        <button type="button" onClick={() => {
          setStatus('loading');
          setAttempt(previous => previous + 1);
        }}>Повторить</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Каталог товаров</h1>
      <p>Всего товаров: {products.length}</p>
      {products.length === 0 && <p>Каталог пуст.</p>}
      <ul id="products">
        {products.slice(0, limit).map(product => (
          <li key={product.id}>{product.name}: {product.qty} шт.</li>
        ))}
      </ul>
      {limit < products.length && (
  <button type="button" onClick={() => setLimit(n => n + 25)}>
    Показать ещё
  </button>
)}

    </main>
  );
}

