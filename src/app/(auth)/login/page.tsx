'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch {
      // Error is handled by useAuth
    }
  }

  return (
    <div className="bg-bg-dark min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Branding Header */}
      <header className="fixed top-0 left-0 z-50 p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center bg-primary rounded-lg text-bg-dark">
            <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white uppercase">
            Modern Obsidian
          </h1>
        </Link>
      </header>

      {/* Left Side: Visual */}
      <section className="hidden md:flex relative w-1/2 bg-bg-dark items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Abstract Geometric Characters */}
        <div className="relative flex items-end gap-4 z-10">
          <div className="geometric-shape w-32 h-48 bg-accent-purple rounded-t-xl flex flex-col items-center justify-start pt-8 gap-1 relative overflow-hidden">
            <div className="flex gap-4">
              <div className="size-2 bg-bg-dark rounded-full" />
              <div className="size-2 bg-bg-dark rounded-full" />
            </div>
            <div className="w-4 h-0.5 bg-bg-dark/30 rounded-full mt-2" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="geometric-shape w-28 h-32 bg-primary rounded-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden">
            <div className="flex gap-3">
              <div className="size-1.5 bg-bg-dark rounded-full" />
              <div className="size-1.5 bg-bg-dark rounded-full" />
            </div>
            <div className="w-6 h-1 bg-bg-dark/20 rounded-full mt-1" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
          </div>

          <div className="geometric-shape w-20 h-56 bg-white/5 border border-white/10 rounded-t-full flex flex-col items-center justify-start pt-12 gap-1 backdrop-blur-sm">
            <div className="flex gap-2">
              <div className="size-1.5 bg-white/40 rounded-full" />
              <div className="size-1.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Right Side: Form */}
      <main className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold mb-3 tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="text-slate-400">Securely access your portfolio dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Email Address
              </label>
              <div className="relative group neon-glow rounded-xl border border-white/5 bg-white/5 transition-all duration-300">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  mail
                </span>
                <input
                  className="w-full bg-transparent border-none rounded-xl py-4 pl-12 pr-4 focus:ring-0 focus:outline-none text-white placeholder:text-slate-600 transition-colors"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a className="text-xs text-primary hover:text-primary/80 transition-colors font-medium" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group neon-glow rounded-xl border border-white/5 bg-white/5 transition-all duration-300">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                  lock
                </span>
                <input
                  className="w-full bg-transparent border-none rounded-xl py-4 pl-12 pr-12 focus:ring-0 focus:outline-none text-white placeholder:text-slate-600 transition-colors"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
              <input
                className="size-4 rounded border-white/10 bg-transparent text-primary focus:ring-primary focus:ring-offset-bg-dark"
                id="remember"
                type="checkbox"
              />
              <label className="text-sm text-slate-400 select-none cursor-pointer" htmlFor="remember">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn-glow w-full bg-primary hover:bg-primary/90 text-bg-dark font-[family-name:var(--font-display)] font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && (
                <span className="material-symbols-outlined">arrow_forward</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-dark px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-xl">terminal</span>
              GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            New here?{' '}
            <Link className="text-primary hover:underline font-medium" href="/register">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <footer className="absolute bottom-8 left-0 right-0 text-center text-slate-600 text-xs">
          <div className="flex gap-4 justify-center mb-2">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Help</a>
          </div>
          <p>&copy; 2024 Modern Obsidian Portfolio</p>
        </footer>
      </main>
    </div>
  );
}
