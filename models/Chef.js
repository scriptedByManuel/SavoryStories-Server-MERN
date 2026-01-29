const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const chefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

chefSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
});

chefSchema.statics.register = async function (name, email, password) {
  const user = await this.create({
    name,
    email,
    password,
  });
  return user;
};

chefSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  } else {
    return user;
  }
};

const Chef = mongoose.model("Chef", chefSchema);

module.exports = Chef;
