
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Award,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
  attendanceGoal?: number;
}

interface ReportsAnalyticsProps {
  subjects: Subject[];
}

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ subjects }) => {
  const analytics = useMemo(() => {
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    const overallAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

    const subjectData = subjects.map(subject => {
      const attendance = (subject.attendedClasses / subject.totalClasses) * 100;
      const goalMet = subject.attendanceGoal ? attendance >= subject.attendanceGoal : true;
      return {
        ...subject,
        attendance,
        goalMet,
        missedClasses: subject.totalClasses - subject.attendedClasses
      };
    });

    const topPerformer = subjectData.reduce((top, current) => 
      current.attendance > top.attendance ? current : top, subjectData[0] || null
    );

    const needsAttention = subjectData.filter(subject => 
      subject.attendanceGoal && subject.attendance < subject.attendanceGoal
    );

    const perfectAttendance = subjectData.filter(subject => subject.attendance === 100);

    return {
      totalClasses,
      totalAttended,
      overallAttendance,
      subjectData,
      topPerformer,
      needsAttention,
      perfectAttendance
    };
  }, [subjects]);

  const chartConfig = {
    attendance: {
      label: "Attendance %",
      color: "hsl(var(--chart-1))",
    },
    classes: {
      label: "Classes",
      color: "hsl(var(--chart-2))",
    },
  };

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  if (subjects.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No data available</h3>
            <p className="text-gray-500">Add subjects and mark attendance to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.overallAttendance.toFixed(1)}%
                </p>
              </div>
              {analytics.overallAttendance >= 80 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.totalClasses}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perfect Attendance</p>
                <p className="text-2xl font-bold text-green-600">{analytics.perfectAttendance.length}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-red-600">{analytics.needsAttention.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Subject */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Attendance by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={analytics.subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="attendance" 
                  fill="var(--color-attendance)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Classes Distribution */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Classes Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={analytics.subjectData}
                  dataKey="totalClasses"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performer */}
        {analytics.topPerformer && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${analytics.topPerformer.color}`} />
                    <span className="font-semibold">{analytics.topPerformer.name}</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {analytics.topPerformer.attendance.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={analytics.topPerformer.attendance} className="h-2" />
                <p className="text-sm text-gray-600">
                  {analytics.topPerformer.attendedClasses} out of {analytics.topPerformer.totalClasses} classes attended
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subjects Needing Attention */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.needsAttention.length > 0 ? (
              <div className="space-y-4">
                {analytics.needsAttention.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${subject.color}`} />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <Badge variant="destructive">
                        {subject.attendance.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={subject.attendance} className="h-2" />
                    <p className="text-sm text-gray-600">
                      Need {Math.ceil((subject.attendanceGoal! * subject.totalClasses / 100) - subject.attendedClasses)} more classes to reach {subject.attendanceGoal}% goal
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                All subjects are meeting their attendance goals! 🎉
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Subject Performance */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Detailed Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Subject</th>
                  <th className="text-left py-3 px-4 font-semibold">Attendance</th>
                  <th className="text-left py-3 px-4 font-semibold">Classes</th>
                  <th className="text-left py-3 px-4 font-semibold">Goal</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.subjectData.map((subject) => (
                  <tr key={subject.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${subject.color}`} />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{subject.attendance.toFixed(1)}%</span>
                        <Progress value={subject.attendance} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {subject.attendedClasses}/{subject.totalClasses}
                    </td>
                    <td className="py-3 px-4">
                      {subject.attendanceGoal ? `${subject.attendanceGoal}%` : 'Not set'}
                    </td>
                    <td className="py-3 px-4">
                      {subject.attendance === 100 ? (
                        <Badge className="bg-green-500 text-white">Perfect</Badge>
                      ) : subject.goalMet ? (
                        <Badge className="bg-blue-500 text-white">On Track</Badge>
                      ) : (
                        <Badge variant="destructive">Behind</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
