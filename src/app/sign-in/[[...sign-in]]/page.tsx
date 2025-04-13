import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl -z-10 transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl -z-10 transform translate-y-1/2"></div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/20 transition-all duration-300 hover:shadow-lg">
          {/* Logo/Brand element */}
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Welcome back
          </h1>

          <p className="text-gray-500 text-center mb-8">Sign in to continue to your account</p>

          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
