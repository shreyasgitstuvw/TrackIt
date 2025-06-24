
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import SubjectForm from './SubjectForm';

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface SubjectManagerProps {
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, onUpdateSubjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: Date.now().toString(),
    };
    onUpdateSubjects([...subjects, newSubject]);
    setIsFormOpen(false);
  };

  const handleEditSubject = (subjectData: Omit<Subject, 'id'>) => {
    if (!editingSubject) return;
    
    const updatedSubjects = subjects.map(subject =>
      subject.id === editingSubject.id
        ? { ...subjectData, id: editingSubject.id }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
    setEditingSubject(null);
    setIsFormOpen(false);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    onUpdateSubjects(updatedSubjects);
  };

  const openEditForm = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Subjects
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Manage Subjects</span>
            <Button onClick={openAddForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {subjects.map((subject) => {
            const attendancePercentage = (subject.attendedClasses / subject.totalClasses) * 100;
            
            return (
              <Card key={subject.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditForm(subject)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className={`h-1 w-full bg-gradient-to-r ${subject.color} rounded-full`} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <Badge variant="secondary">
                        {attendancePercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {subject.attendedClasses} / {subject.totalClasses} classes
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No subjects added yet.</p>
            <Button onClick={openAddForm} className="mt-4">
              Add Your First Subject
            </Button>
          </div>
        )}

        <SubjectForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSubject(null);
          }}
          onSubmit={editingSubject ? handleEditSubject : handleAddSubject}
          initialData={editingSubject}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubjectManager;
