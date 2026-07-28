import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Sparkles,
  Clock,
  Heart,
  Award,
  Zap,
  Gift
} from 'lucide-react';

export const AgeCalculatorTool: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const calculateAgeDetails = () => {
    if (!birthDate) return null;

    const dob = new Date(birthDate);
    const target = new Date(targetDate || new Date());

    if (isNaN(dob.getTime()) || isNaN(target.getTime())) return null;
    if (dob > target) {
      return { error: 'Date of Birth cannot be in the future relative to target date.' };
    }

    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Totals calculation
    const diffMs = target.getTime() - dob.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next birthday calculation
    let nextBdayYear = target.getFullYear();
    let nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
    if (nextBday < target) {
      nextBdayYear++;
      nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
    }

    const nextBdayDiffMs = nextBday.getTime() - target.getTime();
    const nextBdayDays = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));
    const nextBdayMonth = Math.floor(nextBdayDays / 30.4375);
    const nextBdayDaysRem = Math.floor(nextBdayDays % 30.4375);

    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextBdayDayOfWeek = dayOfWeekNames[nextBday.getDay()];

    // Zodiac sign
    const getZodiac = (day: number, month: number) => {
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius ♒', trait: 'Innovative & Independent' };
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: 'Pisces ♓', trait: 'Compassionate & Artistic' };
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries ♈', trait: 'Eager & Bold' };
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus ♉', trait: 'Grounded & Reliable' };
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini ♊', trait: 'Versatile & Expressive' };
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer ♋', trait: 'Intuitive & Nurturing' };
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo ♌', trait: 'Passionate & Charismatic' };
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo ♍', trait: 'Analytical & Practical' };
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra ♎', trait: 'Harmonious & Diplomatic' };
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio ♏', trait: 'Resourceful & Brave' };
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius ♐', trait: 'Optimistic & Adventurous' };
      return { sign: 'Capricorn ♑', trait: 'Disciplined & Ambitious' };
    };

    const zodiac = getZodiac(dob.getDate(), dob.getMonth() + 1);

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBdayDays,
      nextBdayMonth,
      nextBdayDaysRem,
      nextBdayDayOfWeek,
      zodiac
    };
  };

  const details = calculateAgeDetails();

  return (
    <div className="w-full space-y-6">
      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            1. Select Date of Birth (DOB)
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            2. Calculate Age As Of Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {details && 'error' in details ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
          {details.error}
        </div>
      ) : details ? (
        <div className="space-y-6">
          {/* Main Primary Age Hero Banner */}
          <div className="p-8 rounded-3xl bg-indigo-600 dark:bg-indigo-950 text-white shadow-xl text-center space-y-2 border border-indigo-500/30 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200 block">
              Your Calculated Exact Age
            </span>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {details.years} <span className="text-indigo-200 text-2xl sm:text-4xl">years</span>, {details.months}{' '}
              <span className="text-indigo-200 text-2xl sm:text-4xl">months</span>, {details.days}{' '}
              <span className="text-indigo-200 text-2xl sm:text-4xl">days</span>
            </div>
            <p className="text-xs text-indigo-200/80 pt-2">
              Based on Date of Birth: {birthDate}
            </p>
          </div>

          {/* Next Birthday & Zodiac Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <Gift className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                  Next Birthday Countdown
                </span>
                <span className="text-lg font-black text-amber-900 dark:text-amber-200 block">
                  In {details.nextBdayDays} days
                </span>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                  Your next birthday falls on a <strong>{details.nextBdayDayOfWeek}</strong>.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-start gap-3">
              <Sparkles className="w-8 h-8 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400 block">
                  Astrological Zodiac Sign
                </span>
                <span className="text-lg font-black text-purple-900 dark:text-purple-200 block">
                  {details.zodiac.sign}
                </span>
                <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
                  Key Traits: {details.zodiac.trait}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Lifetime Milestones Table */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Complete Lifetime Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalMonths.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Months</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalWeeks.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Weeks</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalDays.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Days</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalHours.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Hours</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalMinutes.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Minutes</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 block">
                  {details.totalSeconds.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Seconds</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
