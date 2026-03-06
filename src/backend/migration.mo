import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Old actor state type without the new fields
  type OldActor = {
    eventId : Nat;
    vendorId : Nat;
    bookingId : Nat;
    userId : Nat;
    listingId : Nat;
    vendorApplicationId : Nat;
    serviceListingId : Nat;
    imageId : Nat;
  };

  // New TicketCategory record type matching the new actor state
  type TicketCategory = {
    id : Nat;
    eventId : Nat;
    name : Text;
    price : Nat;
    availableQty : Nat;
  };

  // New EventBooking record type matching the new actor state
  type EventBooking = {
    id : Nat;
    eventId : Nat;
    eventName : Text;
    ticketCategory : Text;
    name : Text;
    phone : Text;
    city : Text;
    quantity : Nat;
    message : Text;
    status : { #new; #reviewed; #confirmed; #cancelled };
    createdAt : Int;
  };

  // New actor state type with the new fields using the correct record types
  type NewActor = {
    eventId : Nat;
    vendorId : Nat;
    bookingId : Nat;
    userId : Nat;
    listingId : Nat;
    vendorApplicationId : Nat;
    serviceListingId : Nat;
    imageId : Nat;
    ticketCategoryId : Nat;
    eventBookingId : Nat;
    ticketCategories : Map.Map<Nat, TicketCategory>;
    eventBookings : Map.Map<Nat, EventBooking>;
  };

  // Migration function initializes new fields as empty maps
  public func run(old : OldActor) : NewActor {
    {
      old with
      // Initialize new fields as empty maps
      ticketCategoryId = 0;
      eventBookingId = 0;
      ticketCategories = Map.empty<Nat, TicketCategory>();
      eventBookings = Map.empty<Nat, EventBooking>();
    };
  };
};
