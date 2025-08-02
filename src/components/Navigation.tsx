import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Package, User } from 'lucide-react';

interface NavigationProps {
  onShowCart?: () => void;
  onShowOrders?: () => void;
  cartItemCount?: number;
}

export const Navigation = ({ onShowCart, onShowOrders, cartItemCount = 0 }: NavigationProps) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Commerce Store</h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onShowCart} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Button variant="ghost" onClick={onShowOrders}>
              <Package className="w-5 h-5" />
            </Button>
            
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {user.name}
            </span>
            
            {isAdmin && (
              <span className="bg-secondary px-2 py-1 rounded text-xs">Admin</span>
            )}
            
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};