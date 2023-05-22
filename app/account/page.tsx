"use client"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Loader from "../components/loader"
import { Storefront } from "@/utils"
import { formatPrice } from "@/utils"

type CustomerData = {
  customer: {
    email: string
    orders: {
      edges: Array<{
        node: {
          processedAt: string
          totalPrice: {
            amount: string
          }
          lineItems: {
            nodes: Array<{
              title: string
              variant: {
                image: {
                  url: string
                }
              }
              originalTotalPrice: {
                amount: string
              }
            }>
          }
        }
      }>
    }
  }
}

const Account = () => {
  const data = useSession()
  const [loading, setLoading] = useState(true)
  const [customerData, setCustomerData] = useState<CustomerData>()

  useEffect(() => {
    const getCustomerData = async () => {
      const customerQuery = `
        query getCustomer($input: String!) {
          customer(customerAccessToken: $input) {
            email
            orders(first: 100) {
              edges {
                node {
                  processedAt
                  totalPrice {
                    amount
                  }
                  lineItems(first: 100) {
                    nodes {
                      title
                      variant {
                        image {
                          url
                        }
                      }
                      originalTotalPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
      const user = await Storefront(customerQuery, "no-store", { input: data?.data?.user?.access })
      setCustomerData(user.data)
    }

    if (data?.data?.user?.access) {
      getCustomerData()
      setLoading(false)
    }
  }, [data])

  return (
    <div className="my-20 px-20 lg:px-64">
      {loading && <Loader />}
      {customerData !== undefined ? (
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="">
            <h1 className="font-bold text-2xl">Order History</h1>
            <h2 className="text-xl">{customerData.customer.email}</h2>

            <div className="mt-10 text-left">
              <table className="w-full text-sm text-slate-500">
                <thead className="text-xs text-slate-700 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3 bg-slate-50">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Items - Price
                    </th>
                    <th scope="col" className="px-6 py-3 bg-slate-50">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerData?.customer?.orders?.edges.map((order, index) => {
                    return (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="px-6 py-4 bg-slate-50">{order.node.processedAt.split("T")[0]}</td>
                        <td className="px-6 py-4 flex flex-col">
                          {order.node.lineItems.nodes.map((item, index) => {
                            return (
                              <p key={index}>
                                {item.title} - {formatPrice(item.originalTotalPrice.amount)}
                              </p>
                            )
                          })}
                        </td>
                        <td className="px-6 py-4 bg-slate-50">{formatPrice(order.node.totalPrice.amount)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto text-center">
          <h1>
            You are not logged-in, please{" "}
            <Link href="/account/login" className="text-blue-400 hover:underline">
              log-in
            </Link>{" "}
            to view your account
          </h1>
        </div>
      )}
    </div>
  )
}

export default Account
