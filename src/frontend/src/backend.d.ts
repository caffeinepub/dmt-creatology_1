import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HotelBooking {
    id: bigint;
    status: BookingStatus;
    paymentStatus: TransactionStatus;
    hotelName: string;
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
export interface VoteRecord {
    id: bigint;
    profileId: bigint;
    votedAt: bigint;
    voterIdentifier: string;
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
export interface PaymentTransaction {
    id: bigint;
    status: TransactionStatus;
    paymentMethod: string;
    bookingId: bigint;
    timestamp: bigint;
    amount: bigint;
    transactionId: string;
}
export interface RoomType {
    pricePerNight: bigint;
    name: string;
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
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface JobListing {
    id: bigint;
    title: string;
    category: string;
    city: string;
    eventCompanyName: string;
    workDate: bigint;
    dailyWage: bigint;
    requiredStaffCount: bigint;
    description: string;
    isActive: boolean;
    createdAt: bigint;
}
export interface JobApplication {
    id: bigint;
    jobId: bigint;
    jobTitle: string;
    fullName: string;
    phone: string;
    city: string;
    skills: string;
    experience: string;
    availableDates: string;
    status: JobApplicationStatus;
    createdAt: bigint;
}
export enum BookingStatus {
    new_ = "new",
    cancelled = "cancelled",
    reviewed = "reviewed",
    confirmed = "confirmed"
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
export enum JobApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    adjustAdminScore(profileId: bigint, score: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createHotel(name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<bigint>;
    createHotelBooking(hotelId: bigint, hotelName: string, roomType: string, pricePerNight: bigint, guestName: string, guestPhone: string, guestEmail: string, checkInDate: bigint, checkOutDate: bigint, numberOfNights: bigint, totalAmount: bigint): Promise<bigint>;
    createPaymentTransaction(transactionId: string, paymentMethod: string, amount: bigint, bookingId: bigint, status: TransactionStatus): Promise<bigint>;
    createRankingProfile(name: string, city: string, category: string, photoUrl: string, description: string, rating: bigint, adminScore: bigint, linkedVendorId: bigint | null): Promise<bigint>;
    createTransportBooking(transportId: bigint, transportName: string, transportType: string, operatorName: string, route: string, passengerName: string, passengerPhone: string, passengerEmail: string, city: string, travelDate: bigint, seats: bigint, totalAmount: bigint): Promise<bigint>;
    createTransportOption(transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<bigint>;
    createJobListing(title: string, category: string, city: string, eventCompanyName: string, workDate: bigint, dailyWage: bigint, requiredStaffCount: bigint, description: string): Promise<bigint>;
    updateJobListing(id: bigint, title: string, category: string, city: string, eventCompanyName: string, workDate: bigint, dailyWage: bigint, requiredStaffCount: bigint, description: string, isActive: boolean): Promise<void>;
    deleteJobListing(id: bigint): Promise<void>;
    getAllJobListings(): Promise<Array<JobListing>>;
    getActiveJobListings(): Promise<Array<JobListing>>;
    createJobApplication(jobId: bigint, jobTitle: string, fullName: string, phone: string, city: string, skills: string, experience: string, availableDates: string): Promise<bigint>;
    getAllJobApplications(): Promise<Array<JobApplication>>;
    updateJobApplicationStatus(id: bigint, status: JobApplicationStatus): Promise<void>;
    deleteHotel(id: bigint): Promise<void>;
    deleteRankingProfile(id: bigint): Promise<void>;
    deleteTransportOption(id: bigint): Promise<void>;
    getAllHotelBookings(): Promise<Array<HotelBooking>>;
    getAllHotels(): Promise<Array<Hotel>>;
    getAllPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getAllRankingProfiles(): Promise<Array<RankingProfile>>;
    getAllTransportBookings(): Promise<Array<TransportBooking>>;
    getAllTransportOptions(): Promise<Array<TransportOption>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHotel(id: bigint): Promise<Hotel | null>;
    getHotelBooking(id: bigint): Promise<HotelBooking | null>;
    getPaymentTransactionByBookingId(bookingId: bigint): Promise<PaymentTransaction | null>;
    getRankingProfilesByCategory(category: string): Promise<Array<RankingProfile>>;
    getTransportBooking(id: bigint): Promise<TransportBooking | null>;
    getTransportOption(id: bigint): Promise<TransportOption | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVoteRecordsForProfile(profileId: bigint): Promise<Array<VoteRecord>>;
    isCallerAdmin(): Promise<boolean>;
    linkVendorToProfile(profileId: bigint, vendorId: bigint | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateHotel(id: bigint, name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<void>;
    updateHotelBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateHotelBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateRankingProfile(id: bigint, name: string, city: string, category: string, photoUrl: string, description: string, rating: bigint, adminScore: bigint, linkedVendorId: bigint | null): Promise<void>;
    updateTransportBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateTransportBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateTransportOption(id: bigint, transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<void>;
    voteForProfile(profileId: bigint, voterIdentifier: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
