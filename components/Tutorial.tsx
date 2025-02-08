"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
<<<<<<< HEAD
import { Button } from "XENYIELD/xenyield-mvp/components/button"
=======
import { Button } from "@/components/ui/button"
>>>>>>> 5bc7cfdc607cf583355e3324613fed27f8263e43

const tutorialSteps = [
  {
    title: "Welcome to XENOYIELD",
    description: "XENOYIELD is a Web3 game where you explore exoplanets and earn rewards. Let's get you started!",
  },
  {
    title: "Connect Your Wallet",
    description: "First, connect your MetaMask wallet to join the game. Make sure you're on the Mantle testnet.",
  },
  {
    title: "Choose an Exoplanet",
    description: "Select an exoplanet to explore. Each planet has different difficulty levels and potential rewards.",
  },
  {
    title: "Join a Session",
    description: "Stake your assets to join a game session. Remember, higher stakes mean higher potential rewards!",
  },
  {
    title: "Survive and Earn",
    description:
      "Stay alive until the end of the session to claim your rewards. Watch out for dangers and manage your resources wisely!",
  },
]

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">How to Play</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>{tutorialSteps[currentStep].description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={nextStep} disabled={currentStep === tutorialSteps.length - 1}>
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

