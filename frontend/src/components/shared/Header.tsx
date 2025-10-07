import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">FinAssist</h1>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </nav>
    </header>
  );
}