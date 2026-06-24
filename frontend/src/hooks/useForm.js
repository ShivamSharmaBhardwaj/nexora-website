// frontend/src/hooks/useForm.js
import { useState, useCallback } from 'react';
import { validateForm, prepareFormData, isFormValid } from '../utils/validation';
import { sanitizeFormData } from '../utils/security';

export const useForm = (initialData, formType, onSubmit) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Handle blur (mark as touched)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate on blur
    const formErrors = validateForm(formData, formType);
    if (formErrors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: formErrors[name]
      }));
    }
  }, [formData, formType]);

  // Handle submit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm(formData, formType);
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!isFormValid(formErrors)) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sanitize data
      const sanitizedData = prepareFormData(formData);
      
      // Submit
      await onSubmit(sanitizedData);
      
      // Reset form on success
      setFormData(initialData);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, formType, onSubmit, initialData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Set field error manually
  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  return {
    formData,
    setFormData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    isFormValid: isFormValid(errors),
  };
};