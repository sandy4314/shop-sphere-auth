import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/auth';
import { toast } from 'sonner';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Banknote, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface CartItem extends Product {
  quantity: number;
}

type PaymentMethod = 'card' | 'manual';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface PaymentDetails {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  utrNumber?: string;
}

export const Cart = ({ onCheckout }: { onCheckout?: () => void }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Quantity updated');
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setShowPaymentDialog(true);
  };

  const processPayment = () => {
    setIsSubmitting(true);

    // Create order with payment details
    const order = {
      id: Date.now().toString(),
      userId: user.id,
      items: cartItems,
      total: getTotalPrice(),
      paymentMethod,
      paymentDetails,
      status: paymentMethod === 'card' ? 'processing' : 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      saveOrder(order);
      setIsSubmitting(false);
      setShowPaymentDialog(false);
      toast.success(
        paymentMethod === 'card' 
          ? 'Payment processed successfully!' 
          : 'UTR number submitted. Your order will be processed after payment verification.'
      );
      completeCheckout();
    }, 1500);
  };

  const saveOrder = (order: any) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  const completeCheckout = () => {
    // Clear cart
    setCartItems([]);
    localStorage.removeItem('cart');
    onCheckout?.();
  };

  const handlePaymentDetailChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-muted-foreground">
            Your cart is empty
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add some products to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Shopping Cart
        </h1>
        <Badge variant="secondary" className="px-3 py-1">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-muted-foreground">{item.category}</p>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Payment Method</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  Credit/Debit Card
                </Label>
              </div>
              <div>
                <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
                <Label
                  htmlFor="manual"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Banknote className="mb-2 h-6 w-6" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'manual' && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Please transfer the total amount to:
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>Account Name:</strong> Sandeep Kumar Bob</p>
                  <p><strong>Account Number:</strong> 098765636788</p>
                  <p><strong>Bank:</strong> Bank of Baroda</p>
                  <p><strong>IFSC Code:</strong> BOB97579778</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleCheckout} 
            className="w-full"
            size="lg"
          >
            {paymentMethod === 'card' ? (
              <>
                Pay with Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {paymentMethod === 'card' ? (
                <CreditCard className="h-5 w-5" />
              ) : (
                <Banknote className="h-5 w-5" />
              )}
              {paymentMethod === 'card' ? 'Card Payment' : 'Payment Confirmation'}
            </DialogTitle>
            <DialogDescription>
              {paymentMethod === 'card' 
                ? 'Enter your card details to complete payment'
                : 'Please enter your UTR number after completing the bank transfer'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber || ''}
                    onChange={(e) => handlePaymentDetailChange('cardNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentDetails.cardName || ''}
                    onChange={(e) => handlePaymentDetailChange('cardName', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate || ''}
                      onChange={(e) => handlePaymentDetailChange('expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv || ''}
                      onChange={(e) => handlePaymentDetailChange('cvv', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="utr">UTR Number</Label>
                  <Input
                    id="utr"
                    placeholder="Enter UTR/Transaction reference"
                    value={paymentDetails.utrNumber || ''}
                    onChange={(e) => handlePaymentDetailChange('utrNumber', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Found in your bank transaction receipt
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Amount:</strong> ${getTotalPrice().toFixed(2)}</p>
                    <p><strong>Account:</strong> Sandeep Kumar Bob (098766788)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={processPayment} 
              disabled={isSubmitting || 
                (paymentMethod === 'card' && (
                  !paymentDetails.cardNumber || 
                  !paymentDetails.cardName || 
                  !paymentDetails.expiryDate || 
                  !paymentDetails.cvv
                )) ||
                (paymentMethod === 'manual' && !paymentDetails.utrNumber)
              }
            >
              {isSubmitting ? 'Processing...' : 'Complete Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};