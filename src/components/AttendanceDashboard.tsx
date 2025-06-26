import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';


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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      // Fetch subjects
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      // Fetch attendance logs
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id);
      if (!subjectError && subjectData && !attendanceError && attendanceData) {
        // Recalculate stats for each subject
        const subjectsWithStats = subjectData.map((subject) => {
          const logs = attendanceData.filter((a) => a.subject_id === subject.id);
          const totalClasses = logs.length;
          const attendedClasses = logs.filter((a) => a.status === 'present').length;
          // Find the most recent attendance date
          let lastAttended: string | undefined = undefined;
          const presentLogs = logs.filter((a) => a.status === 'present');
          if (presentLogs.length > 0) {
            lastAttended = presentLogs
              .map((a) => a.date)
              .sort()
              .reverse()[0];
          }
          return {
            id: subject.id,
            name: subject.name,
            color: subject.color,
            totalClasses,
            attendedClasses,
            lastAttended,
            attendanceGoal: subject.attendance_goal,
          };
        });
        setSubjects(subjectsWithStats);
        setAttendanceRecords(attendanceData);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Show low attendance notification once per session
  useEffect(() => {
    if (loading) return;
    console.log('Low attendance notification effect running. Subjects:', subjects);
    if (!subjects.length) return;
    if (sessionStorage.getItem('lowAttendanceNotified')) return;
    const lowSubjects = subjects.filter(subject => {
      const percent = (subject.attendedClasses / subject.totalClasses) * 100;
      const goal = typeof subject.attendanceGoal === 'number' ? subject.attendanceGoal : 75;
      return subject.totalClasses > 0 && percent < goal;
    });
    if (lowSubjects.length > 0) {
      toast({
        title: 'Low Attendance Alert',
        description: `You are below your attendance goal in: ${lowSubjects.map(s => s.name).join(', ')}`,
        variant: 'destructive',
      });
    }
    sessionStorage.setItem('lowAttendanceNotified', 'true');
  }, [subjects, toast, loading]);

  // Unmarked days notification
  useEffect(() => {
    if (loading) return;
    if (!attendanceRecords.length) return;
    const today = new Date().toISOString().split('T')[0];
    const hasMarkedToday = attendanceRecords.some(
      (rec) => rec.date === today
    );
    if (!hasMarkedToday && !sessionStorage.getItem('unmarkedDaysNotified')) {
      toast({
        title: 'Attendance Reminder',
        description: "You haven't marked your attendance for today. Don't forget to log your classes!",
        variant: 'warning',
      });
      sessionStorage.setItem('unmarkedDaysNotified', 'true');
    }
  }, [attendanceRecords, toast, loading]);

  const addSubject = async (subjectData: Omit<Subject, 'id'>) => {
    if (!user) return;
    const { name, color, totalClasses, attendedClasses, lastAttended } = subjectData;
    const { data, error } = await supabase
      .from('subjects')
      .insert([{
        user_id: user.id,
        name,
        color,
        total_classes: totalClasses,
        attended_classes: attendedClasses,
        last_attended: lastAttended
      }])
      .select();
    if (!error && data) setSubjects(prev => [
      ...prev,
      ...data.map(subject => ({
        id: subject.id,
        name: subject.name,
        color: subject.color,
        totalClasses: subject.total_classes ?? 0,
        attendedClasses: subject.attended_classes ?? 0,
        lastAttended: subject.last_attended ?? undefined,
        attendanceGoal: subject.attendance_goal,
      }))
    ]);
  };

  const editSubject = async (subjectId: string, subjectData: Omit<Subject, 'id'>) => {
    const { name, color, totalClasses, attendedClasses, lastAttended } = subjectData;
    const { data, error } = await supabase
      .from('subjects')
      .update({
        name,
        color,
        total_classes: totalClasses,
        attended_classes: attendedClasses,
        last_attended: lastAttended
      })
      .eq('id', subjectId)
      .select();
    if (!error && data) {
      setSubjects(prev =>
        prev.map(subject =>
          subject.id === subjectId
            ? {
                id: data[0].id,
                name: data[0].name,
                color: data[0].color,
                totalClasses: data[0].total_classes ?? 0,
                attendedClasses: data[0].attended_classes ?? 0,
                lastAttended: data[0].last_attended ?? undefined,
                attendanceGoal: data[0].attendance_goal,
              }
            : subject
        )
      );
    }
  };

  const deleteSubject = async (subjectId: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId);
    if (!error) setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

/*  const updateAttendance = (subjectId: string, attended: boolean) => {
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
  };*/

  const overallAttendance = subjects.reduce((acc, subject) => {
    return acc + (subject.attendedClasses / subject.totalClasses);
  }, 0) / subjects.length * 100;

  const totalClasses = subjects.reduce((acc, subject) => acc + subject.totalClasses, 0);
  const totalAttended = subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0);

  // New: Track attendance marked today
  const [attendanceMarked, setAttendanceMarked] = useState<{ [subjectId: string]: boolean }>({});

  // New: Mark attendance and persist to Supabase
  const markAttendance = async (subjectId: string, attended: boolean) => {
    console.log('markAttendance called from SubjectCard', subjectId, attended);
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    // Insert attendance record (allow multiple per day)
    const { error: attendanceError, data: attendanceData } = await supabase
      .from('attendance')
      .insert([
        {
          user_id: user.id,
          subject_id: subjectId,
          date: today,
          status: attended ? 'present' : 'absent',
        }
      ]);

    console.log('attendance insert', { attendanceError, attendanceData });

    if (attendanceError) {
      alert('Attendance error: ' + attendanceError.message);
      return;
    }

    // Update subject stats in Supabase
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const newTotal = subject.totalClasses + 1;
    const newAttended = attended ? subject.attendedClasses + 1 : subject.attendedClasses;
    const { data, error } = await supabase
      .from('subjects')
      .update({
        total_classes: newTotal,
        attended_classes: newAttended,
        last_attended: today,
      })
      .eq('id', subjectId)
      .select();

    console.log('subject update', { error, data });

    if (error) {
      alert('Subject update error: ' + error.message);
      return;
    }

    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId
          ? {
              ...s,
              totalClasses: data[0].total_classes ?? newTotal,
              attendedClasses: data[0].attended_classes ?? newAttended,
              lastAttended: data[0].last_attended ?? today,
            }
          : s
      )
    );
    setAttendanceMarked(prev => ({ ...prev, [subjectId]: true }));
  };

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
            onAddSubject={addSubject}
            onEditSubject={editSubject}
            onDeleteSubject={deleteSubject}
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
                      onUpdateAttendance={markAttendance}
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
                    onAddSubject={addSubject}
                    onEditSubject={editSubject}
                    onDeleteSubject={deleteSubject}
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
              <ReportsAnalytics subjects={subjects} attendanceRecords={attendanceRecords} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Attendance Modal */}
        <MarkAttendanceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subjects={subjects}
          onMarkAttendance={markAttendance}
          attendanceMarked={attendanceMarked}
        />
      </div>
    </div>
  );
};

export default AttendanceDashboard;
