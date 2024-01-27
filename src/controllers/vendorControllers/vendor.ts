import { Request, Response, } from "express";
import { createVendorinput, vendorLoginInput, updateVendorProfileInput, createProductInput } from "../../dto";
import { Vendor, Product } from "../../models";
// import { findVendor } from "../adminControllers/vendor";
import { generateToken, validatePassword, phoneValidaion, passwordComplexity, GenerateSalt, GeneratePassword } from '../../utility';


const findVendor = async (id: string | undefined, businessName: string | undefined, emailAddress: string | undefined, phoneNumber?: string | undefined) => {
    if (phoneNumber) {
        return await Vendor.findOne({ phoneNumber: phoneNumber });
    } else if (emailAddress) {
        return await Vendor.findOne({ emailAddress: emailAddress });
    } else if (businessName) {
        return await Vendor.findOne({ businessName: businessName });
    } else {
        return await Vendor.findOne({ _id: id });
    }
};

export const vendorSignUp = async (req: Request, res: Response) => {
    const { name, emailAddress, phoneNumber, state, lga, address, businessName, password } = <createVendorinput>req.body;

    const existingVendorEmail = await findVendor('', '', emailAddress, '');
    const existingVendorPhone = await findVendor('', '', '', phoneNumber);
    const existingVendorBusinessName = await findVendor('', businessName, '', '');

    if (existingVendorEmail !== null) {
        return res.status(400).json({
            "message": `A vendor with email '${emailAddress}' already exists`
        });
    } else if (existingVendorPhone !== null) {
        return res.status(400).json({
            "message": `A vendor with phone '${phoneNumber}' already exists`
        });
    } else if (existingVendorBusinessName !== null) {
        return res.status(400).json({
            "message": `A vendor with business name '${businessName}' already exists`
        });
    }
    
    
    if (state !== "Lagos" || lga !== "Surulere") {
        return res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        });
    }


    if (name === null){
        return res.status(400).json({
            message: "Input values"
        })
    }

    const isPasswordComplex = passwordComplexity(password);
    let validatedPassword = '';

    if (isPasswordComplex.error) {
        return res.status(400).json({
            message: "Invalid password complexity",
            data: isPasswordComplex.error.details,
        });
    } else {
        validatedPassword = isPasswordComplex.value;
    }

    // Generates salt
    const salt = await GenerateSalt();
    // Hashes password
    const hashedPassword = await GeneratePassword(validatedPassword, salt);

    // Creates Vendor
    const createVendor = await Vendor.create({
        name: name,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        status: "pending",
        state: state,
        lga: lga,
        address: address,
        businessName: businessName,
        password: hashedPassword,
        salt: salt,
        serviceAvaliable: false,
        coverImages: 'test',
        rating: 0,
    });

    return res.status(200).json({
        "message": "Vendor successfully signed up",
        "data": createVendor
    });
};

export const vendorLogin = async (req: Request, res: Response) => {
    const { emailAddress, password } = <vendorLoginInput>req.body;

    const existingVendor = await findVendor('', '', emailAddress, '');

    if (existingVendor !== null) {
        const validateVendorPassword = await validatePassword(password, existingVendor.salt, existingVendor.password);

        if (validateVendorPassword) {
            const accessToken = generateToken({
                _id: existingVendor.id,
                emailAddress: existingVendor.emailAddress,
                password: existingVendor.password,
            });

            return res.status(200).json({
                "message": "Vendor logged in successfully",
                "token": accessToken,
                "data": existingVendor
            });
        } else {
            return res.status(401).json({
                "message": "Invalid login credentials"
            });
        }
    } else {
        return res.status(401).json({
            "message": "Invalid login credentials"
        });
    }
};

export const getVendorProfile = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const existingVendor = await findVendor('', '', user.emailAddress, '');

        if (existingVendor == null) {
            return res.status(404).json({
                "message": "Vendor does not exist"
            });
        } else {
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": existingVendor
            });
        }
    } else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const existingVendor = await findVendor('', '', user.emailAddress, '');
        const { name, phoneNumber, businessName } = <updateVendorProfileInput>req.body;

        const validatedNigerianNumber = phoneValidaion(phoneNumber);

        if (validatedNigerianNumber !== true) {
            return res.status(400).json({
                "message": "The number " + "'" + phoneNumber + "'" + " is not a valid Nigerian number"
            });
        }

        const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: user._id } });
        const existingBusinessName = await Vendor.findOne({ businessName: businessName, _id: { $ne: user._id } });

        if (existingVendor == null) {
            return res.status(404).json({
                "message": "Vendor does not exist"
            });
        } else if (existingVendorPhone !== null) {
            return res.status(400).json({
                "message": "A vendor with phone " + "'" + phoneNumber + "'" + " already exists"
            });
        } else if (existingBusinessName !== null) {
            return res.status(400).json({
                "message": "A vendor with business name " + "'" + businessName + "'" + " already exists"
            });
        } else {
            existingVendor.name = name;
            existingVendor.phoneNumber = phoneNumber;
            existingVendor.businessName = businessName;

            const updatedVendor = await existingVendor.save();

            return res.status(200).json({
                "message": "Profile updated successfully",
                "data": updatedVendor
            });
        }
    } else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};


export const createProduct = async (req: Request, res: Response) => {
    const user = req.user;
  
    if (user) {
      const { name, cylinderSize, refilPrice, purchasePrice, imageUrl, IsEmptyCylinderAvailable } = <createProductInput>req.body;
  
      const existingVendor = await findVendor(user._id, '', '', '');
  
      if (existingVendor != null) {
        const createProduct = await Product.create({
          vendorId: existingVendor._id,
          name,
          status: "unavailable",
          imageUrl,
          cylinderSize,
          refilPrice,
          purchasePrice,
          currency: "NGN",
          IsEmptyCylinderAvailable,
        });
  
        return res.status(200).json({
          "message": "Product created successfully",
          "data": createProduct,
        });
      } else {
        return res.status(404).json({
          "message": "Vendor does not exist",
        });
      }
    } else {
      return res.status(404).json({
        "message": 'User not found',
      });
    }
  };
  