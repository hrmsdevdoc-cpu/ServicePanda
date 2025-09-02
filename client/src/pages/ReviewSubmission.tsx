import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface ReviewData {
  token: string;
  customerId: string;
  providerId: number;
  requestId: number;
  customerFirstName: string;
  customerLastName: string;
  providerFirstName: string;
  providerLastName: string;
  categoryName: string;
  suburb: string;
  description: string;
  isUsed: boolean;
  expiresAt: string;
}

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function RatingInput({ label, value, onChange }: RatingInputProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewSubmission() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [ratings, setRatings] = useState({
    overallRating: 0,
    qualityRating: 0,
    professionalismRating: 0,
    timelinessRating: 0,
    valueRating: 0,
  });

  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (token) {
      fetchReviewData();
    }
  }, [token]);

  const fetchReviewData = async () => {
    try {
      const response = await fetch(`/api/review/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load review details");
        return;
      }

      setReviewData(data);
    } catch (err) {
      setError("Failed to load review details");
      console.error("Error fetching review data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all ratings are provided
    const ratingValues = Object.values(ratings);
    if (ratingValues.some((rating) => rating === 0)) {
      toast({
        title: "Missing Ratings",
        description: "Please provide ratings for all categories.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/review/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...ratings,
          reviewText: reviewText.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setSubmitted(true);
      toast({
        title: "Review Submitted!",
        description: data.message,
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading review details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Review
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => setLocation("/")} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-4">
                Your review has been submitted successfully. Your feedback helps us maintain quality and helps other customers choose the right service providers.
              </p>
              <Button onClick={() => setLocation("/")} className="bg-blue-600 hover:bg-blue-700">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reviewData) {
    return null;
  }

  const providerName = `${reviewData.providerFirstName} ${reviewData.providerLastName}`.trim();
  const customerName = `${reviewData.customerFirstName} ${reviewData.customerLastName}`.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🐼</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ServicePanda</h1>
          <p className="text-gray-600">How was your service experience?</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              ⭐ Rate Your Service Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Service Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">📋 Service Completed</h3>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Provider:</strong> {providerName}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Service:</strong> {reviewData.categoryName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {reviewData.suburb}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Categories */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Please rate the service on:
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <RatingInput
                    label="Overall Experience"
                    value={ratings.overallRating}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, overallRating: value }))
                    }
                  />
                  <RatingInput
                    label="Quality of Work"
                    value={ratings.qualityRating}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, qualityRating: value }))
                    }
                  />
                  <RatingInput
                    label="Professionalism"
                    value={ratings.professionalismRating}
                    onChange={(value) =>
                      setRatings((prev) => ({
                        ...prev,
                        professionalismRating: value,
                      }))
                    }
                  />
                  <RatingInput
                    label="Timeliness"
                    value={ratings.timelinessRating}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, timelinessRating: value }))
                    }
                  />
                  <RatingInput
                    label="Value for Money"
                    value={ratings.valueRating}
                    onChange={(value) =>
                      setRatings((prev) => ({ ...prev, valueRating: value }))
                    }
                  />
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell other customers about your experience with this service provider..."
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-gray-700">
                <strong>💡 Your Review Matters:</strong> Your feedback helps us maintain quality and helps other customers make informed decisions. Reviews are public and help support quality service providers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}