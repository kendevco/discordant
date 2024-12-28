import React from "react";

interface CustomPopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-2/3 text-center md:max-w-sm">
        <p className="text-lg font-semibold text-black">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomPopup;
