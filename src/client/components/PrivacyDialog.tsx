import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface PrivacyDialogProps {
  children: React.ReactNode;
}

export function PrivacyDialog({ children }: PrivacyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Your Data - We Don't Use It</DialogTitle>
          <DialogDescription asChild>
            <div className="pt-4 space-y-4 text-left text-sm text-muted-foreground">
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-md">
                <p className="text-base font-semibold text-foreground mb-2">
                  ✓ We do NOT store your database on our servers
                </p>
                <p className="text-sm">
                  Your file is processed in memory only and immediately discarded. 
                  We have zero access to your music library.
                </p>
              </div>
              
              <p>
                <strong>Your privacy is our priority.</strong> We want to be completely transparent about how your data is handled:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">🔒 No Storage</h4>
                  <p className="text-sm">
                    Your Rekordbox database file is <strong>never stored</strong> on our servers. 
                    It's processed in memory and immediately discarded after generating your statistics.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">🚫 No Access to Your Music</h4>
                  <p className="text-sm">
                    We have <strong>no way to access your actual music files</strong>. 
                    We only analyze the database metadata (track names, play counts, timestamps, etc.) 
                    that Rekordbox already stores.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">🔐 Secure Processing</h4>
                  <p className="text-sm">
                    Your database is decrypted and processed securely using industry-standard encryption. 
                    The decryption key never leaves our server and is never exposed to your browser.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">💾 Client-Side Only</h4>
                  <p className="text-sm">
                    All visualizations and sharing features happen in your browser. 
                    We don't track what you share or download.
                  </p>
                </div>
              </div>
              
              <p className="text-sm italic border-t pt-3 mt-4">
                In short: Upload your database, get your stats, and rest assured that 
                we've already forgotten about it. Your music library is yours alone.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
