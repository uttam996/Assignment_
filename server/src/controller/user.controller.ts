import { alias } from "drizzle-orm/pg-core";
import { eq, like, and, or } from "drizzle-orm";
import { UserSchema } from "../db/schema";
import db from "../db";

export const GetListUser = async (req, res) => {
  try {
    let { page, limit, search, role } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    search = search || "";

    const u = UserSchema;
    const m = alias(UserSchema, "manager") as typeof UserSchema;

    const data = await db
      .select({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        manager_id: u.manager_id,
        manager: {
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
        },
      })
      .from(u)
      .leftJoin(m, eq(u.manager_id, m.id))
      .where(
        and(
          role ? eq(u.role, role) : undefined,
          or(
            like(u.name, `%${search}%`),
            like(u.email, `%${search}%`)
          )
        )
      )
      .limit(limit)
      .offset((page - 1) * limit);

    return res.status(200).json({
      message: "User list",
      data,
      total: data.length, // or add total count query
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
