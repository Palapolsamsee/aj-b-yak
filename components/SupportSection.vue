<template>
  <div class="max-w-4xl mx-auto">
    <div class="grid md:grid-cols-2 gap-8">
      <!-- FAQ Section -->
      <div class="card">
        <div class="flex items-center mb-6">
          <QuestionMarkCircleIcon class="h-8 w-8 text-primary-500 mr-3" />
          <h3 class="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="border border-gray-200 rounded-lg"
          >
            <button
              @click="toggleFAQ(index)"
              class="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-lg"
              :aria-expanded="openFAQ === index"
            >
              <span class="font-medium text-gray-900">{{ faq.question }}</span>
              <ChevronDownIcon
                class="h-5 w-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': openFAQ === index }"
              />
            </button>
            <div
              v-show="openFAQ === index"
              class="px-4 pb-3 text-gray-600"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Support Contact -->
      <div class="card">
        <div class="flex items-center mb-6">
          <LifebuoyIcon class="h-8 w-8 text-primary-500 mr-3" />
          <h3 class="text-2xl font-bold text-gray-900">Need More Help?</h3>
        </div>
        
        <div class="space-y-6">
          <p class="text-gray-600">
            Can't find what you're looking for? Our support team is here to help you with any questions about air quality monitoring and our services.
          </p>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <EnvelopeIcon class="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <div class="font-medium text-gray-900">Email Support</div>
                <a href="mailto:support@airwatch.com" class="text-primary-500 hover:text-primary-600">
                  support@airwatch.com
                </a>
              </div>
            </div>
            
            <div class="flex items-center">
              <PhoneIcon class="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <div class="font-medium text-gray-900">Phone Support</div>
                <a href="tel:+1-555-0123" class="text-primary-500 hover:text-primary-600">
                  +1 (555) 012-3456
                </a>
              </div>
            </div>
            
            <div class="flex items-center">
              <ClockIcon class="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <div class="font-medium text-gray-900">Support Hours</div>
                <div class="text-gray-600">Monday - Friday, 9 AM - 6 PM EST</div>
              </div>
            </div>
          </div>
          
          <div class="pt-4 border-t border-gray-200">
            <a href="#contact" class="btn-primary w-full text-center">
              Contact Support Team
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  QuestionMarkCircleIcon, 
  LifebuoyIcon, 
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const openFAQ = ref(null)

const faqs = [
  {
    question: 'What is the Air Quality Index (AQI)?',
    answer: 'The AQI is a standardized way to measure and report air quality. It ranges from 0-500, with lower numbers indicating better air quality. Values below 50 are considered good, while values above 300 are hazardous.'
  },
  {
    question: 'How often is the air quality data updated?',
    answer: 'Our air quality data is updated every hour from official monitoring stations. The data includes PM2.5, PM10, ozone, and other pollutant measurements from reliable sources.'
  },
  {
    question: 'What does PM2.5 mean?',
    answer: 'PM2.5 refers to particulate matter with a diameter of 2.5 micrometers or smaller. These tiny particles can penetrate deep into your lungs and bloodstream, making them particularly concerning for health.'
  },
  {
    question: 'Why do I need to enable location services?',
    answer: 'Location services help us provide accurate, localized air quality data for your specific area. Without location access, we can only show general regional data which may not reflect your immediate environment.'
  },
  {
    question: 'Is my location data stored or shared?',
    answer: 'No, your location data is only used temporarily to fetch relevant air quality information. We do not store, track, or share your location data with third parties.'
  },
  {
    question: 'What should I do if air quality is poor?',
    answer: 'When air quality is poor, limit outdoor activities, keep windows closed, use air purifiers if available, and consider wearing a mask when going outside. People with respiratory conditions should be especially cautious.'
  }
]

const toggleFAQ = (index) => {
  openFAQ.value = openFAQ.value === index ? null : index
}
</script>