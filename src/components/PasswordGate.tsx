import { useState, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const STUDIO_PASSWORD = import.meta.env.VITE_STUDIO_PASSWORD;

export const PasswordGate: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authed, setAuthed] = useState(() => {
    if (!STUDIO_PASSWORD) return true;
    return sessionStorage.getItem('studio_auth') === 'true';
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === STUDIO_PASSWORD) {
      sessionStorage.setItem('studio_auth', 'true');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#040620] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 text-center">
        <Lock className="w-10 h-10 mx-auto text-[#0aa0ab]" />
        <h1 className="text-2xl font-bold text-white">TQI Video Studio</h1>
        <p className="text-sm text-gray-400">Enter password to continue</p>
        <Input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          className={`text-center ${error ? 'border-red-500' : ''}`}
          autoFocus
        />
        {error && <p className="text-xs text-red-400">Incorrect password</p>}
        <Button type="submit" className="w-full bg-[#0aa0ab] hover:bg-[#0aa0ab]/80">
          Enter
        </Button>
      </form>
    </div>
  );
};
