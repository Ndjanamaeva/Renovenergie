import { useEffect, useState } from 'react';
import { FrontendApp } from '@/frontend/FrontendApp';
import { AdminApp } from '@/admin/AdminApp';

function getRoute(): 'admin' | 'frontend' {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'frontend';
}

export default function App() {
  const [route, setRoute] = useState<'admin' | 'frontend'>(getRoute);

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (route === 'admin') return <AdminApp />;
  return <FrontendApp />;
}
