import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Download,
  CheckCircle2
} from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [batchPasswords, setBatchPasswords] = useState<string[]>([]);
  const [showBatch, setShowBatch] = useState<boolean>(false);

  const generatePassword = () => {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      uppercase = uppercase.replace(/[IO]/g, '');
      lowercase = lowercase.replace(/[l]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      setPassword('');
      return;
    }

    // Ensure crypto secure random
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);

    // Generate batch if batch view is enabled
    if (showBatch) {
      const batchList: string[] = [];
      for (let b = 0; b < 10; b++) {
        const bArray = new Uint32Array(length);
        window.crypto.getRandomValues(bArray);
        let bRes = '';
        for (let i = 0; i < length; i++) {
          bRes += charset[bArray[i] % charset.length];
        }
        batchList.push(bRes);
      }
      setBatchPasswords(batchList);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, showBatch]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string; percent: number } => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-300', percent: 0 };

    let poolSize = 0;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) poolSize += 30;

    const entropy = pwd.length * Math.log2(poolSize || 1);

    if (entropy < 28) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500', percent: 20 };
    }
    if (entropy < 45) {
      return { score: 2, label: 'Fair', color: 'bg-amber-500', percent: 45 };
    }
    if (entropy < 65) {
      return { score: 3, label: 'Good', color: 'bg-yellow-500', percent: 70 };
    }
    if (entropy < 85) {
      return { score: 4, label: 'Strong', color: 'bg-emerald-500', percent: 90 };
    }
    return { score: 5, label: 'Bulletproof (Very Strong)', color: 'bg-indigo-600', percent: 100 };
  };

  const strength = getPasswordStrength(password);

  const copyToClipboard = async (textToCopy?: string) => {
    const target = textToCopy || password;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadBatchTxt = () => {
    if (batchPasswords.length === 0) return;
    const content = batchPasswords.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secure_passwords_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Generated Password Result Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-xl space-y-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-indigo-400" /> Generated Secure Password
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${strength.color}`}>
            {strength.label}
          </span>
        </div>

        {/* Display Password */}
        <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
          <span className="font-mono text-lg sm:text-2xl font-black tracking-wider break-all select-all text-indigo-200">
            {password || 'Select options below'}
          </span>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => generatePassword()}
              className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              title="Regenerate Password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Entropy score: {Math.round(password.length * Math.log2(password ? 70 : 1))} bits of randomness.
          </p>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Password Customization Options</span>
        </h3>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password Length
            </label>
            <span className="text-sm font-extrabold font-mono text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>4 chars (Short)</span>
            <span>16 chars (Recommended)</span>
            <span>64 chars (Maximum)</span>
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-slate-900 dark:text-slate-100 block">Uppercase Letters</span>
              <span className="text-[11px] font-normal text-slate-400">A, B, C, D...</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-slate-900 dark:text-slate-100 block">Lowercase Letters</span>
              <span className="text-[11px] font-normal text-slate-400">a, b, c, d...</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-slate-900 dark:text-slate-100 block">Numbers</span>
              <span className="text-[11px] font-normal text-slate-400">0, 1, 2, 3, 4...</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-slate-900 dark:text-slate-100 block">Symbols & Special Chars</span>
              <span className="text-[11px] font-normal text-slate-400">!@#$%^&*()</span>
            </div>
          </label>

          <label className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-slate-900 dark:text-slate-100 block">Exclude Ambiguous Characters</span>
              <span className="text-[11px] font-normal text-slate-400">Avoid confusing chars like i, l, 1, L, o, 0, O</span>
            </div>
          </label>
        </div>
      </div>

      {/* Batch Passwords Accordion */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowBatch(!showBatch)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
        >
          <span>{showBatch ? 'Hide Batch Passwords' : 'Generate 10 Passwords at Once (Batch Mode)'}</span>
        </button>

        {showBatch && (
          <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                10 Generated Passwords
              </span>
              <button
                type="button"
                onClick={downloadBatchTxt}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Export All as TXT
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-xs text-slate-800 dark:text-slate-200">
              {batchPasswords.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  <span className="select-all">{item}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 font-sans font-bold hover:underline"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
