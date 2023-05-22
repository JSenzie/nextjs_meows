"use client"
import "./globals.css"
import Header from "./components/header"
import Footer from "./components/footer"
import { SessionProvider } from "next-auth/react"
import { createContext, useState, useEffect } from "react"
import { Storefront } from "@/utils"

export const CartContext = createContext<any>({})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartInfo, setCartInfo] = useState<any>()
  const [cartCount, setCartCount] = useState(0)
  const [storageLoaded, setStorageLoaded] = useState(false)

  const cartQuery = `
  mutation cartCreate {
    cartCreate {
      cart {
        checkoutUrl
        id
      }
  }
  }`

  let cartContextData = {
    cartInfo,
    setCartInfo,
    cartCount,
    setCartCount,
    storageLoaded,
    setStorageLoaded,
  }

  // on render, grab the cartCount and cartID data from localstorage, or create a new cart
  useEffect(() => {
    if (!localStorage.getItem("cartCount") || localStorage.getItem("cartCount") === undefined) {
      localStorage.setItem("cartCount", JSON.stringify(cartCount))
    } else {
      setCartCount(JSON.parse(localStorage.getItem("cartCount") || "0"))
    }

    if (!localStorage.getItem("cartInfo")) {
      const getNewCart = async () => {
        const newCartData = await Storefront(cartQuery, "no-store")
        localStorage.setItem("cartInfo", JSON.stringify(newCartData.data.cartCreate.cart))
        setCartInfo(newCartData)
      }

      try {
        getNewCart()
        setStorageLoaded(true)
      } catch (e) {
        console.log(e)
      }
    } else {
      setCartInfo(JSON.parse(localStorage.getItem("cartInfo") || "{}"))
      setStorageLoaded(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cartCount", JSON.stringify(cartCount))
  }, [cartCount])

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <SessionProvider>
          <CartContext.Provider value={cartContextData}>
            <Header />
            {children}
            <Footer />
          </CartContext.Provider>
        </SessionProvider>
      </body>
    </html>
  )
}
