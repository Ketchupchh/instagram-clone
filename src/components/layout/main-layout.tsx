import { AuthContextProvider } from "@/lib/context/auth-context";
import { ThemeContextProvider } from "@/lib/context/theme-context";
import { WindowContextProvider } from "@/lib/context/window-context";
import { ReactNode } from "react"
import { MainContainer } from "./main-container";
import { Sidebar } from "../sidebar/sidebar";

type MainLayoutProps = {
    children: ReactNode;
}

export function MainLayout({
    children
} : MainLayoutProps) : JSX.Element
{
    return (
        <AuthContextProvider>
          <WindowContextProvider>
            <ThemeContextProvider>
              <MainContainer>
                <Sidebar />
                {children}
              </MainContainer>
            </ThemeContextProvider>
          </WindowContextProvider>
        </AuthContextProvider>
    );
}