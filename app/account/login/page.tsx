"use client"
import React, { useState, FormEvent } from "react"
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loader from "@/app/components/loader"
import Link from "next/link"

export default function LogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)
      const data = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!data?.ok) {
        setError("There was an error logging you in. Please check your credentials and try again.")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError("There was an error logging you in. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-72 mx-auto max-w-md">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={submitHandler}>
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input onChange={(e) => setEmail(e.target.value)} id="email-address" value={email} name="email" type="email" autoComplete="email" required className="relative block w-full rounded-t-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Email address" />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)} id="password" value={password} name="password" type="password" autoComplete="current-password" required className="relative block w-full rounded-b-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" placeholder="Password" />
          </div>
          {error.length > 0 && (
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div>
          <button type="submit" className="group relative flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon className="h-5 w-5 text-slate-500 group-hover:text-slate-400" aria-hidden="true" />
            </span>
            Sign in
          </button>
          <p className="text-center mt-1">
            Don&apos;t have an account?{" "}
            <Link href="/account/register" className="text-blue-500 underline">
              Register
            </Link>
          </p>
          <p className="text-center mt-1">
            Forgot your password?{" "}
            <Link href="/account/recover" className="text-blue-500 underline">
              Recover Password
            </Link>
          </p>
        </div>
        {loading && <Loader />}
      </form>
    </div>
  )
}
