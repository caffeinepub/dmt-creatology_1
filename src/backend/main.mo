import Maps "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

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

  //// Vendor Marketplace Types
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

  /// Image Storage Types
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

  /** TICKET SYSTEM **/
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

  /** STAFF AUTHENTICATION SYSTEM **/
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

  ////////////////////////////////////////////////////////
  // State
  ////////////////////////////////////////////////////////
  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ID counters
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

  // Data stores
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
  let staffAccounts = Maps.empty<Nat, StaffAccount>();

  ////////////////////////////////////////////////////////
  // TICKET SYSTEM FUNCTIONS
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func addTicketCategory(eventId : Nat, name : Text, price : Nat, availableQty : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add ticket categories");
    };
    let id = ticketCategoryId;
    let tc : TicketCategory = { id; eventId; name; price; availableQty };
    ticketCategories.add(id, tc);
    ticketCategoryId += 1;
    id;
  };

  public query func getTicketCategoriesByEvent(eventId : Nat) : async [TicketCategory] {
    let result = List.empty<TicketCategory>();
    for ((id, tc) in ticketCategories.entries()) {
      if (tc.eventId == eventId) {
        result.add(tc);
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func deleteTicketCategory(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete ticket categories");
    };
    switch (ticketCategories.get(id)) {
      case (null) { Runtime.trap("Ticket category not found") };
      case (?_) { ticketCategories.remove(id); };
    };
  };

  public shared ({ caller }) func createEventBooking(eventId : Nat, eventName : Text, ticketCategory : Text, name : Text, phone : Text, city : Text, quantity : Nat, message : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create event bookings");
    };
    let id = eventBookingId;
    let eb : EventBooking = {
      id;
      eventId;
      eventName;
      ticketCategory;
      name;
      phone;
      city;
      quantity;
      message;
      status = #new;
      createdAt = Time.now();
    };
    eventBookings.add(id, eb);
    eventBookingId += 1;
    id;
  };

  public query ({ caller }) func getAllEventBookings() : async [EventBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all event bookings");
    };
    eventBookings.values().toArray();
  };

  public shared ({ caller }) func updateEventBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update event booking status");
    };
    switch (eventBookings.get(id)) {
      case (null) { Runtime.trap("Event booking not found") };
      case (?existing) {
        let updated : EventBooking = { existing with status };
        eventBookings.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getEventBookingsByEvent(eventId : Nat) : async [EventBooking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view event bookings");
    };
    let result = List.empty<EventBooking>();
    for ((id, eb) in eventBookings.entries()) {
      if (eb.eventId == eventId) {
        result.add(eb);
      };
    };
    result.toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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
  // Event Management
  ////////////////////////////////////////////////////////
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
      case (?_) { events.remove(id) };
    };
  };

  public query func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  public query ({ caller }) func getEvent(id : Nat) : async ?Event {
    events.get(id);
  };

  public query func getPublicEventsByCategory(category : Text) : async [Event] {
    let filtered = List.empty<Event>();
    let now = Time.now();
    for ((id, event) in events.entries()) {
      if (Text.equal(event.category, category) and event.status == #published and event.date > now) {
        filtered.add(event);
      };
    };
    filtered.toArray();
  };

  public query func getPublicEventsBySubCategory(subCategory : Text) : async [Event] {
    let filtered = List.empty<Event>();
    let now = Time.now();
    for ((id, event) in events.entries()) {
      if (Text.equal(event.subCategory, subCategory) and event.status == #published and event.date > now) {
        filtered.add(event);
      };
    };
    filtered.toArray();
  };

  public query func getUpcomingEvents() : async [Event] {
    let filtered = List.empty<Event>();
    let now = Time.now();
    for ((id, event) in events.entries()) {
      if (event.status == #published and event.date > now) {
        filtered.add(event);
      };
    };
    filtered.toArray();
  };

  public query func getPublishedEvents() : async [Event] {
    let published = List.empty<Event>();
    for ((id, event) in events.entries()) {
      if (event.status == #published) {
        published.add(event);
      };
    };
    published.toArray();
  };

  ////////////////////////////////////////////////////////
  // Vendor Management
  ////////////////////////////////////////////////////////
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
        let updated : Vendor = { existing with status };
        vendors.add(id, updated);
      };
    };
  };

  public query func getAllVendors() : async [Vendor] {
    vendors.values().toArray();
  };

  public query ({ caller }) func getVendor(id : Nat) : async ?Vendor {
    vendors.get(id);
  };

  public query ({ caller }) func getPublicVendorsByServices(services : Text) : async [Vendor] {
    let filtered = List.empty<Vendor>();
    for ((id, vendor) in vendors.entries()) {
      if (Text.equal(vendor.services, services)) {
        filtered.add(vendor);
      };
    };
    filtered.toArray();
  };

  public query func getPublishedVendors() : async [Vendor] {
    let published = List.empty<Vendor>();
    for ((id, vendor) in vendors.entries()) {
      if (vendor.status == #approved) {
        published.add(vendor);
      };
    };
    published.toArray();
  };

  public query ({ caller }) func getVendorsByCity(city : Text) : async [Vendor] {
    let filtered = List.empty<Vendor>();
    for ((id, vendor) in vendors.entries()) {
      if (Text.equal(vendor.city, city)) {
        filtered.add(vendor);
      };
    };
    filtered.toArray();
  };

  ////////////////////////////////////////////////////////
  // Booking Management
  ////////////////////////////////////////////////////////
  public shared ({ caller }) func createBookingRequest(name : Text, phone : Text, serviceType : Text, city : Text, date : Int, message : Text) : async Nat {
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
        let updated : Booking = { existing with status };
        bookings.add(id, updated);
      };
    };
  };

  public query func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public query ({ caller }) func getBooking(id : Nat) : async ?Booking {
    bookings.get(id);
  };

  public query ({ caller }) func getBookingsByServiceType(serviceType : Text) : async [Booking] {
    let filtered = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (Text.equal(booking.serviceType, serviceType)) {
        filtered.add(booking);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getBookingsByCity(city : Text) : async [Booking] {
    let filtered = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (Text.equal(booking.city, city)) {
        filtered.add(booking);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getBookingsByDateRange(start : Int, end : Int) : async [Booking] {
    let filtered = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (booking.date >= start and booking.date <= end) {
        filtered.add(booking);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getNewBookings() : async [Booking] {
    let newBookings = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (booking.status == #new) {
        newBookings.add(booking);
      };
    };
    newBookings.toArray();
  };

  public query ({ caller }) func getConfirmedBookings() : async [Booking] {
    let confirmed = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (booking.status == #confirmed) {
        confirmed.add(booking);
      };
    };
    confirmed.toArray();
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [Booking] {
    let filtered = List.empty<Booking>();
    for ((id, booking) in bookings.entries()) {
      if (booking.status == status) {
        filtered.add(booking);
      };
    };
    filtered.toArray();
  };

  ////////////////////////////////////////////////////////
  // User Management
  ////////////////////////////////////////////////////////
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
        let updated : User = { existing with status };
        users.add(id, updated);
      };
    };
  };

  public query func getAllUsers() : async [User] {
    users.values().toArray();
  };

  public query ({ caller }) func getUser(id : Nat) : async ?User {
    users.get(id);
  };

  public query ({ caller }) func getUsersByRole(role : UserRole) : async [User] {
    let filtered = List.empty<User>();
    for ((id, user) in users.entries()) {
      if (user.role == role) {
        filtered.add(user);
      };
    };
    filtered.toArray();
  };

  ////////////////////////////////////////////////////////
  // Listing Management
  ////////////////////////////////////////////////////////
  public query ({ caller }) func getPublicListings() : async [Listing] {
    let approved = List.empty<Listing>();
    for ((id, listing) in listings.entries()) {
      if (listing.status == #approved) {
        approved.add(listing);
      };
    };
    approved.toArray();
  };

  public shared ({ caller }) func createListing(title : Text, category : Text, description : Text, city : Text, price : Nat, contactPhone : Text, submittedBy : Text) : async Nat {
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
        let updated : Listing = { existing with status };
        listings.add(id, updated);
      };
    };
  };

  public query func getAllListings() : async [Listing] {
    listings.values().toArray();
  };

  public query ({ caller }) func getListing(id : Nat) : async ?Listing {
    listings.get(id);
  };

  public query ({ caller }) func getListingsByCategory(category : Text) : async [Listing] {
    let filtered = List.empty<Listing>();
    for ((id, listing) in listings.entries()) {
      if (Text.equal(listing.category, category)) {
        filtered.add(listing);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getListingsByCity(city : Text) : async [Listing] {
    let filtered = List.empty<Listing>();
    for ((id, listing) in listings.entries()) {
      if (Text.equal(listing.city, city)) {
        filtered.add(listing);
      };
    };
    filtered.toArray();
  };

  ////////////////////////////////////////////////////////
  // Analytics
  ////////////////////////////////////////////////////////
  public query func getAnalytics() : async Analytics {
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

  ////////////////////////////////////////////////////////
  // Vendor Marketplace
  ////////////////////////////////////////////////////////
  //// Vendor Applications
  public shared ({ caller }) func submitVendorApplication(businessName : Text, ownerName : Text, city : Text, serviceCategory : Text, description : Text, phone : Text, email : Text, portfolioImages : [Text]) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot submit vendor applications");
    };

    // Check if caller already has an application (any status)
    for ((id, app) in vendorApplications.entries()) {
      if (Principal.equal(app.principal, caller)) {
        Runtime.trap("You have already submitted an application. Use updateMyVendorApplication to modify a pending application.");
      };
    };

    let id = vendorApplicationId;
    let application : VendorApplication = {
      id;
      principal = caller;
      businessName;
      ownerName;
      city;
      serviceCategory;
      description;
      phone;
      email;
      portfolioImages;
      status = #pending;
      submittedAt = Time.now();
      reviewedAt = null;
    };
    vendorApplications.add(id, application);
    vendorApplicationId += 1;
    id;
  };

  public query ({ caller }) func getMyVendorApplication() : async ?VendorApplication {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access vendor applications");
    };

    for ((id, app) in vendorApplications.entries()) {
      if (Principal.equal(app.principal, caller)) {
        return ?app;
      };
    };
    null;
  };

  public shared ({ caller }) func updateMyVendorApplication(businessName : Text, ownerName : Text, city : Text, serviceCategory : Text, description : Text, phone : Text, email : Text, portfolioImages : [Text]) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot update vendor applications");
    };

    var foundId : ?Nat = null;
    for ((id, app) in vendorApplications.entries()) {
      if (Principal.equal(app.principal, caller)) {
        if (app.status != #pending) {
          Runtime.trap("Can only update pending applications");
        };
        foundId := ?id;
      };
    };

    switch (foundId) {
      case (null) { Runtime.trap("No pending application found") };
      case (?id) {
        switch (vendorApplications.get(id)) {
          case (null) { Runtime.trap("Application not found") };
          case (?existing) {
            let updated : VendorApplication = {
              existing with businessName;
              ownerName;
              city;
              serviceCategory;
              description;
              phone;
              email;
              portfolioImages;
            };
            vendorApplications.add(id, updated);
          };
        };
      };
    };
  };

  public query func getPublicApprovedVendors() : async [VendorApplication] {
    let approved = List.empty<VendorApplication>();
    for ((id, app) in vendorApplications.entries()) {
      if (app.status == #approved) {
        approved.add(app);
      };
    };
    approved.toArray();
  };

  public query func getApprovedVendors() : async [VendorApplication] {
    let approved = List.empty<VendorApplication>();
    for ((id, app) in vendorApplications.entries()) {
      if (app.status == #approved) {
        approved.add(app);
      };
    };
    approved.toArray();
  };

  public query ({ caller }) func getAllVendorApplications() : async [VendorApplication] {
    vendorApplications.values().toArray();
  };

  public query ({ caller }) func getVendorApplication(id : Nat) : async ?VendorApplication {
    vendorApplications.get(id);
  };

  public shared ({ caller }) func reviewVendorApplication(id : Nat, status : ApplicationStatus) : async () {
    switch (vendorApplications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?existing) {
        let updated : VendorApplication = {
          existing with status;
          reviewedAt = ?Time.now();
        };
        vendorApplications.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateVendorApplicationStatus(id : Nat, status : ApplicationStatus) : async () {
    switch (vendorApplications.get(id)) {
      case (null) { Runtime.trap("Vendor application not found") };
      case (?existing) {
        let updated : VendorApplication = {
          existing with status
        };
        vendorApplications.add(id, updated);
      };
    };
  };

  //// Service Listings
  public shared ({ caller }) func addServiceListing(input : ServiceListingInput) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot add service listings");
    };

    // Check if caller is an approved vendor
    var hasApprovedVendor = false;
    for ((id, app) in vendorApplications.entries()) {
      if (Principal.equal(app.principal, caller) and app.status == #approved) {
        hasApprovedVendor := true;
      };
    };

    if (not hasApprovedVendor) {
      Runtime.trap("Unauthorized: Only approved vendors can add service listings");
    };

    let id = serviceListingId;
    let listing : ServiceListing = {
      id;
      vendorPrincipal = caller;
      title = input.title;
      category = input.category;
      description = input.description;
      price = input.price;
      createdAt = Time.now();
    };
    serviceListings.add(id, listing);
    serviceListingId += 1;
    id;
  };

  public shared ({ caller }) func updateServiceListing(id : Nat, input : ServiceListingInput) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot update service listings");
    };

    switch (serviceListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (not Principal.equal(existing.vendorPrincipal, caller)) {
          Runtime.trap("Unauthorized: Can only update your own listings");
        };
        let updated : ServiceListing = {
          existing with title = input.title;
          category = input.category;
          description = input.description;
          price = input.price;
        };
        serviceListings.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteServiceListing(id : Nat) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot delete service listings");
    };

    switch (serviceListings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (not Principal.equal(existing.vendorPrincipal, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own listings");
        };
        serviceListings.remove(id);
      };
    };
  };

  public query ({ caller }) func getMyServiceListings() : async [ServiceListing] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access service listings");
    };

    let myListings = List.empty<ServiceListing>();
    for ((id, listing) in serviceListings.entries()) {
      if (Principal.equal(listing.vendorPrincipal, caller)) {
        myListings.add(listing);
      };
    };
    myListings.toArray();
  };

  public query ({ caller }) func getAllServiceListings() : async [ServiceListing] {
    serviceListings.values().toArray();
  };

  public query ({ caller }) func getBookingsForMyVendor() : async [Booking] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot access vendor bookings");
    };

    // Check if caller is an approved vendor and get their service category
    var serviceCategory : ?Text = null;
    for ((id, app) in vendorApplications.entries()) {
      if (Principal.equal(app.principal, caller) and app.status == #approved) {
        serviceCategory := ?app.serviceCategory;
      };
    };

    switch (serviceCategory) {
      case (null) {
        Runtime.trap("Unauthorized: Only approved vendors can view bookings");
      };
      case (?category) {
        let filtered = List.empty<Booking>();
        for ((id, booking) in bookings.entries()) {
          if (Text.equal(booking.serviceType, category)) {
            filtered.add(booking);
          };
        };
        filtered.toArray();
      };
    };
  };

  //// Image Management
  public shared ({ caller }) func uploadPortfolioImage(input : PortfolioImageInput) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot upload images");
    };
    let id = imageId;
    let metadata : ImageMetadata = {
      id;
      vendorId = input.vendorId;
      vendorPrincipal = input.vendorPrincipal;
      title = input.title;
      description = input.description;
      category = input.category;
      filename = input.filename;
      mimeType = input.mimeType;
      size = input.size;
      uploadDate = Time.now();
      file = input.file;
    };
    portfolioImages.add(id, metadata);
    imageId += 1;
    id;
  };

  public shared ({ caller }) func deletePortfolioImage(id : Nat) : async () {
    switch (portfolioImages.get(id)) {
      case (null) { Runtime.trap("Image not found") };
      case (?existing) {
        if (not (PortfolioImageHelper.isImageOwner(caller, existing))) {
          Runtime.trap("Unauthorized: Can only delete your own images");
        };
        portfolioImages.remove(id);
      };
    };
  };

  ////////////////////////////////////////////////////////
  // STAFF AUTHENTICATION SYSTEM
  ////////////////////////////////////////////////////////
  module PasswordHelper {
    // Improved password hash function with multiplication
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

  public shared ({ caller }) func createStaffAccount(username : Text, password : Text, role : StaffRole) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create staff accounts");
    };

    // Check if username is already taken (case-insensitive)
    switch (findStaffAccountByUsername(username)) {
      case (?_) { Runtime.trap("Username already taken, choose another") };
      case (null) { () };
    };

    let id = staffAccountId;
    let passwordHash = PasswordHelper.hash(password);
    let staffAccount : StaffAccount = {
      id;
      username;
      passwordHash;
      role;
      status = #active;
      createdAt = Time.now();
    };
    staffAccounts.add(id, staffAccount);
    staffAccountId += 1;
    id;
  };

  public shared ({ caller }) func updateStaffAccountRole(id : Nat, role : StaffRole) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update staff roles");
    };

    switch (staffAccounts.get(id)) {
      case (null) { Runtime.trap("Staff account not found") };
      case (?existing) {
        let updated : StaffAccount = { existing with role };
        staffAccounts.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func updateStaffAccountStatus(id : Nat, status : StaffStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update staff account status");
    };

    switch (staffAccounts.get(id)) {
      case (null) { Runtime.trap("Staff account not found") };
      case (?existing) {
        let updated : StaffAccount = {
          existing with status;
        };
        staffAccounts.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteStaffAccount(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete staff accounts");
    };
    if (not staffAccounts.containsKey(id)) {
      Runtime.trap("Staff account not found");
    };
    staffAccounts.remove(id);
  };

  public query ({ caller }) func getAllStaffAccounts() : async [StaffAccount] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view staff accounts");
    };
    staffAccounts.values().toArray();
  };

  public shared ({ caller }) func staffLogin(username : Text, password : Text) : async StaffLoginResult {
    let passwordHash = PasswordHelper.hash(password);
    switch (findStaffAccountByUsername(username)) {
      case (null) {
        #err("Invalid credentials or account inactive");
      };
      case (?account) {
        if (account.passwordHash != passwordHash) {
          #err("Invalid credentials or account inactive");
        } else if (account.status != #active) {
          #err("Account is inactive");
        } else {
          #ok({
            staffId = account.id;
            username = account.username;
            role = account.role;
          });
        };
      };
    };
  };

  public shared ({ caller }) func initDefaultStaffAccount() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can initialize default staff accounts");
    };

    // Check if staff accounts already exist
    if (not staffAccounts.isEmpty()) {
      Runtime.trap("Default staff account cannot be initialized if accounts already exist");
    };

    // Add legacy gatestaff
    let id = staffAccountId;
    let passwordHash = PasswordHelper.hash("Staff@123");
    let staffAccount : StaffAccount = {
      id;
      username = "gatestaff";
      passwordHash;
      role = #gateStaff;
      status = #active;
      createdAt = Time.now();
    };
    staffAccounts.add(id, staffAccount);
    staffAccountId += 1 : Nat;
  };

  // Helper to find staff account by username
  func findStaffAccountByUsername(username : Text) : ?StaffAccount {
    var found : ?StaffAccount = null;
    for ((id, account) in staffAccounts.entries()) {
      if (Text.equal(account.username, username)) {
        found := ?account;
      };
    };
    found;
  };

  ////////////////////////////////////////////////////////
  // Helper Functions
  ////////////////////////////////////////////////////////
  // Image Management Helper Module
  module PortfolioImageHelper {
    public func isImageOwner(caller : Principal, image : ImageMetadata) : Bool {
      switch (image.vendorPrincipal) {
        case (null) { false };
        case (?vendor) { caller.equal(vendor) };
      };
    };
  };
};
