import React from "react"
import Link from "next/link"

export default function Footer() {
  return (
    <div className="container mx-auto flex border-t-2 px-6 py-8 justify-center">
      <div className="grow">
        <div className="hidden xl:flex items-center justify-center lg:gap-16 mx-8">
          <Link href="/terms">Terms and Conditions</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
