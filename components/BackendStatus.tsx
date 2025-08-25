'use client'

import React from 'react'
import { BACKEND_URL, isDevMode } from '@/lib/config'

interface BackendStatusProps {
  showInProduction?: boolean
}

export default function BackendStatus({ showInProduction = false }: BackendStatusProps) {
  // Only show in development or if explicitly requested
  if (!isDevMode() && !showInProduction) {
    return null
  }

  const isLocalhost = BACKEND_URL.includes('localhost') || BACKEND_URL.includes('127.0.0.1')
  const isProduction = BACKEND_URL.includes('render.com') || BACKEND_URL.includes('https://')

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs font-mono z-50">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${isLocalhost ? 'bg-green-400' : 'bg-blue-400'}`}></div>
        <span className="font-semibold">Backend Status</span>
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">URL:</span> {BACKEND_URL}
        </div>
        <div>
          <span className="text-gray-400">Mode:</span> {isDevMode() ? 'Development' : 'Production'}
        </div>
        <div>
          <span className="text-gray-400">Type:</span> {isLocalhost ? 'Local (Java Spring)' : 'Production (Render.com)'}
        </div>
      </div>
      {isDevMode() && (
        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
          💡 Use npm run dev:local for localhost:8080
        </div>
      )}
    </div>
  )
}
