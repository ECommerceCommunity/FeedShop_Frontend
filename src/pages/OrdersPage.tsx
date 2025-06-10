import React, { useState } from "react";

const orderStatusList = [
  { key: "all", label: "전체" },
  { key: "paid", label: "결제완료" },
  { key: "ready", label: "배송준비중" },
  { key: "shipping", label: "배송중" },
  { key: "done", label: "배송완료" },
  { key: "cancel", label: "취소" },
  { key: "return", label: "반품" },
];

const ordersInit = [
  {
    id: "ORD-20250609-001",
    date: "2025-06-09 09:23:45",
    customer: "김민준",
    phone: "010-1234-5678",
    product: {
      name: "프리미엄 무선 이어폰",
      option: "블랙",
      qty: 1,
      image: "https://cdn-icons-png.flaticon.com/128/1042/1042330.png",
    },
    price: 129000,
    status: "ready",
  },
  {
    id: "ORD-20250608-042",
    date: "2025-06-08 14:12:33",
    customer: "이서연",
    phone: "010-9876-5432",
    product: {
      name: "스마트 홈 IoT 센서",
      option: "화이트",
      qty: 2,
      image: "https://cdn-icons-png.flaticon.com/128/1042/1042331.png",
    },
    price: 89000,
    status: "shipping",
  },
  {
    id: "ORD-20250607-118",
    date: "2025-06-07 18:45:22",
    customer: "박지훈",
    phone: "010-5555-7777",
    product: {
      name: "초경량 노트북 파우치",
      option: "네이비",
      qty: 1,
      image: "https://cdn-icons-png.flaticon.com/128/1042/1042332.png",
    },
    price: 32000,
    status: "done",
  },
  {
    id: "ORD-20250606-093",
    date: "2025-06-06 11:32:17",
    customer: "최수아",
    phone: "010-2222-3333",
    product: {
      name: "프리미엄 원목 키보드",
      option: "월넛",
      qty: 1,
      image: "https://cdn-icons-png.flaticon.com/128/1042/1042333.png",
    },
    price: 189000,
    status: "paid",
  },
  {
    id: "ORD-20250605-127",
    date: "2025-06-05 15:18:42",
    customer: "정도윤",
    phone: "010-8888-9999",
    product: {
      name: "유기농 그린티 세트",
      option: "선물세트",
      qty: 2,
      image: "https://cdn-icons-png.flaticon.com/128/1042/1042334.png",
    },
    price: 58000,
    status: "cancel",
  },
];

const statusColors: Record<string, string> = {
  paid: "#3b82f6",
  ready: "#eab308",
  shipping: "#6366f1",
  done: "#22c55e",
  cancel: "#ef4444",
  return: "#64748b",
};
const statusLabels: Record<string, string> = {
  paid: "결제완료",
  ready: "배송준비중",
  shipping: "배송중",
  done: "배송완료",
  cancel: "취소",
  return: "반품",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(ordersInit);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [statusChange, setStatusChange] = useState<Record<string, string>>({});

  const filtered = orders.filter(
    (order) =>
      (filter === "all" || order.status === filter) &&
      (search === "" ||
        order.id.includes(search) ||
        order.customer.includes(search) ||
        order.product.name.includes(search))
  );

  const handleStatusChange = (id: string, value: string) => {
    setStatusChange((s) => ({ ...s, [id]: value }));
  };
  const applyStatusChange = () => {
    setOrders((orders) =>
      orders.map((order) =>
        statusChange[order.id]
          ? { ...order, status: statusChange[order.id] }
          : order
      )
    );
    setStatusChange({});
  };

  return (
    <div
      style={{ background: "#f7fafc", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>
          주문 관리
        </div>
        <div style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
          주문 상태를 변경하고 관리할 수 있습니다.
        </div>
        {/* 상태 필터 */}
        <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
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
                {s.key === "all"
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
              width: 420,
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
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{ background: "#f3f6fa", fontWeight: 600, fontSize: 15 }}
            >
              <tr>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                    width: 48,
                  }}
                ></th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  주문 정보
                </th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  고객 정보
                </th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  상품 정보
                </th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  결제 금액
                </th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  주문 상태
                </th>
                <th
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                    width: 180,
                  }}
                >
                  상태 변경
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #f1f5f9", fontSize: 15 }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input type="checkbox" />
                    </td>
                    <td
                      style={{
                        padding: "18px 0",
                        color: "#3b82f6",
                        fontWeight: 600,
                      }}
                    >
                      <div>{order.id}</div>
                      <div
                        style={{
                          color: "#64748b",
                          fontWeight: 400,
                          fontSize: 14,
                        }}
                      >
                        {order.date}
                      </div>
                    </td>
                    <td style={{ padding: "18px 0" }}>
                      <div>{order.customer}</div>
                      <div style={{ color: "#64748b", fontSize: 14 }}>
                        {order.phone}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "18px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          objectFit: "cover",
                          background: "#f3f6fa",
                        }}
                      />
                      <div>
                        <div>{order.product.name}</div>
                        <div style={{ color: "#64748b", fontSize: 14 }}>
                          {order.product.option} / {order.product.qty}개
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "18px 0", fontWeight: 600 }}>
                      {order.price.toLocaleString()}원
                    </td>
                    <td style={{ padding: "18px 0" }}>
                      <span
                        style={{
                          background: statusColors[order.status],
                          color: "#fff",
                          borderRadius: 8,
                          padding: "4px 14px",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td style={{ padding: "18px 0" }}>
                      <select
                        value={statusChange[order.id] || "상태 변경"}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        style={{
                          padding: "8px 14px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          fontSize: 15,
                          minWidth: 120,
                        }}
                      >
                        <option>상태 변경</option>
                        {orderStatusList
                          .filter((s) => s.key !== "all")
                          .map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* 상태 일괄 변경 (UI만) */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
          }}
        >
          <select
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
              minWidth: 120,
            }}
          >
            <option>상태 일괄 변경</option>
            {orderStatusList
              .filter((s) => s.key !== "all")
              .map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
          </select>
          <button
            onClick={applyStatusChange}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            상태 변경 적용
          </button>
        </div>
      </div>
    </div>
  );
}
