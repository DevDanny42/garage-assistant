import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const SIGNUP_TOAST_ID = 'signup-status';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const Signup = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, WebP, or PDF file', { id: SIGNUP_TOAST_ID });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be under 5MB', { id: SIGNUP_TOAST_ID });
      return;
    }
    setDocument(file);
  };

  const removeDocument = () => {
    setDocument(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all fields', { id: SIGNUP_TOAST_ID });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { id: SIGNUP_TOAST_ID });
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', { id: SIGNUP_TOAST_ID });
      return;
    }
    if (!document) {
      toast.error('Please upload an ID proof document', { id: SIGNUP_TOAST_ID });
      return;
    }

    setIsSubmitting(true);
    const success = await signup(name, email, phone, password, document);
    setIsSubmitting(false);

    if (success) {
      toast.success('Account submitted for approval! You will be notified once verified.', { id: SIGNUP_TOAST_ID });
      navigate('/login');
    } else {
      toast.error('Signup failed. Check backend /auth/signup and API URL.', { id: SIGNUP_TOAST_ID });
    }
  };

  return (
    <div ref={ref} className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
        <p className="mt-2 text-muted-foreground">
          Register to track your vehicle services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="input-field"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="input-field"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234-567-8901"
            className="input-field"
            autoComplete="tel"
          />
        </div>

        {/* ID Proof Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ID Proof Document <span className="text-destructive">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Upload a government ID (Aadhar, PAN, Driving License, Passport). JPG, PNG, or PDF — max 5MB.
          </p>
          {document ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{document.name}</span>
              <button
                type="button"
                onClick={removeDocument}
                className="p-1 hover:bg-destructive/10 rounded transition-colors"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm">Click to upload document</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Your account will be reviewed by an admin before activation.
      </p>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
});

Signup.displayName = 'Signup';
