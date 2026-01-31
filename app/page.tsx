"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Product } from "@/components/payment-widget/types"

const plans: Product[] = [
  {
    id: 'pro-plan',
    name: 'Pro Plan',
    description: 'Advanced features and unlimited API access',
    price: 0.5,
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise Plan',
    description: 'Everything in Pro plus dedicated support and custom integrations',
    price: 1.0,
  },
  {
    id: 'starter-plan',
    name: 'Starter Plan',
    description: 'Perfect for getting started with basic features',
    price: 0.2,
  },
]

const additionalServices: Product[] = [
  {
    id: 'premium-support',
    name: 'Premium Support',
    description: 'Priority support and dedicated account manager',
    price: 0.2,
  },
  {
    id: 'custom-integration',
    name: 'Custom Integration',
    description: 'Custom API integration and setup assistance',
    price: 0.3,
  },
  {
    id: 'training-session',
    name: 'Training Session',
    description: 'One-on-one training session with our experts',
    price: 0.15,
  },
]

export default function Home() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      alert('Please select a plan first')
      return
    }

    const selectedProducts: Product[] = []
    
    // Add selected plan
    const plan = plans.find(p => p.id === selectedPlan)
    if (plan) selectedProducts.push(plan)
    
    // Add selected services
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId)
      if (service) selectedProducts.push(service)
    })

    // Navigate to payment page with selected items
    const params = new URLSearchParams()
    params.set('products', JSON.stringify(selectedProducts))
    router.push(`/checkout?${params.toString()}`)
  }

  const totalPrice = () => {
    let total = 0
    if (selectedPlan) {
      const plan = plans.find(p => p.id === selectedPlan)
      if (plan) total += plan.price
    }
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId)
      if (service) total += service.price
    })
    return total
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select a plan and add any additional services you need
          </p>
        </div>

        {/* Plans Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-primary mt-4">
                  {plan.price.toFixed(3)} USDC
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Additional Services
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {additionalServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedServices.includes(service.id)
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {service.description}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      {service.price.toFixed(3)} USDC
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ml-4 ${
                    selectedServices.includes(service.id)
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedServices.includes(service.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary and Proceed Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl shadow-lg">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalPrice().toFixed(3)} USDC
                </div>
              </div>
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedPlan}
                className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                  selectedPlan
                    ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
