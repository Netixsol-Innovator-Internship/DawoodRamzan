"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/admin/Title";
import DateRangePicker from "@/components/admin/DateRangePicker";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import RecentPurchaseTableItem from "@/components/admin/RecentPurchaseTableItem";
import { useGetOrdersQuery, Order as ApiOrder } from "@/lib/services/ordersApi"; // use the API type

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export default function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [filteredItems, setFilteredItems] = useState<ApiOrder[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const itemsPerPage = 8;
  const router = useRouter();

  // Fetch orders from API
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  // Handle responsiveness
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOrderDetails = (orderId: string) => {
    router.push(`/account/orders/${orderId}`);
  };

  // Apply filters
  useEffect(() => {
    if (!orders) return;

    let result = [...orders];

    // Status filter
    if (selectedStatus) {
      result = result.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Date filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = dateRange.startDate;
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((item) => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredItems(result);
    setCurrentPage(1);
  }, [orders, selectedStatus, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 2 : 4;

    if (totalPages <= maxVisiblePages + 3) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= maxVisiblePages) {
        for (let i = 1; i <= maxVisiblePages; i++) pageNumbers.push(i);
        pageNumbers.push("...", totalPages);
      } else if (
        currentPage > maxVisiblePages &&
        currentPage < totalPages - 2
      ) {
        pageNumbers.push(1, "...");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push("...", totalPages);
      } else {
        pageNumbers.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <Title title="Orders List" subtitle="Home > Orders List" />
        <div className="flex flex-col md:flex-row gap-4">
          <DateRangePicker onDateRangeChange={setDateRange} />
          <select
            name="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-3 rounded-lg bg-[#f4f2f2] font-open-sans font-semibold text-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="py-6 px-4 bg-[#fafafa] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-2 border-b border-[#232321]/20 pb-4">
          <p className="font-rubik font-semibold text-sm !text-black">
            Recent Purchases
          </p>
          <EllipsisVertical />
        </div>

        {isLoading ? (
          <p className="text-center py-6">Loading orders...</p>
        ) : isError ? (
          <p className="text-center py-6 text-red-500">
            Failed to load orders.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#232321]/20">
                <tr>
                  <td className="px-2 py-4 font-rubik font-medium">
                    <input type="checkbox" />
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium hidden sm:table-cell">
                    Product
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium hidden md:table-cell">
                    Order ID
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium">Date</td>
                  <td className="px-2 py-4 font-rubik font-medium hidden sm:table-cell">
                    Customer Name
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium">Status</td>
                  <td className="px-2 py-4 font-rubik font-medium">Amount</td>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => handleOrderDetails(item._id)}
                      className="cursor-pointer hover:bg-[#232321]/5 transition-colors border-b border-[#232321]/20"
                    >
                      <RecentPurchaseTableItem
                        productName={item.items?.[0]?.name || "N/A"}
                        orderId={item.orderNumber?.toString() || "N/A"}
                        date={
                          item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"
                        }
                        customerName={item.customerName || "N/A"}
                        status={item.status || "N/A"}
                        amount={item.total || 0}
                        isMobile={isMobile}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-4 text-center font-open-sans font-semibold text-base !text-[#232321]/80"
                    >
                      No orders found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="flex justify-center md:justify-start items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? "bg-[#232321] text-white cursor-not-allowed"
                : "border border-[#232321] text-[#232321]"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {getPageNumbers().map((number, index) =>
            number === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => paginate(Number(number))}
                className={`font-rubik font-medium py-1 px-3 rounded-lg ${
                  currentPage === number
                    ? "bg-[#232321] text-white"
                    : "border border-[#232321] text-[#232321]"
                }`}
              >
                {number}
              </button>
            )
          )}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === totalPages
                ? "bg-[#232321] text-white cursor-not-allowed"
                : "border border-[#232321] text-[#232321]"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
