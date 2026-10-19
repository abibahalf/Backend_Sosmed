import * as z from "zod"; 
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerSchema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().email(),
    fullname: z.string().min(2).max(100),
    password: z.string().min(6).max(100)
});

export const registerUser = async (req, res) => {
    const { username, email, fullname, password } = req.body;


    try {
        // Validation 
        const userSchema = z.object({
            fullname: z.string().min(6, "Fullname minimal 6 karakter").max(100),
            username: z.string().min(6, "Username minimal 6 karakter").max(100),
            email: z.string().email("email harus berformat email example@gmail.com"),
            password: z.string().min(8, "Password minimal 8 karakter").max(100)

        })

        const validateed = userSchema.parse(req.body)

        //check apakah email dan username sudah terdaftar di database
        const emailExiting =  await prisma.user.findUnique({
            where: {
                email: validateed.email
            }
        })

        if(emailExiting){
            return res.status(400).json({
                message: 'Email Sudah Terdaftarsilakkan gunakan eamail lain'
            });
        }

        const usernameExiting =  await prisma.user.findUnique({
            where: {
                username: validateed.username
            }
        })

        if(usernameExiting){
            return res.status(400).json({
                message: 'Username Sudah Terdaftar silakkan gunakan username lain'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(validateed.password, salt);

        const newUser = await prisma.user.create({
            data: {
                username: validateed.username,
                email: validateed.email,
                fullname: validateed.fullname,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        return res.status(201).json({
            message: 'User registered successfully!',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fullname: newUser.fullname,
                image: newUser.image,
                bio: newUser.bio,
            },
            token: token
        });

    } catch (error) {
        if ( error instanceof Error && 'issues' in error) {
            //error dari zod
            const zodError = error;
            const errorMessages = zodError.issues.map(issue => issue.message);
            return res.status(400).json({ errors: errorMessages });
        }

        //error dari express
        console.log(error);
        res.status(500).json({message: 'Server Down'});
    }

  res.json({ 
    message: 'User registered successfully!' ,
    data: {
        username,
        email,
        fullname,
        password
    }
  });
}

export const loginUser = async (req, res) => {
    try {
        //validation eamail sama password
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email dan Password harus diisi'});
        }

        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!existingEmail){
            return res.status(400).json({message: 'Email belum terdaftar silahkan register terlebih dahulu'});
        }


        //bandingakn password req body dengan password database bcrypt

        const existingPassword = await bcrypt.compare(password, existingEmail.password);

        if(!existingPassword){
            return res.status(400).json({message: 'Password salah'});
        }
    
        // buat jwt simpan id user ke jwt

        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign({ id: existingEmail.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

    
        //res success

        res.status(200).json({
            message: 'Login berhasil',
            data: {
                id: existingEmail.id,
                username: existingEmail.username,
                email: existingEmail.email,
                fullname: existingEmail.fullname,
                image: existingEmail.image,
                bio: existingEmail.bio,
                
            },
            token: token
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server Down'});
    }
}

export const GetUser  = async (req, res) => {
    res.status(200).json({
        message : "Berhasil get User",
        data: req.user
    })
}

