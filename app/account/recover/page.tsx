"use client"

import React, { useState, useEffect } from "react"
import Loader from "@/app/components/loader"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Storefront } from "@/utils"
import { FormEvent } from "react"

const Recover = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const searchParams = useSearchParams()
  const url = searchParams?.get("url")

  const sendRecoverEmailQuery = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
        }
      }
    }
  `

  const resetPasswordQuery = `
    mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
      customerResetByUrl(password: $password, resetUrl: $resetUrl) {
        customerUserErrors {
          code
        }
      }
    }
  `

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await Storefront(sendRecoverEmailQuery, "no-store", { email })
    setSuccess(true)
    setLoading(false)
  }

  async function resetPasswordHandler(e: FormEvent<HTMLFormElement>) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    e.preventDefault()
    setError("")
    if (password !== password2) {
      setError("Passwords do not match")
    } else if (!strongRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain at least one lowercase letter, one capital letter, one number, and one special character.")
    } else {
      setLoading(true)
      const result = await Storefront(resetPasswordQuery, "no-store", { password: password, resetUrl: url })
      if (!result.errors) {
        setSuccess(true)
      } else {
        setError("Something went wrong.")
      }
      setLoading(false)
    }
  }

  if (url) {
    return (
      <div className="my-64 mx-auto max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Recover Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={resetPasswordHandler}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input onChange={(e) => setPassword(e.target.value)} id="password" value={password} name="password" type="password" required className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="New password" />
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">
                New Password
              </label>
              <input onChange={(e) => setPassword2(e.target.value)} id="password2" value={password2} name="password2" type="password" required className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Confirm password" />
            </div>
            {success && (
              <div className="p-2 bg-green-600 text-white rounded-lg">
                <p>
                  Password reset. Please{" "}
                  <Link href="/account/login" className="underline text-blue-300">
                    Log-In
                  </Link>
                </p>
              </div>
            )}
          </div>
          {error.length > 0 && (
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <p>{error}</p>
            </div>
          )}
          <div>
            <button type="submit" className="group relative flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
              {loading ? <Loader /> : <p>Set new password</p>}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="my-64 mx-auto max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Recover Password</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <div className="rounded-md shadow-sm">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input onChange={(e) => setEmail(e.target.value)} id="email-address" value={email} name="email" type="email" required className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Email address" />
          </div>
          {success && (
            <div className="p-2 bg-green-600 text-white rounded-lg">
              <p>Password reset email sent.</p>
            </div>
          )}
        </div>
        <div>
          <button type="submit" className="group relative flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
            {loading ? <Loader /> : <p>Send Password Recovery Email</p>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Recover
