import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateCarouselProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateCarousel({ selectedDate, onDateChange }: DateCarouselProps) {
  const getDatesArray = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
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
    <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-xl p-3 shadow-sm">
      <Button
        onClick={goToPreviousDay}
        variant="ghost"
        size="icon"
        className="hover:bg-background/60 flex-shrink-0"
      >
        <ChevronLeft size={16} />
      </Button>

      <div className="flex gap-2 px-2 flex-1 justify-center overflow-hidden">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <Button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              variant={isSelected ? "default" : "ghost"}
              className={cn(
                "flex flex-col h-auto py-2 px-2 whitespace-nowrap w-[52px] flex-shrink-0",
                isSelected && "bg-primary shadow-md",
                isCurrentDay && !isSelected && "bg-nba-primary-100 dark:bg-nba-primary-900 text-nba-primary-700 dark:text-nba-primary-300"
              )}
            >
              <span className="text-xs font-medium leading-tight">
                {format(date, 'EEE')}
              </span>
              <span className={cn("text-xs leading-tight mt-0.5", isSelected && "font-bold")}>
                {format(date, 'MMM d')}
              </span>
            </Button>
          );
        })}
      </div>

      <Button
        onClick={goToNextDay}
        variant="ghost"
        size="icon"
        className="hover:bg-background/60 flex-shrink-0"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}