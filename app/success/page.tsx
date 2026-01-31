"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const txSignature = searchParams.get('tx')
  const sessionId = searchParams.get('session')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment has been processed successfully.
        </p>

        {txSignature && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Transaction Signature:
            </div>
            <div className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
              {txSignature}
            </div>
          </div>
        )}

        {sessionId && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Session ID:
            </div>
            <div className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
              {sessionId}
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

