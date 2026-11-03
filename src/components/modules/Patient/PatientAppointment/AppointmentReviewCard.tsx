import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IReview } from "@/types/review.interface";
import { Star } from "lucide-react";

interface AppointmentReviewCardProps {
  review: IReview;
}

const AppointmentReviewCard = ({ review }: AppointmentReviewCardProps) => (
  <Card className="border-yellow-500/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
        <Star className="h-5 w-5 fill-yellow-600" />
        Your Review
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="bg-yellow-500/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= review.rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground/40"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-yellow-900 dark:text-yellow-200">
            {review.rating}/5
          </span>
        </div>

        {review.comment && (
          <div>
            <p className="text-sm text-yellow-900 dark:text-yellow-200 font-medium mb-1">
              Comment:
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {review.comment}
            </p>
          </div>
        )}

        <p className="text-xs text-yellow-700 dark:text-yellow-300 italic">
          Reviews cannot be edited or deleted once submitted.
        </p>
      </div>
    </CardContent>
  </Card>
);

export default AppointmentReviewCard;
