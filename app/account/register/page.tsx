"use client"
import React, { useState, FormEvent } from "react"
import { Storefront } from "@/utils"
import Loader from "@/app/components/loader"
import Link from "next/link"

const customerCreateQuery = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customer {
        id
      }
    }
  }
`

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptsMarketing, setAcceptsMarketing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOnChange = () => {
    setAcceptsMarketing(!acceptsMarketing)
  }

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
    } else if (!strongRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain at least one lowercase letter, one capital letter, one number, and one special character.")
    } else {
      setLoading(true)
      const res = await Storefront(customerCreateQuery, "no-store", { input: { email, password, acceptsMarketing } })
      if (res.data.customerCreate.customerUserErrors.length < 1) {
        setSuccess(true)
      } else {
        setError("Email is already in use.")
      }
      setLoading(false)
    }
  }
  return (
    <div className="my-64 mx-auto max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <div className="rounded-md shadow-sm">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input onChange={(e) => setEmail(e.target.value)} id="email-address" value={email} name="email" type="email" required className="w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Email address" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)} id="password" value={password} name="password" type="password" required className="w-full  border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Password" />
          </div>
          <div>
            <label htmlFor="password2" className="sr-only">
              Re-enter Password
            </label>
            <input onChange={(e) => setConfirmPassword(e.target.value)} id="password2" value={confirmPassword} name="password2" type="password" required className="w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Re-enter Password" />
          </div>
          <div className="my-1">
            <label htmlFor="Marketing-Opt-In">Do you consent to us sending you emails for marketing purposes? ie. Sales, specials, new items</label>
            <input id="Marketing-Opt-In" type="checkbox" checked={acceptsMarketing} onChange={handleOnChange} className="mx-2 w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 dark:focus:ring-slate-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          {error.length > 0 && (
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="p-2 bg-green-600 text-white rounded-lg">
              <p>
                Registration Successful. Please{" "}
                <Link href="/account/login" className="underline text-blue-300">
                  Log-In
                </Link>
              </p>
            </div>
          )}
        </div>
        <div>
          <button type="submit" className="group relative flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
            {loading ? <Loader /> : <p>Sign Up</p>}
          </button>
        </div>
      </form>
    </div>
  )
}
