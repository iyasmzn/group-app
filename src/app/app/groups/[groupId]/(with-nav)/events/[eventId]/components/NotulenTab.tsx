"use client"

import Reveal from "@/components/animations/Reveal"
import Stepper, { Step } from "@/components/ui/stepper"
import { FileText } from "lucide-react"
import { useState } from "react"

export default function NotulenTab({ eventId }: { eventId: string }) {
  const [name, setName] = useState("")
  
  return (
    <Reveal animation="fadeInUp">
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <FileText className="w-4 h-4" /> Notulen awal untuk event {eventId} (coming soon)
      </div>
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <Step>
          <h2>Welcome to the React Bits stepper!</h2>
          <p>Check out the next step!</p>
        </Step>
        <Step>
          <h2>Step 2</h2>
          <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" />
          <p>Custom step content!</p>
        </Step>
        <Step>
          <h2>How about an input?</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name?" />
        </Step>
        <Step>
          <h2>Final Step</h2>
          <p>You made it!</p>
        </Step>
      </Stepper>
    </Reveal>
  )
}