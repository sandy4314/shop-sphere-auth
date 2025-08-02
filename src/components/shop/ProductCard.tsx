import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/auth';
import { toast } from 'sonner';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
}

export const ProductCard = ({ product, onWishlistToggle, isInWishlist }: ProductCardProps) => {
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success(`${product.name} added to cart!`, {
      description: 'View your cart to checkout',
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart'
      }
    });
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-60 object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        
        {/* Wishlist button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={onWishlistToggle}
            >
              <Heart 
                className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                strokeWidth={isInWishlist ? 2 : 1.5}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          </TooltipContent>
        </Tooltip>

        {/* Stock status badge */}
        {isOutOfStock ? (
          <Badge variant="destructive" className="absolute bottom-2 left-2">
            Out of Stock
          </Badge>
        ) : product.stock < 5 ? (
          <Badge variant="secondary" className="absolute bottom-2 left-2">
            Only {product.stock} left!
          </Badge>
        ) : null}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2 leading-tight">
            {product.name}
          </CardTitle>
          <div className="text-2xl font-bold whitespace-nowrap">
            ${product.price.toFixed(2)}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-1">(24)</span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="font-medium">Category:</span>
          <Badge variant="outline" className="text-muted-foreground">
            {product.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full gap-2"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};