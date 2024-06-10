import mongoose from "mongoose"

export const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)

    mongoose.connection.on("connected", () => {
      console.log("Connectd to DB.")
    })
  } catch (error) {
    console.error("Failed to connect to DB", error)
  }
}
