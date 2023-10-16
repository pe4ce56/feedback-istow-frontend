
import { ForbiddenIcon } from '../icons'

function Page404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <ForbiddenIcon className="w-12 h-12 mt-8 text-primary" aria-hidden="true" />
      <h1 className="text-6xl font-semibold text-gray-700">404</h1>
      <p className="text-gray-700">
        Page not found. Check the address
        .
      </p>
    </div>
  )
}

export default Page404
