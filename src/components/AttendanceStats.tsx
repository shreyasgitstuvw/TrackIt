
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, BookOpen, Target } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface AttendanceStatsProps {
  overallAttendance: number;
  totalClasses: number;
  totalAttended: number;
  subjects: Subject[];
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  overallAttendance,
  totalClasses,
  totalAttended,
  subjects
}) => {
  const getOverallStatus = () => {
    if (overallAttendance >= 90) return { text: 'Excellent Performance!', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (overallAttendance >= 80) return { text: 'Good Progress!', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (overallAttendance >= 75) return { text: 'Needs Improvement', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { text: 'Critical - Improve Attendance', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const status = getOverallStatus();
  const averageClassesPerSubject = Math.round(totalClasses / subjects.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      {/* Overall Attendance */}
      <Card className="md:col-span-2 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Overall Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-4xl font-bold">{overallAttendance.toFixed(1)}%</div>
            <Progress value={overallAttendance} className="h-3 bg-white/20" />
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status.bgColor} ${status.color}`}>
              {status.text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Classes */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5" />
            Total Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{totalClasses}</div>
          <p className="text-sm text-gray-600 mt-1">
            Avg {averageClassesPerSubject} per subject
          </p>
        </CardContent>
      </Card>

      {/* Classes Attended */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <BookOpen className="h-5 w-5" />
            Attended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{totalAttended}</div>
          <p className="text-sm text-gray-600 mt-1">
            {totalClasses - totalAttended} missed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
