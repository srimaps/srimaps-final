import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XIcon } from 'lucide-react';
import { NewsCard } from '../components/NewsCard';
import { mockNews, NewsItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function BusNews() {
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    route: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const newNews: NewsItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      route: formData.route,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setNews([newNews, ...news]);
    setFormData({
      title: '',
      description: '',
      route: ''
    });
    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="flex items-center justify-between">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {translate('newsTitle', language)}
        </h1>
        <motion.button
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg">

          <PlusIcon className="w-5 h-5" />
          {translate('createNews', language)}
        </motion.button>
      </motion.div>

      {/* News Feed */}
      <div className="space-y-4">
        {news.map((item, index) =>
        <NewsCard key={item.id} news={item} index={index} />
        )}
      </div>

      {/* Create News Modal */}
      <AnimatePresence>
        {isModalOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translate('createNews', language)}
                  </h2>
                  <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close">

                    <XIcon className="w-6 h-6 dark:text-gray-300" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {translate('newsHeading', language)}
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter news title" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {translate('description', language)}
                    </label>
                    <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter news description" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {translate('routeNumber', language)}
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      route: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="138" />

                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">

                      {translate('cancel', language)}
                    </motion.button>
                    <motion.button
                    type="submit"
                    whileHover={{
                      scale: 1.02
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">

                      {translate('submit', language)}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}