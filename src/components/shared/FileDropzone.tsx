import { Button } from '@/components/ui/button'
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface FileDropzoneProps {
  label: string
  description: string
  accept: string
  icon?: 'image' | 'video'
  onFileSelect: (file: File | null) => void
  error?: string
  value?: File | null
  disabled?: boolean
}

export function FileDropzone({
  label,
  description,
  accept,
  icon = 'video',
  onFileSelect,
  error,
  value,
  disabled,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setIsDragging(true)
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (disabled) return

      const file = e.dataTransfer.files?.[0]
      if (file) onFileSelect(file)
    },
    [disabled, onFileSelect],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm leading-none font-medium">{label}</label>

      {value ? (
        <div className="bg-muted/50 relative flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              {icon === 'image' ? (
                <ImageIcon className="text-primary h-5 w-5" />
              ) : (
                <UploadCloud className="text-primary h-5 w-5" />
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{value.name}</span>
              <span className="text-muted-foreground text-xs">
                {(value.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
          } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={disabled}
          />
          <div className="bg-primary/10 mb-3 rounded-full p-3 transition-transform group-hover:scale-105">
            {icon === 'image' ? (
              <ImageIcon className="text-primary h-6 w-6" />
            ) : (
              <UploadCloud className="text-primary h-8 w-8" />
            )}
          </div>
          <h3 className="text-foreground mb-1 text-sm font-medium">
            Arrastra y suelta aquí o haz clic para buscar
          </h3>
          <p className="text-muted-foreground mb-3 text-xs">{description}</p>
          <Button type="button" variant="outline" size="sm" className="pointer-events-none">
            Seleccionar Archivo
          </Button>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
