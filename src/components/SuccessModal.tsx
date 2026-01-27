import { CheckCircle, RotateCcw, Home } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessModalProps {
  onSubmitAnother: () => void;
}

export default function SuccessModal({
  onSubmitAnother
}: SuccessModalProps) {
  useEffect(() => {
    // Fire confetti from both sides
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#de0a67', '#591BC5', '#FF69B4', '#FF1493']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#de0a67', '#591BC5', '#FF69B4', '#FF1493']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#de0a67', '#591BC5', '#FF69B4', '#FF1493']
    });

    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card border-2 border-primary rounded-[20px] p-8 sm:p-12 max-w-[500px] w-full text-center animate-scale-in">
        {/* Success Icon */}
        <div className="w-[60px] h-[60px] rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary uppercase mb-4">
          Application Submitted Successfully!
        </h2>

        {/* Message */}
        <p className="text-foreground leading-relaxed mb-8">
          Thank you for applying to TD CONSULTING!
          <br /><br />
          We've received your application and will review it shortly.
          If your profile matches our requirements, we'll contact you
          within 5-7 business days.
          <br /><br />
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSubmitAnother}
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary font-semibold transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            <RotateCcw className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-180" />
            Submit Another
          </button>
          <a
            href="https://tdconsulting.vn/"
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/80 hover:scale-105 hover:shadow-lg hover:shadow-primary/40 active:scale-95"
          >
            <Home className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
