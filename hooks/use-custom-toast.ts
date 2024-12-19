import { useToast } from "@/components/ui/toast"

export const useCustomToast = () => {
  const { toast } = useToast()

  return {
    success: (message: string) => {
      toast({
        title: "Success",
        description: message,
        variant: "success",
      })
    },
    error: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    },
  }
} 