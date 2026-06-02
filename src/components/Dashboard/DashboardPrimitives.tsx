import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';

// ==========================================
// 1. CARD PRIMITIVE
// ==========================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({ children, className = '', hoverEffect = true, ...props }: CardProps) {
  return (
    <div
      className={`bg-dash-surface border border-[#E8E5DF] rounded-2xl p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-[#DEDAD2]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ==========================================
// 2. METRIC CARD PRIMITIVE
// ==========================================
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  progress?: number; // 0 to 100
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  progress,
  className = '',
}: MetricCardProps) {
  const trendColor =
    changeType === 'positive'
      ? 'text-[#10B981]'
      : changeType === 'negative'
      ? 'text-red-500'
      : 'text-dash-text-secondary';

  const trendBg =
    changeType === 'positive'
      ? 'bg-[#10B981]/10'
      : changeType === 'negative'
      ? 'bg-red-500/10'
      : 'bg-dash-muted';

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-dash-text-secondary">
            {title}
          </span>
          <h3 className="text-3xl font-bold font-sans text-dash-text mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-dash-muted text-dash-text flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {/* Trend or Progress bar */}
      <div className="mt-4 flex items-center justify-between">
        {change && (
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendBg} ${trendColor}`}>
              {change}
            </span>
            <span className="text-[11px] text-dash-text-tertiary font-medium">vs last month</span>
          </div>
        )}

        {progress !== undefined && (
          <div className="flex items-center gap-2 w-full mt-1">
            <div className="flex-1 bg-dash-muted h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-dash-accent rounded-full"
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-dash-text-secondary">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

// ==========================================
// 3. STATUS BADGE PRIMITIVE
// ==========================================
interface StatusBadgeProps {
  status: 'active' | 'pending' | 'draft' | 'completed' | 'failed';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    active: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
    completed: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' },
    draft: { bg: 'bg-dash-muted', text: 'text-dash-text-secondary', dot: 'bg-dash-text-tertiary' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500' },
  };

  const current = styles[status] || styles.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}

// ==========================================
// 4. DATA TABLE PRIMITIVE
// ==========================================
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, onRowClick, emptyMessage = 'No items found.' }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#E8E5DF] bg-dash-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E8E5DF] bg-dash-bg/50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary ${
                  col.className || ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E5DF] bg-dash-surface">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-dash-bg/30' : 'hover:bg-dash-bg/10'
                }`}
              >
                {columns.map((col, colIdx) => {
                  const content =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);
                  return (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 font-medium text-dash-text ${col.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-dash-text-secondary">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 5. CONTEXTUAL BANNER PRIMITIVE
// ==========================================
interface BannerProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  type?: 'info' | 'warning' | 'success';
  onDismiss?: () => void;
}

export function Banner({
  title,
  description,
  actionText,
  onAction,
  type = 'info',
  onDismiss,
}: BannerProps) {
  const icon =
    type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-dash-success shrink-0" />
    ) : type === 'warning' ? (
      <AlertCircle className="w-5 h-5 text-dash-accent shrink-0" />
    ) : (
      <Sparkles className="w-5 h-5 text-dash-accent shrink-0" />
    );

  const borderClass =
    type === 'success'
      ? 'border-dash-success/20 bg-dash-success/5'
      : type === 'warning'
      ? 'border-dash-accent/20 bg-dash-accent/5'
      : 'border-dash-accent/15 bg-dash-accent/[0.02]';

  return (
    <div className={`border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${borderClass}`}>
      <div className="flex gap-3">
        {icon}
        <div>
          <h4 className="text-sm font-bold text-dash-text tracking-tight">{title}</h4>
          <p className="text-xs text-dash-text-secondary mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-full bg-dash-sidebar text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
          >
            {actionText}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-dash-text-secondary hover:text-dash-text text-xs font-medium px-2 py-1"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. PROGRESS TRACKER PRIMITIVE
// ==========================================
interface ProgressStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  onClick?: () => void;
}

interface ProgressTrackerProps {
  title: string;
  steps: ProgressStep[];
}

export function ProgressTracker({ title, steps }: ProgressTrackerProps) {
  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">
            {title}
          </h4>
          <span className="text-xs font-mono font-bold text-dash-text-secondary">
            {completedCount} / {steps.length} Completed
          </span>
        </div>
        <div className="w-full bg-dash-muted h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-dash-accent rounded-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={step.onClick}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
              step.onClick ? 'cursor-pointer hover:bg-dash-bg/30' : ''
            } ${
              step.isCompleted
                ? 'bg-dash-surface border-[#E8E5DF] opacity-80'
                : 'bg-dash-surface border-dash-accent/20 border-dashed hover:border-dash-accent/40 shadow-sm'
            }`}
          >
            <div className="mt-0.5">
              {step.isCompleted ? (
                <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-dash-accent/40 flex items-center justify-center text-[10px] font-bold text-dash-accent bg-dash-accent/5">
                  •
                </div>
              )}
            </div>
            <div className="flex-1">
              <h5
                className={`text-sm font-bold tracking-tight ${
                  step.isCompleted ? 'text-dash-text-secondary line-through' : 'text-dash-text'
                }`}
              >
                {step.title}
              </h5>
              <p className="text-xs text-dash-text-secondary mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ==========================================
// 7. TABS PRIMITIVE
// ==========================================
interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ options, activeId, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1.5 border-b border-[#E8E5DF] pb-px ${className}`}>
      {options.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer relative ${
              isActive
                ? 'border-dash-accent text-dash-text font-bold'
                : 'border-transparent text-dash-text-secondary hover:text-dash-text hover:border-[#E8E5DF]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-dash-accent"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ==========================================
// 8. PHONE PREVIEW PRIMITIVE
// ==========================================
interface StorefrontItem {
  id: string;
  title: string;
  type: 'product' | 'booking' | 'link';
  price?: string;
  icon: string;
}

interface PhonePreviewProps {
  username: string;
  bio?: string;
  items: StorefrontItem[];
}

export function PhonePreview({ username, bio = 'Crafting digital experiences & automations.', items }: PhonePreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const profileUrl = `openlx.dm/${username || 'creator'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-dash-surface border-[#E8E5DF] relative">
      {/* Top share indicator */}
      <div className="w-full flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E8E5DF]">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-dash-text-tertiary">Live Storefront Link</span>
          <h5 className="text-sm font-bold text-dash-text truncate font-sans tracking-tight mt-0.5">{profileUrl}</h5>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={copyLink}
            className="p-2 rounded-xl bg-dash-bg border border-[#E8E5DF] text-dash-text hover:bg-dash-muted hover:border-[#DEDAD2] transition-all cursor-pointer"
            title="Copy Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-dash-success" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-2 rounded-xl bg-dash-bg border border-[#E8E5DF] text-dash-text hover:bg-dash-muted hover:border-[#DEDAD2] transition-all cursor-pointer"
            title="Open in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Phone Mockup Frame */}
      <div className="w-[280px] h-[550px] bg-black rounded-[46px] p-3 border-[6px] border-neutral-800 shadow-[-15px_15px_40px_rgba(0,0,0,0.1),_0_0_50px_rgba(255,104,70,0.03)] relative overflow-hidden flex flex-col">
        {/* Diagonal reflections */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[38px] z-20" />

        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
          <div className="w-2.5 h-1.5 bg-neutral-900 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-[#0D0908] rounded-[38px] overflow-hidden flex flex-col pt-8 p-3.5 relative text-left select-none text-white">
          {/* Neon lights */}
          <div className="absolute top-[-30px] left-[-30px] w-36 h-36 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mt-2 mb-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4d15] to-[#e6005c] p-0.5 shadow-lg mb-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0D0908] flex items-center justify-center text-white font-black text-sm uppercase tracking-wider">
                {username ? username.slice(0, 2) : 'ME'}
              </div>
            </div>
            <h3 className="text-white text-xs font-bold tracking-tight">@{username || 'creator'}</h3>
            <p className="text-dash-accent text-[9px] mt-0.5 font-bold">openlx.dm/{username || 'creator'}</p>
            <p className="text-white/60 text-[9px] mt-1.5 px-4 leading-relaxed font-light">{bio}</p>
          </div>

          {/* Liquid Glass Storefront container */}
          <div className="flex flex-col gap-2 relative z-10 flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.id}
                className="liquid-glass rounded-xl p-2.5 bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 select-none">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[9px] text-white font-semibold truncate leading-tight">{item.title}</h4>
                    <p className="text-[8px] text-white/40 capitalize leading-normal">{item.type}</p>
                  </div>
                </div>
                <span className="text-[9px] text-white/80 font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/5 shrink-0">
                  {item.price ? item.price : 'Go'}
                </span>
              </div>
            ))}
          </div>

          {/* Realistic Logo Indicator */}
          <div className="mt-3 py-1 flex items-center justify-center gap-1 opacity-40 select-none">
            <span className="text-[7px] tracking-widest uppercase font-bold text-white">Powered by Openlx DM</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
