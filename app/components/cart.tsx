"use client"

import React, { Fragment, useEffect, useState, useContext } from "react"
import { Storefront } from "@/utils"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Transition, Dialog } from "@headlessui/react"
import Loader from "./loader"
import { CartContext } from "../layout"
import Link from "next/link"
import { formatPrice } from "@/utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const cartItemsQuery = `
  query getCartById($id: ID!) {
    cart(id: $id) {
      totalQuantity
      cost {
        subtotalAmount {
          amount
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                product {
                  title
                  id
                  priceRange{
                    minVariantPrice{
                      amount
                    }
                  }
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
              }
            }
          }
        }
      }
    }
  }
`

const removeItemQuery = `
  mutation removeFromCart($cartId: ID!, $lines: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lines) {
      cart {
        totalQuantity
      }
    }
  }
`

const cartIdentityUpdateQuery = `
  mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!) {
    cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
      userErrors {
        field
        message
      }
      cart {
        checkoutUrl
      }
    }
  }
`

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type CartData = {
  data: {
    cart: {
      totalQuantity: number
      cost: {
        subtotalAmount: {
          amount: string
        }
      }
      lines: {
        edges: Array<{
          node: {
            id: string
            merchandise: {
              product: {
                title: string
                id: string
                priceRange: {
                  minVariantPrice: {
                    amount: string
                  }
                }
                handle: string
                images: {
                  edges: [
                    {
                      node: {
                        url: string
                      }
                    }
                  ]
                }
              }
            }
            cost: {
              totalAmount: {
                amount: string
              }
            }
          }
        }>
      }
    }
  }
}

type CartDataRemove = {
  data: {
    cartLinesRemove: {
      cart: {
        totalQuantity: number
      }
    }
  }
}

const Cart = ({ open, setOpen }: Props) => {
  let { cartInfo, cartCount, setCartCount, storageLoaded } = useContext(CartContext)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [cartData, setCartData] = useState<CartData>()
  const data = useSession()
  const router = useRouter()

  const handleRemove = async (cartItemId: string) => {
    setLoading(true)
    const res: CartDataRemove = await Storefront(removeItemQuery, "no-store", { cartId: cartInfo.id, lines: [cartItemId] })
    setCartCount(res.data.cartLinesRemove.cart.totalQuantity)
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    if (data.status === "authenticated") {
      const res = await Storefront(cartIdentityUpdateQuery, "no-store", { buyerIdentity: { customerAccessToken: data.data.user.access, email: data.data.user.email }, cartId: cartInfo.id })
      router.push(res.data.cartBuyerIdentityUpdate.cart.checkoutUrl)
    } else if (cartInfo?.checkoutUrl) {
      router.push(cartInfo.checkoutUrl)
    } else {
      console.log("error going to cart")
    }
    setCheckoutLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    const getCartData = async () => {
      const res: CartData = await Storefront(cartItemsQuery, "no-store", { id: cartInfo?.id })
      setCartData(res)
      setLoading(false)
    }

    if (storageLoaded) {
      try {
        getCartData()
      } catch (e) {
        console.log(e)
      }
    }
  }, [storageLoaded, cartCount])

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-slate-900">Shopping cart</Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button type="button" className="-m-2 p-2 text-slate-400 hover:text-slate-500" onClick={() => setOpen(false)}>
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {loading ? (
                          <div className="mt-8">
                            <Loader />
                          </div>
                        ) : (
                          <div className="mt-8">
                            {cartData?.data?.cart?.lines?.edges[0] === undefined && "Your cart is empty."}
                            <div className="flow-root">
                              <ul role="list" className="-my-6 divide-y divide-slate-200">
                                {cartData?.data?.cart?.lines?.edges?.map((product) => (
                                  <li key={product.node.merchandise.product.id.split("/")[4]} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                                      <img src={product.node.merchandise.product.images.edges[0].node.url} alt={product.node.merchandise.product.title} className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-slate-900">
                                          <h3>
                                            <Link href={`/products/${product.node.merchandise.product.handle}`}>{product.node.merchandise.product.title}</Link>
                                          </h3>
                                          <p className="ml-4">{formatPrice(product.node.merchandise.product.priceRange.minVariantPrice.amount)}</p>
                                        </div>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex">
                                          <button onClick={() => handleRemove(product.node.id)} type="button" className="font-medium text-slate-600 hover:text-red-500">
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-slate-900">
                          <p>Subtotal</p>
                          {!loading && cartData && <p>{formatPrice(cartData?.data?.cart?.cost?.subtotalAmount?.amount)}</p>}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <button onClick={handleCheckout} className="flex items-center justify-center rounded-md border border-transparent bg-slate-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-slate-700">
                            {checkoutLoading ? <Loader /> : "Checkout"}
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                          <p>
                            or{" "}
                            <button type="button" className="font-medium text-slate-600 hover:text-green-400" onClick={() => setOpen(false)}>
                              Continue Shopping
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default Cart
