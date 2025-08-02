import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

export const ProductList = () => {
  const { products, deleteProduct } = useProducts();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Products</h2>
      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No products added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  Delete Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};