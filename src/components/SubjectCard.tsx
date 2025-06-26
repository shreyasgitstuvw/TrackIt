import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface SubjectCardProps {
  subject: Subject;
  onUpdateAttendance: (subjectId: string, attended: boolean) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onUpdateAttendance }) => {
  const [loading, setLoading] = useState(false);
  const attendancePercentage = (subject.attendedClasses / subject.totalClasses) * 100;
  
  const getAttendanceStatus = () => {
    if (attendancePercentage >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (attendancePercentage >= 80) return { label: 'Good', color: 'bg-blue-500' };
    if (attendancePercentage >= 75) return { label: 'Average', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const status = getAttendanceStatus();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">{subject.name}</CardTitle>
          <Badge className={`${status.color} text-white px-3 py-1 text-xs font-semibold`}>
            {status.label}
          </Badge>
        </div>
        <div className={`h-1 w-full bg-gradient-to-r ${subject.color} rounded-full`} />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Attendance Percentage */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {attendancePercentage.toFixed(1)}%
          </div>
          <Progress value={attendancePercentage} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {subject.attendedClasses} out of {subject.totalClasses} classes
          </p>
        </div>

        {/* Last Attended */}
        {subject.lastAttended && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last: {new Date(subject.lastAttended).toLocaleDateString()}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={async () => {
              setLoading(true);
              await onUpdateAttendance(subject.id, true);
              setLoading(false);
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            disabled={loading}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {loading ? 'Marking...' : 'Present'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setLoading(true);
              await onUpdateAttendance(subject.id, false);
              setLoading(false);
            }}
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            disabled={loading}
          >
            <XCircle className="h-4 w-4 mr-1" />
            {loading ? 'Marking...' : 'Absent'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
