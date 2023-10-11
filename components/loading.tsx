export default function Loading() {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-gray-500 opacity-75">
      <span className="animate-ping w-10 h-10 bg-primary rounded-full"></span>
    </div>
  )
}