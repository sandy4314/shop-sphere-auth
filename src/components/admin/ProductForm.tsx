import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PlusCircle, Image as ImageIcon, DollarSign, Tag, Layers } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
  "Other"
];

export const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const { addProduct } = useProducts();
  const { user } = useAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in as admin');
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category: category || "Other",
      stock: parseInt(stock) || 0,
      image: image || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=800&fit=crop`,
      adminId: user.id
    };

    addProduct(productData);
    toast.success('Product added successfully!');
    
    // Reset form
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStock('');
    setImage('');
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <PlusCircle className="w-6 h-6" />
          Add New Product
        </CardTitle>
        <CardDescription>
          Fill out the form below to add a new product to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Product Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g. Premium Wireless Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Category *
              </Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your product in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-muted/50"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-muted/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="bg-muted/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Image
            </Label>
            <div className="flex items-center gap-4">
              {image ? (
                <>
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-md object-cover border shadow-sm" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={() => setImage('')}
                  >
                    Change Image
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center w-24 h-24 rounded-md border border-dashed bg-muted/50">
                  <Label 
                    htmlFor="image-upload" 
                    className="cursor-pointer text-center text-sm text-muted-foreground p-4"
                  >
                    Click to upload
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size: 800x800px (Max 2MB)
            </p>
          </div>
          
          <Button type="submit" className="w-full mt-6" size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};