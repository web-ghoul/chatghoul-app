import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useVerifyOtpForm } from "../../hooks/useVerifyOtpForm";

export default function VerifyOtpForm() {
  const {
    otp,
    inputRefs,
    isLoading,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
    isComplete,
  } = useVerifyOtpForm();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="w-12 h-14 text-center text-xl font-bold bg-secondary border border-gray rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 shadow-inner"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isComplete}
          className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium shadow-md shadow-green-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>

      {/* Resend */}
      <p className="text-center mt-6 text-txt text-sm">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="text-primary hover:text-primary/80 font-medium transition-all hover:underline underline-offset-4"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
}
