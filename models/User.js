const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "User already exists"],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Updated regex for email validation
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please provide a password"],
        select: false
    },
    ingredients: {
        type: [String]  // Array of strings for ingredients
    },
    favori: {
        type: [String]  // Array of strings for ingredients
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Şifreyi hash'leme işlemi (bcrypt ile)
UserSchema.pre("save", async function (next) {
    // Eğer şifre değişmişse (ya da yeni bir kullanıcı kaydediliyorsa)
    if (this.isModified("password") || this.isNew) {
        // 10 seviyesinde bir "salt" (karıştırıcı) oluşturuyoruz
        const salt = await bcrypt.genSalt(10);

        // Şifreyi hash'liyoruz
        this.password = await bcrypt.hash(this.password, salt);
    }
    next(); // Ardından kaydetmeye devam et
});

// Şifre doğrulama metodu (login için kullanacağız)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Kullanıcıyı model olarak tanımlıyoruz
const User = mongoose.model("User", UserSchema);

module.exports = User;
