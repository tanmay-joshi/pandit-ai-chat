"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InsufficientCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
  availableCredits: number;
}

export function InsufficientCreditsDialog({
  isOpen,
  onClose,
  requiredCredits,
  availableCredits,
}: InsufficientCreditsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-primary-bold text-xl">Insufficient Credits</DialogTitle>
          <DialogDescription className="font-primary-regular pt-2 space-y-2">
            <p>
              You need {requiredCredits} credits to send this message, but you only have{" "}
              {availableCredits} credits in your wallet.
            </p>
            <p className="text-muted-foreground">
              Please add more credits to continue your conversation.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/wallet" className="w-full">
            <Button className="w-full font-primary-bold" size="lg">
              Add Credits
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onClose}
            className="font-primary-regular"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 