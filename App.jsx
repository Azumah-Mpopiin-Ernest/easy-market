import logo from "../icons/logo.png"
import MainComponent from "./mainComponent"
export default function App(){


  return(
    <main className="">
    
      <nav className="bg-red-700 text-white flex justify-between items-center shadow-lg shadow-[0_6px_12px_0_rgba(0,0,0,0.15)]">
        
      <img src={logo} alt="logo" className="w-40 h-40 m-0"/>
    <p className="mr-5">Simplicity, our priority</p>
      </nav>

      <MainComponent />
    </main>
  )
}