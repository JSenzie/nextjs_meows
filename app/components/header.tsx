"use client"

import Link from "next/link"
import { CartContext } from "../layout"
import React, { FormEvent, useContext, Fragment, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import { Popover, Transition, Dialog } from "@headlessui/react"
import { useSession, signOut } from "next-auth/react"
import Cart from "./cart"

export default function Home() {
  let { cartCount } = useContext(CartContext)
  const [search, setSearch] = useState("")
  const router = useRouter()
  const { data } = useSession()
  const [open, setOpen] = useState(false)

  // search to be completed
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch("")
    router.push(`/search?q=${search}`)
  }

  const handleOpenClose = () => {
    setOpen((prev) => !prev)
  }

  return (
    <div className="mx-4">
      {/* Header and hamburger menu popover (on mobile) */}
      <Popover className="mx-auto flex items-center justify-between border-b-2 px-6 py-2 h-24">
        <Link href="/">
          <h1 className="font-semibold text-3xl">Meows and Co.</h1>
        </Link>

        <div className="grow">
          <div className="hidden xl:flex items-center justify-center lg:gap-16 mx-8">
            <Link href="/category/shoes">Shoes</Link>
            <Link href="/category/shirts">Shirts</Link>
            <Link href="/category/pants">Pants</Link>
            <Link href="/category/dresses">Dresses</Link>
            <Link href="/category/accessories">Accessories</Link>
          </div>
        </div>

        <div className="flex grow items-center justify-end xl:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
            <span className="sr-only">Open Menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Overlay className="lg:hidden fixed z-10 inset-0 bg-black opacity-30" />
        <Transition as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100" leave="duration-100 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <Popover.Panel className="absolute z-10 inset-x-0 top-0 origin-top-right transform p-2 transition xl:hidden">
            <div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pt-5 pb-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-bold">Meows</h1>
                  <div className="-mr-2">
                    <Popover.Button className="rounded-lg bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
                      <span className="sr-only">Open Menu</span>

                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 px-2 rounded">
                      Link
                    </Link>
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 px-2 rounded">
                      Link
                    </Link>
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 px-2 rounded">
                      Link
                    </Link>
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 px-2 rounded">
                      Link
                    </Link>
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 px-2 rounded">
                      Link
                    </Link>
                  </nav>
                </div>
                <div className="mt-6 flex flex-col items-center gap-2">
                  <form onSubmit={handleSubmit} className="mb-2">
                    <input type="text" className="rounded" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="font-bold py-2 px-3 bg-slate-500 rounded-lg hover:bg-blue-300 text-white ml-2">Search</button>
                  </form>
                  <div className="flex gap-8">
                    <div className="flex cursor-pointer" onClick={handleOpenClose}>
                      <ShoppingCartIcon className="h-6 w-6 text-blue-300" />
                      <h2>CART ({cartCount})</h2>
                    </div>
                    {data ? (
                      <span>
                        <Link href="/account">
                          <span className="mr-4 cursor-pointer font-bold py-2 px-3 bg-slate-500 rounded-lg hover:bg-blue-300 text-white">My Account</span>
                        </Link>
                        <span className="cursor-pointer font-bold py-2 px-3 bg-slate-400 rounded-lg hover:bg-blue-300 text-white" onClick={() => signOut()}>
                          Logout?
                        </span>
                      </span>
                    ) : (
                      <Link href="/account/login">
                        <span>
                          <span className="cursor-pointer">Log-In</span>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>

        <div className="hidden xl:flex items-center justify-center gap-2 lg:gap-6 whitespace-nowrap">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Search" className="rounded" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="font-bold py-2 px-3 bg-slate-500 rounded-lg hover:bg-blue-300 text-white ml-2">Search</button>
          </form>
          <div className="flex cursor-pointer" onClick={handleOpenClose}>
            <ShoppingCartIcon className="h-6 w-6 text-blue-300" />
            <h2>CART ({cartCount})</h2>
          </div>
          {data ? (
            <span>
              <Link href="/account">
                <span className="mx-2 cursor-pointer font-bold py-2 px-3 bg-slate-500 rounded-lg hover:bg-blue-300 text-white">My Account</span>
              </Link>
              <span className="cursor-pointer font-bold py-2 px-3 bg-slate-400 rounded-lg hover:bg-blue-300 text-white" onClick={() => signOut()}>
                Logout?
              </span>
            </span>
          ) : (
            <Link href="/account/login">
              <span>
                <span className="cursor-pointer">Log-In</span>
              </span>
            </Link>
          )}
        </div>
      </Popover>

      {/* Cart */}
      <Cart open={open} setOpen={setOpen} />
    </div>
  )
}
