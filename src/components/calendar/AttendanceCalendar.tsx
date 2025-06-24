
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface AttendanceRecord {
  date: string;
  subjectId: string;
  attended: boolean;
}

interface AttendanceCalendarProps {
  subjects: Subject[];
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ subjects }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Mock attendance data - in a real app, this would come from a database
  const mockAttendanceData: AttendanceRecord[] = [
    { date: '2024-06-20', subjectId: '1', attended: true },
    { date: '2024-06-20', subjectId: '2', attended: false },
    { date: '2024-06-21', subjectId: '1', attended: true },
    { date: '2024-06-21', subjectId: '3', attended: true },
    { date: '2024-06-22', subjectId: '2', attended: true },
    { date: '2024-06-22', subjectId: '5', attended: true },
    { date: '2024-06-23', subjectId: '1', attended: true },
    { date: '2024-06-23', subjectId: '4', attended: true },
  ];

  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockAttendanceData.filter(record => record.date === dateStr);
  };

  const getAttendanceStats = (date: Date) => {
    const records = getAttendanceForDate(date);
    const attended = records.filter(r => r.attended).length;
    const total = records.length;
    return { attended, total };
  };

  const getDayContent = (date: Date) => {
    const stats = getAttendanceStats(date);
    if (stats.total === 0) return null;

    const percentage = (stats.attended / stats.total) * 100;
    let bgColor = 'bg-gray-200';
    
    if (percentage === 100) bgColor = 'bg-green-500';
    else if (percentage >= 75) bgColor = 'bg-yellow-500';
    else if (percentage > 0) bgColor = 'bg-red-500';

    return (
      <div className={`w-2 h-2 rounded-full ${bgColor} mx-auto mt-1`} />
    );
  };

  const selectedDateAttendance = selectedDate ? getAttendanceForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Attendance Calendar
          </CardTitle>
          <p className="text-sm text-gray-600">
            View your attendance patterns over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="rounded-md border pointer-events-auto"
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative">
                      <div>{date.getDate()}</div>
                      {getDayContent(date)}
                    </div>
                  ),
                }}
              />
              
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Perfect (100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Good (75%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Missed Classes</span>
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            <div>
              <h3 className="font-semibold mb-4">
                {selectedDate 
                  ? `Attendance for ${format(selectedDate, 'MMMM d, yyyy')}` 
                  : 'Select a date to view details'
                }
              </h3>
              
              {selectedDate && selectedDateAttendance.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAttendance.map((record) => {
                    const subject = subjects.find(s => s.id === record.subjectId);
                    if (!subject) return null;
                    
                    return (
                      <div key={`${record.date}-${record.subjectId}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${subject.color}`} />
                          <span className="font-medium">{subject.name}</span>
                        </div>
                        <Badge 
                          className={record.attended ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        >
                          {record.attended ? 'Present' : 'Absent'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500">No classes on this date</p>
              ) : (
                <p className="text-gray-500">Click on a date to see attendance details</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
