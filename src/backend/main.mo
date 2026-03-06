import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // TYPES

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

  // STATE

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var eventId = 0;
  var vendorId = 0;
  var bookingId = 0;
  var userId = 0;
  var listingId = 0;

  let events = Map.empty<Nat, Event>();
  let vendors = Map.empty<Nat, Vendor>();
  let bookings = Map.empty<Nat, Booking>();
  let users = Map.empty<Nat, User>();
  let listings = Map.empty<Nat, Listing>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // USER PROFILE MANAGEMENT (Required by frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // EVENTS

  public shared ({ caller }) func createEvent(name : Text, category : Text, subCategory : Text, venue : Text, city : Text, state : Text, country : Text, date : Int, time : Text, duration : Text, ageLimit : Nat, description : Text, posterUrl : Text, bannerUrl : Text, status : Status) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create events");
    };
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
      status;
      createdAt = Time.now();
    };
    events.add(id, event);
    eventId += 1;
    id;
  };

  public shared ({ caller }) func updateEvent(id : Nat, name : Text, category : Text, subCategory : Text, venue : Text, city : Text, state : Text, country : Text, date : Int, time : Text, duration : Text, ageLimit : Nat, description : Text, posterUrl : Text, bannerUrl : Text, status : Status) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update events");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existing) {
        let updated : Event = {
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
          status;
          createdAt = existing.createdAt;
        };
        events.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete events");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?_) {
        events.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all events");
    };
    events.values().toArray();
  };

  public query ({ caller }) func getEvent(id : Nat) : async ?Event {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view events");
    };
    events.get(id);
  };

  // VENDORS

  public shared ({ caller }) func createVendor(name : Text, businessName : Text, city : Text, services : Text, experience : Nat, phone : Text, email : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create vendors");
    };
    let id = vendorId;
    let vendor : Vendor = {
      id;
      name;
      businessName;
      city;
      services;
      experience;
      phone;
      email;
      status = #pending;
      createdAt = Time.now();
    };
    vendors.add(id, vendor);
    vendorId += 1;
    id;
  };

  public shared ({ caller }) func updateVendor(id : Nat, name : Text, businessName : Text, city : Text, services : Text, experience : Nat, phone : Text, email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update vendors");
    };
    switch (vendors.get(id)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?existing) {
        let updated : Vendor = {
          id;
          name;
          businessName;
          city;
          services;
          experience;
          phone;
          email;
          status = existing.status;
          createdAt = existing.createdAt;
        };
        vendors.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateVendorStatus(id : Nat, status : VendorStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update vendor status");
    };
    switch (vendors.get(id)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?existing) {
        let updated : Vendor = {
          existing with
          status
        };
        vendors.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all vendors");
    };
    vendors.values().toArray();
  };

  public query ({ caller }) func getVendor(id : Nat) : async ?Vendor {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view vendors");
    };
    vendors.get(id);
  };

  // BOOKINGS

  // Public function - anyone can create a booking request from public form
  public shared ({ caller }) func createBookingRequest(name : Text, phone : Text, serviceType : Text, city : Text, date : Int, message : Text) : async Nat {
    // No authorization check - public form submission
    let id = bookingId;
    let booking : Booking = {
      id;
      name;
      phone;
      serviceType;
      city;
      date;
      message;
      status = #new;
      createdAt = Time.now();
    };
    bookings.add(id, booking);
    bookingId += 1;
    id;
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update booking status");
    };
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : Booking = {
          existing with
          status
        };
        bookings.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all bookings");
    };
    bookings.values().toArray();
  };

  public query ({ caller }) func getBooking(id : Nat) : async ?Booking {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view bookings");
    };
    bookings.get(id);
  };

  // USERS

  public shared ({ caller }) func createUser(name : Text, phone : Text, email : Text, role : UserRole) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create users");
    };
    let id = userId;
    let user : User = {
      id;
      name;
      phone;
      email;
      role;
      status = #active;
      createdAt = Time.now();
    };
    users.add(id, user);
    userId += 1;
    id;
  };

  public shared ({ caller }) func updateUser(id : Nat, name : Text, phone : Text, email : Text, role : UserRole) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update users");
    };
    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existing) {
        let updated : User = {
          id;
          name;
          phone;
          email;
          role;
          status = existing.status;
          createdAt = existing.createdAt;
        };
        users.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateUserStatus(id : Nat, status : UserStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update user status");
    };
    switch (users.get(id)) {
      case (null) { Runtime.trap("User not found") };
      case (?existing) {
        let updated : User = {
          existing with
          status
        };
        users.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all users");
    };
    users.values().toArray();
  };

  public query ({ caller }) func getUser(id : Nat) : async ?User {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view users");
    };
    users.get(id);
  };

  // LISTINGS

  // Public function - anyone can submit a listing for approval
  public shared ({ caller }) func createListing(title : Text, category : Text, description : Text, city : Text, price : Nat, contactPhone : Text, submittedBy : Text) : async Nat {
    // No authorization check - public listing submission
    let id = listingId;
    let listing : Listing = {
      id;
      title;
      category;
      description;
      city;
      price;
      contactPhone;
      submittedBy;
      status = #pending;
      createdAt = Time.now();
    };
    listings.add(id, listing);
    listingId += 1;
    id;
  };

  public shared ({ caller }) func updateListingStatus(id : Nat, status : ListingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update listing status");
    };
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let updated : Listing = {
          existing with
          status
        };
        listings.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllListings() : async [Listing] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all listings");
    };
    listings.values().toArray();
  };

  public query ({ caller }) func getListing(id : Nat) : async ?Listing {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view listings");
    };
    listings.get(id);
  };

  // ANALYTICS

  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view analytics");
    };
    let totalEvents = events.size();
    let totalBookings = bookings.size();
    let totalVendors = vendors.size();
    let totalUsers = users.size();
    let totalListings = listings.size();

    let recentBookings = bookings.values().toArray();

    {
      totalEvents;
      totalBookings;
      totalVendors;
      totalUsers;
      totalListings;
      recentBookings;
    };
  };
};
