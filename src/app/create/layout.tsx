
export const metadata = {
    title: 'Create * Instagram',
    description: 'Generated by create next app',
}

export default function CreateLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center">
      {children}
    </div>
  )
}
