"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Volume2, Mic, Music, Palette } from "lucide-react"

interface Settings {
  audioSensitivity: number
  pitchTolerance: number
  autoPlay: boolean
  darkMode: boolean
  notifications: boolean
  defaultTempo: number
  preferredTuning: string
  visualizations: boolean
  advancedMode: boolean
}

export function AdvancedSettings() {
  const [settings, setSettings] = useState<Settings>({
    audioSensitivity: 75,
    pitchTolerance: 10,
    autoPlay: true,
    darkMode: false,
    notifications: true,
    defaultTempo: 120,
    preferredTuning: "A440",
    visualizations: true,
    advancedMode: false,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("raga-ai-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.warn("Failed to load settings:", error)
      }
    }
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    try {
      localStorage.setItem("raga-ai-settings", JSON.stringify(settings))
      setHasChanges(false)
      alert("Settings saved successfully!")
    } catch (error) {
      alert("Failed to save settings. Please try again.")
    }
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      const defaultSettings: Settings = {
        audioSensitivity: 75,
        pitchTolerance: 10,
        autoPlay: true,
        darkMode: false,
        notifications: true,
        defaultTempo: 120,
        preferredTuning: "A440",
        visualizations: true,
        advancedMode: false,
      }
      setSettings(defaultSettings)
      setHasChanges(true)
    }
  }

  const clearAllData = () => {
    if (confirm("This will delete all your progress data. This action cannot be undone. Are you sure?")) {
      localStorage.removeItem("music_ai_sessions")
      localStorage.removeItem("music_ai_progress")
      localStorage.removeItem("raga-ai-settings")
      alert("All data cleared successfully!")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Settings</h2>
        <p className="text-gray-600">Customize your Raga AI experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-blue-500" />
              <span>Audio Settings</span>
            </CardTitle>
            <CardDescription>Configure audio processing and playback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Audio Sensitivity: {settings.audioSensitivity}%</Label>
              <Slider
                value={[settings.audioSensitivity]}
                onValueChange={([value]) => updateSetting("audioSensitivity", value)}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Higher values detect quieter sounds</p>
            </div>

            <div className="space-y-2">
              <Label>Default Tempo: {settings.defaultTempo} BPM</Label>
              <Slider
                value={[settings.defaultTempo]}
                onValueChange={([value]) => updateSetting("defaultTempo", value)}
                min={60}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Tuning</Label>
              <Select
                value={settings.preferredTuning}
                onValueChange={(value) => updateSetting("preferredTuning", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A440">A440 (Western Standard)</SelectItem>
                  <SelectItem value="A432">A432 (Alternative Tuning)</SelectItem>
                  <SelectItem value="SA_C">Sa = C (Indian Classical)</SelectItem>
                  <SelectItem value="SA_D">Sa = D (Indian Classical)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay">Auto-play generated melodies</Label>
              <Switch
                id="autoplay"
                checked={settings.autoPlay}
                onCheckedChange={(checked) => updateSetting("autoPlay", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pitch Training Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-green-500" />
              <span>Pitch Training</span>
            </CardTitle>
            <CardDescription>Fine-tune pitch detection accuracy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Pitch Tolerance: ±{settings.pitchTolerance} cents</Label>
              <Slider
                value={[settings.pitchTolerance]}
                onValueChange={([value]) => updateSetting("pitchTolerance", value)}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Lower values require more precise pitch</p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="visualizations">Show pitch visualizations</Label>
              <Switch
                id="visualizations"
                checked={settings.visualizations}
                onCheckedChange={(checked) => updateSetting("visualizations", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="advanced-mode">Advanced training mode</Label>
              <Switch
                id="advanced-mode"
                checked={settings.advancedMode}
                onCheckedChange={(checked) => updateSetting("advancedMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Interface Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-500" />
              <span>Interface</span>
            </CardTitle>
            <CardDescription>Customize the user interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark mode</Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting("darkMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting("notifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-orange-500" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription>Manage your learning data and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={resetSettings} variant="outline" className="w-full bg-transparent">
              Reset Settings to Default
            </Button>

            <Separator />

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-800 mb-3">
                    This will permanently delete all your progress data, including sessions, achievements, and settings.
                  </p>
                  <Button onClick={clearAllData} variant="destructive" size="sm">
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Changes */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-orange-900">Unsaved Changes</h4>
                <p className="text-sm text-orange-800">You have unsaved changes to your settings.</p>
              </div>
              <Button onClick={saveSettings} className="bg-orange-500 hover:bg-orange-600">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
