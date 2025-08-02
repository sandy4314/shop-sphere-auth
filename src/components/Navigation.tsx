import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Commerce Store</h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            {isAdmin && <span className="bg-secondary px-2 py-1 rounded text-xs">Admin</span>}
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};