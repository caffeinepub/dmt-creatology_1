import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface PortfolioImageInput {
    title?: string;
    file: ExternalBlob;
    size: bigint;
    vendorPrincipal?: Principal;
    mimeType: string;
    description?: string;
    filename: string;
    vendorId?: bigint;
    category: string;
}
export interface StaffAccount {
    id: bigint;
    status: StaffStatus;
    username: string;
    createdAt: bigint;
    role: StaffRole;
    passwordHash: string;
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
export interface TicketCategory {
    id: bigint;
    eventId: bigint;
    availableQty: bigint;
    name: string;
    price: bigint;
}
export interface VendorApplication {
    id: bigint;
    status: ApplicationStatus;
    serviceCategory: string;
    principal: Principal;
    ownerName: string;
    city: string;
    businessName: string;
    submittedAt: bigint;
    description: string;
    reviewedAt?: bigint;
    email: string;
    phone: string;
    portfolioImages: Array<string>;
}
export interface Analytics {
    totalEvents: bigint;
    totalBookings: bigint;
    totalListings: bigint;
    totalUsers: bigint;
    recentBookings: Array<Booking>;
    totalVendors: bigint;
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
export interface Booking {
    id: bigint;
    status: BookingStatus;
    serviceType: string;
    city: string;
    date: bigint;
    name: string;
    createdAt: bigint;
    message: string;
    phone: string;
}
export interface Vendor {
    id: bigint;
    status: VendorStatus;
    city: string;
    name: string;
    createdAt: bigint;
    businessName: string;
    email: string;
    experience: bigint;
    phone: string;
    services: string;
}
export interface Listing {
    id: bigint;
    status: ListingStatus;
    title: string;
    city: string;
    createdAt: bigint;
    submittedBy: string;
    description: string;
    category: string;
    price: bigint;
    contactPhone: string;
}
export interface User {
    id: bigint;
    status: UserStatus;
    name: string;
    createdAt: bigint;
    role: UserRole;
    email: string;
    phone: string;
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
export interface RoomType {
    pricePerNight: bigint;
    name: string;
}
export type StaffLoginResult = {
    __kind__: "ok";
    ok: StaffSession;
} | {
    __kind__: "err";
    err: string;
};
export interface ServiceListingInput {
    title: string;
    description: string;
    category: string;
    price: bigint;
}
export interface EventBooking {
    id: bigint;
    status: BookingStatus;
    eventId: bigint;
    ticketCategory: string;
    city: string;
    name: string;
    createdAt: bigint;
    message: string;
    quantity: bigint;
    phone: string;
    eventName: string;
}
export interface ServiceListing {
    id: bigint;
    title: string;
    createdAt: bigint;
    vendorPrincipal: Principal;
    description: string;
    category: string;
    price: bigint;
}
export interface StaffSession {
    username: string;
    staffId: bigint;
    role: StaffRole;
}
export enum BookingStatus {
    new_ = "new",
    cancelled = "cancelled",
    reviewed = "reviewed",
    confirmed = "confirmed"
}
export enum ListingStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum StaffRole {
    admin = "admin",
    eventManager = "eventManager",
    gateStaff = "gateStaff"
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
export enum UserRole {
    customer = "customer",
    staff = "staff",
    vendor = "vendor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    inactive = "inactive"
}
export enum VendorStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    suspended = "suspended"
}
export interface backendInterface {
    addServiceListing(input: ServiceListingInput): Promise<bigint>;
    addTicketCategory(eventId: bigint, name: string, price: bigint, availableQty: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createBookingRequest(name: string, phone: string, serviceType: string, city: string, date: bigint, message: string): Promise<bigint>;
    createEvent(name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string, status: Status): Promise<bigint>;
    createEventBooking(eventId: bigint, eventName: string, ticketCategory: string, name: string, phone: string, city: string, quantity: bigint, message: string): Promise<bigint>;
    createHotel(name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<bigint>;
    createListing(title: string, category: string, description: string, city: string, price: bigint, contactPhone: string, submittedBy: string): Promise<bigint>;
    createPaymentTransaction(transactionId: string, paymentMethod: string, amount: bigint, bookingId: bigint, status: TransactionStatus): Promise<bigint>;
    createStaffAccount(username: string, password: string, role: StaffRole): Promise<bigint>;
    createUser(name: string, phone: string, email: string, role: UserRole): Promise<bigint>;
    createVendor(name: string, businessName: string, city: string, services: string, experience: bigint, phone: string, email: string): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    deleteHotel(id: bigint): Promise<void>;
    deletePortfolioImage(id: bigint): Promise<void>;
    deleteServiceListing(id: bigint): Promise<void>;
    deleteStaffAccount(id: bigint): Promise<void>;
    deleteTicketCategory(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllEventBookings(): Promise<Array<EventBooking>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllHotels(): Promise<Array<Hotel>>;
    getAllListings(): Promise<Array<Listing>>;
    getAllPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getAllServiceListings(): Promise<Array<ServiceListing>>;
    getAllStaffAccounts(): Promise<Array<StaffAccount>>;
    getAllUsers(): Promise<Array<User>>;
    getAllVendorApplications(): Promise<Array<VendorApplication>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getAnalytics(): Promise<Analytics>;
    getBooking(id: bigint): Promise<Booking | null>;
    getBookingsByCity(city: string): Promise<Array<Booking>>;
    getBookingsByDateRange(start: bigint, end: bigint): Promise<Array<Booking>>;
    getBookingsByServiceType(serviceType: string): Promise<Array<Booking>>;
    getBookingsByStatus(status: BookingStatus): Promise<Array<Booking>>;
    getBookingsForMyVendor(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getConfirmedBookings(): Promise<Array<Booking>>;
    getEvent(id: bigint): Promise<Event | null>;
    getEventBookingsByEvent(eventId: bigint): Promise<Array<EventBooking>>;
    getHotel(id: bigint): Promise<Hotel | null>;
    getListing(id: bigint): Promise<Listing | null>;
    getListingsByCategory(category: string): Promise<Array<Listing>>;
    getListingsByCity(city: string): Promise<Array<Listing>>;
    getMyServiceListings(): Promise<Array<ServiceListing>>;
    getMyVendorApplication(): Promise<VendorApplication | null>;
    getNewBookings(): Promise<Array<Booking>>;
    getPaymentTransactionByBookingId(bookingId: bigint): Promise<PaymentTransaction | null>;
    getPublicApprovedVendors(): Promise<Array<VendorApplication>>;
    getPublicEventsByCategory(category: string): Promise<Array<Event>>;
    getPublicEventsBySubCategory(subCategory: string): Promise<Array<Event>>;
    getPublicListings(): Promise<Array<Listing>>;
    getPublicVendorsByServices(services: string): Promise<Array<Vendor>>;
    getPublishedEvents(): Promise<Array<Event>>;
    getPublishedVendors(): Promise<Array<Vendor>>;
    getTicketCategoriesByEvent(eventId: bigint): Promise<Array<TicketCategory>>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getUser(id: bigint): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsersByRole(role: UserRole): Promise<Array<User>>;
    getVendor(id: bigint): Promise<Vendor | null>;
    getVendorApplication(id: bigint): Promise<VendorApplication | null>;
    getVendorsByCity(city: string): Promise<Array<Vendor>>;
    initDefaultStaffAccount(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    reviewVendorApplication(id: bigint, status: ApplicationStatus): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    staffLogin(username: string, password: string): Promise<StaffLoginResult>;
    submitVendorApplication(businessName: string, ownerName: string, city: string, serviceCategory: string, description: string, phone: string, email: string, portfolioImages: Array<string>): Promise<bigint>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateEvent(id: bigint, name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string, status: Status): Promise<void>;
    updateEventBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateHotel(id: bigint, name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<void>;
    updateListingStatus(id: bigint, status: ListingStatus): Promise<void>;
    updateMyVendorApplication(businessName: string, ownerName: string, city: string, serviceCategory: string, description: string, phone: string, email: string, portfolioImages: Array<string>): Promise<void>;
    updateServiceListing(id: bigint, input: ServiceListingInput): Promise<void>;
    updateStaffAccountRole(id: bigint, role: StaffRole): Promise<void>;
    updateStaffAccountStatus(id: bigint, status: StaffStatus): Promise<void>;
    updateUser(id: bigint, name: string, phone: string, email: string, role: UserRole): Promise<void>;
    updateUserStatus(id: bigint, status: UserStatus): Promise<void>;
    updateVendor(id: bigint, name: string, businessName: string, city: string, services: string, experience: bigint, phone: string, email: string): Promise<void>;
    updateVendorApplicationStatus(id: bigint, status: ApplicationStatus): Promise<void>;
    updateVendorStatus(id: bigint, status: VendorStatus): Promise<void>;
    uploadPortfolioImage(input: PortfolioImageInput): Promise<bigint>;
}
