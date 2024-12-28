"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mic, FileAudio, Save, Upload, Sun, Moon, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function AudioTranscriptionInput({ onTranscriptionComplete }: { onTranscriptionComplete: (transcription: { refined: string, raw: string }) => void }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [file, setFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [rawTranscription, setRawTranscription] = useState<string[]>([])
  const [refinedTranscription, setRefinedTranscription] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [rawTranscription, refinedTranscription])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleTranscribe = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setProgress(0)
    setRawTranscription([])
    setRefinedTranscription('')
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      const response = await fetch('/api/transcribe-whisper', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line) {
              try {
                const data = JSON.parse(line)
                if (data.progress) {
                  setProgress(data.progress)
                }
                if (data.partialTranscription) {
                  setRawTranscription(prev => [...prev, data.partialTranscription])
                }
                if (data.transcription) {
                  setRefinedTranscription(data.transcription)
                }
                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (error) {
                console.error('Error parsing JSON:', error)
              }
            }
          }
        }
      }

      // Call onTranscriptionComplete when transcription is done
      onTranscriptionComplete({
        refined: refinedTranscription,
        raw: rawTranscription.join('\n')
      });
    } catch (error) {
      console.error('Error during transcription:', error)
      toast({
        title: "Transcription Error",
        description: error instanceof Error ? error.message : "An error occurred during transcription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          chunksRef.current = [];
          handleTranscribe(audioBlob);
        };

        chunksRef.current = []; // Clear any previous chunks
        mediaRecorderRef.current.start(); // Remove the 1000ms interval
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone Error",
          description: "Unable to access the microphone. Please check your permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    if (refinedTranscription.length === 0) return

    const suggestedName = `transcript_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`

    try {
      // @ts-expect-error: File System Access API may not be supported in all browsers
      const fileHandle = await window.showSaveFilePicker({
        suggestedName,
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] },
        }],
      })
      const writable = await fileHandle.createWritable()
      await writable.write(refinedTranscription)
      await writable.close()
      toast({
        title: "Save Successful",
        description: "Transcription saved successfully!",
      })
    } catch (err) {
      console.error('Failed to save the file:', err)
      toast({
        title: "Save Failed",
        description: "Failed to save the transcription. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 via-gray-100 to-pink-100'}`}>
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Audio Transcriber</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-900" />}
          </Button>
        </div>
        {children}
      </div>
    </div>
  )

  const TranscriptionContent = () => (
    <Card className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <CardHeader>
        <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>AI Audio Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Record Audio</TabsTrigger>
            <TabsTrigger value="upload">Upload Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="record">
            <Button onClick={toggleRecording} disabled={isTranscribing} className="w-full">
              {isRecording ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="upload">
            <div className="flex items-center justify-between">
              <Input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleUpload} className="flex-1 mr-2">
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio
              </Button>
              {file && (
                <Button onClick={() => file && handleTranscribe(file)} disabled={isTranscribing}>
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    <>
                      <FileAudio className="w-4 h-4 mr-2" />
                      Transcribe
                    </>
                  )}
                </Button>
              )}
            </div>
            {file && (
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Selected file: {file.name}
              </p>
            )}
          </TabsContent>
        </Tabs>
        {isTranscribing && (
          <Progress value={progress} className="w-full" />
        )}
        <Tabs defaultValue="raw">
          <TabsList>
            <TabsTrigger value="raw">Raw Transcription</TabsTrigger>
            <TabsTrigger value="refined">Refined Transcription</TabsTrigger>
          </TabsList>
          <TabsContent value="raw">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4" ref={scrollAreaRef}>
              {rawTranscription.map((line, index) => (
                <p key={index} className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{line}</p>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="refined">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4" ref={scrollAreaRef}>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{refinedTranscription}</p>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSave} disabled={refinedTranscription.length === 0}>
          <Save className="w-4 h-4 mr-2" />
          Save Transcription
        </Button>
      </CardFooter>
    </Card>
  )

  const SmallInputArea = () => (
    <div className="flex items-center space-x-2">
      <Textarea
        placeholder="Type or record your message..."
        className="flex-grow"
      />
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Audio Transcription</DialogTitle>
              <DialogDescription>
                Record or upload audio to transcribe
              </DialogDescription>
            </DialogHeader>
            <TranscriptionContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Audio Transcription</DrawerTitle>
              <DrawerDescription>
                Record or upload audio to transcribe
              </DrawerDescription>
            </DrawerHeader>
            <TranscriptionContent />
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )

  return (
    <ContentWrapper>
      <Card className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <CardHeader>
          <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>AI Audio Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <SmallInputArea />
        </CardContent>
      </Card>
    </ContentWrapper>
  )
}
