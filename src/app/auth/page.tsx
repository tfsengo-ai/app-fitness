"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Definir URL de redirecionamento apenas no cliente
    setRedirectUrl(window.location.origin);

    // Verificar se usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading || !redirectUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              FitPro
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Seu app fitness completo
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Entre ou crie sua conta para começar
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#1e293b',
                    defaultButtonBackgroundHover: '#334155',
                    defaultButtonBorder: '#475569',
                    defaultButtonText: '#e2e8f0',
                    dividerBackground: '#475569',
                    inputBackground: '#0f172a',
                    inputBorder: '#334155',
                    inputBorderHover: '#475569',
                    inputBorderFocus: '#10b981',
                    inputText: '#f1f5f9',
                    inputLabelText: '#cbd5e1',
                    inputPlaceholder: '#64748b',
                    messageText: '#f1f5f9',
                    messageTextDanger: '#ef4444',
                    anchorTextColor: '#10b981',
                    anchorTextHoverColor: '#059669',
                  },
                  space: {
                    spaceSmall: '8px',
                    spaceMedium: '16px',
                    spaceLarge: '24px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google']}
            redirectTo={redirectUrl}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Crie uma senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Continuar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  confirmation_text: 'Verifique seu e-mail para confirmar',
                },
                forgotten_password: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu e-mail para redefinir a senha',
                },
              },
            }}
          />
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Ao continuar, você concorda com nossos</p>
          <p className="mt-1">
            <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Termos de Uso</span>
            {' e '}
            <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Política de Privacidade</span>
          </p>
        </div>
      </div>
    </div>
  );
}
