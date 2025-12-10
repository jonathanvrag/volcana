import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../auth/logout';
import { getCurrentUser } from '../../../api/users';

export default function CmsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const isActive = path =>
    location.pathname === path ? 'bg-slate-800 text-white' : 'text-slate-200';

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <div className='min-h-screen bg-slate-100 flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-slate-900 text-slate-100 flex flex-col'>
        <div className='px-6 py-4 border-b border-slate-800'>
          <h1 className='text-lg font-semibold tracking-wide'>Volcana CMS</h1>
          <p className='text-xs text-slate-400'>
            Universidad EAFIT · Pantalla Innovación
          </p>
        </div>

        <div className='flex-1 flex flex-col'>
          <nav className='px-3 py-4 space-y-1 text-sm'>
            <Link
              to='/cms'
              className={
                'block rounded px-3 py-2 hover:bg-slate-800 ' + isActive('/cms')
              }>
              Playlists
            </Link>
            <Link
              to='/cms/media'
              className={
                'block rounded px-3 py-2 hover:bg-slate-800 ' +
                isActive('/cms/media')
              }>
              Media
            </Link>
            <Link
              to='/cms/account'
              className={
                'block rounded px-3 py-2 hover:bg-slate-800 ' +
                isActive('/cms/account')
              }>
              Mi cuenta
            </Link>
          </nav>

          <div className='mt-auto px-4 pb-4'>
            <button
              onClick={() => logout(navigate)}
              className='w-full rounded-md bg-slate-800 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700'>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className='flex-1 flex flex-col'>
        <header className='h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6'>
          <h2 className='text-base font-semibold text-slate-800'>
            Panel de administración
          </h2>

          {currentUser && (
            <div className='text-xs text-slate-500 text-right'>
              <div className='font-medium text-slate-700'>
                {currentUser.full_name || currentUser.email}
              </div>
              <div className='uppercase tracking-wide text-[10px]'>
                {currentUser.role}
              </div>
            </div>
          )}
        </header>

        <section className='flex-1 p-6'>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
