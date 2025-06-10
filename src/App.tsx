import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/layout/Layout";
import theme from "./theme";

// 페이지 컴포넌트들
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetailPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const MyPage = React.lazy(() => import("./pages/MyPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ProductUploadPage = React.lazy(() => import("./pages/ProductUploadPage"));
const ProductEditPage = React.lazy(() => import("./pages/ProductEditPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ReviewsPage = React.lazy(() => import("./pages/ReviewsPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const ChatRoomListPage = React.lazy(() => import("./pages/ChatRoomListPage"));
const ChatRoomDetailPage = React.lazy(
  () => import("./pages/ChatRoomDetailPage")
);
const OrdersPage = React.lazy(() => import("./pages/OrdersPage"));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <React.Suspense fallback={<div>로딩중...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/mypage/*" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/upload" element={<ProductUploadPage />} />
            <Route path="/product/edit/:id" element={<ProductEditPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/chatrooms" element={<ChatRoomListPage />} />
            <Route path="/chatrooms/:id" element={<ChatRoomDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
