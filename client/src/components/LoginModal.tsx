import React, { useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Cerrar el modal haciendo clic en el fondo (backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isClickInside = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );

    if (!isClickInside) {
      onClose();
    }
  };

  // Sincronizar el estado del componente cuando se cierra de forma nativa (por ejemplo, con la tecla ESC)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Error de Supabase Auth:', error.message);
        alert(`Error al iniciar sesión: ${error.message}`);
      }
    } catch (err: any) {
      console.error('Error de conexión con Supabase:', err);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="login-dialog"
    >
      <div className="login-modal-content">
        <button className="login-modal-close" onClick={onClose} aria-label="Cerrar modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="login-modal-header">
          <span className="login-modal-tag">// auth portal</span>
          <h2>Iniciar Sesión</h2>
          <p>Accede para explorar funciones exclusivas y mentoría personalizada.</p>
        </div>

        <div className="login-modal-body">
          <button className="btn-google-login" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.428-2.534 4.114-4.887 4.114-3.094 0-5.6-2.506-5.6-5.6s2.506-5.6 5.6-5.6c1.394 0 2.662.512 3.642 1.353l3.22-3.22C19.123 3.655 15.932 2.4 12.24 2.4 6.706 2.4 2.2 6.906 2.2 12.44s4.506 10.04 10.04 10.04c6.19 0 9.84-4.35 9.84-9.84 0-.613-.04-1.285-.14-1.885H12.24z"
              />
              <path
                fill="#4285F4"
                d="M22.08 12.585c0-.613-.04-1.285-.14-1.885H12.24v4.115h6.887c-.28 1.15-.98 2.14-1.887 2.82l3.22 3.22c2.08-1.92 3.62-4.73 3.62-8.27z"
              />
              <path
                fill="#FBBC05"
                d="M7.353 14.914c-.26-.82-.413-1.7-.413-2.614s.153-1.794.413-2.614l-3.22-3.22C3.123 8.355 2.5 10.3 2.5 12.44s.623 4.085 1.633 5.975l3.22-3.22c0-.095.003-.186 0-.281z"
              />
              <path
                fill="#34A853"
                d="M12.24 22.44c2.81 0 5.43-.93 7.24-2.52l-3.22-3.22c-1.04.7-2.38 1.125-4.02 1.125-3.094 0-5.6-2.506-5.6-5.6l-3.22 3.22c1.92 3.89 5.89 6.995 8.82 6.995z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        <div className="login-modal-footer">
          <p>Conexión segura cifrada provista por Supabase.</p>
        </div>
      </div>
    </dialog>
  );
}
