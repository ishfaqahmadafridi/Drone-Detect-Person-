// ==========================================
// 4. Tuning Panel Component Props
// ==========================================
export interface TuningHeaderProps {
  showSavedToast: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export interface TuningSliderProps {
  label: string;
  badgeValue: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
}
