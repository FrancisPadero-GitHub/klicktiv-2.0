/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
  },
  // temporary fix: this will be a source of a problem I think says gemini
  serverExternalPackages: ["jspdf", "jspdf-autotable"],
}
export default nextConfig