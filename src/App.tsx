import Canva from "./components/Canva"
import SideBar from "./components/SideBar"
import { SidebarProvider } from "./components/ui/sidebar"

function App() {

  return (
    <SidebarProvider>
      <SideBar />
      <Canva />
    </SidebarProvider>
  )
}

export default App
