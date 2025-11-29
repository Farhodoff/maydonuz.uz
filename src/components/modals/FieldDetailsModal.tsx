import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Phone, User } from 'lucide-react';
import { FootballField } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';

interface FieldDetailsModalProps {
  field: FootballField;
  onClose: () => void;
}

const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({ field, onClose }) => {
  const { translations } = useLanguage();
  const { bookField } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === field.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? field.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              onClick={onClose}
              className="bg-white rounded-full p-1 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Image Slider */}
          <div className="relative h-64 sm:h-96">
            <img
              src={field.images[currentImageIndex]}
              alt={field.name}
              className="w-full h-full object-cover"
            />
            {field.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {field.images.length}
                </div>
              </>
            )}
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{field.name}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    <span>{field.district}, {field.region}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    <span>{field.ownerName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    <a href={`tel:${field.phone}`} className="hover:text-green-600">
                      {field.phone}
                    </a>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">O'lcham:</span> {field.size}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      bookField(field.id);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-md text-white text-sm font-medium transition-colors duration-200 bg-green-600 hover:bg-green-700"
                  >
                    {translations.book}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;