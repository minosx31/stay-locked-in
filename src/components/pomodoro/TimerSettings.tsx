import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

interface TimerSettingsProps {
  durations: {
    pomodoro: number
    shortBreak: number
    longBreak: number
  }
  onUpdate: (durations: {
    pomodoro: number
    shortBreak: number
    longBreak: number
  }) => void
  onClose: () => void
}

const TimerSettings = ({ durations, onUpdate, onClose }: TimerSettingsProps) => {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(Math.floor(durations.pomodoro / 60))
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(durations.shortBreak / 60))
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(durations.longBreak / 60))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onUpdate({
      pomodoro: pomodoroMinutes * 60,
      shortBreak: shortBreakMinutes * 60,
      longBreak: longBreakMinutes * 60,
    })
    
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pomodoro" className="col-span-2">
                Pomodoro (minutes)
              </Label>
              <Input
                id="pomodoro"
                type="number"
                min="1"
                max="90"
                value={pomodoroMinutes}
                onChange={e => setPomodoroMinutes(parseInt(e.target.value) || 1)}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortBreak" className="col-span-2">
                Short Break (minutes)
              </Label>
              <Input
                id="shortBreak"
                type="number"
                min="1"
                max="30"
                value={shortBreakMinutes}
                onChange={e => setShortBreakMinutes(parseInt(e.target.value) || 1)}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longBreak" className="col-span-2">
                Long Break (minutes)
              </Label>
              <Input
                id="longBreak"
                type="number"
                min="1"
                max="60"
                value={longBreakMinutes}
                onChange={e => setLongBreakMinutes(parseInt(e.target.value) || 1)}
                className="col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TimerSettings