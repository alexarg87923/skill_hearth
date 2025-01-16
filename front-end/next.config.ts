import type { NextConfig } from "next";
  
const nextConfig: NextConfig = {
    async rewrites() {
		return {
			beforeFiles: [],
			afterFiles: [
			  {
				source: '/api/:slug*',
				destination: 'http://localhost:3001/api/:slug*',
			  },
			],
			fallback: [],
		  }
	  }
};

export default nextConfig;
