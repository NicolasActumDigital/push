import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  placeholderClassName?: string;
  modalTitle?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className = "",
  labelClassName = "",
  placeholderClassName = "",
  modalTitle = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const openModal = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    closeModal();
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className={`text-base text-gray-700 mb-1 ${labelClassName}`}>{label}</Text>
      )}
      
      <TouchableOpacity
        onPress={openModal}
        className={`flex-row justify-between items-center border rounded-lg px-3 py-3 ${
          error 
            ? 'border-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'opacity-50 bg-gray-100' : 'bg-white'} ${className}`}
        disabled={disabled}
      >
        <Text
          className={`flex-1 ${
            selectedOption
              ? 'text-charcoal'
              : `text-gray-400 ${placeholderClassName}`
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#718096" />
      </TouchableOpacity>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
      
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-xl max-h-3/4">
              <SafeAreaView>
                <View className="border-b border-gray-200 p-4 flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-charcoal">{modalTitle}</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={24} color="#718096" />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`px-4 py-3 border-b border-gray-100 flex-row justify-between items-center ${
                        item.value === value ? 'bg-gray-50' : ''
                      }`}
                      onPress={() => handleSelect(item)}
                    >
                      <Text className="text-charcoal">{item.label}</Text>
                      {item.value === value && (
                        <Ionicons name="checkmark" size={20} color="#E2725B" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </SafeAreaView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Select;