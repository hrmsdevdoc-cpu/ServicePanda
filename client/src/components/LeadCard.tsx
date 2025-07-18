import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, DollarSign } from "lucide-react";

interface LeadCardProps {
  lead: {
    id: number;
    title: string;
    description: string;
    suburb: string;
    postcode: string;
    propertyType?: string;
    urgency?: string;
    budget?: number;
    createdAt: string;
    isFree?: boolean;
  };
  onAccept: (leadId: number) => void;
  onViewDetails?: (leadId: number) => void;
  loading?: boolean;
}

export function LeadCard({ lead, onAccept, onViewDetails, loading }: LeadCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{lead.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              Posted {formatTimeAgo(lead.createdAt)}
            </div>
          </div>
          <Badge 
            variant={lead.isFree ? "default" : "secondary"}
            className={lead.isFree ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
          >
            {lead.isFree ? "Free" : "Paid"}
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {lead.propertyType && (
            <div>
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="font-medium text-gray-900">{lead.propertyType}</p>
            </div>
          )}
          {lead.urgency && (
            <div>
              <p className="text-sm text-gray-600">Urgency</p>
              <p className="font-medium text-gray-900">{lead.urgency}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center mb-4">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">
            {lead.suburb}, {lead.postcode}
          </span>
        </div>
        
        {lead.budget && (
          <div className="flex items-center mb-4">
            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">
              Budget: ${lead.budget}
            </span>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {lead.description}
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={() => onAccept(lead.id)}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Accepting..." : "Accept Lead"}
          </Button>
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(lead.id)}
              className="hover:bg-gray-50"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
