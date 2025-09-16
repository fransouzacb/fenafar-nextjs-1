"use client"

import { Suspense } from "react"
import { AceitarConviteContent } from "./aceitar-convite-content"

export default function AceitarConvitePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
      <AceitarConviteContent />
    </Suspense>
  )
}