/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
  Order,
  OrderStatus,
} from "@/lib/services/ordersApi";
import { useGetPaymentsQuery } from "@/lib/services/paymentsApi";
import { Loader2, CreditCard, Package, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery();

  console.log(orders);
  const [cancelOrder] = useCancelOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // merge orders + payments
  const ordersWithPayments = useMemo(() => {
    if (!orders) return [];
    return orders.map((order) => ({
      ...order,
      payments:
        payments?.filter(
          (p) =>
            (typeof p.orderId === "string"
              ? p.orderId
              : (p.orderId as any)?._id) === order._id
        ) || [],
    }));
  }, [orders, payments]);

  if (ordersLoading || paymentsLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No orders found.</p>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    await cancelOrder(id);
    setSelectedOrder(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {ordersWithPayments.map((order) => (
          <Card key={order._id} className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg">
                Order #{order.orderNumber}
              </CardTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  order.status === OrderStatus.DELIVERED
                    ? "bg-green-100 text-green-700"
                    : order.status === OrderStatus.CANCELLED
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status.toLowerCase()}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Items
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-3 border-b pb-2 last:border-none"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        ${item.price}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping
                </h3>
                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                {/* paid using */}
                <span className="text-xs text-gray-500">
                  Paid using:{" "}
                  <span className="capitalize">{order.paidUsing}</span>
                </span>
              </div>

              {/* Payments */}
              {/* Payments */}
              {order.payments.length > 0 &&
              order.payments.some((p) => p.status === "completed") ? (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payments
                  </h3>
                  <ul className="space-y-1">
                    {order.payments
                      .filter((payment) => payment.status === "completed")
                      .map((payment) => (
                        <li
                          key={payment._id}
                          className="flex flex-col text-sm text-gray-600 border-b pb-2 last:border-none"
                        >
                          <div className="flex justify-between">
                            <span className="text-green-600 font-medium">
                              Paid
                            </span>
                            <span className="text-xs text-gray-500">
                              {payment.transactionId || "N/A"}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No payments found for this order.
                </p>
              )}

              {/* Cancel Action */}
              <div className="flex gap-2">
                {order.status !== OrderStatus.CANCELLED && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cancel Order Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to cancel{" "}
            <span className="font-medium">
              Order #{selectedOrder?.orderNumber}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleCancel(selectedOrder?._id as string)}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
