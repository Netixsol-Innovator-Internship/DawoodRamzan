"use client";

import Title from "@/components/admin/Title";
import DateRangePicker from "@/components/admin/DateRangePicker";
import DashboardCard from "@/components/admin/DashboardCard";
import { EllipsisVerticalIcon, ShoppingBagIcon } from "lucide-react";
import SalesGraph from "@/components/admin/SalesGraph";
import BestSellers from "@/components/admin/BestSellers";
import OrderTableItem from "@/components/admin/OrderTableItem";
import {
  useGetOrdersQuery,
  OrderStatus,
  Order as ApiOrder,
} from "@/lib/services/ordersApi";

export default function Dashboard() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.total || 0),
    0
  );

  // ✅ Use enum values to avoid TS type errors
  const activeOrders = orders.filter(
    (o) =>
      o.status === OrderStatus.PENDING ||
      o.status === OrderStatus.SHIPPED
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === OrderStatus.DELIVERED
  ).length;

  const returnOrders = orders.filter(
    (o) => o.status === OrderStatus.CANCELLED
  ).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Title title="Dashboard" subtitle="Home > Dashboard" />
        <DateRangePicker />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Orders"
          subtitle="All time orders"
          totalPrice={totalRevenue}
          icon={<ShoppingBagIcon color="#fff" size={20} />}
          count={totalOrders}
        />
        <DashboardCard
          title="Active Orders"
          subtitle="Currently processing"
          totalPrice={totalRevenue}
          icon={<ShoppingBagIcon color="#fff" size={20} />}
          count={activeOrders}
        />
        <DashboardCard
          title="Completed Orders"
          subtitle="Successfully delivered"
          totalPrice={completedOrders}
          icon={<ShoppingBagIcon color="#fff" size={20} />}
          count={completedOrders}
        />
        <DashboardCard
          title="Return Orders"
          subtitle="Cancelled/Returned"
          totalPrice={returnOrders}
          icon={<ShoppingBagIcon color="#fff" size={20} />}
          count={returnOrders}
        />
      </div>

      {/* Graph + Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-3">
          <SalesGraph />
        </div>
        <BestSellers
          title="Best Seller"
          subPrice="126.5"
          totalPrice={126.5}
          icon={"DummyPro"}
          count={999}
        />
      </div>

      {/* Recent Orders */}
      <div className="py-6 px-4 bg-[#fafafa] rounded-2xl">
        <div className="flex items-center justify-between mb-2 border-b border-[#232321]/20 pb-4">
          <p className="font-rubik font-semibold text-sm !text-black">
            Recent Orders
          </p>
          <EllipsisVerticalIcon />
        </div>

        <div className="relative h-4/5 mt-4 overflow-x-auto">
          {isLoading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load orders.</p>
          ) : (
            <table className="w-full">
              <thead className="border-b border-[#232321]/20">
                <tr>
                  <td className="px-2 py-4 font-rubik font-medium">
                    <input type="checkbox" />
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80 max-sm:hidden">
                    Product
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80 max-sm:hidden">
                    Order ID
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80">
                    Date
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80 max-sm:hidden">
                    Customer Name
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80">
                    Status
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium !text-[#232321]/80">
                    Amount
                  </td>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order: ApiOrder) => (
                  <OrderTableItem
                    key={order._id}
                    orderId={order.orderNumber}
                    productName={order.items?.[0]?.name || "N/A"}
                    customerImg={order.items?.[0]?.image || ""}
                    date={
                      order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                    customerName={order.customerName}
                    status={order.status}
                    amount={order.total}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
