import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { Navigation } from '@/components/Navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { ProductCard } from '@/components/shop/ProductCard';
import { Cart } from '@/components/shop/Cart';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'shop' | 'cart' | 'orders'>('shop');
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { products } = useProducts();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-8 flex items-center justify-center">
          {authMode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onShowCart={() => setCurrentView('cart')}
          onShowOrders={() => setCurrentView('orders')}
          cartItemCount={cartItemCount}
        />
        <div className="container mx-auto py-8">
          <Tabs defaultValue="add-product" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-product">Add Product</TabsTrigger>
              <TabsTrigger value="manage-products">Manage Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="add-product" className="mt-6">
              <div className="flex justify-center">
                <ProductForm />
              </div>
            </TabsContent>
            <TabsContent value="manage-products" className="mt-6">
              <ProductList />
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <OrderTracking />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'cart':
        return <Cart onCheckout={() => setCurrentView('orders')} />;
      case 'orders':
        return <OrderTracking />;
      default:
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Shop Our Products</h1>
              <p className="text-muted-foreground">Discover amazing products from our store</p>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onShowCart={() => setCurrentView('cart')}
        onShowOrders={() => setCurrentView('orders')}
        cartItemCount={cartItemCount}
      />
      <div className="container mx-auto py-8">
        <div className="mb-4">
          <Button 
            variant={currentView === 'shop' ? 'default' : 'outline'} 
            onClick={() => setCurrentView('shop')}
            className="mr-2"
          >
            Shop
          </Button>
          <Button 
            variant={currentView === 'cart' ? 'default' : 'outline'} 
            onClick={() => setCurrentView('cart')}
            className="mr-2"
          >
            Cart ({cartItemCount})
          </Button>
          <Button 
            variant={currentView === 'orders' ? 'default' : 'outline'} 
            onClick={() => setCurrentView('orders')}
          >
            Orders
          </Button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
