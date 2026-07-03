import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CarritoProvider } from "@/context/CarritoContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "../components/layout/Breadcrumb";

export const metadata = {
  title: "Sweet Medical",
  description: "Reservá turnos médicos de forma simple y rápida.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--surf)", color: "var(--on-surf)" }}>
        <AuthProvider>
          <CarritoProvider>
            <Header />
            <Breadcrumb />
            <main className="flex-1">{children}</main>
            <Footer />
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
