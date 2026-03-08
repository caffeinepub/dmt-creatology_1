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
export interface RoomType {
    pricePerNight: bigint;
    name: string;
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
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createHotel(name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<bigint>;
    createHotelBooking(hotelId: bigint, hotelName: string, roomType: string, pricePerNight: bigint, guestName: string, guestPhone: string, guestEmail: string, checkInDate: bigint, checkOutDate: bigint, numberOfNights: bigint, totalAmount: bigint): Promise<bigint>;
    createPaymentTransaction(transactionId: string, paymentMethod: string, amount: bigint, bookingId: bigint, status: TransactionStatus): Promise<bigint>;
    createTransportBooking(transportId: bigint, transportName: string, transportType: string, operatorName: string, route: string, passengerName: string, passengerPhone: string, passengerEmail: string, city: string, travelDate: bigint, seats: bigint, totalAmount: bigint): Promise<bigint>;
    createTransportOption(transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<bigint>;
    deleteHotel(id: bigint): Promise<void>;
    deleteTransportOption(id: bigint): Promise<void>;
    getAllHotelBookings(): Promise<Array<HotelBooking>>;
    getAllHotels(): Promise<Array<Hotel>>;
    getAllPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getAllTransportBookings(): Promise<Array<TransportBooking>>;
    getAllTransportOptions(): Promise<Array<TransportOption>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHotel(id: bigint): Promise<Hotel | null>;
    getHotelBooking(id: bigint): Promise<HotelBooking | null>;
    getPaymentTransactionByBookingId(bookingId: bigint): Promise<PaymentTransaction | null>;
    getTransportBooking(id: bigint): Promise<TransportBooking | null>;
    getTransportOption(id: bigint): Promise<TransportOption | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateHotel(id: bigint, name: string, city: string, address: string, description: string, roomTypes: Array<RoomType>, amenities: Array<string>, photoUrls: Array<string>): Promise<void>;
    updateHotelBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateHotelBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateTransportBookingPaymentStatus(id: bigint, paymentStatus: TransactionStatus): Promise<void>;
    updateTransportBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateTransportOption(id: bigint, transportType: TransportType, operatorName: string, route: string, city: string, price: bigint, availableSeats: bigint, photoUrls: Array<string>): Promise<void>;
}
