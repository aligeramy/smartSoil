import React, { createContext, useContext, useState } from 'react';

// Define the structure of our tutorial state
type LessonProgress = {
  completed: boolean;
  currentStep: number;
  totalSteps: number;
};

type TutorialContextType = {
  // Overall tutorial progress
  overallProgress: number;
  // Progress for each individual lesson
  lessonProgress: {
    [lessonId: string]: LessonProgress;
  };
  // Functions to update progress
  startLesson: (lessonId: string, totalSteps: number) => void;
  completeLesson: (lessonId: string) => void;
  updateLessonStep: (lessonId: string, step: number) => void;
  // Skip tutorial completely
  skipTutorial: () => void;
  hasCompletedTutorial: boolean;
};

// Create the context
const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

// Total number of lessons in the tutorial
const TOTAL_LESSONS = 4;

// Tutorial provider component
export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lessonProgress, setLessonProgress] = useState<{ [lessonId: string]: LessonProgress }>({});
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  // Calculate overall progress from all lessons
  const calculateOverallProgress = (): number => {
    const completedLessons = Object.values(lessonProgress).filter(lesson => lesson.completed).length;
    
    // If no lessons have been started yet, return 0
    if (Object.keys(lessonProgress).length === 0) return 0;
    
    // Calculate progress including partial completion of current lesson
    const currentLessonProgress = Object.values(lessonProgress)
      .filter(lesson => !lesson.completed)
      .reduce((sum, lesson) => {
        return sum + (lesson.currentStep / lesson.totalSteps);
      }, 0);
    
    return ((completedLessons + currentLessonProgress) / TOTAL_LESSONS) * 100;
  };

  // Start a lesson (initialize its progress)
  const startLesson = (lessonId: string, totalSteps: number) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: {
        completed: false,
        currentStep: 0,
        totalSteps
      }
    }));
  };

  // Mark a lesson as completed
  const completeLesson = (lessonId: string) => {
    // Add null check to ensure the lesson exists before updating
    if (!lessonProgress[lessonId]) {
      // Initialize the lesson if it doesn't exist
      startLesson(lessonId, 5); // Default to 5 steps if not initialized
    }
    
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        completed: true,
        currentStep: prev[lessonId]?.totalSteps || 0
      }
    }));
    
    // Check if all lessons are complete
    const updatedProgress = {
      ...lessonProgress,
      [lessonId]: {
        ...lessonProgress[lessonId],
        completed: true,
        currentStep: lessonProgress[lessonId]?.totalSteps || 0
      }
    };
    
    const allComplete = Object.keys(updatedProgress).length === TOTAL_LESSONS &&
      Object.values(updatedProgress).every(lesson => lesson.completed);
      
    if (allComplete) {
      setHasCompletedTutorial(true);
    }
  };

  // Update the current step of a lesson
  const updateLessonStep = (lessonId: string, step: number) => {
    setLessonProgress(prev => {
      if (!prev[lessonId]) return prev;
      
      return {
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          currentStep: step
        }
      };
    });
  };

  // Skip the entire tutorial
  const skipTutorial = () => {
    setHasCompletedTutorial(true);
  };

  // Context value
  const value = {
    overallProgress: calculateOverallProgress(),
    lessonProgress,
    startLesson,
    completeLesson,
    updateLessonStep,
    skipTutorial,
    hasCompletedTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

// Custom hook to use the tutorial context
export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

// Add default export
export default TutorialProvider; 