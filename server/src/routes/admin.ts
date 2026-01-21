import { Router } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import {
  pitches,
  pitchImages,
  pitchWorkingHours,
  blockedSlots,
  bookings,
  users,
  teams,
  teamMembers,
  leagues,
  leagueTeams,
  matches,
  matchResults,
  posts,
} from "../db/schema.js";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";
import { eq, and, count, ne } from "drizzle-orm";
import { validateCity } from "../utils/cities.js";

export const adminRouter = Router();

// All admin routes require authentication and ADMIN role
adminRouter.use(authenticate);
adminRouter.use(requireRole("ADMIN"));

const createPitchSchema = z.object({
  name: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  address: z.string().min(1),
  indoor: z.boolean().default(false),
  description: z.string().optional(),
  pricePerHour: z.number().int().positive(),
  openTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  closeTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  images: z.array(z.string().url()).optional(),
});

const updatePitchSchema = createPitchSchema.partial();

adminRouter.post("/pitches", async (req: AuthRequest, res) => {
  try {
    const data = createPitchSchema.parse(req.body);

    // Validate city
    const cityValidation = validateCity(data.city);
    if (!cityValidation.valid) {
      return res.status(400).json({
        message: cityValidation.error,
        code: "VALIDATION_ERROR",
      });
    }

    const [newPitch] = await db
      .insert(pitches)
      .values({
        name: data.name,
        city: data.city,
        address: data.address,
        indoor: data.indoor,
        description: data.description,
        pricePerHour: data.pricePerHour,
        openTime: data.openTime || "08:00:00",
        closeTime: data.closeTime || "22:00:00",
      })
      .returning();

    // Add images if provided
    if (data.images && data.images.length > 0) {
      await db.insert(pitchImages).values(
        data.images.map((url, index) => ({
          pitchId: newPitch.id,
          url,
          sortOrder: index,
        }))
      );
    }

    // Set default working hours (all days, same as pitch defaults)
    const defaultWorkingHours = Array.from({ length: 7 }, (_, day) => ({
      pitchId: newPitch.id,
      dayOfWeek: day,
      openTime: data.openTime || "08:00:00",
      closeTime: data.closeTime || "22:00:00",
    }));

    await db.insert(pitchWorkingHours).values(defaultWorkingHours);

    const images = await db
      .select()
      .from(pitchImages)
      .where(eq(pitchImages.pitchId, newPitch.id))
      .orderBy(pitchImages.sortOrder);

    res.status(201).json({
      data: {
        ...newPitch,
        images: images.map((img) => img.url),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Create pitch error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

adminRouter.patch("/pitches/:id", async (req: AuthRequest, res) => {
  try {
    const pitchId = req.params.id;
    const data = updatePitchSchema.parse(req.body);

    // Validate city if provided
    if (data.city) {
      const cityValidation = validateCity(data.city);
      if (!cityValidation.valid) {
        return res.status(400).json({
          message: cityValidation.error,
          code: "VALIDATION_ERROR",
        });
      }
    }

    const [existing] = await db
      .select()
      .from(pitches)
      .where(eq(pitches.id, pitchId))
      .limit(1);

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Pitch not found", code: "NOT_FOUND" });
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.city) updateData.city = data.city;
    if (data.address) updateData.address = data.address;
    if (data.indoor !== undefined) updateData.indoor = data.indoor;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.pricePerHour) updateData.pricePerHour = data.pricePerHour;
    if (data.openTime) updateData.openTime = data.openTime;
    if (data.closeTime) updateData.closeTime = data.closeTime;

    const [updated] = await db
      .update(pitches)
      .set(updateData)
      .where(eq(pitches.id, pitchId))
      .returning();

    // Update images if provided
    if (data.images) {
      // Delete existing images
      await db.delete(pitchImages).where(eq(pitchImages.pitchId, pitchId));
      // Insert new images
      if (data.images.length > 0) {
        await db.insert(pitchImages).values(
          data.images.map((url, index) => ({
            pitchId,
            url,
            sortOrder: index,
          }))
        );
      }
    }

    const images = await db
      .select()
      .from(pitchImages)
      .where(eq(pitchImages.pitchId, pitchId))
      .orderBy(pitchImages.sortOrder);

    res.json({
      data: {
        ...updated,
        images: images.map((img) => img.url),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Update pitch error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

adminRouter.patch(
  "/pitches/:id/working-hours",
  async (req: AuthRequest, res) => {
    try {
      const pitchId = req.params.id;
      const schema = z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        openTime: z.string().regex(/^\d{2}:\d{2}$/),
        closeTime: z.string().regex(/^\d{2}:\d{2}$/),
      });
      const data = schema.parse(req.body);

      const [existing] = await db
        .select()
        .from(pitches)
        .where(eq(pitches.id, pitchId))
        .limit(1);

      if (!existing) {
        return res
          .status(404)
          .json({ message: "Pitch not found", code: "NOT_FOUND" });
      }

      // Upsert working hours
      await db
        .insert(pitchWorkingHours)
        .values({
          pitchId,
          dayOfWeek: data.dayOfWeek,
          openTime: data.openTime,
          closeTime: data.closeTime,
        })
        .onConflictDoUpdate({
          target: [pitchWorkingHours.pitchId, pitchWorkingHours.dayOfWeek],
          set: {
            openTime: data.openTime,
            closeTime: data.closeTime,
          },
        });

      const workingHours = await db
        .select()
        .from(pitchWorkingHours)
        .where(eq(pitchWorkingHours.pitchId, pitchId));

      res.json({ data: workingHours });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          code: "VALIDATION_ERROR",
          details: error.errors,
        });
      }
      console.error("Update working hours error:", error);
      res
        .status(500)
        .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
    }
  }
);

adminRouter.post("/pitches/:id/block-slot", async (req: AuthRequest, res) => {
  try {
    const pitchId = req.params.id;
    const schema = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      reason: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const [existing] = await db
      .select()
      .from(pitches)
      .where(eq(pitches.id, pitchId))
      .limit(1);

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Pitch not found", code: "NOT_FOUND" });
    }

    const [blocked] = await db
      .insert(blockedSlots)
      .values({
        pitchId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
      })
      .returning();

    res.status(201).json({ data: blocked });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Block slot error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

adminRouter.delete("/blocked-slots/:id", async (req: AuthRequest, res) => {
  try {
    const slotId = req.params.id;

    const [deleted] = await db
      .delete(blockedSlots)
      .where(eq(blockedSlots.id, slotId))
      .returning();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Blocked slot not found", code: "NOT_FOUND" });
    }

    res.json({ data: deleted });
  } catch (error) {
    console.error("Delete blocked slot error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

adminRouter.get("/bookings", async (req: AuthRequest, res) => {
  try {
    const pitchId = req.query.pitchId as string | undefined;
    const date = req.query.date as string | undefined;

    const conditions = [];
    if (pitchId) {
      conditions.push(eq(bookings.pitchId, pitchId));
    }
    if (date) {
      conditions.push(eq(bookings.date, date));
    }

    const allBookings =
      conditions.length > 0
        ? await db
            .select({
              booking: bookings,
              pitch: pitches,
            })
            .from(bookings)
            .innerJoin(pitches, eq(bookings.pitchId, pitches.id))
            .where(and(...conditions))
            .orderBy(bookings.createdAt)
        : await db
            .select({
              booking: bookings,
              pitch: pitches,
            })
            .from(bookings)
            .innerJoin(pitches, eq(bookings.pitchId, pitches.id))
            .orderBy(bookings.createdAt);

    res.json({
      data: allBookings.map((item) => ({
        ...item.booking,
        pitch: item.pitch,
      })),
    });
  } catch (error) {
    console.error("Get admin bookings error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Get all users (admin only)
adminRouter.get("/users", async (req: AuthRequest, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    res.json({ data: allUsers });
  } catch (error) {
    console.error("Get admin users error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Get admin stats
adminRouter.get("/stats", async (req: AuthRequest, res) => {
  try {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [teamsCount] = await db.select({ count: count() }).from(teams);
    const [leaguesCount] = await db.select({ count: count() }).from(leagues);
    const [pitchesCount] = await db.select({ count: count() }).from(pitches);

    res.json({
      data: {
        users: usersCount?.count || 0,
        teams: teamsCount?.count || 0,
        leagues: leaguesCount?.count || 0,
        pitches: pitchesCount?.count || 0,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Delete team (admin only)
adminRouter.delete("/teams/:id", async (req: AuthRequest, res) => {
  try {
    const teamId = req.params.id;

    // Get team
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) {
      return res
        .status(404)
        .json({ message: "Team not found", code: "NOT_FOUND" });
    }

    // Delete team members first (cascade)
    await db.delete(teamMembers).where(eq(teamMembers.teamId, teamId));

    // Delete team
    await db.delete(teams).where(eq(teams.id, teamId));

    res.json({ data: { message: "Team deleted successfully" } });
  } catch (error) {
    console.error("Delete team error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Update user (admin only)
adminRouter.patch("/users/:id", async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      username: z.string().min(3).max(100).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      role: z.enum(["USER", "ADMIN", "PITCH_OWNER"]).optional(),
      bio: z.string().max(250).optional().nullable(),
      avatar: z.string().url().optional().nullable(),
    });
    const data = updateSchema.parse(req.body);

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existing) {
      return res
        .status(404)
        .json({ message: "User not found", code: "NOT_FOUND" });
    }

    // Check if username is being changed and if it's already taken
    if (data.username && data.username !== existing.username) {
      const [usernameExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.username, data.username), ne(users.id, userId)))
        .limit(1);

      if (usernameExists) {
        return res.status(400).json({
          message: "Username already exists",
          code: "USERNAME_EXISTS",
        });
      }
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== existing.email) {
      const [emailExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, data.email), ne(users.id, userId)))
        .limit(1);

      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists",
          code: "EMAIL_EXISTS",
        });
      }
    }

    // Validate city if provided
    if (data.city !== undefined && data.city && data.city.trim() !== "") {
      const normalizedCity = data.city.trim().toUpperCase();
      const cityValidation = validateCity(normalizedCity);
      if (!cityValidation.valid) {
        return res.status(400).json({
          message: cityValidation.error,
          code: "VALIDATION_ERROR",
        });
      }
      data.city = normalizedCity;
    } else if (
      data.city !== undefined &&
      (!data.city || data.city.trim() === "")
    ) {
      data.city = null;
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.username && { username: data.username }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.role && { role: data.role }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        city: users.city,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
      });

    res.json({ data: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Update user error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Update league (admin only - bypasses owner check)
adminRouter.patch("/leagues/:id", async (req: AuthRequest, res) => {
  try {
    const leagueId = req.params.id;
    const updateSchema = z.object({
      name: z.string().min(1).max(255).optional(),
      city: z.string().optional(),
      season: z.string().optional().nullable(),
      startDate: z.string().optional().nullable(),
      status: z.enum(["DRAFT", "ACTIVE", "COMPLETED"]).optional(),
    });
    const data = updateSchema.parse(req.body);

    // Validate city if provided
    if (data.city) {
      const cityValidation = validateCity(data.city);
      if (!cityValidation.valid) {
        return res.status(400).json({
          message: cityValidation.error,
          code: "VALIDATION_ERROR",
        });
      }
    }

    // Get league
    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, leagueId))
      .limit(1);

    if (!league) {
      return res
        .status(404)
        .json({ message: "League not found", code: "NOT_FOUND" });
    }

    // Update league (admin can update even locked leagues)
    const [updated] = await db
      .update(leagues)
      .set(data)
      .where(eq(leagues.id, leagueId))
      .returning();

    res.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Update league error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Delete league (admin only - cascade delete)
adminRouter.delete("/leagues/:id", async (req: AuthRequest, res) => {
  try {
    const leagueId = req.params.id;

    // Get league
    const [league] = await db
      .select()
      .from(leagues)
      .where(eq(leagues.id, leagueId))
      .limit(1);

    if (!league) {
      return res
        .status(404)
        .json({ message: "League not found", code: "NOT_FOUND" });
    }

    // Admin can delete league regardless of status or dependencies
    // Cascade deletion will handle:
    // - leagueTeams (via foreign key cascade)
    // - matches (via foreign key cascade)
    // - matchResults (via foreign key cascade on matches)

    // Delete league (cascade will handle related records)
    await db.delete(leagues).where(eq(leagues.id, leagueId));

    res.json({ data: { message: "League deleted successfully" } });
  } catch (error) {
    console.error("Delete league error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Delete user (admin only)
adminRouter.delete("/users/:id", async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", code: "NOT_FOUND" });
    }

    // Prevent deleting yourself
    if (user.id === req.userId) {
      return res.status(400).json({
        message: "Cannot delete your own account",
        code: "CANNOT_DELETE_SELF",
      });
    }

    // Admin can delete user - cascade will handle:
    // - teams (via captainId/ownerId cascade)
    // - leagues (via ownerId cascade)
    // - bookings (via userId cascade)
    // - posts (via authorId cascade)
    // - comments (via authorId cascade)
    // - teamMembers (via userId cascade)
    // - matchResults (via recordedBy cascade)

    await db.delete(users).where(eq(users.id, userId));

    res.json({ data: { message: "User deleted successfully" } });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Delete pitch (admin only)
adminRouter.delete("/pitches/:id", async (req: AuthRequest, res) => {
  try {
    const pitchId = req.params.id;

    // Get pitch
    const [pitch] = await db
      .select()
      .from(pitches)
      .where(eq(pitches.id, pitchId))
      .limit(1);

    if (!pitch) {
      return res
        .status(404)
        .json({ message: "Pitch not found", code: "NOT_FOUND" });
    }

    // Admin can delete pitch - cascade will handle:
    // - pitchImages (via foreign key cascade)
    // - pitchWorkingHours (via foreign key cascade)
    // - blockedSlots (via foreign key cascade)
    // - bookings (pitchId will be set to null)
    // - matches (pitchId will be set to null)

    // Delete pitch images first
    await db.delete(pitchImages).where(eq(pitchImages.pitchId, pitchId));

    // Delete working hours
    await db.delete(pitchWorkingHours).where(eq(pitchWorkingHours.pitchId, pitchId));

    // Delete blocked slots
    await db.delete(blockedSlots).where(eq(blockedSlots.pitchId, pitchId));

    // Delete pitch
    await db.delete(pitches).where(eq(pitches.id, pitchId));

    res.json({ data: { message: "Pitch deleted successfully" } });
  } catch (error) {
    console.error("Delete pitch error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Delete post (admin only)
adminRouter.delete("/posts/:id", async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;

    // Get post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", code: "NOT_FOUND" });
    }

    // Admin can delete post - cascade will handle:
    // - comments (via foreign key cascade)
    // - postLikes (via foreign key cascade)

    await db.delete(posts).where(eq(posts.id, postId));

    res.json({ data: { message: "Post deleted successfully" } });
  } catch (error) {
    console.error("Delete post error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});

// Update post (admin only - bypasses author check)
adminRouter.patch("/posts/:id", async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const updateSchema = z.object({
      content: z.string().min(1).max(5000).optional(),
      mediaType: z.enum(["IMAGE", "VIDEO", "NONE"]).optional(),
      mediaUrl: z.string().url().optional().nullable(),
    });
    const data = updateSchema.parse(req.body);

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", code: "POST_NOT_FOUND" });
    }

    // Sanitize content if provided
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.content !== undefined) {
      updateData.content = data.content.trim().replace(/\s+/g, " ");
    }

    if (data.mediaType !== undefined) {
      updateData.mediaType = data.mediaType;
    }

    if (data.mediaUrl !== undefined) {
      updateData.mediaUrl = data.mediaUrl;
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    res.json({ data: updatedPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }
    console.error("Update post error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }
});
