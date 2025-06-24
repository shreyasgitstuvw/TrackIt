
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
  lastAttended?: string;
}

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: Omit<Subject, 'id'>) => void;
  initialData?: Subject | null;
}

const colorOptions = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-indigo-500 to-indigo-600',
  'from-red-500 to-red-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
  'from-yellow-500 to-yellow-600',
  'from-cyan-500 to-cyan-600',
];

const SubjectForm: React.FC<SubjectFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalClasses: 0,
    attendedClasses: 0,
    color: colorOptions[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        totalClasses: initialData.totalClasses,
        attendedClasses: initialData.attendedClasses,
        color: initialData.color,
      });
    } else {
      setFormData({
        name: '',
        totalClasses: 0,
        attendedClasses: 0,
        color: colorOptions[0],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSubmit({
      name: formData.name.trim(),
      totalClasses: Math.max(0, formData.totalClasses),
      attendedClasses: Math.max(0, Math.min(formData.attendedClasses, formData.totalClasses)),
      color: formData.color,
      lastAttended: initialData?.lastAttended,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalClasses">Total Classes</Label>
              <Input
                id="totalClasses"
                type="number"
                min="0"
                value={formData.totalClasses}
                onChange={(e) => setFormData({ ...formData, totalClasses: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attendedClasses">Attended Classes</Label>
              <Input
                id="attendedClasses"
                type="number"
                min="0"
                max={formData.totalClasses}
                value={formData.attendedClasses}
                onChange={(e) => setFormData({ ...formData, attendedClasses: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-full rounded bg-gradient-to-r ${color} ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Subject' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectForm;
