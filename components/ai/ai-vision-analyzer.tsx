"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Moon, Sun, Camera, Mic, Send, Loader2, Copy, Volume2, SwitchCamera, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { useToast } from "@/components/ui/use-toast";

export default function AiVisionAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('camera');
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(undefined);

  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    setTheme('dark');
    const getCameraDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    };

    getCameraDevices();
  }, [setTheme]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.video!.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      alert("Unable to access the camera. Please make sure you've granted the necessary permissions.");
    }
  };

  const switchCamera = async () => {
    const currentIndex = cameraDevices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    setCurrentDeviceId(cameraDevices[nextIndex].deviceId);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        const audioChunks: BlobPart[] = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          sendAudioToWhisper(audioBlob);
        });
      })
      .catch(error => {
        console.error("Error accessing the microphone:", error);
        alert("Unable to access the microphone. Please make sure you've granted the necessary permissions.");
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/transcribe-whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullTranscription = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          console.log('Received chunk:', chunk);
          try {
            const parsedChunk = JSON.parse(chunk);

            if (parsedChunk.error) {
              throw new Error(parsedChunk.error);
            }

            if (parsedChunk.partialTranscription) {
              fullTranscription += parsedChunk.partialTranscription;
              console.log('Partial transcription:', parsedChunk.partialTranscription);
              setInstructions(prev => prev + parsedChunk.partialTranscription);
            }

            if (parsedChunk.transcription) {
              fullTranscription = parsedChunk.transcription;
              console.log('Full transcription received:', fullTranscription);
              setInstructions(fullTranscription.trim());
            }

            if (parsedChunk.done) {
              console.log('Transcription process completed');
              break;
            }
          } catch (parseError) {
            console.error('Error parsing chunk:', parseError);
            console.error('Problematic chunk:', chunk);
          }
        }
      }

      if (!fullTranscription) {
        throw new Error('No transcription received');
      }

      console.log('Final full transcription:', fullTranscription);
      setInstructions(fullTranscription.trim());
      handleSubmit(); // Auto-submit after transcription
    } catch (error: unknown) {
      console.error('Error during transcription:', error);
      let errorMessage = 'An error occurred during transcription';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast({
        title: "Transcription Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const compressImage = async (imageFile: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    try {
      return await imageCompression(imageFile, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return imageFile; // Return original file if compression fails
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!image || !instructions) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      // Convert base64 to Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Compress the image
      const compressedFile = await compressImage(new File([blob], "image.jpg", { type: "image/jpeg" }));

      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('instructions', instructions);

      const analysisResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }
      const result = await analysisResponse.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error during image analysis:', error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during image analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis)
        .then(() => toast({
          title: "Copied",
          description: "Analysis copied to clipboard!",
        }))
        .catch(err => {
          console.error('Failed to copy text: ', err);
          toast({
            title: "Copy Failed",
            description: "Failed to copy analysis to clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  const handleListen = async () => {
    if (analysis) {
      try {
        const response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: analysis }),
        });
        if (!response.ok) {
          throw new Error('Text-to-speech conversion failed');
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error('Error during text-to-speech conversion:', error);
        alert('An error occurred during text-to-speech conversion. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    if (!analysis) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `${timestamp}-picture-analysis.txt`;

    try {
      // @ts-expect-error: File System Access API may not be supported in all browsers
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] },
        }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(analysis);
      await writable.close();
      alert('Analysis saved successfully!');
    } catch (err) {
      console.error('Failed to save the file:', err);
      alert('Failed to save the analysis. Please try again.');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImage(event.target?.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-4xl w-full backdrop-blur-sm bg-opacity-80 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
            AI Vision Analyzer
          </h1>
          <Button onClick={toggleTheme} variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600 border-gray-600 transition-all duration-300">
            {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem] text-gray-300" /> : <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />}
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 p-1 rounded-lg">
              <TabsTrigger value="camera" className="data-[state=active]:bg-purple-600 text-white transition-all duration-300">Camera</TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-purple-600 text-white transition-all duration-300">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="space-y-4">
              <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                {image ? (
                  <Image
                    src={image}
                    alt="Captured"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ deviceId: currentDeviceId }}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={startCamera} className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
                <Button type="button" onClick={switchCamera} className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <SwitchCamera className="mr-2 h-4 w-4" />
                  Switch Camera
                </Button>
                <Button type="button" onClick={captureImage} className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div
                className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onPaste={handlePaste}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="Upload or paste image area"
              >
                {image ? (
                  <Image
                    src={image}
                    alt="Uploaded"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-gray-400">
                      Click to upload or paste an image
                    </p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </TabsContent>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-lg font-semibold text-gray-300">Instructions</Label>
            <div className="flex gap-2">
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions or use voice input"
                className="flex-grow bg-gray-700 text-white border-gray-600 focus:border-purple-500 transition-all duration-300"
                rows={3}
              />
              <Button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "secondary"}
                className={`bg-gray-700 hover:bg-gray-600 border-gray-600 transition-all duration-300 ${isRecording ? 'animate-pulse' : ''}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!image || !instructions || isAnalyzing}
            className="w-full py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-6 w-6" />
                Analyze Image
              </>
            )}
          </Button>
        </form>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Analysis Result</h2>
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <ScrollArea className="h-[calc(100vh-24rem)] md:h-96 rounded-lg border border-gray-700 p-4 bg-gray-700 shadow-inner">
                <div className="text-gray-200 leading-relaxed">{analysis}</div>
              </ScrollArea>
              <div className="flex gap-4 flex-wrap">
                <Button onClick={handleListen} className="flex-1 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Listen
                </Button>
                <Button onClick={handleCopy} className="flex-1 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <Copy className="mr-2 h-5 w-5" />
                  Copy
                </Button>
                <Button onClick={handleSave} className="flex-1 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300">
                  <Save className="mr-2 h-5 w-5" />
                  Save
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-700 p-6 rounded-lg h-48 flex items-center justify-center shadow-inner">
              <p className="text-gray-400 text-lg">No analysis available yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}