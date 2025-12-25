import { Fragment, useRef, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentY(0)
      setIsDragging(false)
    }
  }, [isOpen])

  // Предотвращаем скролл body при открытом sheet
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleStart = (clientY: number) => {
    // Проверяем, начинается ли drag с области контента
    const content = contentRef.current
    if (content) {
      const isScrollable = content.scrollHeight > content.clientHeight
      const isAtTop = content.scrollTop === 0

      // Если контент прокручиваемый и не в начале, не начинаем drag
      if (isScrollable && !isAtTop) {
        return false
      }
    }

    setStartY(clientY)
    setStartTime(Date.now())
    setIsDragging(true)
    return true
  }

  const handleMove = (clientY: number) => {
    if (!isDragging) return

    const diff = clientY - startY

    // Разрешаем только свайп вниз с сопротивлением
    if (diff > 0) {
      // Добавляем сопротивление для более нативного ощущения
      const resistance = 0.7
      setCurrentY(diff * resistance)
    }
  }

  const handleEnd = () => {
    if (!isDragging) return

    const timeDiff = Date.now() - startTime
    const velocityY = currentY / timeDiff // px/ms

    // Закрываем если:
    // 1. Протянули больше 150px
    // 2. Или быстрый свайп вниз (velocity > 0.5)
    if (currentY > 150 || velocityY > 0.5) {
      onClose()
    } else {
      // Иначе возвращаем на место
      setCurrentY(0)
    }
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      handleStart(touch.clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      handleMove(touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Mouse handlers для desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (handleStart(e.clientY)) {
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientY)
    }
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Bottom Sheet Panel */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="flex min-h-full items-end justify-center pointer-events-none">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel
                ref={panelRef}
                className="w-full max-w-lg transform overflow-hidden rounded-t-3xl bg-white shadow-xl transition-all pointer-events-auto"
                style={{
                  transform: `translateY(${currentY}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {/* Drag Handle */}
                <div
                  className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                >
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4 pt-2">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Закрыть"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div
                  ref={contentRef}
                  className="px-6 pb-6 max-h-[80vh] overflow-y-auto overscroll-contain"
                >
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

