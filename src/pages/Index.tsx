import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { Navigation } from '@/components/Navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { products } = useProducts();

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
        <Navigation />
        <div className="container mx-auto py-8">
          <Tabs defaultValue="add-product" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-product">Add Product</TabsTrigger>
              <TabsTrigger value="manage-products">Manage Products</TabsTrigger>
            </TabsList>
            <TabsContent value="add-product" className="mt-6">
              <div className="flex justify-center">
                <ProductForm />
              </div>
            </TabsContent>
            <TabsContent value="manage-products" className="mt-6">
              <ProductList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8">
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
      </div>
    </div>
  );
};

export default Index;
