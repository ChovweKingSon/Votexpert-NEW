import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ProgressBar,
} from '@/components/atoms';
import { AlertMessage, CandidateCard, StepIndicator } from '@/components/molecules';
import { Loader2, ChevronLeft, ChevronRight, Vote, Check } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  photoUrl?: string;
  bio?: string;
  manifesto?: string;
}

interface PositionGroup {
  position: string;
  candidates: Candidate[];
}

interface VotingBoothProps {
  electionName: string;
  positions: PositionGroup[];
  onSubmit: (votes: Record<string, string>) => void;
  isSubmitting?: boolean;
  error?: string;
  className?: string;
}

export function VotingBooth({
  electionName,
  positions,
  onSubmit,
  isSubmitting = false,
  error,
  className,
}: VotingBoothProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [votes, setVotes] = React.useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const totalPositions = positions.length;
  const isLastPosition = currentStep === totalPositions - 1;
  const currentPosition = positions[currentStep];
  const selectedCandidateId = currentPosition ? votes[currentPosition.position] : undefined;

  const handleSelectCandidate = (candidateId: string) => {
    if (currentPosition) {
      setVotes((prev) => ({
        ...prev,
        [currentPosition.position]: candidateId,
      }));
    }
  };

  const handleNext = () => {
    if (isLastPosition) {
      setShowConfirmation(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConfirmVote = () => {
    onSubmit(votes);
  };

  const completedVotes = Object.keys(votes).length;
  const progress = (completedVotes / totalPositions) * 100;

  // Step labels for indicator
  const steps = positions.map((p) => ({ label: p.position }));

  if (showConfirmation) {
    return (
      <Card className={cn('w-full max-w-2xl mx-auto', className)}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirm Your Votes</CardTitle>
          <CardDescription>
            Review your selections before submitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <AlertMessage variant="error">{error}</AlertMessage>
          )}

          {/* Vote summary */}
          <div className="space-y-3">
            {positions.map((position) => {
              const selectedCandidate = position.candidates.find(
                (c) => c.id === votes[position.position]
              );
              return (
                <div
                  key={position.position}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="font-medium">{position.position}</span>
                  <span className="text-muted-foreground">
                    {selectedCandidate?.name || (
                      <span className="text-destructive">Not selected</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Warning if not all positions filled */}
          {completedVotes < totalPositions && (
            <AlertMessage variant="warning">
              You have not selected candidates for all positions. You can still submit your vote,
              but unselected positions will be recorded as abstentions.
            </AlertMessage>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Review Selections
            </Button>
            <Button
              onClick={handleConfirmVote}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{electionName}</CardTitle>
          <CardDescription>
            Select your preferred candidate for each position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Voting Progress</span>
              <span className="font-medium">
                {completedVotes} of {totalPositions} positions
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>

          {/* Step indicator */}
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
          />
        </CardContent>
      </Card>

      {/* Current position voting */}
      {currentPosition && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {currentPosition.position}
                </CardTitle>
                <CardDescription>
                  Select one candidate for this position
                </CardDescription>
              </div>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalPositions}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <AlertMessage variant="error">{error}</AlertMessage>
            )}

            {/* Candidates grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {currentPosition.candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  name={candidate.name}
                  position={currentPosition.position}
                  photoUrl={candidate.photoUrl}
                  bio={candidate.bio}
                  manifesto={candidate.manifesto}
                  isSelected={selectedCandidateId === candidate.id}
                  onSelect={() => handleSelectCandidate(candidate.id)}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {isLastPosition ? (
                  <>
                    <Vote className="mr-2 h-4 w-4" />
                    Review & Submit
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
