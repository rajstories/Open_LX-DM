import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  CreditCard,
  Download,
  RefreshCw,
  FileText,
  MoreHorizontal,
  Upload,
  BarChart3,
  X,
  ArrowRight,
  Lock,
  Calendar,
  Building,
  User,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type VerificationState =
  | 'wizard'          // Dynamic step wizard
  | 'submitted'       // Payout details submitted successfully
  | 'under_review'    // Manual compliance audit stage
  | 'approved'        // Active Fintech Dashboard (from previous redesign)
  | 'action_required' // IFSC/document mismatch alert
  | 'rejected';       // Outright PAN or address mismatch rejection

type AccountType = 'individual' | 'proprietor' | 'business';

interface KycFormState {
  accountType: AccountType;
  // Personal
  legalName: string;
  dob: string;
  pan: string;
  aadhaarConsent: boolean;
  // Business
  businessName: string;
  businessType: string;
  gstin: string;
  businessAddress: string;
  incCertName: string;
  incCertSize: string;
  // Bank
  accHolderName: string;
  accNumber: string;
  confirmAccNumber: string;
  ifsc: string;
  chequeProofName: string;
  chequeProofSize: string;
}

const DEFAULT_FORM_STATE: KycFormState = {
  accountType: 'individual',
  legalName: '',
  dob: '',
  pan: '',
  aadhaarConsent: false,
  businessName: '',
  businessType: 'retail',
  gstin: '',
  businessAddress: '',
  incCertName: '',
  incCertSize: '',
  accHolderName: '',
  accNumber: '',
  confirmAccNumber: '',
  ifsc: '',
  chequeProofName: '',
  chequeProofSize: '',
};

interface Transaction {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  method: 'UPI' | 'Card' | 'NetBanking';
  amount: string;
  status: 'completed' | 'pending' | 'failed';
}

// ==========================================
// MAIN KYC COMPONENT
// ==========================================
export default function KYCView() {
  const [kycState, setKycState] = useState<VerificationState>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KycFormState>(DEFAULT_FORM_STATE);
  
  // Local error states for forms
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Fintech Dashboard UI state (visible in 'approved' status)
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const [isPayoutDrawerOpen, setIsPayoutDrawerOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Mock Transactions (used in approved state)
  const [transactions] = useState<Transaction[]>([
    { id: 'tx_503', date: '2026-06-02 11:24', customerName: 'Aishwarya Sen', customerEmail: 'aish@gmail.com', productName: 'Instagram Growth Formula Playbook (PDF)', method: 'UPI', amount: '₹1,500.00', status: 'completed' },
    { id: 'tx_502', date: '2026-06-01 18:40', customerName: 'Kunal Kapoor', customerEmail: 'kunal@kapoor.in', productName: '1:1 Private Partner Audit Call', method: 'Card', amount: '₹4,999.00', status: 'completed' },
    { id: 'tx_501', date: '2026-05-30 14:15', customerName: 'Tanvi Shah', customerEmail: 'tanvi@shah.in', productName: 'Instagram Growth Formula Playbook (PDF)', method: 'UPI', amount: '₹1,500.00', status: 'completed' },
    { id: 'tx_500', date: '2026-05-28 09:30', customerName: 'Rohan Mehta', customerEmail: 'rohan@mehta.org', productName: 'Premium Lightroom LUT Presets Pack', method: 'NetBanking', amount: '₹999.00', status: 'completed' },
  ]);

  // Load progress from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('openlx_kyc_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || DEFAULT_FORM_STATE);
        setCurrentStep(parsed.currentStep || 1);
        if (parsed.kycState) {
          setKycState(parsed.kycState);
        }
      } catch (e) {
        console.error('Failed to restore KYC draft progress:', e);
      }
    }
  }, []);

  // Save Progress draft function
  const handleSaveProgress = () => {
    localStorage.setItem(
      'openlx_kyc_progress',
      JSON.stringify({ formData, currentStep, kycState })
    );
    setSaveSuccessMsg('✓ Progress saved securely to draft memory.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleClearDraft = () => {
    localStorage.removeItem('openlx_kyc_progress');
    setFormData(DEFAULT_FORM_STATE);
    setCurrentStep(1);
    setKycState('wizard');
    alert('Draft cleared. Flow reset.');
  };

  // Field validation and Step progression
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 2) {
      if (!formData.legalName.trim()) errors.legalName = 'Full legal name is required.';
      if (!formData.dob) errors.dob = 'Date of birth is required.';
      if (!formData.pan.trim()) {
        errors.pan = 'PAN is required.';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan.trim())) {
        errors.pan = 'Invalid PAN format. Must be like ABCDE1234F.';
      }
      if (!formData.aadhaarConsent) {
        errors.aadhaarConsent = 'You must give verification consent.';
      }
    }

    if (step === 3) {
      // If Registered Business, Business details are strict
      if (formData.accountType === 'business') {
        if (!formData.businessName.trim()) errors.businessName = 'Business name is required.';
        if (!formData.businessAddress.trim()) errors.businessAddress = 'Registered office address is required.';
        if (!formData.incCertName) errors.incCertName = 'Incorporation Certificate upload is required.';
      }
    }

    if (step === 4) {
      if (!formData.accHolderName.trim()) errors.accHolderName = 'Account holder name is required.';
      if (!formData.accNumber.trim()) {
        errors.accNumber = 'Account number is required.';
      }
      if (formData.accNumber !== formData.confirmAccNumber) {
        errors.confirmAccNumber = 'Bank account numbers do not match.';
      }
      if (!formData.ifsc.trim()) {
        errors.ifsc = 'IFSC code is required.';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifsc.trim())) {
        errors.ifsc = 'Invalid IFSC format. Must be 11 characters (e.g. SBIN0001234).';
      }
      if (!formData.chequeProofName) {
        errors.chequeProofName = 'Cancelled cheque or bank statement statement is required.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      // Save state automatically
      localStorage.setItem(
        'openlx_kyc_progress',
        JSON.stringify({ formData, currentStep: currentStep + 1, kycState })
      );
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      setKycState('submitted');
      // Save final submitted state in local storage
      localStorage.setItem(
        'openlx_kyc_progress',
        JSON.stringify({ formData, currentStep: 5, kycState: 'submitted' })
      );
    } else {
      alert('Compliance validations failed. Please review your entries.');
    }
  };

  // Format and mask details securely
  const maskSensitiveData = (value: string, type: 'pan' | 'bank'): string => {
    const clean = value.replace(/\s+/g, '').toUpperCase();
    if (clean.length < 4) return '••••';
    
    if (type === 'pan') {
      // PAN format: 5 letters, 4 digits, 1 letter. Mask: XXXXX1234X -> first 5 masked, last 1 masked. Or simple mask:
      return `••••• ${clean.slice(5, 9)} •`;
    }
    
    // Bank mask: show only last 4 digits
    return `•••• •••• •••• ${clean.slice(-4)}`;
  };

  const handleRefund = (txId: string, customer: string) => {
    if (confirm(`Confirm tax adjustment refund for ${customer}?`)) {
      alert(`Adjustment processing initiated for Transaction ID: ${txId}`);
      setActiveActionMenuId(null);
    }
  };

  const renderStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      failed: 'bg-red-500/10 text-red-500 border border-red-500/20',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
        <span className={`w-1 h-1 rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full select-none text-dash-text font-sans pb-10">

      {/* ==========================================
          HEADER: WORKSPACE CONTROL & STATE SWITCHER
          ========================================== */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent">Compliance Registry</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">SECURE</span>
          </div>
          <h2 className="text-xl font-extrabold text-dash-text mt-0.5 font-sans tracking-tight">KYC & Payout Activation</h2>
        </div>

        {/* State simulations control */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={handleClearDraft} 
            className="px-2.5 py-1.5 border border-[#E8E5DF] hover:bg-red-500/5 text-red-500 rounded-lg text-[10px] font-bold tracking-tight bg-transparent transition-all"
            title="Reset form drafts"
          >
            Clear Draft
          </button>
          
          <select
            value={kycState}
            onChange={(e) => {
              const selected = e.target.value as VerificationState;
              setKycState(selected);
              if (selected === 'wizard') setCurrentStep(1);
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
          >
            <option value="wizard">📑 Verification Onboarding Form</option>
            <option value="submitted">⏳ Verification Submitted</option>
            <option value="under_review">🕵️‍♂️ Compliance Reviewing</option>
            <option value="approved">🟢 Payment Account Active</option>
            <option value="action_required">⚠️ Compliance Notice Required</option>
            <option value="rejected">❌ PAN / DOB Rejected</option>
          </select>
        </div>
      </div>

      {/* Main workspace display based on kycState */}
      <AnimatePresence mode="wait">
        
        {/* ==========================================
            WIZARD FLOW: 5-STEP VERTICAL TRACKER
            ========================================== */}
        {kycState === 'wizard' && (
          <motion.div
            key="wizard_flow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start"
          >
            
            {/* Left Column: Vertical Progress Tracker */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <Card className="border-[#E8E5DF] p-5 select-none bg-dash-surface">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-dash-text-tertiary mb-4">Onboarding Steps</h4>
                <div className="flex flex-col gap-5 relative">
                  
                  {/* Step Item 1 */}
                  <div className="flex gap-3.5 items-start cursor-pointer" onClick={() => setCurrentStep(1)}>
                    <div className="relative flex items-center justify-center shrink-0">
                      {currentStep > 1 ? (
                        <div className="w-6 h-6 rounded-full bg-dash-success/10 text-dash-success flex items-center justify-center text-xs font-bold border border-dash-success/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                          currentStep === 1 ? 'bg-dash-sidebar text-white border-dash-sidebar' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                        }`}>
                          1
                        </div>
                      )}
                      <div className="absolute top-6 bottom-[-20px] left-1/2 w-0.5 bg-[#E8E5DF] -translate-x-1/2 z-0" />
                    </div>
                    <div>
                      <h5 className={`text-xs font-extrabold tracking-tight ${currentStep === 1 ? 'text-dash-text' : 'text-dash-text-secondary'}`}>Account Type</h5>
                      <span className="text-[9px] text-dash-text-tertiary font-medium">Step 1 of 5</span>
                    </div>
                  </div>

                  {/* Step Item 2 */}
                  <div className="flex gap-3.5 items-start cursor-pointer" onClick={() => { if (validateStep(1)) setCurrentStep(2); }}>
                    <div className="relative flex items-center justify-center shrink-0">
                      {currentStep > 2 ? (
                        <div className="w-6 h-6 rounded-full bg-dash-success/10 text-dash-success flex items-center justify-center text-xs font-bold border border-dash-success/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                          currentStep === 2 ? 'bg-dash-sidebar text-white border-dash-sidebar' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                        }`}>
                          2
                        </div>
                      )}
                      <div className="absolute top-6 bottom-[-20px] left-1/2 w-0.5 bg-[#E8E5DF] -translate-x-1/2 z-0" />
                    </div>
                    <div>
                      <h5 className={`text-xs font-extrabold tracking-tight ${currentStep === 2 ? 'text-dash-text' : 'text-dash-text-secondary'}`}>Identity Credentials</h5>
                      <span className="text-[9px] text-dash-text-tertiary font-medium">Step 2 of 5</span>
                    </div>
                  </div>

                  {/* Step Item 3 */}
                  <div className="flex gap-3.5 items-start cursor-pointer" onClick={() => { if (validateStep(1) && validateStep(2)) setCurrentStep(3); }}>
                    <div className="relative flex items-center justify-center shrink-0">
                      {currentStep > 3 ? (
                        <div className="w-6 h-6 rounded-full bg-dash-success/10 text-dash-success flex items-center justify-center text-xs font-bold border border-dash-success/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                          currentStep === 3 ? 'bg-dash-sidebar text-white border-dash-sidebar' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                        }`}>
                          3
                        </div>
                      )}
                      <div className="absolute top-6 bottom-[-20px] left-1/2 w-0.5 bg-[#E8E5DF] -translate-x-1/2 z-0" />
                    </div>
                    <div>
                      <h5 className={`text-xs font-extrabold tracking-tight ${currentStep === 3 ? 'text-dash-text' : 'text-dash-text-secondary'}`}>Business Details</h5>
                      <span className="text-[9px] text-dash-text-tertiary font-medium">Step 3 of 5</span>
                    </div>
                  </div>

                  {/* Step Item 4 */}
                  <div className="flex gap-3.5 items-start cursor-pointer" onClick={() => { if (validateStep(1) && validateStep(2) && validateStep(3)) setCurrentStep(4); }}>
                    <div className="relative flex items-center justify-center shrink-0">
                      {currentStep > 4 ? (
                        <div className="w-6 h-6 rounded-full bg-dash-success/10 text-dash-success flex items-center justify-center text-xs font-bold border border-dash-success/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                          currentStep === 4 ? 'bg-dash-sidebar text-white border-dash-sidebar' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                        }`}>
                          4
                        </div>
                      )}
                      <div className="absolute top-6 bottom-[-20px] left-1/2 w-0.5 bg-[#E8E5DF] -translate-x-1/2 z-0" />
                    </div>
                    <div>
                      <h5 className={`text-xs font-extrabold tracking-tight ${currentStep === 4 ? 'text-dash-text' : 'text-dash-text-secondary'}`}>Bank Routing Details</h5>
                      <span className="text-[9px] text-dash-text-tertiary font-medium">Step 4 of 5</span>
                    </div>
                  </div>

                  {/* Step Item 5 */}
                  <div className="flex gap-3.5 items-start cursor-pointer" onClick={() => { if (validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)) setCurrentStep(5); }}>
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                        currentStep === 5 ? 'bg-dash-sidebar text-white border-dash-sidebar' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                      }`}>
                        5
                      </div>
                    </div>
                    <div>
                      <h5 className={`text-xs font-extrabold tracking-tight ${currentStep === 5 ? 'text-dash-text' : 'text-dash-text-secondary'}`}>Review & Activate</h5>
                      <span className="text-[9px] text-dash-text-tertiary font-medium">Step 5 of 5</span>
                    </div>
                  </div>

                </div>
              </Card>

              {/* Secure note card widget */}
              <div className="bg-dash-muted border border-[#E8E5DF] rounded-2xl p-4.5 flex gap-3 items-start select-none">
                <Lock className="w-4 h-4 text-dash-text-secondary shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-[10px] uppercase font-bold text-dash-text tracking-wider">AES-256 Shield Protection</h6>
                  <p className="text-[9.5px] text-dash-text-secondary leading-relaxed mt-1">
                    Your parameters are transmitted via secure TLS/SSL lines and stored as zero-knowledge encryptions. Exposing raw variables is blocked.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Column: Active Step Form */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              
              <Card className="border-[#E8E5DF] bg-dash-surface relative">
                
                {/* Save Progress Status Pill */}
                {saveSuccessMsg && (
                  <div className="absolute top-4 right-4 bg-dash-success/15 border border-dash-success/30 text-dash-success text-[10px] font-bold px-3 py-1 rounded-full select-none">
                    {saveSuccessMsg}
                  </div>
                )}

                <h3 className="text-sm font-black uppercase tracking-wider text-dash-text-secondary border-b border-[#E8E5DF] pb-3.5 mb-5 flex justify-between items-center">
                  <span>
                    {currentStep === 1 && '1. Choose Entity Account Type'}
                    {currentStep === 2 && '2. Personal Identity Verification'}
                    {currentStep === 3 && '3. Corporate Business Details'}
                    {currentStep === 4 && '4. Bank Settlement Account'}
                    {currentStep === 5 && '5. Final Compliance Review'}
                  </span>
                  
                  {/* Save draft button */}
                  <button
                    type="button"
                    onClick={handleSaveProgress}
                    className="px-2.5 py-1 rounded bg-dash-bg text-dash-text hover:bg-[#E8E5DF] border border-[#E8E5DF] text-[9px] font-black uppercase tracking-wide cursor-pointer transition-colors"
                  >
                    Save Draft
                  </button>
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); }}>
                  
                  {/* --------------------------------------
                      WIZARD STEP 1: ACCOUNT TYPE
                      -------------------------------------- */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <p className="text-xs text-dash-text-secondary leading-relaxed">
                        Select the legal status under which your digital storefront processes customer payments. This helps us optimize routing limits.
                      </p>

                      <div className="grid grid-cols-1 gap-4 mt-2">
                        
                        {/* Option Individual */}
                        <div
                          onClick={() => setFormData({ ...formData, accountType: 'individual' })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-start ${
                            formData.accountType === 'individual'
                              ? 'border-dash-sidebar bg-dash-sidebar/5'
                              : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-dash-surface'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm ${
                            formData.accountType === 'individual' ? 'bg-dash-sidebar text-white' : 'bg-dash-muted text-dash-text-secondary'
                          }`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-dash-text tracking-tight uppercase">Individual / Creator</h4>
                            <p className="text-[10px] text-dash-text-secondary leading-relaxed mt-1">
                              Best for independent creators, writers, freelancers, or solo consultants. Payouts cleared directly.
                            </p>
                          </div>
                        </div>

                        {/* Option Sole Proprietor */}
                        <div
                          onClick={() => setFormData({ ...formData, accountType: 'proprietor' })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-start ${
                            formData.accountType === 'proprietor'
                              ? 'border-dash-sidebar bg-dash-sidebar/5'
                              : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-dash-surface'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm ${
                            formData.accountType === 'proprietor' ? 'bg-dash-sidebar text-white' : 'bg-dash-muted text-dash-text-secondary'
                          }`}>
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-dash-text tracking-tight uppercase">Sole Proprietorship</h4>
                            <p className="text-[10px] text-dash-text-secondary leading-relaxed mt-1">
                              Registered business managed by one individual. Simple tax integration with business PAN validations.
                            </p>
                          </div>
                        </div>

                        {/* Option Business */}
                        <div
                          onClick={() => setFormData({ ...formData, accountType: 'business' })}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-start ${
                            formData.accountType === 'business'
                              ? 'border-dash-sidebar bg-dash-sidebar/5'
                              : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-dash-surface'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm ${
                            formData.accountType === 'business' ? 'bg-dash-sidebar text-white' : 'bg-dash-muted text-dash-text-secondary'
                          }`}>
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-dash-text tracking-tight uppercase">Registered Business Entity</h4>
                            <p className="text-[10px] text-dash-text-secondary leading-relaxed mt-1">
                              Private Limited, LLP, Partnership or Registered Trusts. Dynamic GSTIN matching and corporate certificate registry required.
                            </p>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E8E5DF]">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Proceed to Identity</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* --------------------------------------
                      WIZARD STEP 2: PERSONAL DETAILS
                      -------------------------------------- */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4.5"
                    >
                      <p className="text-xs text-dash-text-secondary leading-relaxed">
                        Provide tax registration credentials matching your PAN card to clear financial audits.
                      </p>

                      {/* Legal Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Full Legal Name (PAN matched)</label>
                        <input
                          type="text"
                          required
                          value={formData.legalName}
                          onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                          className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent ${
                            formErrors.legalName ? 'border-red-500' : 'border-[#E8E5DF]'
                          }`}
                          placeholder="Tanvi Shah"
                        />
                        {formErrors.legalName && <span className="text-[10px] text-red-500 font-medium">{formErrors.legalName}</span>}
                      </div>

                      {/* DOB & PAN */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* DOB */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-dash-text-tertiary" />
                            <span>Date of Birth</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent ${
                              formErrors.dob ? 'border-red-500' : 'border-[#E8E5DF]'
                            }`}
                          />
                          {formErrors.dob && <span className="text-[10px] text-red-500 font-medium">{formErrors.dob}</span>}
                        </div>

                        {/* PAN */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">PAN Number</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            value={formData.pan}
                            onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                            className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent uppercase font-mono ${
                              formErrors.pan ? 'border-red-500' : 'border-[#E8E5DF]'
                            }`}
                            placeholder="ABCDE1234F"
                          />
                          {formErrors.pan && <span className="text-[10px] text-red-500 font-medium">{formErrors.pan}</span>}
                        </div>

                      </div>

                      {/* Consent checkbox */}
                      <div className="mt-2 border border-[#E8E5DF] bg-dash-muted/40 p-4 rounded-xl flex gap-3 items-start select-none">
                        <input
                          type="checkbox"
                          id="aadhaarConsent"
                          checked={formData.aadhaarConsent}
                          onChange={(e) => setFormData({ ...formData, aadhaarConsent: e.target.checked })}
                          className="mt-0.5 rounded text-dash-accent focus:ring-dash-accent w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="aadhaarConsent" className="text-[10.5px] text-dash-text-secondary leading-relaxed cursor-pointer font-medium">
                          I consent to Open LX initiating an instant Aadhaar match verification with NSDL to securely authenticate legal status. We do not store Aadhaar numbers.
                        </label>
                      </div>
                      {formErrors.aadhaarConsent && (
                        <span className="text-[10px] text-red-500 font-medium">{formErrors.aadhaarConsent}</span>
                      )}

                      {/* Buttons */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#E8E5DF]">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-4 py-2 border border-[#E8E5DF] hover:bg-dash-muted text-dash-text-secondary rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent"
                        >
                          Back
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Proceed to Business</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* --------------------------------------
                      WIZARD STEP 3: BUSINESS DETAILS
                      -------------------------------------- */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4.5"
                    >
                      <p className="text-xs text-dash-text-secondary leading-relaxed">
                        Configure billing and tax compliance registries.
                        {formData.accountType !== 'business' && ' (These details are configured automatically for Individual accounts).'}
                      </p>

                      {formData.accountType === 'business' ? (
                        <>
                          {/* Business Name */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Official Registered Business Name</label>
                            <input
                              type="text"
                              required
                              value={formData.businessName}
                              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                              className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent ${
                                formErrors.businessName ? 'border-red-500' : 'border-[#E8E5DF]'
                              }`}
                              placeholder="E.g. Acme Tech Private Limited"
                            />
                            {formErrors.businessName && <span className="text-[10px] text-red-500 font-medium">{formErrors.businessName}</span>}
                          </div>

                          {/* Business Type & Optional GSTIN */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Business Type */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Business Category</label>
                              <select
                                value={formData.businessType}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                              >
                                <option value="retail">E-Commerce & Digital Goods</option>
                                <option value="education">Education & Digital Courses</option>
                                <option value="consulting">Professional Consulting & Bookings</option>
                                <option value="services">Creative & SaaS automation</option>
                              </select>
                            </div>

                            {/* GSTIN (Optional) */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">
                                GSTIN Registration <span className="text-dash-text-tertiary lowercase font-normal">(optional)</span>
                              </label>
                              <input
                                type="text"
                                maxLength={15}
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent uppercase font-mono"
                                placeholder="27AAAAA1111A1Z1"
                              />
                            </div>

                          </div>

                          {/* Address */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Registered Corporate Office Address</label>
                            <textarea
                              rows={2}
                              required
                              value={formData.businessAddress}
                              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                              className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent ${
                                formErrors.businessAddress ? 'border-red-500' : 'border-[#E8E5DF]'
                              }`}
                              placeholder="E.g. Unit 3A, Horizon Towers, Sector 62, Noida, UP"
                            />
                            {formErrors.businessAddress && <span className="text-[10px] text-red-500 font-medium">{formErrors.businessAddress}</span>}
                          </div>

                          {/* Reusable FileUploader: Incorporation Certificate */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">
                              Incorporation Certificate / Registration Proof
                            </label>
                            
                            <FileUploader
                              fileName={formData.incCertName}
                              fileSize={formData.incCertSize}
                              onUploadSuccess={(name, size) => setFormData({ ...formData, incCertName: name, incCertSize: size })}
                              onClearFile={() => setFormData({ ...formData, incCertName: '', incCertSize: '' })}
                              hasError={!!formErrors.incCertName}
                              errorMsg={formErrors.incCertName}
                              acceptTypes=".pdf, .png, .jpeg"
                            />
                          </div>

                        </>
                      ) : (
                        <div className="border border-dashed border-[#E8E5DF] rounded-2xl p-8 text-center bg-dash-muted/20 select-none">
                          <Building className="w-8 h-8 text-dash-text-tertiary mx-auto mb-2" />
                          <h4 className="text-xs font-extrabold text-dash-text">Corporate Step Excused</h4>
                          <p className="text-[10.5px] text-dash-text-secondary max-w-sm mx-auto leading-relaxed mt-1">
                            You selected an **Individual Creator** entity. Corporate registration proofs and GSTIN numbers are waived. Please proceed to routing your bank proof.
                          </p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#E8E5DF]">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-4 py-2 border border-[#E8E5DF] hover:bg-dash-muted text-dash-text-secondary rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent"
                        >
                          Back
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Proceed to Bank details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* --------------------------------------
                      WIZARD STEP 4: BANK DETAILS
                      -------------------------------------- */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-4.5"
                    >
                      <p className="text-xs text-dash-text-secondary leading-relaxed">
                        Configure direct clearing bank accounts to route digital product sale earnings weekly.
                      </p>

                      {/* Holder Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Bank Account Holder Name</label>
                        <input
                          type="text"
                          required
                          value={formData.accHolderName}
                          onChange={(e) => setFormData({ ...formData, accHolderName: e.target.value })}
                          className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent ${
                            formErrors.accHolderName ? 'border-red-500' : 'border-[#E8E5DF]'
                          }`}
                          placeholder="E.g. Tanvi Shah"
                        />
                        {formErrors.accHolderName && <span className="text-[10px] text-red-500 font-medium">{formErrors.accHolderName}</span>}
                      </div>

                      {/* Account Number & Confirm */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Bank Account Number</label>
                          <input
                            type="password"
                            required
                            value={formData.accNumber}
                            onChange={(e) => setFormData({ ...formData, accNumber: e.target.value.replace(/[^0-9]/g, '') })}
                            className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent font-mono ${
                              formErrors.accNumber ? 'border-red-500' : 'border-[#E8E5DF]'
                            }`}
                            placeholder="E.g. 9876543210"
                          />
                          {formErrors.accNumber && <span className="text-[10px] text-red-500 font-medium">{formErrors.accNumber}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Confirm Account Number</label>
                          <input
                            type="text"
                            required
                            value={formData.confirmAccNumber}
                            onChange={(e) => setFormData({ ...formData, confirmAccNumber: e.target.value.replace(/[^0-9]/g, '') })}
                            className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent font-mono ${
                              formErrors.confirmAccNumber ? 'border-red-500' : 'border-[#E8E5DF]'
                            }`}
                            placeholder="Confirm your bank account number"
                          />
                          {formErrors.confirmAccNumber && <span className="text-[10px] text-red-500 font-medium">{formErrors.confirmAccNumber}</span>}
                        </div>

                      </div>

                      {/* IFSC */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">IFSC Bank Code</label>
                        <input
                          type="text"
                          required
                          maxLength={11}
                          value={formData.ifsc}
                          onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                          className={`w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border text-dash-text focus:outline-none focus:border-dash-accent uppercase font-mono ${
                            formErrors.ifsc ? 'border-red-500' : 'border-[#E8E5DF]'
                          }`}
                          placeholder="E.g. SBIN0001234"
                        />
                        {formErrors.ifsc && <span className="text-[10px] text-red-500 font-medium">{formErrors.ifsc}</span>}
                      </div>

                      {/* Cancelled Cheque upload */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">
                          Upload Cancelled Cheque or Bank Passbook proof
                        </label>
                        
                        <FileUploader
                          fileName={formData.chequeProofName}
                          fileSize={formData.chequeProofSize}
                          onUploadSuccess={(name, size) => setFormData({ ...formData, chequeProofName: name, chequeProofSize: size })}
                          onClearFile={() => setFormData({ ...formData, chequeProofName: '', chequeProofSize: '' })}
                          hasError={!!formErrors.chequeProofName}
                          errorMsg={formErrors.chequeProofName}
                          acceptTypes=".pdf, .png, .jpeg"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#E8E5DF]">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-4 py-2 border border-[#E8E5DF] hover:bg-dash-muted text-dash-text-secondary rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent"
                        >
                          Back
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => { if (validateStep(4)) setCurrentStep(5); }}
                          className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Review Submission</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                  {/* --------------------------------------
                      WIZARD STEP 5: REVIEW & MASKED SUMMARY
                      -------------------------------------- */}
                  {currentStep === 5 && (
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="border border-dash-success/20 bg-dash-success/5 p-4 rounded-xl flex gap-3 items-start select-none">
                        <CheckCircle2 className="w-4.5 h-4.5 text-dash-success shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-dash-success">Review Encrypted Compliance Records</h4>
                          <p className="text-[10px] text-dash-text-secondary mt-0.5 leading-relaxed">
                            Confirm that the legal details inputted correspond exactly with NSDL registry files. Bank clearing networks verify cheque details prior to settlements.
                          </p>
                        </div>
                      </div>

                      {/* Masked details summary grid */}
                      <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden divide-y divide-[#E8E5DF] bg-dash-bg/40 select-none">
                        
                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Account Type</span>
                          <span className="font-bold text-dash-text capitalize">{formData.accountType}</span>
                        </div>

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Full Legal Name</span>
                          <span className="font-bold text-dash-text">{formData.legalName || 'N/A'}</span>
                        </div>

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">PAN Tax Credentials</span>
                          <span className="font-bold text-dash-text font-mono">
                            {formData.pan ? maskSensitiveData(formData.pan, 'pan') : 'N/A'}
                          </span>
                        </div>

                        {formData.accountType === 'business' && (
                          <>
                            <div className="p-4 grid grid-cols-2 text-xs">
                              <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Business Entity</span>
                              <span className="font-bold text-dash-text">{formData.businessName || 'N/A'}</span>
                            </div>
                            <div className="p-4 grid grid-cols-2 text-xs">
                              <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Corporate Proof</span>
                              <span className="font-bold text-dash-text text-[10px] text-dash-accent font-mono truncate">
                                📎 {formData.incCertName} ({formData.incCertSize})
                              </span>
                            </div>
                          </>
                        )}

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Bank Holder</span>
                          <span className="font-bold text-dash-text">{formData.accHolderName || 'N/A'}</span>
                        </div>

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Routing Bank Account</span>
                          <span className="font-bold text-dash-text font-mono">
                            {formData.accNumber ? maskSensitiveData(formData.accNumber, 'bank') : 'N/A'}
                          </span>
                        </div>

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">IFSC Routing Code</span>
                          <span className="font-bold text-dash-text font-mono">{formData.ifsc || 'N/A'}</span>
                        </div>

                        <div className="p-4 grid grid-cols-2 text-xs">
                          <span className="font-bold text-dash-text-secondary uppercase text-[10px] tracking-wider">Statement Cheque Proof</span>
                          <span className="font-bold text-dash-text text-[10px] text-dash-accent font-mono truncate">
                            📎 {formData.chequeProofName} ({formData.chequeProofSize})
                          </span>
                        </div>

                      </div>

                      {/* Submit */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#E8E5DF]">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-4 py-2 border border-[#E8E5DF] hover:bg-dash-muted text-dash-text-secondary rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent"
                        >
                          Modify Details
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleSubmitKyc}
                          className="px-6 py-3 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Confirm & Submit KYC</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                </form>

              </Card>

            </div>

            {/* Right Column: Security Ledger Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <Card className="border-[#E8E5DF] bg-dash-surface flex flex-col gap-4 select-none">
                
                <div className="flex items-center gap-2 text-dash-accent">
                  <FileText className="w-4.5 h-4.5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Onboarding Rules</h4>
                </div>
                
                <ul className="text-xs text-dash-text-secondary flex flex-col gap-3.5 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-dash-accent font-bold select-none">•</span>
                    <span>Consolidated payouts settle automatically every Monday morning.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-dash-accent font-bold select-none">•</span>
                    <span>Platform commission is capped at 5% + GST.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-dash-accent font-bold select-none">•</span>
                    <span>Verified accounts face zero monthly or annual sales limitations.</span>
                  </li>
                </ul>

                <div className="h-px bg-[#E8E5DF] my-1" />

                <div className="flex flex-col gap-2 bg-dash-muted/40 p-3 rounded-xl border border-[#E8E5DF]">
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary">Compliance Checklist</span>
                  <div className="flex items-center gap-2 text-[10px] text-dash-text-secondary font-medium">
                    <div className="w-3.5 h-3.5 rounded bg-dash-success/15 text-dash-success flex items-center justify-center font-bold">✓</div>
                    <span>PAN Validity Checked</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-dash-text-secondary font-medium">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center font-bold ${
                      formData.chequeProofName ? 'bg-dash-success/15 text-dash-success' : 'bg-dash-muted border border-[#E8E5DF] text-transparent'
                    }`}>
                      {formData.chequeProofName ? '✓' : ''}
                    </div>
                    <span>Bank Passbook Uploaded</span>
                  </div>
                </div>

              </Card>
            </div>

          </motion.div>
        )}

        {/* ==========================================
            STATE: SUBMITTED (VerificationResult)
            ========================================== */}
        {kycState === 'submitted' && (
          <motion.div
            key="submitted_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <VerificationStatus
              status="submitted"
              title="KYC Compliance Records Transmitted"
              description="Your corporate tax registration and bank verification documents have been securely compiled and transmitted to the NSDL compliance network. Clearance rails are being calibrated."
              onAction={() => setKycState('under_review')}
              actionLabel="View Auditing Progress"
            />
          </motion.div>
        )}

        {/* ==========================================
            STATE: UNDER REVIEW (VerificationResult)
            ========================================== */}
        {kycState === 'under_review' && (
          <motion.div
            key="review_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <VerificationStatus
              status="under_review"
              title="Verification Audit in Progress"
              description="NSDL tax verifications and IFSC routing matching tests are currently undergoing standard compliance checks. Processing limits are capped at ₹10,000 until full approval is cleared."
              onAction={() => setKycState('approved')}
              actionLabel="Simulate Auto-Approval"
            />
          </motion.div>
        )}

        {/* ==========================================
            STATE: ACTION REQUIRED (VerificationResult)
            ========================================== */}
        {kycState === 'action_required' && (
          <motion.div
            key="action_req_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <VerificationStatus
              status="action_required"
              title="Compliance Document Re-Upload Required"
              description="Auditing mismatch: The IFSC bank branch code SBIN0001234 inputted does not match the branch stamp on the uploaded cancelled cheque image proof. Please replace the routing files immediately."
              onAction={() => {
                setKycState('wizard');
                setCurrentStep(4); // direct bank details step
              }}
              actionLabel="Re-verify Bank Routing Details"
              warningReason="Cancelled Cheque Branch Stamp Blurred"
            />
          </motion.div>
        )}

        {/* ==========================================
            STATE: REJECTED (VerificationResult)
            ========================================== */}
        {kycState === 'rejected' && (
          <motion.div
            key="rejected_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <VerificationStatus
              status="rejected"
              title="NSDL PAN Verification Rejected"
              description="Tax Matching Denied: The PAN credential provided does not match the legal name listed on official corporate registry database files. Please ensure you register under identical company PANs."
              onAction={() => {
                setKycState('wizard');
                setCurrentStep(2); // direct personal info step
              }}
              actionLabel="Restart Compliance Registration"
              rejectionReason="Legal Name Mismatch on PAN Record Registry"
            />
          </motion.div>
        )}

        {/* ==========================================
            STATE: APPROVED (Fintech Dashboard View)
            ========================================== */}
        {kycState === 'approved' && (
          <motion.div
            key="active_workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            
            {/* Standard alert details */}
            <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-5 flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-emerald-600 tracking-tight">Compliance Account Approved & Verified</h4>
                <p className="text-xs text-dash-text-secondary mt-1 leading-relaxed">
                  Congratulations! All NSDL credentials and bank routes are cleared. Payout caps are removed. Standard Monday payout cycles are fully active.
                </p>
              </div>
            </div>

            {/* Monospace metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total sales */}
              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Total Gross Sales</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">₹8,998.00</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-success font-bold font-mono select-none">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>+18.5% this month</span>
                </div>
              </Card>

              {/* Card 2: Net earnings */}
              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Net Earnings (5% fee)</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">₹8,548.10</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-dash-text-secondary select-none">
                  <CreditCard className="w-3.5 h-3.5 text-dash-text-tertiary shrink-0" />
                  <span>Settled: ₹0.00</span>
                </div>
              </Card>

              {/* Card 3: Pending Payout */}
              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Pending Bank Payout</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">₹8,548.10</h3>
                </div>
                <div className="mt-4 flex justify-between items-center w-full select-none">
                  <span className="text-[9px] text-[#FF6846] font-bold">Next transfer: Monday</span>
                  <button
                    onClick={() => setIsPayoutDrawerOpen(true)}
                    className="text-[9px] font-bold text-dash-sidebar hover:underline border-none bg-transparent cursor-pointer"
                  >
                    View Schedule →
                  </button>
                </div>
              </Card>

              {/* Card 4: Refund adjustments */}
              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Refund Adjustments</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">₹0.00</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-text-tertiary select-none">
                  <span>0 refunds issues</span>
                </div>
              </Card>

            </div>

            {/* Date-filtered revenue chart */}
            <Card className="border-[#E8E5DF] flex flex-col justify-between p-6 min-h-[300px]">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 select-none">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4.5 h-4.5 text-dash-accent" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">Daily gross revenue funnel</h3>
                  </div>

                  {/* Date range filter pill */}
                  <div className="bg-dash-muted rounded-xl p-1 flex items-center gap-1 border border-[#E8E5DF]">
                    <button
                      onClick={() => setDateFilter('7d')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none ${
                        dateFilter === '7d' ? 'bg-dash-surface text-dash-text shadow-sm' : 'text-dash-text-tertiary hover:text-dash-text'
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => setDateFilter('30d')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none ${
                        dateFilter === '30d' ? 'bg-dash-surface text-dash-text shadow-sm' : 'text-dash-text-tertiary hover:text-dash-text'
                      }`}
                    >
                      Last 30 Days
                    </button>
                  </div>
                </div>

                {/* Histogram chart bars representing daily sales */}
                <div className="flex gap-4 items-end justify-between h-40 pt-4 px-2 select-none border-b border-[#E8E5DF]">
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-dash-muted hover:bg-dash-muted/80 rounded-t h-[15%] transition-all" title="June 01: ₹1,500.00" />
                    <span className="text-[9px] text-dash-text-secondary font-mono font-bold">06/01</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-gradient-to-t from-[#FF6846] to-[#e6005c] hover:opacity-90 rounded-t h-[75%] transition-all" title="June 02: ₹7,498.00" />
                    <span className="text-[9px] text-dash-text-secondary font-mono font-bold">06/02</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-dash-muted hover:bg-dash-muted/80 rounded-t h-[0%] transition-all" />
                    <span className="text-[9px] text-dash-text-secondary font-mono font-bold">06/03</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-dash-muted hover:bg-dash-muted/80 rounded-t h-[0%] transition-all" />
                    <span className="text-[9px] text-dash-text-secondary font-mono font-bold">06/04</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-dash-muted hover:bg-dash-muted/80 rounded-t h-[0%] transition-all" />
                    <span className="text-[9px] text-dash-text-secondary font-mono font-bold">06/05</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-dash-text-secondary font-medium select-none">
                <span>Direct Stripe bank route active.</span>
                <span>Balances compiled live 1 min ago.</span>
              </div>
            </Card>

            {/* Transaction statements tables */}
            <Card className="p-0 border-[#E8E5DF]">
              <div className="p-5 border-b border-[#E8E5DF] flex justify-between items-center bg-dash-surface rounded-t-2xl select-none">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-dash-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">Recent Ledger statements</h3>
                </div>
                <span className="text-[10px] font-bold text-dash-success bg-dash-success/15 px-3 py-1 rounded-full border border-dash-success/30 uppercase tracking-wide">
                  Live compiles
                </span>
              </div>

              <div className="w-full overflow-x-auto bg-dash-surface rounded-b-2xl">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E8E5DF] bg-dash-bg/50 select-none">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Timestamp</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Customer</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Purchased Item</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Method</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Amount</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Status</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF] bg-dash-surface">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-dash-bg/10 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-dash-text-secondary">{tx.date}</td>
                        <td className="px-6 py-4">
                          <h4 className="text-xs font-bold text-dash-text tracking-tight">{tx.customerName}</h4>
                          <span className="text-[10px] text-dash-text-tertiary select-all font-semibold">{tx.customerEmail}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-dash-text">{tx.productName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-dash-text-secondary uppercase select-none">
                            💳 {tx.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-xs text-dash-text select-all">{tx.amount}</td>
                        <td className="px-6 py-4">{renderStatusBadge(tx.status)}</td>
                        <td className="px-6 py-4 text-right relative select-none">
                          
                          <button
                            onClick={() => setActiveActionMenuId(activeActionMenuId === tx.id ? null : tx.id)}
                            className="p-1.5 rounded-lg hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center ml-auto"
                            title="Action options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Popover Action Menu */}
                          <AnimatePresence>
                            {activeActionMenuId === tx.id && (
                              <>
                                {/* Global overlay to dismiss */}
                                <div onClick={() => setActiveActionMenuId(null)} className="fixed inset-0 z-10 bg-transparent" />
                                
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  className="absolute right-6 top-12 z-20 w-44 bg-dash-surface border border-[#E8E5DF] rounded-xl shadow-lg p-1.5 flex flex-col gap-1 text-left"
                                >
                                  <button
                                    onClick={() => handleRefund(tx.id, tx.customerName)}
                                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-red-500 hover:bg-red-500/5 cursor-pointer border-none bg-transparent"
                                  >
                                    Issue Payout Refund
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert('Invoice PDF statement download initiated.');
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-dash-text-secondary hover:bg-dash-bg cursor-pointer border-none bg-transparent flex items-center gap-1.5"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download Invoice PDF</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert('Transaction flagged for review.');
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-dash-text-secondary hover:bg-dash-bg cursor-pointer border-none bg-transparent flex items-center gap-1.5"
                                  >
                                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                    <span>Flag suspicious</span>
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ==========================================
          PAYOUT SUMMARY DRAWER OVERLAY (Used in approved state)
          ========================================== */}
      <AnimatePresence>
        {isPayoutDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPayoutDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Slide up payout drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 z-50 w-full max-w-lg mx-auto bg-dash-bg rounded-t-3xl border-t border-[#E8E5DF] p-6 shadow-2xl flex flex-col gap-5 select-none text-dash-text"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center w-full border-b border-[#E8E5DF] pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4.5 h-4.5 text-dash-accent animate-spin-slow" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-dash-text">
                    Bank Payout settlement schedule
                  </h3>
                </div>
                <button
                  onClick={() => setIsPayoutDrawerOpen(false)}
                  className="p-1 rounded hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer details */}
              <div className="flex flex-col gap-4 text-xs">
                
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary block">Next Automated Transfer</span>
                  <p className="font-extrabold text-dash-text mt-0.5 leading-normal">
                    Monday, June 08, 2026 at 09:00 AM (consolidated weekly balance)
                  </p>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary block">Destination Routing Account</span>
                  <div className="bg-dash-surface border border-[#E8E5DF] rounded-xl p-3.5 mt-1.5 flex justify-between items-center">
                    <div>
                      <strong className="text-xs font-bold text-dash-text block">State Bank of India</strong>
                      <span className="text-[10px] text-dash-text-secondary font-mono block mt-0.5">
                        Account ending in: ****1234
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#FF6846]/10 text-[#FF6846] px-2 py-0.5 rounded border border-[#FF6846]/20 uppercase">
                      IFSC: SBIN0001234
                    </span>
                  </div>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                {/* Simulated Ledger details */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-dash-text-tertiary block">Accumulated Balance</span>
                    <strong className="text-sm font-bold text-dash-text block font-mono mt-0.5">₹8,548.10</strong>
                  </div>
                  <button
                    onClick={() => {
                      alert('Manual payouts settlement requested! Direct bank clearing cleared in sandbox.');
                      setIsPayoutDrawerOpen(false);
                    }}
                    className="px-5 py-2.5 bg-dash-sidebar text-white text-xs font-extrabold rounded-full hover:bg-neutral-800 shadow-sm transition-all cursor-pointer border-none"
                  >
                    Instantly Settle Now
                  </button>
                </div>

              </div>

              {/* Footer status */}
              <div className="text-[9px] text-dash-text-tertiary select-none text-center border-t border-[#E8E5DF] pt-3 mt-1 uppercase tracking-wider">
                Status: <strong className="text-dash-success">Settlement routes clearing correctly</strong>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// REUSABLE COMPONENT: FILE UPLOADER
// ==========================================
interface FileUploaderProps {
  fileName: string;
  fileSize: string;
  onUploadSuccess: (name: string, size: string) => void;
  onClearFile: () => void;
  hasError?: boolean;
  errorMsg?: string;
  acceptTypes?: string;
}

function FileUploader({
  fileName,
  fileSize,
  onUploadSuccess,
  onClearFile,
  hasError = false,
  errorMsg = '',
  acceptTypes = '.pdf, .png, .jpeg'
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploaderError, setUploaderError] = useState('');

  const processFile = (file: File) => {
    setUploaderError('');
    
    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploaderError('File size exceeds the strict 5MB audit limit.');
      return;
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const accepted = acceptTypes.split(',').map(t => t.trim().toLowerCase());
    if (!accepted.includes(extension)) {
      setUploaderError(`Invalid file format. Accepted types: ${acceptTypes}`);
      return;
    }

    // Simulate upload loader micro-animation
    setIsUploading(true);
    setUploadPercent(0);
    
    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
          onUploadSuccess(file.name, sizeStr);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {fileName ? (
        // File Saved View
        <div className="border border-[#E8E5DF] rounded-xl p-4.5 bg-dash-surface flex justify-between items-center select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded bg-[#FF6846]/10 text-[#FF6846] flex items-center justify-center text-xs font-bold shrink-0">
              PDF
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-dash-text block truncate leading-tight">{fileName}</span>
              <span className="text-[10px] text-dash-text-tertiary font-mono block mt-0.5">{fileSize} • Uploaded Securely</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearFile}
            className="px-3 py-1.5 border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text-secondary hover:text-dash-text text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer bg-transparent shrink-0"
          >
            Replace
          </button>
        </div>
      ) : isUploading ? (
        // Uploading Loader View
        <div className="border border-[#E8E5DF] rounded-xl p-6 text-center bg-dash-muted/20 select-none flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 text-dash-accent animate-spin-slow" />
          <span className="text-xs font-bold text-dash-text">Encrypting identity file proofs...</span>
          
          <div className="w-full max-w-[200px] bg-[#E8E5DF] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-dash-accent h-full rounded-full transition-all duration-300" style={{ width: `${uploadPercent}%` }} />
          </div>
          <span className="text-[9px] text-dash-text-tertiary font-mono font-bold">{uploadPercent}% Encrypted</span>
        </div>
      ) : (
        // Uploader Drag Zone
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center gap-1.5 bg-dash-bg/40 ${
            isDragOver ? 'border-dash-sidebar bg-dash-sidebar/5' : hasError || uploaderError ? 'border-red-500 bg-red-50/5' : 'border-[#E8E5DF] hover:border-dash-accent'
          }`}
        >
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-5 h-5 text-dash-text-tertiary" />
          <span className="text-xs font-bold text-dash-text">Choose verification file or drag here</span>
          <span className="text-[9.5px] text-dash-text-tertiary font-medium">
            Accepted formats: {acceptTypes} • Maximum file size limit: **5MB**
          </span>
          
          {(uploaderError || errorMsg) && (
            <span className="text-[10px] text-red-500 font-bold mt-1 bg-red-500/5 px-2.5 py-0.5 rounded border border-red-500/10">
              ⚠️ {uploaderError || errorMsg}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENT: VERIFICATION STATUS RESULT
// ==========================================
interface VerificationStatusProps {
  status: 'submitted' | 'under_review' | 'action_required' | 'rejected';
  title: string;
  description: string;
  onAction: () => void;
  actionLabel: string;
  warningReason?: string;
  rejectionReason?: string;
}

function VerificationStatus({
  status,
  title,
  description,
  onAction,
  actionLabel,
  warningReason = '',
  rejectionReason = ''
}: VerificationStatusProps) {
  return (
    <Card className="border-[#E8E5DF] bg-dash-surface p-10 text-center flex flex-col items-center justify-center select-none shadow-sm min-h-[420px]">
      
      {/* Icon status display */}
      <div className="mb-5 relative shrink-0">
        {status === 'submitted' && (
          <div className="w-16 h-16 rounded-full bg-dash-success/10 border-2 border-dash-success/20 flex items-center justify-center text-2xl text-dash-success animate-pulse-glow">
            ✓
          </div>
        )}
        {status === 'under_review' && (
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center text-2xl text-amber-500 animate-spin-slow">
            ⚙️
          </div>
        )}
        {status === 'action_required' && (
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center text-2xl text-red-500 animate-bounce">
            ⚠️
          </div>
        )}
        {status === 'rejected' && (
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center text-2xl text-red-500">
            ❌
          </div>
        )}
      </div>

      {/* Details */}
      <span className="text-[9px] uppercase font-black text-dash-accent tracking-widest">
        {status === 'submitted' && 'NSDL Transmitted'}
        {status === 'under_review' && 'Compliance Auditing'}
        {status === 'action_required' && 'Action Required'}
        {status === 'rejected' && 'Registry Rejected'}
      </span>

      <h3 className="text-base font-black text-dash-text tracking-tight mt-1.5">{title}</h3>
      <p className="text-xs text-dash-text-secondary mt-2.5 max-w-md leading-relaxed mx-auto">
        {description}
      </p>

      {/* Specific details */}
      {status === 'action_required' && warningReason && (
        <div className="mt-4 border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-xl text-left text-[11px] text-red-500 font-bold max-w-md w-full flex gap-2 items-center">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Requirement: {warningReason}</span>
        </div>
      )}

      {status === 'rejected' && rejectionReason && (
        <div className="mt-4 border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-xl text-left text-[11px] text-red-500 font-bold max-w-md w-full flex gap-2 items-center">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Reason: {rejectionReason}</span>
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        onClick={onAction}
        className={`mt-7 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer shadow-sm ${
          status === 'action_required' || status === 'rejected'
            ? 'bg-red-500 text-white hover:opacity-95 shadow-red-500/10'
            : 'bg-dash-sidebar text-white hover:bg-neutral-800'
        }`}
      >
        {actionLabel}
      </button>

      {/* Security compliance footer */}
      <div className="mt-8 pt-5 border-t border-[#E8E5DF] w-full max-w-xs flex gap-2 justify-center items-center opacity-65">
        <Lock className="w-3.5 h-3.5 text-dash-text-tertiary" />
        <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider font-mono">
          PCI-DSS COMPLIANT ENCRYPTIONS
        </span>
      </div>

    </Card>
  );
}
