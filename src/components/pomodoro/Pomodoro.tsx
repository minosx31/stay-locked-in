import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Maximize, Minimize, Plus, Settings, Trash2 } from 'lucide-react'
import TimerSettings from './TimerSettings'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'

// Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function Pomodoro() {
  const [activeTab, setActiveTab] = useState('pomodoro')
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60) // Default: 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false)
  const [isCursorVisible, setIsCursorVisible] = useState(true)
  
  // Default durations in seconds
  const [durations, setDurations] = useState({
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  })

  // New state for task management
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')

  // New fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Function to enter fullscreen
  const enterFullscreen = () => {
    const element = fullscreenContainerRef.current
    
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(`Error attempting to enable fullscreen: ${err.message}`))
      } else if ((element as any).webkitRequestFullscreen) { /* Safari */
        (element as any).webkitRequestFullscreen()
        setIsFullscreen(true)
      } else if ((element as any).msRequestFullscreen) { /* IE11 */
        (element as any).msRequestFullscreen()
        setIsFullscreen(true)
      }
    }
  }
  
  // Function to exit fullscreen
  const exitFullscreen = () => {
    if (document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(`Error attempting to exit fullscreen: ${err.message}`))
      } else if ((document as any).webkitExitFullscreen) { /* Safari */
        (document as any).webkitExitFullscreen()
        setIsFullscreen(false)
      } else if ((document as any).msExitFullscreen) { /* IE11 */
        (document as any).msExitFullscreen()
        setIsFullscreen(false)
      }
    }
  }
  
  // Toggle fullscreen function
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }
  
  // Handle fullscreen change events from the browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Update our state based on the browser's fullscreen state
      setIsFullscreen(
        Boolean(
          document.fullscreenElement || 
          (document as any).webkitFullscreenElement || 
          (document as any).msFullscreenElement
        )
      )
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Add this effect to handle cursor visibility in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) {
      // Always show cursor when not in fullscreen
      setIsCursorVisible(true)
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current)
        cursorTimeoutRef.current = null
      }
      return
    }

    // Reset cursor visibility when mouse moves
    const handleMouseMove = () => {
      setIsCursorVisible(true)
      
      // Clear any existing timeout
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current)
      }
      
      // Set a new timeout to hide cursor after 3 seconds
      cursorTimeoutRef.current = window.setTimeout(() => {
        setIsCursorVisible(false)
      }, 3000)
    }

    // Initial hide cursor timeout when entering fullscreen
    cursorTimeoutRef.current = window.setTimeout(() => {
      setIsCursorVisible(false)
    }, 3000)
    
    // Add mouse event listeners
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current)
      }
    }
  }, [isFullscreen])
  
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const cursorTimeoutRef = useRef<number | null>(null)
  
  // Initialize audio
  // useEffect(() => {
  //   audioRef.current = new Audio('/notification.mp3')
  //   return () => {
  //     if (intervalRef.current) clearInterval(intervalRef.current)
  //   }
  // }, [])
  
  // Handle tab changes
  useEffect(() => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    switch (activeTab) {
      case 'pomodoro':
        setTime(durations.pomodoro)
        break
      case 'shortBreak':
        setTime(durations.shortBreak)
        break
      case 'longBreak':
        setTime(durations.longBreak)
        break
    }
  }, [activeTab, durations])
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            // Timer finished
            setIsRunning(false)
            clearInterval(intervalRef.current!)
            audioRef.current?.play()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    switch (activeTab) {
      case 'pomodoro':
        setTime(durations.pomodoro)
        break
      case 'shortBreak':
        setTime(durations.shortBreak)
        break
      case 'longBreak':
        setTime(durations.longBreak)
        break
    }
  }
  
  const updateDurations = (newDurations: typeof durations) => {
    setDurations(newDurations)
    // Update current time based on active tab
    switch (activeTab) {
      case 'pomodoro':
        setTime(newDurations.pomodoro)
        break
      case 'shortBreak':
        setTime(newDurations.shortBreak)
        break
      case 'longBreak':
        setTime(newDurations.longBreak)
        break
    }
  }

  // // Calculate progress percentage
  // const getMaxTime = () => {
  //   switch (activeTab) {
  //     case 'pomodoro': return durations.pomodoro
  //     case 'shortBreak': return durations.shortBreak
  //     case 'longBreak': return durations.longBreak
  //     default: return durations.pomodoro
  //   }
  // }

  // TASKS MANAGEMENT
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoroTasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Failed to parse saved tasks:', error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks))
  }, [tasks])

  // New task management methods
  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTaskText.trim()) return
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
    }
    
    setTasks([...tasks, newTask])
    setNewTaskText('')
  }
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }
  
  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }
  // END - TASKS MANAGEMENT
  
  // const progress = (time / getMaxTime()) * 100

  return (
    <div className='w-full h-full' ref={fullscreenContainerRef}>
      {isFullscreen 
        ? (
        // Fullscreen timer UI
        <div className={`fixed inset-0 bg-background flex items-center justify-center z-50 ${isCursorVisible ? "" : 'cursor-none'}`}>
          <div className="text-center w-4/5">
            <h2 className="text-[16rem] font-extrabold tabular-nums">{formatTime(time)}</h2>
            <div className="mt-8 flex justify-center">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  variant="secondary"
                  className="w-32 h-12 text-lg mx-2"
                >
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg" 
                  variant="secondary"
                  className="w-32 h-12 text-lg mx-2"
                >
                  Pause
                </Button>
              )}
              <Button
                onClick={toggleFullscreen}
                size="lg"
                variant="outline"
                className="ml-4 h-12"
              >
                <Minimize className="h-6 w-6" />
                <span className="ml-2">Exit Fullscreen</span>
              </Button>
            </div>
          </div>
        </div>
        ) 
        : (
          <div className="flex flex-col items-center justify-center gap-8 p-6 max-w-md mx-auto">
      {/* Timer Tabs */}
      <Tabs
        defaultValue="pomodoro"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Timer Display */}
      <div className="flex flex-col items-center">
        <div className="relative w-80 h-35 mb-6">
          {/* Timer Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-9xl font-extrabold tabular-nums">{formatTime(time)}</h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              variant="secondary"
              className="w-24"
            >
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="secondary"
              className="w-24"
            >
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="ghost">
            Reset
          </Button>
          <Button
            onClick={toggleFullscreen}
            size="icon"
            variant="outline"
          >
            <Maximize size={20} />
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            size="icon"
            variant="outline"
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="w-full max-w-md mt-6 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Tasks</h3>
        
        {/* Task Form */}
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        
        {/* Task List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label 
                    htmlFor={`task-${task.id}`}
                    className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(task.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <TimerSettings
          durations={durations}
          onUpdate={updateDurations}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
        )}
    </div>
  );
}

export default Pomodoro