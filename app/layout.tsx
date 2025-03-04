import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/contexts/AuthContext"
import { ToastProvider } from "@/components/ui/toast"
import { DataProvider } from "@/contexts/ModelDataContext"
import { MapProvider } from "@/contexts/MapContext"
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
          <DataProvider>
            <MapProvider>
              <ToastProvider>
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 bg-white overflow-hidden">{children}</main>
                </div>
              </ToastProvider>
            </MapProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}