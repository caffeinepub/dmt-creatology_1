import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface Analytics {
    totalEvents: bigint;
    totalBookings: bigint;
    totalListings: bigint;
    totalUsers: bigint;
    recentBookings: Array<Booking>;
    totalVendors: bigint;
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
export enum ListingStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Status {
    cancelled = "cancelled",
    published = "published",
    draft = "draft"
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
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createBookingRequest(name: string, phone: string, serviceType: string, city: string, date: bigint, message: string): Promise<bigint>;
    createEvent(name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string, status: Status): Promise<bigint>;
    createListing(title: string, category: string, description: string, city: string, price: bigint, contactPhone: string, submittedBy: string): Promise<bigint>;
    createUser(name: string, phone: string, email: string, role: UserRole): Promise<bigint>;
    createVendor(name: string, businessName: string, city: string, services: string, experience: bigint, phone: string, email: string): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllListings(): Promise<Array<Listing>>;
    getAllUsers(): Promise<Array<User>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getAnalytics(): Promise<Analytics>;
    getBooking(id: bigint): Promise<Booking | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getEvent(id: bigint): Promise<Event | null>;
    getListing(id: bigint): Promise<Listing | null>;
    getUser(id: bigint): Promise<User | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendor(id: bigint): Promise<Vendor | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateEvent(id: bigint, name: string, category: string, subCategory: string, venue: string, city: string, state: string, country: string, date: bigint, time: string, duration: string, ageLimit: bigint, description: string, posterUrl: string, bannerUrl: string, status: Status): Promise<void>;
    updateListingStatus(id: bigint, status: ListingStatus): Promise<void>;
    updateUser(id: bigint, name: string, phone: string, email: string, role: UserRole): Promise<void>;
    updateUserStatus(id: bigint, status: UserStatus): Promise<void>;
    updateVendor(id: bigint, name: string, businessName: string, city: string, services: string, experience: bigint, phone: string, email: string): Promise<void>;
    updateVendorStatus(id: bigint, status: VendorStatus): Promise<void>;
}
