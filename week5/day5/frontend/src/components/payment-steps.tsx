import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";

interface PaymentStep {
  id: string;
  date: string;
  time: string;
  winningBid: string;
  status: "completed" | "current" | "pending";
  label: string;
}

interface PaymentStepsProps {
  steps: PaymentStep[];
  title?: string;
}

export function PaymentSteps({
  steps,
  title = "Steps of Payment (Just update the component)",
}: PaymentStepsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}

              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className="flex-shrink-0 mt-1">
                  {step.status === "completed" ? (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  ) : step.status === "current" ? (
                    <div className="w-12 h-12 bg-[#4A5AAF] rounded-full flex items-center justify-center">
                      <Circle className="w-6 h-6 text-white fill-current" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <Circle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600">
                        {step.date}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {step.time}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {step.winningBid}
                      </span>
                      <span className="text-sm text-gray-500">379931</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{step.date}</span>
                      <span className="text-sm text-gray-500">{step.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{step.label}</span>
                    {step.status === "completed" && (
                      <span className="text-sm text-green-600 font-medium">
                        Delivered
                      </span>
                    )}
                  </div>

                  {/* Progress indicators */}
                  {step.status === "current" && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1 h-1 bg-green-500 rounded"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Final status */}
          <div className="text-center py-4">
            <span className="text-lg font-semibold text-red-600">
              Bidding has ended
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
