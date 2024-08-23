import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Asegúrate de que la ruta sea correcta

class UploadRating {
  constructor(postId, userId) {
    this.postId = postId;
    this.userId = userId;
    this.ratingsRef = collection(db, "posts", this.postId, "ratings");
  }

  async addRating(rating) {
    try {
      await addDoc(this.ratingsRef, {
        userId: this.userId,
        rating: rating,
        createdAt: new Date(),
      });
      console.log("Rating successfully uploaded!");
    } catch (error) {
      console.error("Error uploading rating: ", error);
    }
  }
}

export default UploadRating;
