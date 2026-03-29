import Maps "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Upgrades "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Event Management canister actor
(with migration = Upgrades.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ORGANISER MANAGEMENT SYSTEM
  type OrganiserStatus = {
    #active;
    #inactive;
  };

  type OrganiserSession = {
    organiserId : Nat;
    username : Text;
    name : Text;
  };

  type Organiser = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    name : Text;
    email : Text;
    status : OrganiserStatus;
    createdAt : Int;
  };

  var organiserAccountId = 0 : Nat;
  let organisers = Maps.empty<Nat, Organiser>();
  let organiserEvents = Maps.empty<Nat, Nat>();

  // Create an organiser (admin-only)
  public shared ({ caller }) func createOrganiser(username : Text, password : Text, name : Text, email : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create organisers");
    };
    if (username.isEmpty() or password.isEmpty() or name.isEmpty() or email.isEmpty()) {
      Runtime.trap("Invalid input: username, password, name, and email are required");
    };

    let existing : [Organiser] = organisers.values().toArray().filter(
      func(o) { Text.equal(o.username, username) }
    );
    if (existing.size() > 0) {
      Runtime.trap("Username already exists");
    };

    let id = organiserAccountId;
    let hashedPassword = PasswordHelper.hash(password);
    let organiser : Organiser = {
      id;
      username;
      passwordHash = hashedPassword;
      name;
      email;
      status = #active;
      createdAt = Time.now();
    };
    organisers.add(id, organiser);
    organiserAccountId += 1 : Nat;
    id;
  };

  // Update an organiser (admin-only)
  public shared ({ caller }) func updateOrganiser(id : Nat, name : Text, email : Text, status : OrganiserStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update organisers");
    };

    switch (organisers.get(id)) {
      case (null) { Runtime.trap("Organiser not found") };
      case (?existing) {
        if (name.isEmpty()) { Runtime.trap("Name cannot be empty") };
        let updated : Organiser = { existing with name; email; status };
        organisers.add(id, updated);
      };
    };
  };

  // Delete an organiser (admin-only)
  public shared ({ caller }) func deleteOrganiser(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete organisers");
    };
    switch (organisers.get(id)) {
      case (null) { Runtime.trap("Organiser not found") };
      case (?_) { organisers.remove(id) };
    };
  };

  // Get all organisers (admin-only)
  public query ({ caller }) func getAllOrganisers() : async [Organiser] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view organisers");
    };
    organisers.values().toArray();
  };

  // Organiser login (public, returns session for informational purposes)
  public shared func organiserLogin(username : Text, password : Text) : async {
    #ok : OrganiserSession;
    #err : Text;
  } {
    switch (organisers.values().toArray().find(func(o) { Text.equal(o.username, username) })) {
      case (null) { #err("Organiser not found") };
      case (?organiser) {
        if (not Text.equal(organiser.passwordHash, PasswordHelper.hash(password))) {
          return #err("Invalid password");
        };
        if (organiser.status == #inactive) {
          return #err("Organiser is inactive");
        };
        #ok({ organiserId = organiser.id; username; name = organiser.name });
      };
    };
  };

  // Create event as organiser (admin-only, since there's no session-based auth for organisers)
  public shared ({ caller }) func createEventAsOrganiser(organiserId : Nat, name : Text, category : Text, subCategory : Text, venue : Text, city : Text, state : Text, country : Text, date : Int, time : Text, duration : Text, ageLimit : Nat, description : Text, posterUrl : Text, bannerUrl : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create events for organisers");
    };
    switch (organisers.get(organiserId)) {
      case (null) { Runtime.trap("Organiser not found") };
      case (?organiser) {
        if (organiser.status == #inactive) { Runtime.trap("Organiser is inactive") };
        let id = eventId;
        let event : Event = {
          id;
          name;
          category;
          subCategory;
          venue;
          city;
          state;
          country;
          date;
          time;
          duration;
          ageLimit;
          description;
          posterUrl;
          bannerUrl;
          status = #draft;
          createdAt = Time.now();
        };
        events.add(id, event);
        organiserEvents.add(id, organiserId);
        eventId += 1;
        id;
      };
    };
  };

  // Update event as organiser (admin-only, since there's no session-based auth for organisers)
  public shared ({ caller }) func updateEventAsOrganiser(organiserId : Nat, eventId : Nat, name : Text, category : Text, subCategory : Text, venue : Text, city : Text, state : Text, country : Text, date : Int, time : Text, duration : Text, ageLimit : Nat, description : Text, posterUrl : Text, bannerUrl : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update events for organisers");
    };
    switch (organisers.get(organiserId)) {
      case (null) { Runtime.trap("Organiser not found") };
      case (?organiser) {
        if (organiser.status == #inactive) { Runtime.trap("Organiser is inactive") };
        switch (organiserEvents.get(eventId)) {
          case (null) { Runtime.trap("Event not found") };
          case (?ownerId) {
            if (ownerId != organiserId) { Runtime.trap("You do not own this event") };
            switch (events.get(eventId)) {
              case (null) { Runtime.trap("Event not found") };
              case (?existing) {
                let updated : Event = {
                  id = eventId;
                  name;
                  category;
                  subCategory;
                  venue;
                  city;
                  state;
                  country;
                  date;
                  time;
                  duration;
                  ageLimit;
                  description;
                  posterUrl;
                  bannerUrl;
                  status = existing.status;
                  createdAt = existing.createdAt;
                };
                events.add(eventId, updated);
              };
            };
          };
        };
      };
    };
  };

  // Publish event as organiser (admin-only, since there's no session-based auth for organisers)
  public shared ({ caller }) func publishEventAsOrganiser(organiserId : Nat, eventId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can publish events for organisers");
    };
    switch (organisers.get(organiserId)) {
      case (null) { Runtime.trap("Organiser not found") };
      case (?organiser) {
        if (organiser.status == #inactive) { Runtime.trap("Organiser is inactive") };
        switch (organiserEvents.get(eventId)) {
          case (null) { Runtime.trap("Event not found") };
          case (?ownerId) {
            if (ownerId != organiserId) { Runtime.trap("You do not own this event") };
            switch (events.get(eventId)) {
              case (null) { Runtime.trap("Event not found") };
              case (?existing) {
                let updated : Event = { existing with status = #published };
                events.add(eventId, updated);
              };
            };
          };
        };
      };
    };
  };

  // Get all events by organiser (public query)
  public query func getEventsByOrganiser(organiserId : Nat) : async [Event] {
    if (organiserId == 0) { Runtime.trap("Invalid organiserId") };
    events.values().toArray().filter(
      func(event) {
        switch (organiserEvents.get(event.id)) {
          case (null) { false };
          case (?ownerId) { ownerId == organiserId };
        };
      }
    );
  };

  // Return organiser id for event id (public query)
  public query func getOrganiserForEvent(eventId : Nat) : async ?Nat {
    organiserEvents.get(eventId);
  };

  // Return null if organiser does not exist or is not active (public query)
  public query func getActiveOrganiser(organiserId : Nat) : async ?Organiser {
    switch (organisers.get(organiserId)) {
      case (null) { null };
      case (?organiser) {
        if (organiser.status == #active) { ?organiser } else { null };
      };
    };
  };

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
    bookedBy : Principal;
  };

  ////////////////////////////////////////////////////////
  // NEW RANKINGS ENGINE
  ////////////////////////////////////////////////////////
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

  var rankingProfileId = 0 : Nat;
  var voteRecordId = 0 : Nat;
  let rankingProfiles = Maps.empty<Nat, RankingProfile>();
  let voteRecords = Maps.empty<Nat, VoteRecord>();

  public shared ({ caller }) func createRankingProfile(
    name : Text,
    city : Text,
    category : Text,
    photoUrl : Text,
    description : Text,
    rating : Nat,
    adminScore : Nat,
    linkedVendorId : ?Nat,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create ranking profiles");
    };
    let id = rankingProfileId;
    let profile : RankingProfile = {
      id;
      name;
      city;
      category;
      photoUrl;
      description;
      rating;
      totalVotes = 0;
      adminScore;
      linkedVendorId;
      createdAt = Time.now();
    };
    rankingProfiles.add(id, profile);
    rankingProfileId += 1 : Nat;
    id;
  };

  public shared ({ caller }) func updateRankingProfile(
    id : Nat,
    name : Text,
    city : Text,
    category : Text,
    photoUrl : Text,
    description : Text,
    rating : Nat,
    adminScore : Nat,
    linkedVendorId : ?Nat,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update ranking profiles");
    };

    switch (rankingProfiles.get(id)) {
      case (?existing) {
        let updated : RankingProfile = {
          id;
          name;
          city;
          category;
          photoUrl;
          description;
          rating;
          totalVotes = existing.totalVotes;
          adminScore;
          linkedVendorId;
          createdAt = existing.createdAt;
        };
        rankingProfiles.add(id, updated);
      };
      case (null) { Runtime.trap("RANKING_PROFILE_NOT_FOUND") };
    };
  };

  public shared ({ caller }) func deleteRankingProfile(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete ranking profiles");
    };
    switch (rankingProfiles.get(id)) {
      case (null) { Runtime.trap("RANKING_PROFILE_NOT_FOUND") };
      case (?_) { rankingProfiles.remove(id) };
    };
  };

  func compareRankingProfiles(a : RankingProfile, b : RankingProfile) : Order.Order {
    let aScore = a.totalVotes * 60 + a.adminScore * 40;
    let bScore = b.totalVotes * 60 + b.adminScore * 40;
    if (aScore > bScore) { return #less };
    if (aScore < bScore) { return #greater };
    #equal;
  };

  func compareRankingProfilesDesc(a : RankingProfile, b : RankingProfile) : Order.Order {
    Nat.compare(b.totalVotes, a.totalVotes);
  };

  public query func getAllRankingProfiles() : async [RankingProfile] {
    rankingProfiles.values().toArray().sort(compareRankingProfiles);
  };

  public query func getRankingProfilesByCategory(category : Text) : async [RankingProfile] {
    rankingProfiles.values().toArray().filter(
      func(p) { Text.equal(p.category, category) }
    ).sort(
      compareRankingProfilesDesc
    );
  };

  public shared ({ caller }) func voteForProfile(
    profileId : Nat,
    voterIdentifier : Text,
  ) : async { #ok; #err : Text } {
    switch (rankingProfiles.get(profileId)) {
      case (null) { return #err("RANKING_PROFILE_NOT_FOUND") };
      case (?profile) {
        for ((id, vote) in voteRecords.entries()) {
          if (vote.profileId == profileId and Text.equal(vote.voterIdentifier, voterIdentifier)) {
            let now = Time.now();
            let votedAtDay = vote.votedAt / 86_400_000_000_000;
            let nowDay = now / 86_400_000_000_000;
            if (votedAtDay == nowDay) {
              return #err("Already voted today");
            };
          };
        };
        let voteId = voteRecordId;
        let vote : VoteRecord = {
          id = voteId;
          profileId;
          voterIdentifier;
          votedAt = Time.now();
        };
        voteRecords.add(voteId, vote);
        voteRecordId += 1 : Nat;
        let updatedProfile = {
          profile with totalVotes = profile.totalVotes + 1;
        };
        rankingProfiles.add(profileId, updatedProfile);
        #ok;
      };
    };
  };

  public query ({ caller }) func getVoteRecordsForProfile(profileId : Nat) : async [VoteRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view vote records");
    };
    voteRecords.values().toArray().filter(
      func(v) { v.profileId == profileId }
    );
  };

  public shared ({ caller }) func adjustAdminScore(profileId : Nat, score : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can adjust admin score");
    };
    switch (rankingProfiles.get(profileId)) {
      case (null) { Runtime.trap("RANKING_PROFILE_NOT_FOUND") };
      case (?profile) {
        let updatedProfile = { profile with adminScore = score };
        rankingProfiles.add(profileId, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func linkVendorToProfile(profileId : Nat, vendorId : ?Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can link vendor");
    };
    switch (rankingProfiles.get(profileId)) {
      case (null) { Runtime.trap("RANKING_PROFILE_NOT_FOUND") };
      case (?profile) {
        let updatedProfile = { profile with linkedVendorId = vendorId };
        rankingProfiles.add(profileId, updatedProfile);
      };
    };
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
  // STAFF JOB APPLICATION SYSTEM
  ////////////////////////////////////////////////////////
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
  var jobListingId = 0 : Nat;
  var jobApplicationId = 0 : Nat;

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
  let jobListings = Maps.empty<Nat, JobListing>();
  let jobApplications = Maps.empty<Nat, JobApplication>();

  ////////////////////////////////////////////////////////
  // VENUE BOOKING SYSTEM
  ////////////////////////////////////////////////////////

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

  var venueId = 0 : Nat;
  var venueBookingId = 0 : Nat;
  let venues = Maps.empty<Nat, Venue>();
  let venueBookings = Maps.empty<Nat, VenueBooking>();

  ////////////////////////////////////////////////////////
  // CATERING/FOOD BOOKING SYSTEM
  ////////////////////////////////////////////////////////

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

  var cateringVendorId = 0 : Nat;
  var foodBookingId = 0 : Nat;
  let cateringVendors = Maps.empty<Nat, CateringVendor>();
  let foodBookings = Maps.empty<Nat, FoodBooking>();

  public shared ({ caller }) func createCateringVendor(
    name : Text,
    city : Text,
    cuisineType : Text,
    pricePerPlate : Nat,
    minimumGuests : Nat,
    photoUrls : [Text],
    description : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create catering vendors");
    };
    let id = cateringVendorId;
    let vendor : CateringVendor = {
      id;
      name;
      city;
      cuisineType;
      pricePerPlate;
      minimumGuests;
      photoUrls;
      description;
      createdAt = Time.now();
    };
    cateringVendors.add(id, vendor);
    cateringVendorId += 1 : Nat;
    id;
  };

  public shared ({ caller }) func updateCateringVendor(
    id : Nat,
    name : Text,
    city : Text,
    cuisineType : Text,
    pricePerPlate : Nat,
    minimumGuests : Nat,
    photoUrls : [Text],
    description : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update catering vendors");
    };
    switch (cateringVendors.get(id)) {
      case (null) { Runtime.trap("Catering vendor not found") };
      case (?existing) {
        let updated : CateringVendor = {
          id;
          name;
          city;
          cuisineType;
          pricePerPlate;
          minimumGuests;
          photoUrls;
          description;
          createdAt = existing.createdAt;
        };
        cateringVendors.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCateringVendor(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete catering vendors");
    };
    if (not cateringVendors.containsKey(id)) {
      Runtime.trap("Catering vendor not found");
    };
    cateringVendors.remove(id);
  };

  public query func getAllCateringVendors() : async [CateringVendor] {
    cateringVendors.values().toArray();
  };

  public query func getCateringVendor(id : Nat) : async ?CateringVendor {
    cateringVendors.get(id);
  };

  public shared ({ caller }) func createFoodBooking(
    vendorId : Nat,
    vendorName : Text,
    guestName : Text,
    guestPhone : Text,
    guestEmail : Text,
    eventDate : Int,
    guestCount : Nat,
    totalAmount : Nat,
    eventLocation : Text,
    specialRequests : Text,
  ) : async Nat {
    let id = foodBookingId;
    let booking : FoodBooking = {
      id;
      vendorId;
      vendorName;
      guestName;
      guestPhone;
      guestEmail;
      eventDate;
      guestCount;
      totalAmount;
      eventLocation;
      specialRequests;
      status = #new;
      paymentStatus = #pending;
      createdAt = Time.now();
      bookedBy = caller;
    };
    foodBookings.add(id, booking);
    foodBookingId += 1 : Nat;
    id;
  };

  public query ({ caller }) func getAllFoodBookings() : async [FoodBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all food bookings");
    };
    foodBookings.values().toArray();
  };

  public query ({ caller }) func getFoodBooking(id : Nat) : async ?FoodBooking {
    switch (foodBookings.get(id)) {
      case (null) { null };
      case (?booking) {
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
  };

  public shared ({ caller }) func updateFoodBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update food booking status");
    };
    switch (foodBookings.get(id)) {
      case (null) { Runtime.trap("Food booking not found") };
      case (?existing) {
        let updated : FoodBooking = { existing with status };
        foodBookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateFoodBookingPaymentStatus(id : Nat, paymentStatus : TransactionStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update payment status");
    };
    switch (foodBookings.get(id)) {
      case (null) { Runtime.trap("Food booking not found") };
      case (?existing) {
        let updated : FoodBooking = { existing with paymentStatus };
        foodBookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func createVenue(
    name : Text,
    city : Text,
    capacity : Nat,
    pricePerDay : Nat,
    photoUrls : [Text],
    amenities : [Text],
    description : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create venues");
    };
    let id = venueId;
    let venue : Venue = {
      id;
      name;
      city;
      capacity;
      pricePerDay;
      photoUrls;
      amenities;
      description;
      createdAt = Time.now();
    };
    venues.add(id, venue);
    venueId += 1 : Nat;
    id;
  };

  public shared ({ caller }) func updateVenue(
    id : Nat,
    name : Text,
    city : Text,
    capacity : Nat,
    pricePerDay : Nat,
    photoUrls : [Text],
    amenities : [Text],
    description : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update venues");
    };
    switch (venues.get(id)) {
      case (null) { Runtime.trap("Venue not found") };
      case (?existing) {
        let updated : Venue = {
          id;
          name;
          city;
          capacity;
          pricePerDay;
          photoUrls;
          amenities;
          description;
          createdAt = existing.createdAt;
        };
        venues.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteVenue(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete venues");
    };
    switch (venues.get(id)) {
      case (null) { Runtime.trap("Venue not found") };
      case (?_) { venues.remove(id) };
    };
  };

  public query func getAllVenues() : async [Venue] {
    venues.values().toArray();
  };

  public query func getVenue(id : Nat) : async ?Venue {
    venues.get(id);
  };

  public shared ({ caller }) func createVenueBooking(
    venueId : Nat,
    venueName : Text,
    eventDate : Int,
    eventDetails : Text,
    guestName : Text,
    guestPhone : Text,
    guestEmail : Text,
    totalAmount : Nat,
  ) : async Nat {
    let id = venueBookingId;
    let booking : VenueBooking = {
      id;
      venueId;
      venueName;
      eventDate;
      eventDetails;
      guestName;
      guestPhone;
      guestEmail;
      totalAmount;
      status = #new;
      paymentStatus = #pending;
      createdAt = Time.now();
      bookedBy = caller;
    };
    venueBookings.add(id, booking);
    venueBookingId += 1 : Nat;
    id;
  };

  public query ({ caller }) func getAllVenueBookings() : async [VenueBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all venue bookings");
    };
    venueBookings.values().toArray();
  };

  public query ({ caller }) func getVenueBooking(id : Nat) : async ?VenueBooking {
    switch (venueBookings.get(id)) {
      case (null) { null };
      case (?booking) {
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
  };

  public shared ({ caller }) func updateVenueBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update venue booking status");
    };
    switch (venueBookings.get(id)) {
      case (null) { Runtime.trap("Venue booking not found") };
      case (?existing) {
        let updated : VenueBooking = { existing with status };
        venueBookings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateVenueBookingPaymentStatus(id : Nat, paymentStatus : TransactionStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update payment status");
    };
    switch (venueBookings.get(id)) {
      case (null) { Runtime.trap("Venue booking not found") };
      case (?existing) {
        let updated : VenueBooking = { existing with paymentStatus };
        venueBookings.add(id, updated);
      };
    };
  };

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
      bookedBy = caller;
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
    switch (hotelBookings.get(id)) {
      case (null) { null };
      case (?booking) {
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        ?booking;
      };
    };
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

  ////////////////////////////////////////////////////////
  // STAFF JOB LISTING FUNCTIONS
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func createJobListing(
    title : Text,
    category : Text,
    city : Text,
    eventCompanyName : Text,
    workDate : Int,
    dailyWage : Nat,
    requiredStaffCount : Nat,
    description : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create job listings");
    };
    let id = jobListingId;
    let job : JobListing = {
      id;
      title;
      category;
      city;
      eventCompanyName;
      workDate;
      dailyWage;
      requiredStaffCount;
      description;
      isActive = true;
      createdAt = Time.now();
    };
    jobListings.add(id, job);
    jobListingId += 1 : Nat;
    id;
  };

  public shared ({ caller }) func updateJobListing(
    id : Nat,
    title : Text,
    category : Text,
    city : Text,
    eventCompanyName : Text,
    workDate : Int,
    dailyWage : Nat,
    requiredStaffCount : Nat,
    description : Text,
    isActive : Bool,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update job listings");
    };
    switch (jobListings.get(id)) {
      case (null) { Runtime.trap("Job listing not found") };
      case (?existing) {
        let updated : JobListing = {
          id;
          title;
          category;
          city;
          eventCompanyName;
          workDate;
          dailyWage;
          requiredStaffCount;
          description;
          isActive;
          createdAt = existing.createdAt;
        };
        jobListings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteJobListing(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete job listings");
    };
    switch (jobListings.get(id)) {
      case (null) { Runtime.trap("Job listing not found") };
      case (?_) { jobListings.remove(id) };
    };
  };

  public query func getAllJobListings() : async [JobListing] {
    jobListings.values().toArray();
  };

  public query func getActiveJobListings() : async [JobListing] {
    jobListings.values().toArray().filter(func(j) { j.isActive });
  };

  public shared func createJobApplication(
    jobId : Nat,
    jobTitle : Text,
    fullName : Text,
    phone : Text,
    city : Text,
    skills : Text,
    experience : Text,
    availableDates : Text,
  ) : async Nat {
    let id = jobApplicationId;
    let application : JobApplication = {
      id;
      jobId;
      jobTitle;
      fullName;
      phone;
      city;
      skills;
      experience;
      availableDates;
      status = #pending;
      createdAt = Time.now();
    };
    jobApplications.add(id, application);
    jobApplicationId += 1 : Nat;
    id;
  };

  public query ({ caller }) func getAllJobApplications() : async [JobApplication] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view job applications");
    };
    jobApplications.values().toArray();
  };

  public shared ({ caller }) func updateJobApplicationStatus(
    id : Nat,
    status : JobApplicationStatus,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update application status");
    };
    switch (jobApplications.get(id)) {
      case (null) { Runtime.trap("Job application not found") };
      case (?existing) {
        let updated : JobApplication = { existing with status };
        jobApplications.add(id, updated);
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
