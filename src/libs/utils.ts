export async function preprocessImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate new dimensions
      const maxDimension = 1024
      let width = img.width
      let height = img.height
      
      if (width > height && width > maxDimension) {
        height *= maxDimension / width
        width = maxDimension
      } else if (height > maxDimension) {
        width *= maxDimension / height
        height = maxDimension
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const processedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          URL.revokeObjectURL(url)
          resolve(processedFile)
        } else {
          resolve(file)
        }
      }, 'image/jpeg', 0.8)
    }
    
    img.src = url
  })
}