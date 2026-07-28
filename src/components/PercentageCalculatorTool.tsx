import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Percent,
  Tag,
  TrendingUp,
  Award,
  Sparkles,
  DollarSign,
  Calculator
} from 'lucide-react';

type CalcMode = 'discount' | 'percentOf' | 'percentChange' | 'marksGrade';

export const PercentageCalculatorTool: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalcMode>('discount');

  // Mode 1: Discount Calculator
  const [origPrice, setOrigPrice] = useState<string>('120');
  const [discountPercent, setDiscountPercent] = useState<string>('25');
  const [taxPercent, setTaxPercent] = useState<string>('8');

  // Mode 2: Percent of Value
  const [partVal, setPartVal] = useState<string>('15');
  const [wholeVal, setWholeVal] = useState<string>('200');

  // Mode 3: Percent Change
  const [fromVal, setFromVal] = useState<string>('50');
  const [toVal, setToVal] = useState<string>('75');

  // Mode 4: Test Marks
  const [obtainedMarks, setObtainedMarks] = useState<string>('88');
  const [totalMarks, setTotalMarks] = useState<string>('100');

  // Discount Math
  const getDiscountResult = () => {
    const price = parseFloat(origPrice) || 0;
    const disc = parseFloat(discountPercent) || 0;
    const tax = parseFloat(taxPercent) || 0;

    const discountAmount = (price * disc) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    return { discountAmount, priceAfterDiscount, taxAmount, finalPrice };
  };

  // Percent Of Math
  const getPercentOfResult = () => {
    const p = parseFloat(partVal) || 0;
    const w = parseFloat(wholeVal) || 0;
    const result = (p * w) / 100;
    return result;
  };

  // Percent Change Math
  const getPercentChangeResult = () => {
    const f = parseFloat(fromVal) || 0;
    const t = parseFloat(toVal) || 0;
    if (f === 0) return { changePercent: 0, direction: 'no change' };

    const diff = t - f;
    const changePercent = (diff / Math.abs(f)) * 100;
    const direction = diff > 0 ? 'Increase' : diff < 0 ? 'Decrease' : 'No Change';

    return { changePercent, direction };
  };

  // Marks Math
  const getMarksResult = () => {
    const obt = parseFloat(obtainedMarks) || 0;
    const tot = parseFloat(totalMarks) || 1;
    const percent = tot > 0 ? (obt / tot) * 100 : 0;

    let grade = 'F';
    let pass = false;
    if (percent >= 90) { grade = 'A+'; pass = true; }
    else if (percent >= 80) { grade = 'A'; pass = true; }
    else if (percent >= 70) { grade = 'B'; pass = true; }
    else if (percent >= 60) { grade = 'C'; pass = true; }
    else if (percent >= 50) { grade = 'D'; pass = true; }

    return { percent, grade, pass };
  };

  const discountRes = getDiscountResult();
  const percentOfRes = getPercentOfResult();
  const percentChangeRes = getPercentChangeResult();
  const marksRes = getMarksResult();

  return (
    <div className="w-full space-y-6">
      {/* Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'discount', label: 'Shopping Discount', icon: Tag },
          { id: 'percentOf', label: '% Of Value', icon: Percent },
          { id: 'percentChange', label: '% Change / Diff', icon: TrendingUp },
          { id: 'marksGrade', label: 'Test Marks Grade', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id as CalcMode)}
              className={`p-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: Shopping Discount */}
      {activeMode === 'discount' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Original Item Price ($)
              </label>
              <input
                type="number"
                value={origPrice}
                onChange={(e) => setOrigPrice(e.target.value)}
                placeholder="120"
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="25"
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Sales Tax / VAT (%) [Optional]
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                placeholder="8"
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-indigo-600 text-white text-center shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
                Final Payable Price
              </span>
              <span className="text-3xl font-black block">
                ${discountRes.finalPrice.toFixed(2)}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                You Save (Discount)
              </span>
              <span className="text-3xl font-black text-emerald-800 dark:text-emerald-200 block">
                ${discountRes.discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Tax Amount
              </span>
              <span className="text-3xl font-black text-amber-800 dark:text-amber-200 block">
                ${discountRes.taxAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Percentage Of Value */}
      {activeMode === 'percentOf' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-base font-bold text-slate-800 dark:text-slate-200">
            <span>What is</span>
            <input
              type="number"
              value={partVal}
              onChange={(e) => setPartVal(e.target.value)}
              className="w-28 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center font-extrabold"
            />
            <span>% of</span>
            <input
              type="number"
              value={wholeVal}
              onChange={(e) => setWholeVal(e.target.value)}
              className="w-36 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center font-extrabold"
            />
            <span>?</span>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-600 text-white text-center shadow-lg space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
              Calculated Value
            </span>
            <span className="text-4xl font-black block">
              {percentOfRes.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>
          </div>
        </div>
      )}

      {/* Mode 3: Percent Change */}
      {activeMode === 'percentChange' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Original Initial Value (From)
              </label>
              <input
                type="number"
                value={fromVal}
                onChange={(e) => setFromVal(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                New Final Value (To)
              </label>
              <input
                type="number"
                value={toVal}
                onChange={(e) => setToVal(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-600 text-white text-center shadow-lg space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
              Percentage Difference / Change
            </span>
            <span className="text-4xl font-black block">
              {percentChangeRes.changePercent > 0 ? '+' : ''}
              {percentChangeRes.changePercent.toFixed(2)}%
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200 block">
              ({percentChangeRes.direction})
            </span>
          </div>
        </div>
      )}

      {/* Mode 4: Marks Grade */}
      {activeMode === 'marksGrade' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Marks / Score Obtained
              </label>
              <input
                type="number"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Total Maximum Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-indigo-600 text-white text-center shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
                Calculated Percentage
              </span>
              <span className="text-4xl font-black block">
                {marksRes.percent.toFixed(2)}%
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Grade Letter
              </span>
              <span className="text-4xl font-black text-emerald-800 dark:text-emerald-200 block">
                {marksRes.grade}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
