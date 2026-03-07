import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  /** HOTEL SYSTEM **/
  type Hotel = {
    id : Nat;
    name : Text;
    city : Text;
    address : Text;
    description : Text;
    roomTypes : [RoomType];
    amenities : [Text];
    photoUrls : [Text];
    createdAt : Int;
  };

  type RoomType = {
    name : Text;
    pricePerNight : Nat;
  };

  // Original actor without Hotel fields
  type OldActor = {};

  // New actor type including hotel fields
  type NewActor = {
    hotelId : Nat;
    hotels : Map.Map<Nat, Hotel>;
  };

  public func run(old : OldActor) : NewActor {
    {
      hotelId = 0;
      hotels = Map.empty<Nat, Hotel>();
    };
  };
};
