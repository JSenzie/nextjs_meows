"use client"
import React, { FormEvent, useContext, useState } from "react"
import { CartContext } from "../layout"
import { Storefront } from "@/utils"
import { CheckBadgeIcon, CheckIcon } from "@heroicons/react/24/solid"
import Loader from "./loader"

const addToCartQuery = `
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart{
        totalQuantity
      }
      userErrors{
        message
      }
  }
}
`

type ItemProps = {
  itemID: string
}

const AddToCart = (props: ItemProps) => {
  let { cartInfo, setCartCount } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const addedToCart = await Storefront(addToCartQuery, "no-store", { cartId: cartInfo.id, lines: [{ quantity: 1, merchandiseId: props.itemID }] })

    if (!addedToCart?.data?.cartLinesAdd?.userErrors[0]) {
      console.log(addedToCart)
      setCartCount(addedToCart.data.cartLinesAdd.cart.totalQuantity)
      setSuccess(true)
      setLoading(false)
    } else {
      console.log(addedToCart.data.cartLinesAdd.userErrors[0])
    }
  }

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      {!success ? (
        <button type="submit" className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-slate-600 px-8 py-3 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2">
          {loading ? (
            <div className="h-6 w-6">
              <Loader />
            </div>
          ) : (
            "Add to Cart"
          )}
        </button>
      ) : (
        <button type="submit" disabled className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2">
          Item Added to Cart <CheckIcon className="h-6 w-6 ml-2" />
        </button>
      )}
    </form>
  )
}

export default AddToCart
