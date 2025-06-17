import { lazy, FC, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/layout/Layout";
import theme from "./theme";

// 페이지 컴포넌트들
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/products/Lists"));
const ProductDetailPage = lazy(() => import("./pages/products/DetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProductUploadPage = lazy(() => import("./pages/products/UploadPage"));
const ProductEditPage = lazy(() => import("./pages/products/EditPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ChatRoomListPage = lazy(() => import("./pages/ChatRoomListPage"));
const ChatRoomDetailPage = lazy(
  () => import("./pages/ChatRoomDetailPage")
);
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ReportManagePage = lazy(() => import("./pages/ReportManagePage"));
const AdminDashboardPage = lazy(
  () => import("./pages/AdminDashboardPage")
);
const StoreHomePage = lazy(() => import("./pages/StoreHomePage"));

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Suspense fallback={<div>로딩중...</div>}>
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
            <Route path="/report-manage" element={<ReportManagePage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/store-home" element={<StoreHomePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
