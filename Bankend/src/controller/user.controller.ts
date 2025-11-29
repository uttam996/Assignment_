import { like, or } from "drizzle-orm";
import db from "../db";
import { UserSchema } from "../db/schema";

export const GetListUser = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = page || 1;
    limit = limit || 10;
    search = search || "";
    const user = await db
      .select()
      .from(UserSchema)
      .where(
        or(
          like(UserSchema.name, `%${search}%`),
          like(UserSchema.email, `%${search}%`)
        )
      )
      .limit(Number(limit) || 10)
      .offset((Number(page) - 1) * Number(limit) || 0);

    return res.status(200).json({ message: "User list", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
