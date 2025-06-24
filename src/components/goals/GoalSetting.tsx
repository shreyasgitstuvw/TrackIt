
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
  attendanceGoal?: number;
}

interface GoalSettingProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ subjects, onUpdateSubjects }) => {
  const [editingGoals, setEditingGoals] = useState<{ [key: string]: number }>({});

  const handleGoalChange = (subjectId: string, goal: number) => {
    setEditingGoals(prev => ({
      ...prev,
      [subjectId]: goal
    }));
  };

  const saveGoal = (subjectId: string) => {
    const goal = editingGoals[subjectId];
    if (goal !== undefined) {
      onUpdateSubjects(subjects.map(subject => 
        subject.id === subjectId 
          ? { ...subject, attendanceGoal: goal }
          : subject
      ));
      
      // Remove from editing state
      const newEditingGoals = { ...editingGoals };
      delete newEditingGoals[subjectId];
      setEditingGoals(newEditingGoals);
    }
  };

  const getGoalStatus = (subject: Subject) => {
    const currentPercentage = (subject.attendedClasses / subject.totalClasses) * 100;
    const goal = subject.attendanceGoal || 75;
    
    if (currentPercentage >= goal) {
      return { status: 'achieved', color: 'bg-green-500', icon: CheckCircle };
    } else if (currentPercentage >= goal - 10) {
      return { status: 'on-track', color: 'bg-yellow-500', icon: TrendingUp };
    } else {
      return { status: 'at-risk', color: 'bg-red-500', icon: AlertTriangle };
    }
  };

  const calculateClassesNeeded = (subject: Subject) => {
    const goal = subject.attendanceGoal || 75;
    const currentPercentage = (subject.attendedClasses / subject.totalClasses) * 100;
    
    if (currentPercentage >= goal) return 0;
    
    // Calculate how many consecutive classes needed to reach goal
    let classesNeeded = 0;
    let futureAttended = subject.attendedClasses;
    let futureTotal = subject.totalClasses;
    
    while ((futureAttended / futureTotal) * 100 < goal && classesNeeded < 50) {
      futureAttended++;
      futureTotal++;
      classesNeeded++;
    }
    
    return classesNeeded;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Attendance Goals
          </CardTitle>
          <p className="text-sm text-gray-600">
            Set and track attendance targets for each subject
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map((subject) => {
              const currentPercentage = (subject.attendedClasses / subject.totalClasses) * 100;
              const goal = subject.attendanceGoal || 75;
              const goalStatus = getGoalStatus(subject);
              const classesNeeded = calculateClassesNeeded(subject);
              const StatusIcon = goalStatus.icon;
              const isEditing = editingGoals[subject.id] !== undefined;

              return (
                <div key={subject.id} className="p-4 rounded-lg border bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${subject.color}`} />
                      <h3 className="font-semibold">{subject.name}</h3>
                      <Badge className={`${goalStatus.color} text-white`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {goalStatus.status === 'achieved' ? 'Goal Achieved' : 
                         goalStatus.status === 'on-track' ? 'On Track' : 'At Risk'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={editingGoals[subject.id]}
                            onChange={(e) => handleGoalChange(subject.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm">%</span>
                          <Button size="sm" onClick={() => saveGoal(subject.id)}>
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-600">Goal: {goal}%</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGoalChange(subject.id, goal)}
                          >
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current: {currentPercentage.toFixed(1)}%</span>
                      <span className="text-sm text-gray-600">Target: {goal}%</span>
                    </div>
                    
                    <div className="relative">
                      <Progress value={currentPercentage} className="h-3" />
                      <div 
                        className="absolute top-0 w-1 h-3 bg-red-500 opacity-70"
                        style={{ left: `${goal}%` }}
                      />
                    </div>

                    {classesNeeded > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Action needed:</strong> Attend the next {classesNeeded} classes to reach your {goal}% goal
                        </p>
                      </div>
                    )}

                    {goalStatus.status === 'achieved' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Congratulations!</strong> You've achieved your attendance goal for this subject!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {subjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No subjects available. Add subjects to set attendance goals.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSetting;
