import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Success = ({ orderId }: { orderId?: string }) => (
  <div
    style={{
      maxWidth: 420,
      margin: "60px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      padding: "36px 32px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 48, color: "#3b82f6", marginBottom: 12 }}>✔️</div>
    <h2>결제가 완료되었습니다!</h2>
    <div
      style={{
        background: "#f3f6fa",
        borderRadius: 8,
        padding: "18px 0",
        margin: "18px 0",
        fontSize: 16,
        textAlign: "left",
      }}
    >
      <div>
        <b>주문번호:</b> {orderId || "12345678"}
      </div>
      <div>
        <b>결제금액:</b> 4,797,500원
      </div>
      <div>
        <b>배송지:</b> 서울특별시 강남구 테헤란로 123
      </div>
      <div>
        <b>결제수단:</b> 신용/체크카드
      </div>
    </div>
    <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
      주문/배송 조회는 마이페이지에서 확인하실 수 있습니다.
      <br />
      빠른 배송을 위해 최선을 다하겠습니다.
    </div>
    <div>
      <button
        style={{
          margin: "0 8px",
          padding: "10px 24px",
          border: "none",
          borderRadius: 6,
          background: "#3b82f6",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/mypage")}
      >
        마이페이지로 이동
      </button>
      <button
        style={{
          margin: "0 8px",
          padding: "10px 24px",
          border: "none",
          borderRadius: 6,
          background: "#e5e7eb",
          color: "#374151",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/")}
      >
        쇼핑 계속하기
      </button>
    </div>
  </div>
);

const Fail = ({ errorMsg }: { errorMsg?: string }) => (
  <div
    style={{
      maxWidth: 420,
      margin: "60px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      padding: "36px 32px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 48, color: "#ef4444", marginBottom: 12 }}>❌</div>
    <h2>결제에 실패하였습니다</h2>
    <div
      style={{
        background: "#f3f6fa",
        borderRadius: 8,
        padding: "18px 0",
        margin: "18px 0",
        fontSize: 16,
        textAlign: "left",
      }}
    >
      <div>
        <b>실패 사유:</b> {errorMsg || "알 수 없는 오류가 발생했습니다."}
      </div>
    </div>
    <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
      결제 정보를 다시 확인해 주세요.
      <br />
      문제가 지속될 경우 고객센터로 문의해 주세요.
    </div>
    <div>
      <button
        style={{
          margin: "0 8px",
          padding: "10px 24px",
          border: "none",
          borderRadius: 6,
          background: "#3b82f6",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/cart")}
      >
        장바구니로 돌아가기
      </button>
      <button
        style={{
          margin: "0 8px",
          padding: "10px 24px",
          border: "none",
          borderRadius: 6,
          background: "#e5e7eb",
          color: "#374151",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/")}
      >
        메인으로
      </button>
    </div>
  </div>
);

const CheckoutPage: React.FC = () => {
  const query = useQuery();
  const result = query.get("result"); // 'success' or 'fail'
  const orderId = query.get("orderId");
  const errorMsg = query.get("msg");

  if (result === "success") {
    return <Success orderId={orderId || undefined} />;
  }
  if (result === "fail") {
    return <Fail errorMsg={errorMsg || undefined} />;
  }
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>잘못된 접근입니다.</div>
  );
};

export default CheckoutPage;
