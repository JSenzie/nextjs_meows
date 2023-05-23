/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://meows-and-co.myshopify.com/api/2023-04/graphql.json",
    NEXT_PUBLIC_ACCESS_TOKEN: "7b1b83ec74ae9e48c615ef981872b2a7",
  },
}

module.exports = nextConfig
