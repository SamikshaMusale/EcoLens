import { useState } from "react";
import { Share2, Check, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  location: string;
  timeRange: string;
}

export function ShareButton({ location, timeRange }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = window.location.href;
  const shareText = `Check out EcoLens analysis for ${location} (${timeRange}) - Visualizing deforestation and climate correlation`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    
    window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Analysis</DialogTitle>
          <DialogDescription>
            Share this EcoLens analysis with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button onClick={copyToClipboard} size="sm" variant="secondary">
              {copied ? <Check className="h-4 w-4" /> : "Copy"}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => shareToSocial("twitter")}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={() => shareToSocial("facebook")}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              onClick={() => shareToSocial("linkedin")}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
