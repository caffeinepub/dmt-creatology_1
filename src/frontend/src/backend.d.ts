import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Venue {
    id: bigint;
    photoUrls: Array<string>;
    city: string;
    name: string;
    createdAt: bigint;
    description: string;
    amenities: Array<string>;
    pricePerDay: bigint;
    capacity: bigint;
}
export interface OrganiserSession {
    username: string;
    name: string;
    organiserId: bigint;
}
export interface JobApplication {
    id: bigint;
    status: JobApplicationStatus;
    city: string;
    createdAt: bigint;
    jobId: bigint;
    fullName: string;
    experience: string;
    jobTitle: string;
    phone: string;
    skills: string;
    availableDates: string;
}
export interface PaymentTransaction {
    id: bigint;
    status: TransactionStatus;
    paymentMethod: string;
    bookingId: bigint;
    timestamp: bigint;
    amount: bigint;
    transactionId: string;
}
export interface FoodBooking {
    id: bigint;
    status: BookingStatus;
    paymentStatus: TransactionStatus;
    bookedBy: Principal;
    guestCount: bigint;
    specialRequests: string;
    createdAt: bigint;
    guestName: string;
    guestEmail: string;
    totalAmount: bigint;
    vendorId: bigint;
    eventLocation: string;
    guestPhone: string;
    vendorName: string;
    eventDate: bigint;
}
export interface VenueBooking {
    id: bigint;
    status: BookingStatus;
    paymentStatus: TransactionStatus;
    bookedBy: Principal;
    venueId: bigint;
    eventDetails: string;
    createdAt: bigint;
    guestName: string;
    guestEmail: string;
    totalAmount: bigint;
    guestPhone: string;
    venueName: string;
    eventDate: bigint;
}
export interface TransportOption {
    id: bigint;
    photoUrls: Array<string>;
    city: string;
    createdAt: bigint;
    operatorName: string;
    availableSeats: bigint;
    transportType: TransportType;
    price: bigint;
    route: string;
}
export interface Hotel {
    id: bigint;
    roomTypes: Array<RoomType>;
    photoUrls: Array<string>;
    city: string;
    name: string;
    createdAt: bigint;
    description: string;
    amenities: Array<string>;
    address: string;
}
export interface TransportBooking {
    id: bigint;
    status: BookingStatus;
    paymentStatus: TransactionStatus;
    bookedBy: Principal;
    transportId: bigint;
    city: string;
    createdAt: bigint;
    operatorName: string;
    passengerName: string;
    seats: bigint;
    passengerEmail: string;
    totalAmount: bigint;
    travelDate: bigint;
    transportName: string;
    transportType: string;
    passengerPhone: string;
    route: string;
}
export interface HotelBooking {
    id: bigint;
    status: BookingStatus;
    paymentStatus: TransactionStatus;
    hotelName: string;
    bookedBy: Principal;
    pricePerNight: bigint;
    createdAt: bigint;
    hotelId: bigint;
    checkInDate: bigint;
    guestName: string;
    guestEmail: string;
    totalAmount: bigint;
    checkOutDate: bigint;
    guestPhone: string;
    numberOfNights: bigint;
    roomType: string;
}
export interface RankingProfile {
    id: bigint;
    totalVotes: bigint;
    city: string;
    name: string;
    createdAt: bigint;
    description: string;
    photoUrl: string;
    linkedVendorId?: bigint;
    category: string;
    adminScore: bigint;
    rating: bigint;
}
export interface Event {
    id: bigint;
    status: Status;
    subCategory: string;
    duration: string;
    country: string;
    venue: string;
    city: string;
    date: bigint;
    name: string;
    createdAt: bigint;
    time: string;
    description: string;
    state: string;
    posterUrl: string;
    category: string;
    bannerUrl: string;
    ageLimit: bigint;
}
export interface VoteRecord {
    id: bigint;
    profileId: bigint;
    votedAt: bigint;
    voterIdentifier: string;
}
export interface Organiser {
    id: bigint;
    status: OrganiserStatus;
    username: string;
    name: string;
    createdAt: bigint;
    email: string;
    passwordHash: string;
}
export interface RoomType {
    pricePerNight: bigint;
    name: string;
}
export interface JobListing {
    id: bigint;
    title: string;
    dailyWage: bigint;
    city: string;
    createdAt: bigint;
    description: string;
    eventCompanyName: string;
    isActive: boolean;
    category: string;
    requiredStaffCount: bigint;
    workDate: bigint;
}
export interface CateringVendor {
    id: bigint;
    photoUrls: Array<string>;
    city: string;
    name: string;
    createdAt: bigint;
    cuisineType: string;
    description: string;
    pricePerPlate: bigint;
    minimumGuests: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BookingStatus {
    new_ = "new",
    cancelled = "cancelled",
    reviewed = "reviewed",
    confirmed = "confirmed"
}
export enum JobApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OrganiserStatus {
    active = "active",
    inactive = "inactive"
}
export enum Status {
    cancelled = "cancelled",
    published = "published",
    draft = "draft"
}
export enum TransactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum TransportType {
    bus = "bus",
    car = "car",
    train = "train",
    flight = "flight",
    helicopter = "helicopter",
    cruise = "cruise"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adjustAdminScore(profileId: bigint, score: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCateringVendor(name: string, city: string, cuisineType: string, pricePerPlate: bigint, minimumGuests: bigint, photoUrls: Array<string>, description: string): Promise<bigint>;
    createEventAsOrganiser(organiserId: bigint, name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string): Promise<bigint>;
    createFoodBooking(vendorId: bigint, vendorName: string, guestName: string, guestPhone: string, guestEmail: string, eventDate: bigint, guestCount: bigint, totalAmount: bigint, eventLocation: string, specialRequests: string): Promise<bigint>;
    createHotel(name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<bigint>;
    createHotelBooking(hotelId: bigint, hotelName: string, roomType: string, pricePerNight: bigint, guestName: string, guestPhone: string, guestEmail: string, checkInDate: bigint, checkOutDate: bigint, numberOfNights: bigint, totalAmount: bigint): Promise<bigint>;
    createJobApplication(jobId: bigint, jobTitle: string, fullName: string, phone: string, city: string, skills: string, experience: string, availableDates: string): Promise<bigint>;
    createJobListing(title: string, category: string, city: string, eventCompanyName: string, workDate: bigint, dailyWage: bigint, requiredStaffCount: bigint, description: string): Promise<bigint>;
    createOrganiser(username: string, password: string, name: string, email: string): Promise<bigint>;
    createPaymentTransaction(transactionId: string, paymentMethod: string, amount: bigint, bookingId: bigint, status: TransactionStatus): Promise<bigint>;
    createRankingProfile(name: string, city: string, category: string, photoUrl: string, description: string, rating: bigint, adminScore: bigint, linkedVendorId: bigint | null): Promise<bigint>;
    createTransportBooking(transportId: bigint, transportName: string, transportType: string, operatorName: string, route: string, passengerName: string, passengerPhone: string, passengerEmail: string, city: string, travelDate: bigint, seats: bigint, totalAmount: bigint): Promise<bigint>;
    createTransportOption(transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<bigint>;
    createVenue(name: string, city: string, capacity: bigint, pricePerDay: bigint, photoUrls: Array<string>, amenities: Array<string>, description: string): Promise<bigint>;
    createVenueBooking(venueId: bigint, venueName: string, eventDate: bigint, eventDetails: string, guestName: string, guestPhone: string, guestEmail: string, totalAmount: bigint): Promise<bigint>;
    deleteCateringVendor(id: bigint): Promise<void>;
    deleteHotel(id: bigint): Promise<void>;
    deleteJobListing(id: bigint): Promise<void>;
    deleteOrganiser(id: bigint): Promise<void>;
    deleteRankingProfile(id: bigint): Promise<void>;
    deleteTransportOption(id: bigint): Promise<void>;
    deleteVenue(id: bigint): Promise<void>;
    getActiveJobListings(): Promise<Array<JobListing>>;
    getActiveOrganiser(organiserId: bigint): Promise<Organiser | null>;
    getAllCateringVendors(): Promise<Array<CateringVendor>>;
    getAllFoodBookings(): Promise<Array<FoodBooking>>;
    getAllHotelBookings(): Promise<Array<HotelBooking>>;
    getAllHotels(): Promise<Array<Hotel>>;
    getAllJobApplications(): Promise<Array<JobApplication>>;
    getAllJobListings(): Promise<Array<JobListing>>;
    getAllOrganisers(): Promise<Array<Organiser>>;
    getAllPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getAllRankingProfiles(): Promise<Array<RankingProfile>>;
    getAllTransportBookings(): Promise<Array<TransportBooking>>;
    getAllTransportOptions(): Promise<Array<TransportOption>>;
    getAllVenueBookings(): Promise<Array<VenueBooking>>;
    getAllVenues(): Promise<Array<Venue>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCateringVendor(id: bigint): Promise<CateringVendor | null>;
    getEventsByOrganiser(organiserId: bigint): Promise<Array<Event>>;
    getFoodBooking(id: bigint): Promise<FoodBooking | null>;
    getHotel(id: bigint): Promise<Hotel | null>;
    getHotelBooking(id: bigint): Promise<HotelBooking | null>;
    getOrganiserForEvent(eventId: bigint): Promise<bigint | null>;
    getPaymentTransactionByBookingId(bookingId: bigint): Promise<PaymentTransaction | null>;
    getRankingProfilesByCategory(category: string): Promise<Array<RankingProfile>>;
    getTransportBooking(id: bigint): Promise<TransportBooking | null>;
    getTransportOption(id: bigint): Promise<TransportOption | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVenue(id: bigint): Promise<Venue | null>;
    getVenueBooking(id: bigint): Promise<VenueBooking | null>;
    getVoteRecordsForProfile(profileId: bigint): Promise<Array<VoteRecord>>;
    isCallerAdmin(): Promise<boolean>;
    linkVendorToProfile(profileId: bigint, vendorId: bigint | null): Promise<void>;
    organiserLogin(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: OrganiserSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    publishEventAsOrganiser(organiserId: bigint, eventId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCateringVendor(id: bigint, name: string, city: string, cuisineType: string, pricePerPlate: bigint, minimumGuests: bigint, photoUrls: Array<string>, description: string): Promise<void>;
    updateEventAsOrganiser(organiserId: bigint, eventId: bigint, name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string): Promise<void>;
    updateFoodBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateFoodBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateHotel(id: bigint, name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<void>;
    updateHotelBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateHotelBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateJobApplicationStatus(id: bigint, status: JobApplicationStatus): Promise<void>;
    updateJobListing(id: bigint, title: string, category: string, city: string, eventCompanyName: string, workDate: bigint, dailyWage: bigint, requiredStaffCount: bigint, description: string, isActive: boolean): Promise<void>;
    updateOrganiser(id: bigint, name: string, email: string, status: OrganiserStatus): Promise<void>;
    updateRankingProfile(id: bigint, name: string, city: string, category: string, photoUrl: string, description: string, rating: bigint, adminScore: bigint, linkedVendorId: bigint | null): Promise<void>;
    updateTransportBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateTransportBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateTransportOption(id: bigint, transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<void>;
    updateVenue(id: bigint, name: string, city: string, capacity: bigint, pricePerDay: bigint, photoUrls: Array<string>, amenities: Array<string>, description: string): Promise<void>;
    updateVenueBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateVenueBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    voteForProfile(profileId: bigint, voterIdentifier: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
