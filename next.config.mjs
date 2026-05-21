/** @type {import('next').NextConfig} */
const nextConfig = {
  // temporary fix: this will be a source of a problem I think says gemini
  serverExternalPackages: ["jspdf", "jspdf-autotable"],
}
export default nextConfig
