import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
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

  type PaymentTransaction = {
    id : Nat;
    transactionId : Text;
    paymentMethod : Text;
    amount : Nat;
    bookingId : Nat;
    timestamp : Int;
    status : TransactionStatus;
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
    bookedBy : Principal;
  };

  public type RankingProfile = {
    id : Nat;
    name : Text;
    city : Text;
    category : Text;
    photoUrl : Text;
    description : Text;
    rating : Nat;
    totalVotes : Nat;
    adminScore : Nat;
    linkedVendorId : ?Nat;
    createdAt : Int;
  };

  public type VoteRecord = {
    id : Nat;
    profileId : Nat;
    voterIdentifier : Text;
    votedAt : Int;
  };

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

  public type Venue = {
    id : Nat;
    name : Text;
    city : Text;
    capacity : Nat;
    pricePerDay : Nat;
    photoUrls : [Text];
    amenities : [Text];
    description : Text;
    createdAt : Int;
  };

  public type VenueBooking = {
    id : Nat;
    venueId : Nat;
    venueName : Text;
    eventDate : Int;
    eventDetails : Text;
    guestName : Text;
    guestPhone : Text;
    guestEmail : Text;
    totalAmount : Nat;
    status : BookingStatus;
    paymentStatus : TransactionStatus;
    createdAt : Int;
    bookedBy : Principal;
  };

  public type CateringVendor = {
    id : Nat;
    name : Text;
    city : Text;
    cuisineType : Text;
    pricePerPlate : Nat;
    minimumGuests : Nat;
    photoUrls : [Text];
    description : Text;
    createdAt : Int;
  };

  public type FoodBooking = {
    id : Nat;
    vendorId : Nat;
    vendorName : Text;
    guestName : Text;
    guestPhone : Text;
    guestEmail : Text;
    eventDate : Int;
    guestCount : Nat;
    totalAmount : Nat;
    eventLocation : Text;
    specialRequests : Text;
    status : BookingStatus;
    paymentStatus : TransactionStatus;
    createdAt : Int;
    bookedBy : Principal;
  };

  public type JobApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type JobListing = {
    id : Nat;
    title : Text;
    category : Text;
    city : Text;
    eventCompanyName : Text;
    workDate : Int;
    dailyWage : Nat;
    requiredStaffCount : Nat;
    description : Text;
    isActive : Bool;
    createdAt : Int;
  };

  public type JobApplication = {
    id : Nat;
    jobId : Nat;
    jobTitle : Text;
    fullName : Text;
    phone : Text;
    city : Text;
    skills : Text;
    experience : Text;
    availableDates : Text;
    status : JobApplicationStatus;
    createdAt : Int;
  };

  public type OrganiserStatus = {
    #active;
    #inactive;
  };

  public type OrganiserSession = {
    organiserId : Nat;
    username : Text;
    name : Text;
  };

  public type Organiser = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    name : Text;
    email : Text;
    status : OrganiserStatus;
    createdAt : Int;
  };

  public type OldState = {
    events : Map.Map<Nat, Event>;
    vendors : Map.Map<Nat, Vendor>;
    bookings : Map.Map<Nat, Booking>;
    users : Map.Map<Nat, User>;
    listings : Map.Map<Nat, Listing>;
    userProfiles : Map.Map<Principal, UserProfile>;
    vendorApplications : Map.Map<Nat, VendorApplication>;
    serviceListings : Map.Map<Nat, ServiceListing>;
    ticketCategories : Map.Map<Nat, TicketCategory>;
    eventBookings : Map.Map<Nat, EventBooking>;
    paymentTransactions : Map.Map<Nat, PaymentTransaction>;
    staffAccounts : Map.Map<Nat, StaffAccount>;
    hotels : Map.Map<Nat, Hotel>;
    hotelBookings : Map.Map<Nat, HotelBooking>;
    rankingProfiles : Map.Map<Nat, RankingProfile>;
    voteRecords : Map.Map<Nat, VoteRecord>;
    transportOptions : Map.Map<Nat, TransportOption>;
    venueId : Nat;
    venueBookingId : Nat;
    venues : Map.Map<Nat, Venue>;
    venueBookings : Map.Map<Nat, VenueBooking>;
    cateringVendorId : Nat;
    foodBookingId : Nat;
    cateringVendors : Map.Map<Nat, CateringVendor>;
    foodBookings : Map.Map<Nat, FoodBooking>;
    eventId : Nat;
    vendorId : Nat;
    bookingId : Nat;
    userId : Nat;
    listingId : Nat;
    vendorApplicationId : Nat;
    serviceListingId : Nat;
    ticketCategoryId : Nat;
    eventBookingId : Nat;
    staffAccountId : Nat;
    paymentTransactionId : Nat;
    hotelId : Nat;
    hotelBookingId : Nat;
    rankingProfileId : Nat;
    voteRecordId : Nat;
    transportOptionId : Nat;
    transportBookingId : Nat;
    jobListingId : Nat;
    jobApplicationId : Nat;
    transportBookings : Map.Map<Nat, TransportBooking>;
    jobListings : Map.Map<Nat, JobListing>;
    jobApplications : Map.Map<Nat, JobApplication>;
  };

  public type NewState = {
    events : Map.Map<Nat, Event>;
    vendors : Map.Map<Nat, Vendor>;
    bookings : Map.Map<Nat, Booking>;
    users : Map.Map<Nat, User>;
    listings : Map.Map<Nat, Listing>;
    userProfiles : Map.Map<Principal, UserProfile>;
    vendorApplications : Map.Map<Nat, VendorApplication>;
    serviceListings : Map.Map<Nat, ServiceListing>;
    ticketCategories : Map.Map<Nat, TicketCategory>;
    eventBookings : Map.Map<Nat, EventBooking>;
    paymentTransactions : Map.Map<Nat, PaymentTransaction>;
    staffAccounts : Map.Map<Nat, StaffAccount>;
    hotels : Map.Map<Nat, Hotel>;
    hotelBookings : Map.Map<Nat, HotelBooking>;
    rankingProfiles : Map.Map<Nat, RankingProfile>;
    voteRecords : Map.Map<Nat, VoteRecord>;
    transportOptions : Map.Map<Nat, TransportOption>;
    venueId : Nat;
    venueBookingId : Nat;
    venues : Map.Map<Nat, Venue>;
    venueBookings : Map.Map<Nat, VenueBooking>;
    cateringVendorId : Nat;
    foodBookingId : Nat;
    cateringVendors : Map.Map<Nat, CateringVendor>;
    foodBookings : Map.Map<Nat, FoodBooking>;
    eventId : Nat;
    vendorId : Nat;
    bookingId : Nat;
    userId : Nat;
    listingId : Nat;
    vendorApplicationId : Nat;
    serviceListingId : Nat;
    ticketCategoryId : Nat;
    eventBookingId : Nat;
    staffAccountId : Nat;
    paymentTransactionId : Nat;
    hotelId : Nat;
    hotelBookingId : Nat;
    rankingProfileId : Nat;
    voteRecordId : Nat;
    transportOptionId : Nat;
    transportBookingId : Nat;
    jobListingId : Nat;
    jobApplicationId : Nat;
    transportBookings : Map.Map<Nat, TransportBooking>;
    jobListings : Map.Map<Nat, JobListing>;
    jobApplications : Map.Map<Nat, JobApplication>;
    organisers : Map.Map<Nat, Organiser>;
    organiserAccountId : Nat;
    organiserEvents : Map.Map<Nat, Nat>;
  };

  public func run(old : OldState) : NewState {
    {
      events = old.events;
      vendors = old.vendors;
      bookings = old.bookings;
      users = old.users;
      listings = old.listings;
      userProfiles = old.userProfiles;
      vendorApplications = old.vendorApplications;
      serviceListings = old.serviceListings;
      ticketCategories = old.ticketCategories;
      eventBookings = old.eventBookings;
      paymentTransactions = old.paymentTransactions;
      staffAccounts = old.staffAccounts;
      hotels = old.hotels;
      hotelBookings = old.hotelBookings;
      rankingProfiles = old.rankingProfiles;
      voteRecords = old.voteRecords;
      transportOptions = old.transportOptions;
      venueId = old.venueId;
      venueBookingId = old.venueBookingId;
      venues = old.venues;
      venueBookings = old.venueBookings;
      cateringVendorId = old.cateringVendorId;
      foodBookingId = old.foodBookingId;
      cateringVendors = old.cateringVendors;
      foodBookings = old.foodBookings;
      eventId = old.eventId;
      vendorId = old.vendorId;
      bookingId = old.bookingId;
      userId = old.userId;
      listingId = old.listingId;
      vendorApplicationId = old.vendorApplicationId;
      serviceListingId = old.serviceListingId;
      ticketCategoryId = old.ticketCategoryId;
      eventBookingId = old.eventBookingId;
      staffAccountId = old.staffAccountId;
      paymentTransactionId = old.paymentTransactionId;
      hotelId = old.hotelId;
      hotelBookingId = old.hotelBookingId;
      rankingProfileId = old.rankingProfileId;
      voteRecordId = old.voteRecordId;
      transportOptionId = old.transportOptionId;
      transportBookingId = old.transportBookingId;
      jobListingId = old.jobListingId;
      jobApplicationId = old.jobApplicationId;
      transportBookings = old.transportBookings;
      jobListings = old.jobListings;
      jobApplications = old.jobApplications;
      organisers = Map.empty<Nat, Organiser>();
      organiserAccountId = 0;
      organiserEvents = Map.empty<Nat, Nat>();
    };
  };
};
