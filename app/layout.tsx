import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/contexts/AuthContext"
import { ToastProvider } from "@/components/ui/toast"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 bg-white overflow-hidden">{children}</main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


