
import MainComponent from "./mainComponent"
export default function App(){


  return(
    <main className="">
    
      <nav className="bg-red-700 text-white flex justify-between items-center shadow-lg shadow-[0_6px_12px_0_rgba(0,0,0,0.15)] h-40 px-5">
        
      <div className="relative">
        <span className="material-symbols-outlined text-white absolute bottom-5 left-5">
                    shopping_cart
                </span> 
                <span className="text-blue-600 text-2xl font-bold">EasyMarket</span>
      </div>
    <p >Simplicity, our priority</p>
      </nav>

      <MainComponent />

    </main>
  )
}