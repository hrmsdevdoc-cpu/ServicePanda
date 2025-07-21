import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, User, DollarSign, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LeadOfferDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  offerDetails: any;
}

export function AdminLeadOfferDetails({ isOpen, onClose, requestId, offerDetails }: LeadOfferDetailsProps) {
  if (!offerDetails || !offerDetails.offers) {
    return null;
  }

  const { distributionLog, offers } = offerDetails;
  
  const uniqueOffers = offers.filter((offer: any) => offer.offerType === 'unique');
  const sharedOffers = offers.filter((offer: any) => offer.offerType === 'shared');
  
  const currentUniqueOffer = uniqueOffers.find((offer: any) => offer.isCurrentOffer);
  const completedUniqueOffers = uniqueOffers.filter((offer: any) => offer.status === 'purchased');
  const purchasedSharedOffers = sharedOffers.filter((offer: any) => offer.status === 'purchased');

  const getStatusBadge = (status: string, isCurrentOffer: boolean) => {
    if (isCurrentOffer) {
      return <Badge className="bg-green-500 text-white">Active</Badge>;
    }
    
    switch (status) {
      case 'purchased':
        return <Badge className="bg-blue-500 text-white">Purchased</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500 text-white">Expired</Badge>;
      case 'declined':
        return <Badge className="bg-red-500 text-white">Declined</Badge>;
      default:
        return <Badge className="bg-orange-500 text-white">Pending</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">
            Lead Offer Details - Request #{requestId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Distribution Status Overview */}
          {distributionLog && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-3">Distribution Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Phase:</span>
                  <div className="font-medium capitalize">{distributionLog.distributionPhase}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total Providers:</span>
                  <div className="font-medium">{distributionLog.totalEligibleProviders}</div>
                </div>
                <div>
                  <span className="text-gray-600">Unique Completed:</span>
                  <div className="font-medium">{distributionLog.uniqueOffersCompleted}</div>
                </div>
                <div>
                  <span className="text-gray-600">Shared Purchased:</span>
                  <div className="font-medium">{distributionLog.sharedOffersPurchased}/{distributionLog.maxSharedOffers}</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Active Offer */}
          {currentUniqueOffer && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Current Active Offer (Unique Phase)
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="font-medium">{currentUniqueOffer.providerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{currentUniqueOffer.rating}/5.0</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span>${currentUniqueOffer.leadCost}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Expires: {formatTime(currentUniqueOffer.expiresAt)}
                </div>
              </div>
            </div>
          )}

          {/* Unique Offers Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Unique Offers Queue (Rating-Based Order)
            </h3>
            <div className="space-y-3">
              {uniqueOffers.map((offer: any, index: number) => (
                <div 
                  key={offer.offerId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    offer.isCurrentOffer ? 'bg-green-100 border-green-300' : 
                    offer.status === 'purchased' ? 'bg-blue-100 border-blue-300' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{offer.providerName}</div>
                      <div className="text-sm text-gray-600">{offer.providerEmail}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{offer.rating}/5.0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">${offer.leadCost}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(offer.status, offer.isCurrentOffer)}
                    <div className="text-xs text-gray-500">
                      Started: {formatTime(offer.offerStartTime)}
                    </div>
                    {offer.purchasedAt && (
                      <div className="text-xs text-gray-500">
                        Purchased: {formatTime(offer.purchasedAt)}
                      </div>
                    )}
                    {!offer.purchasedAt && (
                      <div className="text-xs text-gray-500">
                        Expires: {formatTime(offer.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Offers Section */}
          {sharedOffers.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Shared Offers (Available to All Providers)
              </h3>
              <div className="space-y-3">
                {sharedOffers.map((offer: any) => (
                  <div 
                    key={offer.offerId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      offer.status === 'purchased' ? 'bg-orange-100 border-orange-300' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{offer.providerName}</div>
                        <div className="text-sm text-gray-600">{offer.providerEmail}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{offer.rating}/5.0</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">${offer.leadCost}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getStatusBadge(offer.status, offer.isCurrentOffer)}
                      <div className="text-xs text-gray-500">
                        Started: {formatTime(offer.offerStartTime)}
                      </div>
                      {offer.purchasedAt && (
                        <div className="text-xs text-gray-500">
                          Purchased: {formatTime(offer.purchasedAt)}
                        </div>
                      )}
                      {!offer.purchasedAt && (
                        <div className="text-xs text-gray-500">
                          Expires: {formatTime(offer.expiresAt)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">Distribution Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedUniqueOffers.length}</div>
                <div className="text-gray-600">Unique Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{purchasedSharedOffers.length}</div>
                <div className="text-gray-600">Shared Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(completedUniqueOffers.reduce((sum: number, offer: any) => sum + offer.leadCost, 0) + 
                     purchasedSharedOffers.reduce((sum: number, offer: any) => sum + offer.leadCost, 0)).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {distributionLog?.isActive ? 'Active' : 'Completed'}
                </div>
                <div className="text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}