import { ModeToggle } from "../mode-toggle"
import { Button } from "../ui/button"

function Navbar() {
  return (
    <nav className=" p-2 h-20 flex items-center justify-between mx-auto px-4 md:px-20 ">
        <div className="">
         <img src="/logo.svg" />
        </div>
         <div className="flex items-center space-x-6">
             <ModeToggle/>
            <Button variant="secondary" className="bg-orange-500 text-white hover:bg-orange-500/80" >Login</Button>
         </div>
    </nav>
  )
}

export default Navbar