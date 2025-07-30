import { CSSProperties, useEffect, useState } from "react";
import { Order } from "types/order";

const orderStatusList = [
  { key: "ALL", label: "전체" },
  { key: "ORDERED", label: "배송준비중" },
  { key: "SHIPPED", label: "배송중" },
  { key: "DELIVERED", label: "배송완료" },
  { key: "CANCELED", label: "취소" },
  { key: "RETURNED", label: "반품" },
];

const statusColors: Record<string, string> = {
  ORDERED: "#eab308",
  SHIPPED: "#6366f1",
  DELIVERED: "#22c55e",
  CANCELED: "#ef4444",
  RETURNED: "#64748b",
};

const statusLabels: Record<string, string> = {
  ORDERED: "배송준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송완료",
  CANCELED: "취소",
  RETURNED: "반품",
};

const headerCellStyle = (
  align: "left" | "right" | "center" = "left",
  width?: number
): CSSProperties => ({
  textAlign: align,
  padding: "16px 12px",
  borderBottom: "1px solid #e5e7eb",
  width,
});

const bodyCellStyle = (
  align: "left" | "right" | "center" = "left",
  width?: number
): CSSProperties => ({
  textAlign: align,
  padding: "18px 12px",
  verticalAlign: "top",
  width,
});

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [statusChange, setStatusChange] = useState<Record<string, string>>({});
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [allStatusChange, setAllStatusChange] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(orders);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const filtered = orders.filter((order) => {
    const matchStatus = filter === "ALL" || order.status === filter;
    const matchSearch =
      search === "" ||
      String(order.orderId).includes(search) ||
      order.shippingInfo.recipientName.includes(search) ||
      order.items.some((item) => item.productName.includes(search));
    return matchStatus && matchSearch;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filtered.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const applyStatusChange = () => {
    const ordersAfterIndividualChanges = orders.map((order) =>
      statusChange[order.orderId]
        ? { ...order, status: statusChange[order.orderId] }
        : order
    );

    const finalOrders = ordersAfterIndividualChanges.map((order) =>
      selectedOrders.has(String(order.orderId)) && allStatusChange
        ? { ...order, status: allStatusChange }
        : order
    );

    setOrders(finalOrders);
    localStorage.setItem("orders", JSON.stringify(finalOrders));

    setStatusChange({});
    setSelectedOrders(new Set());
    setAllStatusChange("");
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  return (
    <div
      style={{ background: "#f7fafc", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>
          주문 관리
        </div>
        <div style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          주문 상태를 변경하고 관리할 수 있습니다.
        </div>

        {/* 상태 필터 */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          {orderStatusList.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: filter === s.key ? "#3b82f6" : "#64748b",
                background: filter === s.key ? "#e0f2fe" : "none",
                border: "none",
                borderRadius: 8,
                padding: "7px 18px",
                cursor: "pointer",
              }}
            >
              {s.label}{" "}
              <span style={{ fontWeight: 400, color: "#a3a3a3", fontSize: 14 }}>
                {s.key === "ALL"
                  ? orders.length
                  : orders.filter((o) => o.status === s.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div style={{ marginBottom: 18 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="주문번호, 고객명 또는 상품명으로 검색"
            style={{
              width: "100%",
              maxWidth: 420,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
            }}
          />
        </div>

        {/* 테이블 카드 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #e0e7ef",
            padding: 0,
            overflow: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1000,
              textAlign: "left",
            }}
          >
            <thead
              style={{ background: "#f3f6fa", fontWeight: 600, fontSize: 15 }}
            >
              <tr>
                <th style={headerCellStyle("center", 48)}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(
                          new Set(paginatedOrders.map((o) => String(o.orderId)))
                        );
                      } else {
                        setSelectedOrders(new Set());
                      }
                    }}
                    checked={
                      paginatedOrders.length > 0 &&
                      paginatedOrders.every((o) =>
                        selectedOrders.has(String(o.orderId))
                      )
                    }
                  />
                </th>
                <th style={headerCellStyle("left")}>주문 정보</th>
                <th style={headerCellStyle("left")}>고객 정보</th>
                <th style={headerCellStyle("left")}>상품 정보</th>
                <th style={headerCellStyle("right")}>결제 금액</th>
                <th style={headerCellStyle("center")}>주문 상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: 48,
                      color: "#a3a3a3",
                      fontSize: 17,
                    }}
                  >
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    style={{ borderBottom: "1px solid #f1f5f9", fontSize: 15 }}
                  >
                    <td style={bodyCellStyle("center", 48)}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(String(order.orderId))}
                        onChange={(e) =>
                          handleSelectOrder(
                            String(order.orderId),
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td style={bodyCellStyle()}>
                      <div style={{ fontWeight: 600, color: "#3b82f6" }}>
                        {order.orderId}
                      </div>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 14,
                        }}
                      >
                        {order.orderedAt}
                      </div>
                    </td>
                    <td style={bodyCellStyle()}>
                      <div>{order.shippingInfo.recipientName}</div>
                      <div style={{ color: "#64748b", fontSize: 14 }}>
                        {order.shippingInfo.recipientPhone}
                      </div>
                    </td>
                    <td style={bodyCellStyle()}>
                      {order.items.map((item, index) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom:
                              index < order.items.length - 1 ? 12 : 0,
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 8,
                              objectFit: "cover",
                              background: "#f3f6fa",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {item.productName}
                            </div>
                            <div style={{ color: "#64748b", fontSize: 14 }}>
                              {item.size} / {item.quantity}개
                            </div>
                            {item.discount > 0 && (
                              <div style={{ fontSize: 12, color: "#ef4444" }}>
                                {item.productPrice.toLocaleString()}원 →{" "}
                                {item.discountPrice.toLocaleString()}원 (-
                                {item.discount.toLocaleString()}원)
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td style={bodyCellStyle("right", 120)}>
                      {order.totalPrice.toLocaleString()}원
                    </td>
                    <td style={bodyCellStyle("center", 120)}>
                      <span
                        style={{
                          background: statusColors[order.status] || "#64748b",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "4px 14px",
                          fontWeight: 600,
                          fontSize: 14,
                          display: "inline-block",
                        }}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 상태 변경 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#64748b", fontSize: 14 }}>
            {selectedOrders.size > 0 && `${selectedOrders.size}개 주문 선택됨`}
          </div>
          <select
            value={allStatusChange}
            onChange={(e) => setAllStatusChange(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
              minWidth: 150,
            }}
          >
            <option value="">선택한 주문 상태 변경</option>
            {orderStatusList
              .filter((s) => s.key !== "ALL")
              .map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
          </select>
          <button
            onClick={applyStatusChange}
            disabled={
              Object.keys(statusChange).length === 0 &&
              (selectedOrders.size === 0 || !allStatusChange)
            }
            style={{
              background:
                Object.keys(statusChange).length > 0 ||
                (selectedOrders.size > 0 && allStatusChange)
                  ? "#6366f1"
                  : "#9ca3af",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor:
                Object.keys(statusChange).length > 0 ||
                (selectedOrders.size > 0 && allStatusChange)
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            변경 적용
          </button>
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#e5e7eb",
                border: "none",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                fontWeight: 500,
              }}
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  backgroundColor: currentPage === page ? "#6366f1" : "#e5e7eb",
                  color: currentPage === page ? "#fff" : "#1f2937",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                backgroundColor: "#e5e7eb",
                border: "none",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                fontWeight: 500,
              }}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
