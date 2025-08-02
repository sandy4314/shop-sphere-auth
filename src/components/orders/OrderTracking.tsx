import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {isAdmin ? 'All Orders' : 'My Orders'}
      </h2>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Items:</strong> {order.items.length} item(s)</p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Order Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {isAdmin && (
                  <div className="mt-4 flex gap-2">
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
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};