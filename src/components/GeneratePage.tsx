'use client'
import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function GeneratePage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysisComplete = async (file: File, analysis: string) => {
    try {
      setError(null)
      
      // 1. Upload image to storage
      const formData = new FormData()
      formData.append('file', file)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) throw new Error('Échec du téléchargement de l\'image')
      const { url: imageUrl } = await uploadResponse.json()

      // 2. Create database job record via API
      const jobSessionId = `session-${Date.now()}`
      const jobResponse = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: jobSessionId,
          originalImageUrl: imageUrl,
          status: 'pending',
          progress: 0,
          analysis
        })
      })

      if (!jobResponse.ok) throw new Error('Échec de la création du projet')
      const job = await jobResponse.json()

      // 3. Start processing
      const processResponse = await fetch('/api/process-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: job.sessionId,
          imageUrl,
          prompt: analysis
        })
      })

      if (!processResponse.ok) throw new Error('Échec du démarrage du traitement')

      // 4. Set the session ID
      setSessionId(job.sessionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du traitement')
      console.error('Processing error:', err)
    }
  }

  if (sessionId) {
    return <ResultsDisplay sessionId={sessionId} />
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
            Transformez votre intérieur
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-orange-100">
            Téléchargez une photo de votre pièce et obtenez des suggestions de design IA personnalisées
          </p>
          <div className="flex items-center justify-center space-x-2 text-orange-100">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Simple, rapide et personnalisé</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-red-500 hover:text-red-700 font-bold transition-colors"
              >
                ×
              </button>
            </div>
          )}

          <ImageUpload 
            onComplete={handleAnalysisComplete} 
            onError={setError}
          />
        </div>
      </div>
    </main>
  )
}