import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

type Features = {
  id: string
  icon: LucideIcon
  title: string
  description?: string | null
  href?: string
}

export default function FeatureShortcuts({ items }: { items: Features[] }) {
  const router = useRouter()

  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada fitur tersedia.</p>
  }

  return (
    <>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => item.href && router.push(item.href)} // Tambah navigasi
        >
          <Card className="h-full flex flex-col items-center justify-center p-4 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-2 border-transparent hover:border-blue-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <CardContent className="flex flex-col items-center text-center space-y-2">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </h3>
              {item.description != null && (
                <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                  {item.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}
