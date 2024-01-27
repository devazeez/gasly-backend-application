export interface createRiderinput {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    state: string;
    lga: string;
    address: string;
    businessName: string;
    password: string;
    imageUrl: string;
}
export interface updateRiderinput {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
    businessName: string;
}
export interface riderLoginInput {
    emailAddress: string;
    password: string;
}
export interface updateRiderProfileInput {
    name: string;
    phoneNumber: string;
    imageUrl: string;
}
export interface riderPayload {
    _id: string;
    emailAddress: string;
    password: string;
}
