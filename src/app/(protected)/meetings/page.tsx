import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarClock } from "lucide-react"

export default function Meetings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <CalendarClock className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Meetings Feature Coming Soon</h1>

        <p className="text-muted-foreground">
          We're working hard to bring you a powerful meetings management system. Be the first to know when it launches.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Input type="email" placeholder="Enter your email" className="sm:flex-1" />
          <Button>Notify Me</Button>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          We'll notify you when the Meetings feature is ready. No spam, promise!
        </p>
      </div>
    </div>
  )
}
