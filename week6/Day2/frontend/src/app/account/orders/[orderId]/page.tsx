/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Title from "@/components/admin/Title";
import DateRangePicker from "@/components/admin/DateRangePicker";
import { EllipsisVerticalIcon, Printer, User } from "lucide-react";
import { BsHandbag } from "react-icons/bs";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/services/ordersApi";

// ✅ Import OrderStatus enum from your types
import { OrderStatus } from "@/lib/services/ordersApi";

export default function OrderDetails({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  // ✅ Fetch order by ID
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(orderId);

  // ✅ Mutation hook
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  if (isLoading) {
    return <p className="p-4">Loading order details...</p>;
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <img
          src="/no-order.png"
          alt="No order found"
          className="w-full max-w-[400px] h-auto"
        />
        <p className="font-rubik font-semibold text-xl md:text-2xl !text-[#232321]/80 mt-4 text-center">
          No Order Found
        </p>
      </div>
    );
  }

  // ✅ Calculate totals
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.2;
  const tax = subtotal * taxRate;
  const discount = 0;
  const shippingRate = 0;
  const total = order.total;

  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  // ✅ Strict typing for newStatus
  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setLoadingStatus(true);
      await updateOrderStatus({
        id: orderId,
        data: { status: newStatus },
      }).unwrap();

      await refetch();
      setStatusMenuOpen(false);
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status ❌");
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Title
          title="Order Details"
          subtitle="Home > Order List > Order Details"
        />
      </div>

      {/* Order Header */}
      <div className="py-4 md:py-6 px-4 bg-[#fafafa] rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <h1 className="text-lg md:text-xl font-rubik font-semibold">
            Order Number: {order.orderNumber}
          </h1>
          <div
            className={`p-2 rounded-lg font-open-sans font-semibold text-xs capitalize ${
              order.status === OrderStatus.DELIVERED
                ? "bg-green-100 !text-green-800"
                : order.status === OrderStatus.PROCESSING
                ? "bg-blue-100 !text-blue-800"
                : order.status === OrderStatus.SHIPPED
                ? "bg-yellow-100 !text-yellow-800"
                : "bg-red-100 !text-red-800"
            }`}
          >
            {order.status.toLowerCase()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row md:items-center items-start md:justify-between gap-4 mb-4">
          <div className="w-full md:w-auto">
            <DateRangePicker />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-4 rounded-lg bg-[#f4f2f2] cursor-pointer text-[#232321] flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-[#f4f2f2] font-open-sans font-semibold text-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Customer */}
          <div className="p-4 md:p-6 rounded-2xl border border-[#E7E7E3]">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-3 md:p-4 rounded-lg bg-[#232321]">
                <User color="#fff" size={20} />
              </div>
              <div>
                <h5 className="font-semibold text-lg md:text-xl mb-2">
                  Customer
                </h5>
                <p className="font-open-sans text-sm md:text-base !text-[#70706E]">
                  Full Name:{" "}
                  <span className="text-black">{order.customerName}</span>
                </p>
                <p className="font-open-sans text-sm md:text-base !text-[#70706E]">
                  User ID: <span className="text-black">{order.userId}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="p-4 md:p-6 rounded-2xl border border-[#E7E7E3]">
            <div className="flex items-start gap-3 md:gap-4 mb-4 relative">
              <div className="p-3 md:p-4 rounded-lg bg-[#232321]">
                <BsHandbag color="#fff" size={20} />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-lg md:text-xl mb-2">
                  Order Info
                </h5>
                <p className="font-open-sans text-sm md:text-base !text-[#70706E]">
                  Shipping Address:{" "}
                  <span className="text-black">{order.shippingAddress}</span>
                </p>
                <p className="font-open-sans text-sm md:text-base !text-[#70706E] flex items-center gap-2">
                  Status:{" "}
                  <span className="text-black capitalize">{order.status}</span>
                  {/* 3 dots menu */}
                  <div className="relative">
                    <button
                      onClick={() => setStatusMenuOpen((prev) => !prev)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <EllipsisVerticalIcon size={18} />
                    </button>
                    {statusMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
                        {Object.values(OrderStatus).map((status) => (
                          <button
                            key={status}
                            disabled={loadingStatus}
                            onClick={() => handleStatusChange(status)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              order.status === status ? "font-semibold" : ""
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Section */}
        <div id="print-content" className="mt-6">
          <div className="py-4 md:py-6 px-4 bg-[#fafafa] rounded-2xl">
            <div className="flex items-center justify-between mb-2 border-b border-[#232321]/20 pb-4">
              <p className="font-rubik font-semibold text-sm md:text-base !text-black">
                Products
              </p>
              <EllipsisVerticalIcon size={20} />
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full">
                <thead className="border-b border-[#232321]/20">
                  <tr>
                    <th className="px-2 py-3 text-left">Product Name</th>
                    <th className="px-2 py-3 text-left">Qty</th>
                    <th className="px-2 py-3 text-left">Price</th>
                    <th className="px-2 py-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b border-[#232321]/20">
                      <td className="px-2 py-3">{item.name}</td>
                      <td className="px-2 py-3">{item.quantity}</td>
                      <td className="px-2 py-3">
                        {currency} {item.price.toFixed(2)}
                      </td>
                      <td className="px-2 py-3">
                        {currency} {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <div className="flex justify-between mb-3">
                <p>Subtotal</p>
                <p>
                  {currency}
                  {subtotal.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-3">
                <p>Tax (20%)</p>
                <p>
                  {currency}
                  {tax.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-3">
                <p>Discount</p>
                <p>
                  {currency}
                  {discount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-3">
                <p>Shipping</p>
                <p>
                  {currency}
                  {shippingRate.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#232321]/20">
                <p className="text-lg md:text-2xl font-semibold">Total</p>
                <p className="text-lg md:text-2xl font-semibold">
                  {currency}
                  {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
