import { AppProps } from "next/app";
import AuthProvider from "../contexts/AuthContext";  // Importando o AuthProvider
import '../../styles/global.scss';
import 'react-toastify/dist/ReactToastify.css'; // Estilo do Toastify
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider> {/* Envolvendo toda a aplicação com AuthProvider */}
            <Component {...pageProps} />
            <ToastContainer /> {/* Adicionando o container para os Toasts */}
        </AuthProvider>
    );
}

export default MyApp;
