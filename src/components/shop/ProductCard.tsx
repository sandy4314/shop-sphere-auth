import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/auth';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">${product.price}</span>
            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
          </div>
          <p className="text-sm"><strong>Category:</strong> {product.category}</p>
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};