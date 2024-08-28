/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['r1-upload.s3.ap-south-1.amazonaws.com'], // Add your S3 bucket domain here
  },
};
