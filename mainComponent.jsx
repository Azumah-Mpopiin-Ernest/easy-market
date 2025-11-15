import { useState } from "react"
import logo from "./logo.png"
import { nanoid } from "nanoid"
import { useEffect } from "react"
export default function MainComponent(){

    const [selectedItem, setSelectedItem] = useState(() => {
    const savedSelected = localStorage.getItem("selected-items")
    return savedSelected ? JSON.parse(savedSelected) : []
})

    const [itemName, setItemName] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [list, setList] = useState(() => {
        const savedList = localStorage.getItem("basket-items")
        return savedList ? JSON.parse(savedList) : []
    })
    const [removeAllItemsPopup, setRemoveAllItemsPopup] = useState(false)
    const [alertMesg, setAlertMesg] = useState("")
    const [alertType, setAlertType] = useState("")

    
   const [showInstallPopup, setShowInstallPopup] = useState(false)
const [deferredPrompt, setDeferredPrompt] = useState(null)
const [isiOS, setIsIOS] = useState(false)
const [isInStandalone, setIsInStandalone] = useState(false)

useEffect(() => {
  const isIOSDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  const isStandaloneMode = window.navigator.standalone === true

  setIsIOS(isIOSDevice)
  setIsInStandalone(isStandaloneMode)

  // Only show popup if not installed & not shown before
  const popupShown = localStorage.getItem("install-popup-shown")

  // If already installed OR popup already shown, do nothing
  if (isStandaloneMode || popupShown) return

  // Android: capture beforeinstallprompt
  const handlePrompt = (e) => {
    e.preventDefault()
    setDeferredPrompt(e)

    // Show popup after 60 seconds only if still not installed
    setTimeout(() => {
      if (!window.navigator.standalone) {
        setShowInstallPopup(true)
        localStorage.setItem("install-popup-shown", "true")
      }
    }, 60000)
  }

  window.addEventListener("beforeinstallprompt", handlePrompt)

  // iOS: show only after 60 seconds
  if (isIOSDevice && !isStandaloneMode) {
    setTimeout(() => {
      setShowInstallPopup(true)
      localStorage.setItem("install-popup-shown", "true")
    }, 60000)
  }

  return () => {
    window.removeEventListener("beforeinstallprompt", handlePrompt)
  }
}, [])

async function handleInstallClick() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === "accepted") {
      setShowInstallPopup(false)
      setDeferredPrompt(null)
    }
  }
}



useEffect(() => {
    localStorage.setItem("selected-items", JSON.stringify(selectedItem))
}, [selectedItem])

    function showAlert(message, type){
        setAlertMesg(message)
        setAlertType(type)

        setTimeout(() => {
            setAlertMesg("")
        }, 3500)
    }

    function handleCheck(id){
        if(selectedItem.includes(id)){
            const newSelectedItems =
            selectedItem.filter(item => item !== id)
            setSelectedItem(newSelectedItems)
        }
        else{
            setSelectedItem(item => [
                ...item,
                id
            ])
        }
    }

    function handleFormSubmit(event){
        event.preventDefault()
        if(!price || !itemName || !quantity){
            showAlert("Please fill in all fields before adding an item.", "error")
            return
        }

        if(isNaN(price) || isNaN(quantity)){
            showAlert("Price and Quantity must be valid numbers.", "error")
            return
        }
        setList(prev => [
            {
                name: itemName,
                price: Number(price),
                quantity: Number(quantity),
                id: nanoid()
            },
            ...prev
        ])
        
        setItemName("")
        setPrice("")
        setQuantity("")

        showAlert("Item added successfully!", "success")
    }

    function removeItem(item){

    const newList =    list.filter(prev => prev !== item)
    setList(newList)
    }

    function removeAllItems(){
        setList([])
        setRemoveAllItemsPopup(false)
        localStorage.removeItem("basket-items")
        showAlert("Basket successfully emptied!", "success")
    }

    function toggleRemoveAllItemsPopup(){
        setRemoveAllItemsPopup(prev => !prev)
    }

    const listEls = list.map(item =>  (
        
        <div className="w-full flex justify-between items-center max-w-3xl" key={item.id}>

                <div className="flex justify-between items-center bg-white rounded-3xl p-3 gap-1">

                <div className="flex items-center w-1/2 gap-2">

                <div className="flex items-center gap-1">
                    <p className=" text-md tracking-tighter leading-none">{item.name}</p>
                    <span>—</span>
                    <input 
                    type="text" 
                    value={item.price} 
                    className="w-10 px-2"
                    onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                    />
                    <span>X</span>
                    <input 
                    type="text" 
                    value={item.quantity}
                    className="w-10 px-2"
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    />
                </div>
                <p>=</p>
                <div>
                    
                    <p className="whitespace-nowrap">&#8373;{item.price * item.quantity}</p>
                </div>
                </div>
                
                {selectedItem.includes(item.id) ? <span onClick={() => handleCheck(item.id)} className="material-symbols-outlined  cursor-pointer text-green-600 ">
                check_circle
                </span> :
                <span className="material-symbols-outlined  cursor-pointer text-blue-600" onClick={() => handleCheck(item.id)}>
                radio_button_unchecked
                </span>
                }

                </div>
                <span className="material-symbols-outlined text-red-700 cursor-pointer"
                onClick={() => removeItem(item)}
                 >
                    delete
                </span>
            </div>
           
    ))

    const totalSpent = list.reduce((sum, item) => {
        let totalSpent = sum
        if(selectedItem.includes(item.id)){
         totalSpent +=   (item.price * item.quantity)
        return totalSpent
        }
        else{
            return totalSpent
        }
        
    }  , 0)

    function updateItem(id, field, value){

        setList(prev => 
            prev.map(item => 
                item.id === id ? {...item, [field] : value} :
                item
         ))}

         function saveBasket() {
    localStorage.setItem("basket-items", JSON.stringify(list));
    localStorage.setItem("selected-items", JSON.stringify(selectedItem));
    showAlert("Basket successfully saved!", "success")
}



function downloadList() {
    if (list.length === 0) {
        showAlert("No items to download!", "error")
        return
    }

    let content = "EasyMarket Basket\n\n"

    list.forEach(item => {
        const isChecked = selectedItem.includes(item.id) ? "[✔]" : "[ ]"
        content += `${isChecked} ${item.name} — ${item.price} x ${item.quantity} = ${item.price * item.quantity}\n`
    })

    content += `\nTotal Spent: GH₵${totalSpent}\n\nEnjoy your market!`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "easymarket-list.txt"
    a.click()

    URL.revokeObjectURL(url)
    showAlert("Basket successfully downloaded!", "success")
}


function shareList() {
    if (list.length === 0) {
        showAlert("No items to share!", "error")
        return
    }

    let content = "🛒 *EasyMarket Basket*\n\n"

    list.forEach(item => {
        const isChecked = selectedItem.includes(item.id) ? "✔" : "•"
        content += `${isChecked} ${item.name} — ${item.price} x ${item.quantity} = ${item.price * item.quantity}\n`
    });

    content += `\n*Total Spent:* GH₵${totalSpent}`
    content += `\n\nSent from EasyMarket`

    // Use Web Share API
    if (navigator.share) {
        navigator.share({
            title: "EasyMarket Basket",
            text: content
        })
        .catch(err => console.log("Share cancelled:", err))
    } else {
        showAlert("Sharing not supported on this device.", "error")
    }
}

    return(
        <>
        <main className="flex flex-col gap-5 items-center px-3 " style={{fontFamily: "Inter, sans-serif"}}>
            {alertMesg && (
            <div className="fixed top-60 w-full flex justify-center z-50">
                <p className="text-white px-4 py-2 rounded shadow" style={{backgroundColor: alertType === "success" ? "#047857" : "#F87171"}}>
                    {alertMesg}
                </p>
            </div>
)}

            <div className="text-center" style={{fontFamily: "Poppins, sans-serif"}}>
            <h2 className="mt-5 text-2xl">Welcome to EasyMarket</h2>
            <p>Enjoy the market!</p>
            </div>
            
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3" style={{fontFamily: "Inter, sans-serif"}}>

                    <div className="flex flex-col gap-1">
                     <label htmlFor="name" className="text-lg">Item Name</label>
                    <input 
                    id="name"
                    type="text"
                    className="rounded-md w-80 py-1 px-2 text-md"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    />
                    </div>
                   <div className="flex flex-col gap-1">
                    <label htmlFor="price" className="text-lg">Price</label>
                    <input 
                    id="price" 
                    type="number" 
                    className="rounded-md w-80 py-1 px-2 text-md"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    />
                   </div>
                   <div className="flex flex-col gap-1">
                    <label htmlFor="quantity" className="text-lg">Quantity</label>
                    <input 
                    id="quantity" 
                    type="number" 
                    className="rounded-md w-80 py-1 px-2 text-md"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                   </div>
                    <button className="bg-red-700
                    rounded-lg
                    py-1
                    text-white
                    text-lg
                    cursor-pointer
                    my-4
                    hover:bg-blue-600
                    "
                    style={{fontFamily: "Poppins, sans-serif", transition: "0.3s"}}
                    >Add Item</button>

                </form>

            <div className="bg-blue-600 w-full rounded flex justify-between h-10 items-center py-8 px-5 max-w-3xl">
                <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">
                    shopping_cart
                </span>
                <h3 className="text-yellow-100 text-xl text-yellow-100">Basket</h3>
                </div>
                
                <p className="flex gap-2 items-center">
                    <span className="text-lg text-yellow-300">
                        {list.length}
                    </span> 
                    <span className="text-white">
                        Item{list.length === 0 || list.length> 1 ? "s" : ""}
                    </span>
                    </p>
                    <button className="bg-yellow-300 px-2 rounded hover:bg-yellow-200" onClick={() => {
                       if(list.length > 0)  {saveBasket()} else{showAlert("Add items to save!", "error")
                         return} 
                        }}>Save</button>
            </div>
           { list.length > 0 ?
            listEls
            :
            <p className="mb-20">
                The Basket is...Empty!
            </p>}

            {list.length > 0 &&
            <>
             <div className="bg-red-700 w-full flex justify-between p-3 rounded-2xl items-center max-w-3xl h-20">
                <div className="flex items-center gap-2 text-white">
                    <h4>Total Spent</h4>
                    <span>=</span>
                    <span>&#8373;{totalSpent ? totalSpent : 0}</span>
                </div>
                <div className="relative">
                <button 
                className="text-blue-600 
                bg-yellow-200 
                rounded-3xl 
                py-1
                px-2 border 
                border-blue-600
                cursor-pointer 
                hover:bg-yellow-500 
                whitespace-nowrap"
                style={{fontFamily: "Poppins, sans-serif", transition: "0.3s"}}
                onClick={toggleRemoveAllItemsPopup}
                >Empty Basket</button>

                {removeAllItemsPopup && 
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
    <div className="flex flex-col items-center justify-center gap-6 bg-blue-600 rounded-lg w-80 max-w-[90%] h-40 p-4 animate-fadeIn">

                    <h3 className="text-yellow-100">Are you sure you want to empty Basket?</h3>
                    <div className="flex items-center justify-center gap-10">
                        <button 
                        className="bg-red-700 px-5 rounded text-yellow-100 cursor-pointer"
                        onClick={removeAllItems}
                        >Empty</button>
                        <button 
                        className="bg-yellow-100 rounded px-5 cursor-pointer"
                        onClick={toggleRemoveAllItemsPopup}
                        >Return</button>
                    </div>
                </div>
                </div>
                }
                </div>
                
            </div>

                <div className="flex items-center justify-between w-full px-5 mb-20 max-w-3xl">
                    <button className="bg-yellow-500 rounded-xl px-2 cursor-pointer hover:bg-yellow-200"
                    onClick={downloadList}
                    >Download List</button>
                    <span className="material-symbols-outlined cursor-pointer text-blue-600"
                    onClick={shareList}
                    >
                        share
                    </span> 
                </div>
                </>
                }
        </main>


       {showInstallPopup && !isInStandalone && (
        <div className="fixed bottom-4 inset-x-0 flex justify-center z-50"
        style={{fontFamily: "Poppins, sans-serif"}}
        >
  <div 
    className="bg-white border shadow-xl rounded-xl p-4 w-80 max-w-[90%]"
  >
    <h3 className="text-lg font-semibold text-center mb-2">Install EasyMarket</h3>

    {/* ANDROID INSTALL BUTTON */}
    {!isiOS && deferredPrompt && (
      <>
        <p className="text-sm text-center mb-3">
          Install EasyMarket for faster access and offline usage
        </p>

        <button
          onClick={handleInstallClick}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition cursor-pointer"
        >
          Install App
        </button>

        <p className="text-xs text-center mt-3 text-gray-600">
          Android: tap Install App above
        </p>
      </>
    )}

    {/* iOS INSTRUCTIONS */}
    {isiOS && (
      <>
        <p className="text-sm text-center mb-3">
          To install EasyMarket on iPhone:
        </p>

        <ol className="text-sm mb-3 list-decimal ml-5">
          <li>Tap the <strong>Share</strong> icon at the bottom</li>
          <li>Select <strong>Add to Home Screen</strong></li>
          <li>Tap <strong>Add</strong> in the top-right</li>
        </ol>

        <p className="text-center text-blue-600 font-semibold">
          Works offline after installation
        </p>
      </>
    )}

    {/* Close button */}
    <button
      onClick={() => setShowInstallPopup(false)}
      className="absolute top-2 right-3 text-gray-500 text-xl cursor-pointer"
    >
      ×
    </button>
  </div>
  </div>
)}


                
        <footer className="bg-yellow-500 text-white flex flex-col ">
        <div className="flex justify-between items-center ">

        <img src={logo} alt="logo" className="w-40 h-40 m-0"/>
                    
        <span className="mr-4 cursor-pointer">
        Enjoy the market!
        </span>

        </div>  
        
             <small className="text-center mb-2">© {new Date().getFullYear()} EasyMarket. All rights reserved.</small>               
        </footer>
       
        </>
    )
}