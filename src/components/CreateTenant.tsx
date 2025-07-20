'use client';

import React, { useEffect, useState } from 'react';
import {
  X, Check, Loader2, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHasMounted } from './hooks/UseHasMounted';

type TenantFormData = {
  name: string;
  code: string;
  email: string;
  contact: string;
  address: string;
  description: string;
  subscription: string;
  status: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  domain: string;
};

type AddTenantDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTenantDialog: React.FC<AddTenantDialogProps> = ({ isOpen, onClose }) => {
  const hasMounted = useHasMounted();


  const [formData, setFormData] = useState<TenantFormData>({
    name: '', code: '', email: '', contact: '', address: '',
    description: '', subscription: 'basic', status: 'active',
    adminFirstName: '', adminLastName: '', adminEmail: '',
    adminPassword: '', domain: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData | 'submit', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = (step: number) => {
    const newErrors: Partial<Record<keyof TenantFormData | 'submit', string>> = {};
    const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Merchant name is required';
      if (!formData.code) newErrors.code = 'Merchant code is required';
      else if (!/^[A-Z0-9]{3,10}$/.test(formData.code)) {
        newErrors.code = 'Code must be 3-10 uppercase letters/numbers';
      }
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!isEmail(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.contact) newErrors.contact = 'Contact number is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }

    if (step === 2) {
      if (!formData.adminFirstName) newErrors.adminFirstName = 'First name required';
      if (!formData.adminLastName) newErrors.adminLastName = 'Last name required';
      if (!formData.adminEmail) newErrors.adminEmail = 'Admin email required';
      else if (!isEmail(formData.adminEmail)) newErrors.adminEmail = 'Invalid email';
      if (!formData.adminPassword) newErrors.adminPassword = 'Password is required';
      else if (formData.adminPassword.length < 8)
        newErrors.adminPassword = 'Minimum 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }

    if (field === 'name' && !formData.code) {
      const autoCode = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
      setFormData(prev => ({ ...prev, code: autoCode }));
    }
  };

  const handleNext = () => validateStep(1) && setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

const handleSubmit = async (e: { preventDefault: () => void }) => {
  e.preventDefault();
  if (!validateStep(2)) return;
  setIsSubmitting(true);

  try {
    const adminName = `${formData.adminFirstName} ${formData.adminLastName}`.trim();
    const username = formData.adminEmail.split('@')[0];

    const response = await fetch('/api/tenant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        code: formData.code,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        description: formData.description,
        subscription: formData.subscription,
        status: formData.status,
        domain: formData.domain,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        username: '', // Not used on backend
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      }),
    });

    let result = null;
    const text = await response.text();
    if (text) {
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        console.warn('Failed to parse JSON:', parseErr);
      }
    }

    if (!response.ok) {
      throw new Error(result?.message || 'API Error');
    }

    toast.success('Tenant created successfully');
    onClose();
    resetForm();
  } catch (err: any) {
  console.error('Error during tenant creation:', err);
  toast.error(err.message || 'Failed to create tenant');
  setErrors({ submit: err.message || 'Failed to create tenant. Try again.' });
}
 finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData({
      name: '', code: '', email: '', contact: '', address: '',
      description: '', subscription: 'basic', status: 'active',
      adminFirstName: '', adminLastName: '', adminEmail: '',
      adminPassword: '', domain: ''
    });
    setCurrentStep(1);
    setErrors({});
  };

  console.log('AddTenantDialog mounted:', hasMounted, 'isOpen:', isOpen);
  if (!hasMounted || !isOpen) return null; // move AFTER all hooks are declared

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Spinner Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-blue-50 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Merchant</h2>
            <p className="text-sm text-gray-600">Create a new Merchant</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg" disabled={isSubmitting}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            {[1, 2].map(step => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step === 1 && <div className="hidden md:block"><div className="text-sm font-medium">Merchant Details</div><div className="text-xs text-gray-500">Basic info</div></div>}
                {step === 2 && <div className="hidden md:block"><div className="text-sm font-medium">Admin Setup</div><div className="text-xs text-gray-500">Administrator user</div></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form id="add-tenant-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Merchant Name *</label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Merchant Code *</label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.code}
                    onChange={e => handleInputChange('code', e.target.value.toUpperCase())}
                    placeholder="ACME001"
                    maxLength={10}
                  />
                  {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email *</label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="email@tenant.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone *</label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-lg ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.contact}
                    onChange={e => handleInputChange('contact', e.target.value)}
                    placeholder="+254700000000"
                  />
                  {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Subscription</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.subscription}
                    onChange={e => handleInputChange('subscription', e.target.value)}
                  >
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Address *</label>
                <textarea
                  className={`w-full px-3 py-2 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder="Full address"
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name *</label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg ${errors.adminFirstName ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.adminFirstName}
                    onChange={e => handleInputChange('adminFirstName', e.target.value)}
                    placeholder="John"
                  />
                  {errors.adminFirstName && <p className="text-sm text-red-500">{errors.adminFirstName}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name *</label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg ${errors.adminLastName ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.adminLastName}
                    onChange={e => handleInputChange('adminLastName', e.target.value)}
                    placeholder="Doe"
                  />
                  {errors.adminLastName && <p className="text-sm text-red-500">{errors.adminLastName}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Admin Email *</label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg ${errors.adminEmail ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.adminEmail}
                  onChange={e => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@tenant.com"
                />
                {errors.adminEmail && <p className="text-sm text-red-500">{errors.adminEmail}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Admin Password *</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border rounded-lg ${errors.adminPassword ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.adminPassword}
                  onChange={e => handleInputChange('adminPassword', e.target.value)}
                  placeholder="Minimum 8 characters"
                />
                {errors.adminPassword && <p className="text-sm text-red-500">{errors.adminPassword}</p>}
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
          {currentStep === 2 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {currentStep === 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                form="add-tenant-form"     // 👈 Connects to the form above
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Merchant'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTenantDialog;
