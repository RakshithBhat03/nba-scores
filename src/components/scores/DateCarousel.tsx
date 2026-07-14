import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateCarouselProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateCarousel({ selectedDate, onDateChange }: DateCarouselProps) {
  const getDatesArray = () => {
    const dates = [];
    for (let i = -2; i <= 2; i++) {
      dates.push(addDays(selectedDate, i));
    }
    return dates;
  };

  const dates = getDatesArray();

  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1.5 shadow-sm backdrop-blur-sm">
      <button
        onClick={goToPreviousDay}
        aria-label="Previous day"
        className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex flex-1 justify-center gap-1 overflow-hidden">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex h-[42px] w-[58px] flex-shrink-0 flex-col items-center justify-center rounded-lg transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              )}
            >
              <span className={cn('text-[10px] font-medium uppercase leading-none', isSelected ? 'text-primary-foreground/80' : '')}>
                {format(date, 'EEE')}
              </span>
              <span className={cn('mt-0.5 text-xs leading-none tabular-nums', isSelected ? 'font-bold' : 'font-semibold')}>
                {format(date, 'd')}
              </span>
              {isCurrentDay && !isSelected && (
                <span className="mt-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={goToNextDay}
        aria-label="Next day"
        className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
