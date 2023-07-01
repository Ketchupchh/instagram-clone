'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2 className="mt-10 font-bold text-2xl">Something went wrong!</h2>
      <button className="border dark:border-neutral-800 rounded-md p-2 dark:bg-black" onClick={() => reset()}>Try again</button>
    </div>
  )
}