import type { NextConfig } from "next";
  
const nextConfig: NextConfig = {
    async rewrites() {
		return [
			{
				source: '/api/:slug*',
				destination: 'http://localhost:3001/api/:slug*',
			}
		  ]
	  }
};

export default nextConfig;
