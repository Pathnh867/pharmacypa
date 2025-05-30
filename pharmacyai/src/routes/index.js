import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import HomePage from "../pages/Homepage/HomePage";
import OrderPage from "../pages/Orderpage/OrderPage";
import ProductPage from "../pages/Productpage/ProductPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PaymentResultPage from "../pages/PaymentResultPage/PaymentResultPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import OrderHistory from "../pages/OrderHistory/OrderHistory";
import PrescriptionProductsPage from "../pages/PrescriptionProductsPage/PrescriptionProductsPage";
import MyPrescriptions from "../pages/MyPrescriptions/MyPrescriptions"; 
// import PaymentPage from "../pages/Payment/PaymentPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductPage,
        isShowHeader: true
    },
    {
        path: '/products/prescription',
        page: PrescriptionProductsPage,
        isShowHeader: true
    },
    {
        path: '/products/non-prescription',
        page: PrescriptionProductsPage,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true,
        
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
        
    },
    {
        path: '/payment-result',
        page: PaymentResultPage,
        isShowHeader: true
    },
    {
        path: '/order-history',
        page: OrderHistory,
        isShowHeader: true
    },
    {
        path: '/prescriptions',
        page: MyPrescriptions,
        isShowHeader: true
    }
]