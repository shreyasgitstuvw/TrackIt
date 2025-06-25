import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, TrendingUp, Users, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import SubjectCard from './SubjectCard';
import AttendanceStats from './AttendanceStats';
import MarkAttendanceModal from './MarkAttendanceModal';
import SubjectManager from './subject-management/SubjectManager';
import AttendanceCalendar from './calendar/AttendanceCalendar';
import GoalSetting from './goals/GoalSetting';
import ReportsAnalytics from './reports/ReportsAnalytics';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
  attendanceGoal?: number;
}

const AttendanceDashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      totalClasses: 45,
      attendedClasses: 42,
      color: 'from-blue-500 to-blue-600',
      lastAttended: '2024-06-23',
      attendanceGoal: 90
    },
    {
      id: '2',
      name: 'Physics',
      totalClasses: 40,
      attendedClasses: 35,
      color: 'from-purple-500 to-purple-600',
      lastAttended: '2024-06-22',
      attendanceGoal: 85
    },
    {
      id: '3',
      name: 'Chemistry',
      totalClasses: 38,
      attendedClasses: 30,
      color: 'from-green-500 to-green-600',
      lastAttended: '2024-06-21',
      attendanceGoal: 80
    },
    {
      id: '4',
      name: 'English',
      totalClasses: 35,
      attendedClasses: 33,
      color: 'from-orange-500 to-orange-600',
      lastAttended: '2024-06-23',
      attendanceGoal: 85
    },
    {
      id: '5',
      name: 'Computer Science',
      totalClasses: 42,
      attendedClasses: 38,
      color: 'from-indigo-500 to-indigo-600',
      lastAttended: '2024-06-22',
      attendanceGoal: 90
    },
    {
      id: '6',
      name: 'History',
      totalClasses: 30,
      attendedClasses: 25,
      color: 'from-red-500 to-red-600',
      lastAttended: '2024-06-20',
      attendanceGoal: 75
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateAttendance = (subjectId: string, attended: boolean) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            attendedClasses: attended ? subject.attendedClasses + 1 : subject.attendedClasses,
            lastAttended: new Date().toISOString().split('T')[0]
          }
        : subject
    ));
  };

  const overallAttendance = subjects.reduce((acc, subject) => {
    return acc + (subject.attendedClasses / subject.totalClasses);
  }, 0) / subjects.length * 100;

  const totalClasses = subjects.reduce((acc, subject) => acc + subject.totalClasses, 0);
  const totalAttended = subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              My Attendance
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your attendance across all subjects and stay on top of your academic progress
          </p>
        </div>

        {/* Overall Stats */}
        <AttendanceStats 
          overallAttendance={overallAttendance}
          totalClasses={totalClasses}
          totalAttended={totalAttended}
          subjects={subjects}
        />

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Mark Attendance
          </Button>
          
          <SubjectManager 
            subjects={subjects}
            onUpdateSubjects={setSubjects}
          />
        </div>

        {/* Main Content Tabs */}
        <div className="animate-fade-in">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <SubjectCard 
                      subject={subject} 
                      onUpdateAttendance={updateAttendance}
                    />
                  </div>
                ))}
              </div>

              {subjects.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No subjects added yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first subject</p>
                  <SubjectManager 
                    subjects={subjects}
                    onUpdateSubjects={setSubjects}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <AttendanceCalendar subjects={subjects} />
            </TabsContent>

            <TabsContent value="goals">
              <GoalSetting 
                subjects={subjects}
                onUpdateSubjects={setSubjects}
              />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsAnalytics subjects={subjects} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Attendance Modal */}
        <MarkAttendanceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subjects={subjects}
          onUpdateAttendance={updateAttendance}
        />
      </div>
    </div>
  );
};

export default AttendanceDashboard;
