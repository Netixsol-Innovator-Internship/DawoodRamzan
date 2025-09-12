/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  useCreatePaymentMutation,
  useConfirmPaymentMutation,
} from "@/lib/services/paymentsApi";

// ✅ Load Stripe
const stripePromise = loadStripe(
  "pk_test_51RCuzmCl0vn8AzTFhopPduTWVQlYArGSJl9TU0yEMRrCltDmOukj0oj4tObkzOw4PMfjgbEK6LU7yhlDEyUX5dnx00GXqqwZN5"
);

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [createPayment] = useCreatePaymentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Create PaymentIntent on page load
  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await createPayment({
          orderId,
          method: "stripe",
        }).unwrap();
        setClientSecret(res.clientSecret);
        setPaymentId(res.paymentId); // store backend paymentId
      } catch (err) {
        console.error("Failed to create payment:", err);
        setMessage("❌ Failed to initialize payment.");
      }
    };

    if (orderId) {
      void initPayment();
    }
  }, [orderId, createPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret || !paymentId) return;

    setLoading(true);
    setMessage(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) throw new Error("Card number element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardNumberElement },
        }
      );

      if (error) {
        console.error(error);
        setMessage(error.message || "❌ Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        // ✅ Call backend confirm API
        await confirmPayment(paymentId).unwrap();

        // ✅ Remove orderId from localStorage
        localStorage.removeItem("orderId");

        setMessage("💸 Payment succeeded!");
        setTimeout(() => router.push("/orders"), 1500);
      } else {
        setMessage("⚠️ Payment processing...");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Secure Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 rounded-md shadow-sm">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#e3342f" },
                },
              }}
            />
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <div className="p-3 border border-gray-300 rounded-md shadow-sm">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#e3342f" },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CVC
            </label>
            <div className="p-3 border border-gray-300 rounded-md shadow-sm">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#e3342f" },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {message && (
          <div
            className={`text-center mt-4 text-sm font-medium ${
              message.includes("succeeded") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default function PaymentPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("orderId");
    if (storedId) {
      setOrderId(storedId);
    }
  }, []);

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No order found. Please go back to cart.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm orderId={orderId} />
      </Elements>
    </div>
  );
}
