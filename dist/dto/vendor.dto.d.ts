export interface createVendorinput {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    state: string;
    lga: string;
    address: string;
    businessName: string;
    password: string;
}
export interface updateVendorinput {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
    businessName: string;
}
export interface vendorLoginInput {
    emailAddress: string;
    password: string;
}
export interface updateVendorProfileInput {
    name: string;
    phoneNumber: string;
    businessName: string;
}
export interface vendorPayload {
    _id: string;
    emailAddress: string;
    password: string;
}
