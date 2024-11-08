import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
 
function Dashboard() {
  return (
    <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      
    </main>
  </SidebarProvider>
  )
}

export default Dashboard