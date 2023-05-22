import React from "react"
import Loader from "./components/loader"

const loading = () => {
  return (
    <div className="h-screen">
      <div className="mt-80">
        <Loader />
      </div>
    </div>
  )
}

export default loading
