import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XIcon, PhoneIcon } from 'lucide-react';
import { LostFoundCard } from '../components/LostFoundCard';
import { mockLostItems, mockFoundItems, LostFoundItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function LostAndFound() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [lostItems, setLostItems] = useState<LostFoundItem[]>(mockLostItems);
  const [foundItems, setFoundItems] = useState<LostFoundItem[]>(mockFoundItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactModalItem, setContactModalItem] =
  useState<LostFoundItem | null>(null);
  const [formData, setFormData] = useState({
    type: 'lost' as 'lost' | 'found',
    itemName: '',
    description: '',
    contact: '',
    route: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const newItem: LostFoundItem = {
      id: Date.now().toString(),
      itemName: formData.itemName,
      description: formData.description,
      contact: formData.contact,
      route: formData.route,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    if (formData.type === 'lost') {
      setLostItems([newItem, ...lostItems]);
    } else {
      setFoundItems([newItem, ...foundItems]);
    }
    setFormData({
      type: 'lost',
      itemName: '',
      description: '',
      contact: '',
      route: ''
    });
    setIsModalOpen(false);
  };
  const handleAction = (item: LostFoundItem) => {
    setContactModalItem(item);
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
          {translate('lostAndFound', language)}
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
          {translate('submitItem', language)}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2">
        <motion.button
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={() => setActiveTab('lost')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === 'lost' ? 'bg-red-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>

          {translate('lostItems', language)}
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={() => setActiveTab('found')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === 'found' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>

          {translate('foundItems', language)}
        </motion.button>
      </div>

      {/* Items List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          className="space-y-4">

          {(activeTab === 'lost' ? lostItems : foundItems).map(
            (item, index) =>
            <LostFoundCard
              key={item.id}
              item={item}
              type={activeTab}
              index={index}
              onAction={handleAction} />


          )}
        </motion.div>
      </AnimatePresence>

      {/* Submit Item Modal */}
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
                    {translate('submitItem', language)}
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
                      {translate('itemType', language)}
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="type"
                        value="lost"
                        checked={formData.type === 'lost'}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: 'lost'
                        })
                        }
                        className="w-4 h-4 text-primary-600" />

                        <span className="dark:text-gray-300">
                          {translate('lost', language)}
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="type"
                        value="found"
                        checked={formData.type === 'found'}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: 'found'
                        })
                        }
                        className="w-4 h-4 text-primary-600" />

                        <span className="dark:text-gray-300">
                          {translate('found', language)}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {translate('itemName', language)}
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.itemName}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      itemName: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., Black Backpack" />

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
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe the item in detail" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {translate('contactInfo', language)}
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: e.target.value
                    })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="+94 77 123 4567" />

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

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModalItem &&
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
            onClick={() => setContactModalItem(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {translate('contactInfo', language)}
                  </h3>
                  <button
                  onClick={() => setContactModalItem(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close">

                    <XIcon className="w-5 h-5 dark:text-gray-300" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Item
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {contactModalItem.itemName}
                    </p>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Contact
                      </p>
                      <a
                      href={`tel:${contactModalItem.contact}`}
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">

                        {contactModalItem.contact}
                      </a>
                    </div>
                  </div>
                </div>

                <motion.button
                whileHover={{
                  scale: 1.02
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() => setContactModalItem(null)}
                className="w-full mt-6 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">

                  {translate('close', language)}
                </motion.button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}