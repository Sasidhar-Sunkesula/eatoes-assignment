import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import MenuPage from "./pages/MenuPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MenuPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
