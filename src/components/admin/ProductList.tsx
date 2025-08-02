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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Products</h2>

      {products.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <CardContent>
            <p className="text-gray-600 text-lg">No products added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </CardTitle>
                <p className="text-gray-700 text-sm flex-grow">{product.description}</p>
                <div className="mt-4 space-y-1 text-sm text-gray-800">
                  <p>
                    <span className="font-semibold">Price:</span> ${product.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p>
                    <span className="font-semibold">Stock:</span> {product.stock}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-6 w-full"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  Delete Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
