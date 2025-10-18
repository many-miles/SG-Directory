"use client";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { useContext } from 'react';
import { UserContext } from "@/context/UserContext";

interface ServiceActionsWrapperProps {
  serviceId: string;
  title?: string | null;
  description?: string | null;
}

export default function ServiceActionsWrapper({ serviceId, title, description }: ServiceActionsWrapperProps) {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('ServiceActionsWrapper must be used within a UserProvider');
  }

  const { isSaved, saveService, unsaveService, shareService } = context;

  const handleSave = () => {
    if (isSaved(serviceId)) {
      unsaveService(serviceId);
      toast.success("Service removed from saved");
    } else {
      saveService(serviceId);
      toast.success("Service saved!");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: title || 'Service in Jeffreys Bay',
      text: description || 'Check out this service in Jeffreys Bay',
      url: `${window.location.origin}/service/${serviceId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        navigator.clipboard.writeText(shareData.url);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
    
    await shareService(serviceId, title ?? undefined, description ?? undefined);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        onClick={handleSave}
      >
        {isSaved(serviceId) ? "Unsave" : "Save for Later"}
      </Button>
      <Button
        className="w-full border-2 border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        onClick={handleShare}
      >
        Share Service
      </Button>
    </div>
  );
}
