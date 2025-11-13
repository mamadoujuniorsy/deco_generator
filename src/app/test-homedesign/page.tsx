"use client";
import { useState } from 'react';

export default function TestHomeDesignPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Ajouter un canapé moderne gris et des plantes vertes');
  const [designOptions, setDesignOptions] = useState({
    designStyle: 'Modern',
    roomType: 'Working Space',
    aiIntervention: 'Extreme',
    noDesign: 1,
    keepStructuralElement: false
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{timestamp: string, message: string, type: string}>>([]);

  const addLog = (message: string, type: string = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[${timestamp}] ${message}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addLog(`📁 Fichier sélectionné: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      
      // Vérifier les dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        addLog(`📐 Dimensions: ${width}x${height}px`);
        
        if (width < 512 || height < 512) {
          setError(`⚠️ Image trop petite (${width}x${height}px). Minimum: 512x512px`);
          addLog(`❌ Image rejetée: trop petite`, 'error');
          return;
        }

        // Redimensionner si trop grande (max 1024px)
        const MAX_SIZE = 1024;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          addLog(`📏 Redimensionnement nécessaire (max ${MAX_SIZE}px)...`);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let newWidth = width;
          let newHeight = height;
          
          if (width > height) {
            newWidth = MAX_SIZE;
            newHeight = (height / width) * MAX_SIZE;
          } else {
            newHeight = MAX_SIZE;
            newWidth = (width / height) * MAX_SIZE;
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          addLog(`✅ Image redimensionnée: ${newWidth.toFixed(0)}x${newHeight.toFixed(0)}px`);
          setPreviewUrl(resizedBase64);
        } else {
          addLog(`✅ Image OK, pas de redimensionnement nécessaire`);
          setPreviewUrl(result);
        }
        
        setSelectedFile(file);
        setError(null);
      };
      img.src = result;
    };
    
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) {
      setError('Veuillez sélectionner une image et entrer une description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);
    
    addLog('🚀 Démarrage de la génération...');
    addLog(`📝 Prompt: "${prompt}"`);
    addLog(`🎨 Style: ${designOptions.designStyle}, Room: ${designOptions.roomType}`);

    try {
      addLog('📤 Envoi de la requête à /api/generate...');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: previewUrl,
          prompt,
          designStyle: designOptions.designStyle,
          roomType: designOptions.roomType,
          aiIntervention: designOptions.aiIntervention,
          noDesign: designOptions.noDesign,
          keepStructuralElement: designOptions.keepStructuralElement, // ✅ Ajouté
        }),
      });

      addLog(`📨 Réponse reçue: ${response.status} ${response.statusText}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      addLog(`✅ Génération réussie!`, 'success');
      addLog(`🖼️ ${data.images?.length || 0} image(s) générée(s)`);
      setResult(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      addLog(`❌ Erreur: ${errorMessage}`, 'error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-purple-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎨 Test Home Designs AI
          </h1>
          <p className="text-gray-600">
            Testez l&apos;API avec une interface simplifiée pour déboguer facilement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">1️⃣ Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Prompt */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">2️⃣ Description</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Ajouter un canapé moderne gris..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 min-h-[100px]"
              />
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">3️⃣ Options</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
                  <select
                    value={designOptions.designStyle}
                    onChange={(e) => setDesignOptions({...designOptions, designStyle: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  >
                    <option>Modern</option>
                    <option>Minimalist</option>
                    <option>Scandinavian</option>
                    <option>Industrial</option>
                    <option>Bohemian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de pièce</label>
                  <select
                    value={designOptions.roomType}
                    onChange={(e) => setDesignOptions({...designOptions, roomType: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  >
                    <option>Working Space</option>
                    <option>Bedroom</option>
                    <option>Kitchen</option>
                    <option>Bathroom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Niveau d&apos;intervention</label>
                  <select
                    value={designOptions.aiIntervention}
                    onChange={(e) => setDesignOptions({...designOptions, aiIntervention: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  >
                    <option>Very Low</option>
                    <option>Low</option>
                    <option>Mid</option>
                    <option>Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de designs</label>
                  <select
                    value={designOptions.noDesign}
                    onChange={(e) => setDesignOptions({...designOptions, noDesign: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  >
                    <option value={1}>1 design</option>
                    <option value={2}>2 designs</option>
                  </select>
                </div>

                {/* ✅ Nouvelle option: Keep Structural Elements */}
                <div className="col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={designOptions.keepStructuralElement}
                      onChange={(e) => setDesignOptions({...designOptions, keepStructuralElement: e.target.checked})}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium">
                      🏗️ Conserver les éléments structurels (murs, fenêtres, portes)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    Désactivé = Plus de liberté créative pour l&apos;IA ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedFile || !prompt}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '⏳ Génération...' : '🚀 Générer le Design'}
            </button>
          </div>

          {/* Right Column - Results & Logs */}
          <div className="space-y-6">
            {/* Logs */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border-2 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">📋 Logs en temps réel</h2>
              <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">En attente...</div>
                ) : (
                  logs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`mb-1 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                        'text-gray-300'
                      }`}
                    >
                      <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-2">❌ Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && result.success && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-300">
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  ✅ Design Généré!
                </h3>
                <div className="space-y-4">
                  {result.images?.map((imageUrl, index) => (
                    <div key={index}>
                      <img
                        src={imageUrl}
                        alt={`Design ${index + 1}`}
                        className="w-full rounded-lg border-2 border-gray-300"
                      />
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                      >
                        📥 Télécharger Design {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}