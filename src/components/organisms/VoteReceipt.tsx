import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/atoms';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface VoteReceiptProps {
  voteId: string;
  timestamp: string;
  positionsVoted: number;
  electionName: string;
  onViewResults?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function VoteReceipt({
  voteId,
  timestamp,
  positionsVoted,
  electionName,
  onViewResults,
  onGoHome,
  className,
}: VoteReceiptProps) {
  const handleShare = async () => {
    const text = `I just voted in ${electionName}! Vote ID: ${voteId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vote Confirmation',
          text,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
    }
  };

  const handleDownload = () => {
    const receiptContent = `
VOTE RECEIPT
============

Election: ${electionName}
Vote ID: ${voteId}
Timestamp: ${formatDate(timestamp)}
Positions Voted: ${positionsVoted}

This receipt confirms that your vote has been recorded.
Thank you for participating in this election.
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-receipt-${voteId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl text-green-600 dark:text-green-400">
          Vote Submitted!
        </CardTitle>
        <CardDescription>
          Your vote has been recorded successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receipt details */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vote ID</span>
            <span className="font-mono text-sm font-medium">{voteId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Election</span>
            <span className="text-sm font-medium">{electionName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Timestamp</span>
            <span className="text-sm font-medium">{formatDate(timestamp)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Positions Voted</span>
            <span className="text-sm font-medium">{positionsVoted}</span>
          </div>
        </div>

        {/* Info message */}
        <p className="text-sm text-muted-foreground text-center">
          Save your Vote ID for your records. Results will be available after the election ends.
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {onViewResults && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={onViewResults}
            >
              View Results (when available)
            </Button>
          )}

          {onGoHome && (
            <Button
              className="w-full"
              onClick={onGoHome}
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
