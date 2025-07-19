import { lazy, FC, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/rollback/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";

// 페이지 컴포넌트들
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/products/Lists"));
const ProductDetailPage = lazy(() => import("./pages/products/DetailPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ProductUploadPage = lazy(
  () => import("./pages/products/registerProduct/RegisterProductPage")
);
const ProductEditPage = lazy(
  () => import("./pages/products/editProduct/EditProductsPage")
);
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const UserManagePage = lazy(() => import("./pages/UserManagePage"));
const ReportManagePage = lazy(() => import("./pages/ReportManagePage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const StatsDashboardPage = lazy(() => import("./pages/StatsDashboardPage"));
const StoreHomePage = lazy(() => import("./pages/stores/StoreHomePage"));
const CartPage = lazy(() => import("./pages/cart/CartPage"));
const PaymentPage = lazy(() => import("./pages/order/PaymentPage"));
const OrdersPage = lazy(() => import("./pages/order/OrdersPage"));
const CheckoutPage = lazy(() => import("./pages/order/CheckoutPage"));
const WishListPage = lazy(() => import("./pages/cart/WishListPage"));
const RecentViewPage = lazy(() => import("./pages/cart/RecentViewPage"));
const ReviewEditPage = lazy(() => import("./pages/reviews/ReviewEditPage"));
const ProfileSettingsPage = lazy(() => import("./pages/ProfileSettingsPage"));
const FeedListPage = lazy(() => import("./pages/feed/FeedListPage"));
const FeedDetailPage = lazy(() => import("./pages/feed/FeedDetailPage"));
const FeedCreatePage = lazy(() => import("./pages/feed/FeedCreatePage"));
const FeedEditPage = lazy(() => import("./pages/feed/FeedEditPage"));
const MyFeedPage = lazy(() => import("./pages/feed/MyFeedPage"));
const EventListPage = lazy(() => import("./pages/event/EventListPage"));
const EventCreatePage = lazy(() => import("./pages/event/EventCreatePage"));
const EventDetailPage = lazy(() => import("./pages/event/EventDetailPage"));
const EventEditPage = lazy(() => import("./pages/event/EventEditPage"));
const EventResultPage = lazy(() => import("./pages/event/EventResultPage"));
const BecomeAdminPage = lazy(() => import("./pages/BecomeAdminPage"));

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<div>로딩중...</div>}>
          <Routes>
            {/* Layout이 필요한 페이지들 */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/mypage/*" element={<MyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/product/upload" element={<ProductUploadPage />} />
              <Route path="/products/edit/:id" element={<ProductEditPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/report-manage" element={<ReportManagePage />} />
              <Route path="/user-manage" element={<UserManagePage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/stats-dashboard" element={<StatsDashboardPage />} />
              <Route path="/store-home" element={<StoreHomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishListPage />} />
              <Route path="/recentview" element={<RecentViewPage />} />
              <Route path="/reviews/edit" element={<ReviewEditPage />} />
              <Route
                path="/profile-settings"
                element={<ProfileSettingsPage />}
              />
              <Route path="/feed-list" element={<FeedListPage />} />
              <Route path="/feed/:id" element={<FeedDetailPage />} />
              <Route path="/feed-create" element={<FeedCreatePage />} />
              <Route path="/feed-edit" element={<FeedEditPage />} />
              <Route path="/my-feed" element={<MyFeedPage />} />
              <Route path="/event-list" element={<EventListPage />} />
              <Route path="/events/create" element={<EventCreatePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/events/edit/:id" element={<EventEditPage />} />
              <Route path="/events/result" element={<EventResultPage />} />
              <Route path="/become-admin" element={<BecomeAdminPage />} />
            </Route>

            {/* Layout 없이 보여야 하는 페이지들 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
