
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpdateAttendance: (subjectId: string, attended: boolean) => void;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onUpdateAttendance
}) => {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const handleMarkAttendance = (subjectId: string, attended: boolean) => {
    onUpdateAttendance(subjectId, attended);
    const subject = subjects.find(s => s.id === subjectId);
    toast({
      title: "Attendance Marked",
      description: `Marked ${attended ? 'Present' : 'Absent'} for ${subject?.name}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Mark Today's Attendance
          </DialogTitle>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${subject.color}`} />
                    <div>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <p className="text-sm text-gray-600">
                        Current: {((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleMarkAttendance(subject.id, true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(subject.id, false)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button onClick={onClose} variant="outline" className="px-8">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendanceModal;
