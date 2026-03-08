import Maps "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Status = {
    #draft;
    #published;
    #cancelled;
  };

  type VendorStatus = {
    #pending;
    #approved;
    #rejected;
    #suspended;
  };

  type BookingStatus = {
    #new;
    #reviewed;
    #confirmed;
    #cancelled;
  };

  type UserRole = {
    #customer;
    #vendor;
    #staff;
  };

  type UserStatus = {
    #active;
    #inactive;
  };

  type ListingStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type TransactionStatus = {
    #pending;
    #completed;
    #failed;
  };

  type PaymentTransaction = {
    id : Nat;
    transactionId : Text;
    paymentMethod : Text;
    amount : Nat;
    bookingId : Nat;
    timestamp : Int;
    status : TransactionStatus;
  };

  type Event = {
    id : Nat;
    name : Text;
    category : Text;
    subCategory : Text;
    venue : Text;
    city : Text;
    state : Text;
    country : Text;
    date : Int;
    time : Text;
    duration : Text;
    ageLimit : Nat;
    description : Text;
    posterUrl : Text;
    bannerUrl : Text;
    status : Status;
    createdAt : Int;
  };

  type Vendor = {
    id : Nat;
    name : Text;
    businessName : Text;
    city : Text;
    services : Text;
    experience : Nat;
    phone : Text;
    email : Text;
    status : VendorStatus;
    createdAt : Int;
  };

  type Booking = {
    id : Nat;
    name : Text;
    phone : Text;
    serviceType : Text;
    city : Text;
    date : Int;
    message : Text;
    status : BookingStatus;
    createdAt : Int;
  };

  type User = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    role : UserRole;
    status : UserStatus;
    createdAt : Int;
  };

  type Listing = {
    id : Nat;
    title : Text;
    category : Text;
    description : Text;
    city : Text;
    price : Nat;
    contactPhone : Text;
    submittedBy : Text;
    status : ListingStatus;
    createdAt : Int;
  };

  type Analytics = {
    totalEvents : Nat;
    totalBookings : Nat;
    totalVendors : Nat;
    totalUsers : Nat;
    totalListings : Nat;
    recentBookings : [Booking];
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
  };

  public type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type VendorApplication = {
    id : Nat;
    principal : Principal;
    businessName : Text;
    ownerName : Text;
    city : Text;
    serviceCategory : Text;
    description : Text;
    phone : Text;
    email : Text;
    portfolioImages : [Text];
    status : ApplicationStatus;
    submittedAt : Int;
    reviewedAt : ?Int;
  };

  public type ServiceListing = {
    id : Nat;
    vendorPrincipal : Principal;
    title : Text;
    category : Text;
    description : Text;
    price : Nat;
    createdAt : Int;
  };

  public type ServiceListingInput = {
    title : Text;
    category : Text;
    description : Text;
    price : Nat;
  };

  public type ImageMetadata = {
    id : Nat;
    vendorId : ?Nat;
    vendorPrincipal : ?Principal;
    title : ?Text;
    description : ?Text;
    category : Text;
    filename : Text;
    mimeType : Text;
    size : Nat;
    uploadDate : Int;
    file : Storage.ExternalBlob;
  };

  public type PortfolioImageInput = {
    title : ?Text;
    description : ?Text;
    category : Text;
    vendorId : ?Nat;
    vendorPrincipal : ?Principal;
    file : Storage.ExternalBlob;
    filename : Text;
    mimeType : Text;
    size : Nat;
  };

  public type TicketCategory = {
    id : Nat;
    eventId : Nat;
    name : Text;
    price : Nat;
    availableQty : Nat;
  };

  public type EventBooking = {
    id : Nat;
    eventId : Nat;
    eventName : Text;
    ticketCategory : Text;
    name : Text;
    phone : Text;
    city : Text;
    quantity : Nat;
    message : Text;
    status : BookingStatus;
    createdAt : Int;
  };

  public type StaffRole = {
    #gateStaff;
    #eventManager;
    #admin;
  };

  public type StaffStatus = {
    #active;
    #inactive;
  };

  public type StaffAccount = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    role : StaffRole;
    status : StaffStatus;
    createdAt : Int;
  };

  public type StaffSession = {
    staffId : Nat;
    username : Text;
    role : StaffRole;
  };

  public type StaffLoginResult = {
    #ok : StaffSession;
    #err : Text;
  };

  public type Hotel = {
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

  public type RoomType = {
    name : Text;
    pricePerNight : Nat;
  };

  public type HotelBooking = {
    id : Nat;
    hotelId : Nat;
    hotelName : Text;
    roomType : Text;
    pricePerNight : Nat;
    guestName : Text;
    guestPhone : Text;
    guestEmail : Text;
    checkInDate : Int;
    checkOutDate : Int;
    numberOfNights : Nat;
    totalAmount : Nat;
    status : BookingStatus;
    paymentStatus : TransactionStatus;
    createdAt : Int;
  };

  ////////////////////////////////////////////////////////
  // TRANSPORT BOOKING SYSTEM
  ////////////////////////////////////////////////////////
  public type TransportType = {
    #car;
    #bus;
    #flight;
    #train;
    #helicopter;
    #cruise;
  };

  public type TransportOption = {
    id : Nat;
    transportType : TransportType;
    operatorName : Text;
    route : Text;
    city : Text;
    price : Nat;
    availableSeats : Nat;
    photoUrls : [Text];
    createdAt : Int;
  };

  public type TransportBooking = {
    id : Nat;
    transportId : Nat;
    transportName : Text;
    transportType : Text;
    operatorName : Text;
    route : Text;
    passengerName : Text;
    passengerPhone : Text;
    passengerEmail : Text;
    city : Text;
    travelDate : Int;
    seats : Nat;
    totalAmount : Nat;
    status : BookingStatus;
    paymentStatus : TransactionStatus;
    createdAt : Int;
    bookedBy : Principal;
  };

  ////////////////////////////////////////////////////////
  // State
  ////////////////////////////////////////////////////////

  var eventId = 0;
  var vendorId = 0;
  var bookingId = 0;
  var userId = 0;
  var listingId = 0;
  var vendorApplicationId = 0;
  var serviceListingId = 0;
  var imageId = 0;
  var ticketCategoryId = 0;
  var eventBookingId = 0;
  var staffAccountId = 0;
  var paymentTransactionId = 0;
  var hotelId = 0;
  var hotelBookingId = 0;
  var transportOptionId = 0;
  var transportBookingId = 0;

  let events = Maps.empty<Nat, Event>();
  let vendors = Maps.empty<Nat, Vendor>();
  let bookings = Maps.empty<Nat, Booking>();
  let users = Maps.empty<Nat, User>();
  let listings = Maps.empty<Nat, Listing>();
  let userProfiles = Maps.empty<Principal, UserProfile>();
  let vendorApplications = Maps.empty<Nat, VendorApplication>();
  let serviceListings = Maps.empty<Nat, ServiceListing>();
  let portfolioImages = Maps.empty<Nat, ImageMetadata>();
  let ticketCategories = Maps.empty<Nat, TicketCategory>();
  let eventBookings = Maps.empty<Nat, EventBooking>();
  let paymentTransactions = Maps.empty<Nat, PaymentTransaction>();
  let staffAccounts = Maps.empty<Nat, StaffAccount>();
  let hotels = Maps.empty<Nat, Hotel>();
  let hotelBookings = Maps.empty<Nat, HotelBooking>();
  let transportOptions = Maps.empty<Nat, TransportOption>();
  let transportBookings = Maps.empty<Nat, TransportBooking>();

  ////////////////////////////////////////////////////////
  // USER PROFILE FUNCTIONS (Required by frontend)
  ////////////////////////////////////////////////////////
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ////////////////////////////////////////////////////////
  // TRANSPORT BOOKING SYSTEM FUNCTIONS
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func createTransportOption(
    transportType : TransportType,
    operatorName : Text,
    route : Text,
    city : Text,
    price : Nat,
    availableSeats : Nat,
    photoUrls : [Text]
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create transport options");
    };
    let id = transportOptionId;
    let option : TransportOption = {
      id;
      transportType;
      operatorName;
      route;
      city;
      price;
      availableSeats;
      photoUrls;
      createdAt = Time.now();
    };
    transportOptions.add(id, option);
    transportOptionId += 1 : Nat;
    id;
  };

  public shared ({ caller }) func updateTransportOption(
    id : Nat,
    transportType : TransportType,
    operatorName : Text,
    route : Text,
    city : Text,
    price : Nat,
    availableSeats : Nat,
    photoUrls : [Text],
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update transport options");
    };
    switch (transportOptions.get(id)) {
      case (null) { Runtime.trap("Transport option not found") };
      case (?existing) {
        let updated : TransportOption = {
          id;
          transportType;
          operatorName;
          route;
          city;
          price;
          availableSeats;
          photoUrls;
          createdAt = existing.createdAt;
        };
        transportOptions.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteTransportOption(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete transport options");
    };
    if (not transportOptions.containsKey(id)) {
      Runtime.trap("Transport option not found");
    };
    transportOptions.remove(id);
  };

  public query func getAllTransportOptions() : async [TransportOption] {
    transportOptions.values().toArray();
  };

  public query func getTransportOption(id : Nat) : async ?TransportOption {
    transportOptions.get(id);
  };

  public shared ({ caller }) func createTransportBooking(
    transportId : Nat,
    transportName : Text,
    transportType : Text,
    operatorName : Text,
    route : Text,
    passengerName : Text,
    passengerPhone : Text,
    passengerEmail : Text,
    city : Text,
    travelDate : Int,
    seats : Nat,
    totalAmount : Nat,
  ) : async Nat {
    let id = transportBookingId;
    let booking : TransportBooking = {
      id;
      transportId;
      transportName;
      transportType;
      operatorName;
      route;
      passengerName;
      passengerPhone;
      passengerEmail;
      city;
      travelDate;
      seats;
      totalAmount;
      status = #new;
      paymentStatus = #pending;
      createdAt = Time.now();
      bookedBy = caller;
    };
    transportBookings.add(id, booking);
    transportBookingId += 1 : Nat;
    id;
  };

  public query ({ caller }) func getAllTransportBookings() : async [TransportBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all transport bookings");
    };
    transportBookings.values().toArray();
  };

  public query ({ caller }) func getTransportBooking(id : Nat) : async ?TransportBooking {
    switch (transportBookings.get(id)) {
      case (null) { null };
      case (?booking) {
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
  };

  public shared ({ caller }) func updateTransportBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update transport booking status");
    };
    switch (transportBookings.get(id)) {
      case (null) { Runtime.trap("Transport booking not found") };
      case (?existing) {
        let updated : TransportBooking = { existing with status };
        transportBookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateTransportBookingPaymentStatus(id : Nat, paymentStatus : TransactionStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update payment status");
    };
    switch (transportBookings.get(id)) {
      case (null) { Runtime.trap("Transport booking not found") };
      case (?existing) {
        let updated : TransportBooking = { existing with paymentStatus };
        transportBookings.add(id, updated);
      };
    };
  };

  ////////////////////////////////////////////////////////
  // HOTEL BOOKING SYSTEM
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func createHotelBooking(
    hotelId : Nat,
    hotelName : Text,
    roomType : Text,
    pricePerNight : Nat,
    guestName : Text,
    guestPhone : Text,
    guestEmail : Text,
    checkInDate : Int,
    checkOutDate : Int,
    numberOfNights : Nat,
    totalAmount : Nat,
  ) : async Nat {
    let id = hotelBookingId;
    let booking : HotelBooking = {
      id;
      hotelId;
      hotelName;
      roomType;
      pricePerNight;
      guestName;
      guestPhone;
      guestEmail;
      checkInDate;
      checkOutDate;
      numberOfNights;
      totalAmount;
      status = #new;
      paymentStatus = #pending;
      createdAt = Time.now();
    };
    hotelBookings.add(id, booking);
    hotelBookingId += 1;
    id;
  };

  public query ({ caller }) func getAllHotelBookings() : async [HotelBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all hotel bookings");
    };
    hotelBookings.values().toArray();
  };

  public query ({ caller }) func getHotelBooking(id : Nat) : async ?HotelBooking {
    hotelBookings.get(id);
  };

  public shared ({ caller }) func updateHotelBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update hotel booking status");
    };
    switch (hotelBookings.get(id)) {
      case (null) { Runtime.trap("Hotel booking not found") };
      case (?existing) {
        let updated : HotelBooking = { existing with status };
        hotelBookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateHotelBookingPaymentStatus(id : Nat, paymentStatus : TransactionStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update payment status");
    };
    switch (hotelBookings.get(id)) {
      case (null) { Runtime.trap("Hotel booking not found") };
      case (?existing) {
        let updated : HotelBooking = { existing with paymentStatus };
        hotelBookings.add(id, updated);
      };
    };
  };

  ////////////////////////////////////////////////////////
  // Existing Functionality
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func createHotel(
    name : Text,
    city : Text,
    address : Text,
    description : Text,
    roomTypes : [RoomType],
    amenities : [Text],
    photoUrls : [Text]
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create hotels");
    };
    let id = hotelId;
    let hotel : Hotel = {
      id;
      name;
      city;
      address;
      description;
      roomTypes;
      amenities;
      photoUrls;
      createdAt = Time.now();
    };
    hotels.add(id, hotel);
    hotelId += 1;
    id;
  };

  public shared ({ caller }) func updateHotel(
    id : Nat,
    name : Text,
    city : Text,
    address : Text,
    description : Text,
    roomTypes : [RoomType],
    amenities : [Text],
    photoUrls : [Text],
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update hotels");
    };
    switch (hotels.get(id)) {
      case (null) { Runtime.trap("Hotel not found") };
      case (?existing) {
        let updated : Hotel = {
          id;
          name;
          city;
          address;
          description;
          roomTypes;
          amenities;
          photoUrls;
          createdAt = existing.createdAt;
        };
        hotels.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteHotel(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete hotels");
    };
    switch (hotels.get(id)) {
      case (null) { Runtime.trap("Hotel not found") };
      case (?_) { hotels.remove(id) };
    };
  };

  public query func getAllHotels() : async [Hotel] {
    hotels.values().toArray();
  };

  public query func getHotel(id : Nat) : async ?Hotel {
    hotels.get(id);
  };

  public shared ({ caller }) func createPaymentTransaction(transactionId : Text, paymentMethod : Text, amount : Nat, bookingId : Nat, status : TransactionStatus) : async Nat {
    let timestamp = Time.now();
    let id = paymentTransactionId;
    let paymentTransaction : PaymentTransaction = {
      id;
      transactionId;
      paymentMethod;
      amount;
      bookingId;
      timestamp;
      status;
    };
    paymentTransactions.add(id, paymentTransaction);
    paymentTransactionId += 1;
    id;
  };

  public query ({ caller }) func getAllPaymentTransactions() : async [PaymentTransaction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all payment transactions");
    };
    paymentTransactions.values().toArray();
  };

  public query ({ caller }) func getPaymentTransactionByBookingId(bookingId : Nat) : async ?PaymentTransaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payment transactions");
    };
    var foundTransaction : ?PaymentTransaction = null;
    for ((id, paymentTransaction) in paymentTransactions.entries()) {
      if (paymentTransaction.bookingId == bookingId) {
        foundTransaction := ?paymentTransaction;
      };
    };
    switch (foundTransaction) {
      case (null) { return null };
      case (?transaction) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return ?transaction;
        };
        switch (bookings.get(bookingId)) {
          case (null) {
            switch (eventBookings.get(bookingId)) {
              case (null) { Runtime.trap("Booking not found") };
              case (?eventBooking) { return ?transaction };
            };
          };
          case (?booking) { return ?transaction };
        };
      };
    };
  };

  module PasswordHelper {
    public func hash(password : Text) : Text {
      var hashValue = 5381 : Nat;
      password.chars().forEach(
        func(character) {
          hashValue := hashValue * 33 + character.toNat32().toNat();
        }
      );
      let shiftedHash = (hashValue * 2654435769) % 4294967296;
      ((shiftedHash % 1000000007).toText()) # (hashValue % 1000000007).toText();
    };
  };

  func findStaffAccountByUsername(username : Text) : ?StaffAccount {
    var found : ?StaffAccount = null;
    for ((id, account) in staffAccounts.entries()) {
      if (Text.equal(account.username, username)) {
        found := ?account;
      };
    };
    found;
  };

  module PortfolioImageHelper {
    public func isImageOwner(caller : Principal, image : ImageMetadata) : Bool {
      switch (image.vendorPrincipal) {
        case (null) { false };
        case (?vendor) { caller.equal(vendor) };
      };
    };
  };
};
