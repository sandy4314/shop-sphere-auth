import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Banknote, Package, Truck, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  paymentMethod: 'card' | 'manual';
  paymentDetails: {
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
    utrNumber?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (isAdmin) {
      setOrders(allOrders);
    } else if (user) {
      setOrders(allOrders.filter((order: Order) => order.userId === user.id));
    }
  }, [user, isAdmin]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map((order: Order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    if (isAdmin) {
      setOrders(updatedOrders);
    } else if (user) {
      setOrders(updatedOrders.filter((order: Order) => order.userId === user.id));
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />;
      case 'processing': return <CreditCard className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return 'N/A';
    const last4 = cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {isAdmin ? 'All Orders' : 'My Orders'}
      </h2>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium text-muted-foreground">
              No orders found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAdmin ? 'No orders have been placed yet' : 'You have no orders yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3">Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Information */}
                  <div>
                    <h4 className="font-medium mb-3">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'card' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Banknote className="h-4 w-4" />
                          )}
                          <p className="font-medium">
                            {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                          </p>
                        </div>
                      </div>

                      {order.paymentMethod === 'card' ? (
                        <>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Card Number</p>
                            <p className="font-medium">
                              {formatCardNumber(order?.paymentDetails?.cardNumber)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Cardholder Name</p>
                            <p className="font-medium">
                              {order?.paymentDetails?.cardName || 'N/A'}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Expiry Date</p>
                            <p className="font-medium">
                              {order?.paymentDetails?.expiryDate || 'N/A'}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">UTR Number</p>
                          <p className="font-medium">
                            {order?.paymentDetails?.utrNumber || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <>
                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          disabled={order.status !== 'pending'}
                        >
                          Mark Processing
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          disabled={order.status !== 'processing'}
                        >
                          Mark Shipped
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          disabled={order.status !== 'shipped'}
                        >
                          Mark Delivered
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};