'use client';

import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  const handleLogout = () => {
    signOut();
  };

  return (
    <button className="text-vino-500 hover:text-vino-700 hover:underline" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};
