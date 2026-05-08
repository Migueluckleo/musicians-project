/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    // Production: add Supabase storage domain here
    // domains: ["localhost", "your-project.supabase.co"],
  },
};

export default nextConfig;
