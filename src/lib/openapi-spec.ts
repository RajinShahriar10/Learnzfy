export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Learnzfy API",
    version: "1.0.0",
    description: `RESTful API for the Learnzfy e-learning platform. All endpoints are prefixed with \`/api/v1\`.
    
Base URL: \`https://learnzfy.com/api/v1\`

Authentication is via Bearer token (JWT) or session cookie.`,
    contact: {
      name: "Learnzfy Team",
      email: "support@learnzfy.com",
    },
  },
  servers: [
    { url: "https://learnzfy.com/api/v1", description: "Production" },
    { url: "http://localhost:3000/api/v1", description: "Development" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtained from login",
      },
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description: "Session cookie (automatically set after browser login)",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: { type: "string" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
          totalPages: { type: "integer" },
          hasMore: { type: "boolean" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", nullable: true },
          email: { type: "string" },
          role: { type: "string", enum: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"] },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Course: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          shortDescription: { type: "string", nullable: true },
          thumbnailUrl: { type: "string", nullable: true },
          price: { type: "number" },
          difficulty: { type: "string" },
          duration: { type: "integer", nullable: true },
          isPublished: { type: "boolean" },
          teacher: { $ref: "#/components/schemas/User" },
          category: { type: "object", nullable: true, properties: { id: { type: "string" }, name: { type: "string" }, slug: { type: "string" } } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Certificate: {
        type: "object",
        properties: {
          id: { type: "string" },
          verificationId: { type: "string" },
          studentName: { type: "string" },
          courseName: { type: "string" },
          teacherName: { type: "string" },
          grade: { type: "string", nullable: true },
          certificateUrl: { type: "string" },
          status: { type: "string", enum: ["VALID", "EXPIRED", "REVOKED"] },
          revokedAt: { type: "string", format: "date-time", nullable: true },
          revokedReason: { type: "string", nullable: true },
          expiresAt: { type: "string", format: "date-time", nullable: true },
          issuedAt: { type: "string", format: "date-time" },
        },
      },
      VerificationLog: {
        type: "object",
        properties: {
          id: { type: "string" },
          certificateId: { type: "string" },
          verifiedAt: { type: "string", format: "date-time" },
          ipAddress: { type: "string", nullable: true },
          userAgent: { type: "string", nullable: true },
          verifierName: { type: "string", nullable: true },
          status: { type: "string" },
        },
      },
      Discussion: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          isPinned: { type: "boolean" },
          upvotes: { type: "integer" },
          replyCount: { type: "integer" },
          hasUpvoted: { type: "boolean" },
          user: { $ref: "#/components/schemas/User" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Reward: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          pointsCost: { type: "integer" },
          type: { type: "string", enum: ["COUPON", "DISCOUNT", "PROMO"] },
          value: { type: "string" },
          stock: { type: "integer", nullable: true },
          sponsor: { type: "object", nullable: true, properties: { name: { type: "string" }, logoUrl: { type: "string", nullable: true } } },
        },
      },
      XP: {
        type: "object",
        properties: {
          points: { type: "integer" },
          level: { type: "integer" },
        },
      },
      Enrollment: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          courseId: { type: "string" },
          status: { type: "string", enum: ["ACTIVE", "COMPLETED", "DROPPED"] },
          progress: { type: "number" },
          enrolledAt: { type: "string", format: "date-time" },
          course: { type: "object", properties: { id: { type: "string" }, title: { type: "string" }, slug: { type: "string" }, thumbnailUrl: { type: "string", nullable: true }, difficulty: { type: "string" } } },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          type: { type: "string" },
          isRead: { type: "boolean" },
          link: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Redemption: {
        type: "object",
        properties: {
          id: { type: "string" },
          pointsSpent: { type: "integer" },
          code: { type: "string", nullable: true },
          status: { type: "string" },
          redeemedAt: { type: "string", format: "date-time" },
          reward: { type: "object", properties: { title: { type: "string" }, type: { type: "string" }, value: { type: "string" }, pointsCost: { type: "integer" } } },
        },
      },
      LeaderboardEntry: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          points: { type: "integer" },
          rank: { type: "integer", nullable: true },
          period: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user",
        description: "Returns the authenticated user's profile. Requires a valid session or Bearer token.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "User profile", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/User" } } } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/courses": {
      get: {
        tags: ["Courses"],
        summary: "List published courses",
        description: "Returns paginated list of published courses with optional filters.",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "category", in: "query", schema: { type: "string" }, description: "Category slug" },
          { name: "difficulty", in: "query", schema: { type: "string", enum: ["beginner", "intermediate", "advanced"] } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Search by title" },
        ],
        responses: {
          "200": { description: "Paginated course list", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Course" } }, pagination: { $ref: "#/components/schemas/Pagination" } } } } } },
        },
      },
    },
    "/courses/detail": {
      get: {
        tags: ["Courses"],
        summary: "Get course details",
        parameters: [{ name: "id", in: "query", required: true, schema: { type: "string" }, description: "Course ID" }],
        responses: {
          "200": { description: "Course with modules and lessons" },
          "404": { description: "Course not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/enrollments": {
      get: {
        tags: ["Enrollments"],
        summary: "List my enrollments",
        description: "Returns the authenticated student's course enrollments.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Paginated enrollments with course info", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Enrollment" } }, pagination: { $ref: "#/components/schemas/Pagination" } } } } } },
        },
      },
    },
    "/certificates": {
      get: {
        tags: ["Certificates"],
        summary: "List my certificates",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Paginated certificates", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Certificate" } }, pagination: { $ref: "#/components/schemas/Pagination" } } } } } },
        },
      },
    },
    "/certificates/verify": {
      get: {
        tags: ["Certificates"],
        summary: "Verify a certificate",
        description: "Public endpoint to verify a certificate by its unique verification ID. No authentication required. Returns certificate status (VALID/EXPIRED/REVOKED) and verification history.",
        parameters: [{ name: "verificationId", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Verified certificate details with status and verification history", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object", properties: { certificate: { $ref: "#/components/schemas/Certificate" }, verificationHistory: { type: "array", items: { $ref: "#/components/schemas/VerificationLog" } } } } } } } } },
          "404": { description: "Certificate not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/admin/certificates": {
      get: {
        tags: ["Certificates"],
        summary: "Admin - List/search certificates",
        description: "Admin endpoint to list and search certificates with filter by status.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Search query" },
          { name: "status", in: "query", schema: { type: "string", enum: ["ALL", "VALID", "REVOKED", "EXPIRED"] }, description: "Filter by status" },
        ],
        responses: { "200": { description: "Certificates list" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" } },
      },
    },
    "/admin/certificates/revoke": {
      post: {
        tags: ["Certificates"],
        summary: "Admin - Revoke a certificate",
        description: "Revoke a certificate with a required reason.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["id", "reason"], properties: { id: { type: "string" }, reason: { type: "string" } } } } } },
        responses: { "200": { description: "Certificate revoked" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" } },
      },
    },
    "/admin/certificates/restore": {
      post: {
        tags: ["Certificates"],
        summary: "Admin - Restore a revoked certificate",
        description: "Restore a revoked certificate back to VALID status.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "string" } } } } } },
        responses: { "200": { description: "Certificate restored" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" } },
      },
    },
    "/admin/certificates/logs": {
      get: {
        tags: ["Certificates"],
        summary: "Admin - Get verification logs",
        description: "Get verification history for a certificate.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [{ name: "certificateId", in: "query", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Verification logs" }, "401": { description: "Unauthorized" }, "403": { description: "Forbidden" } },
      },
    },
    "/discussions": {
      get: {
        tags: ["Discussions"],
        summary: "List discussions",
        description: "Returns paginated discussions for a course or lesson. Supports sorting by recent or most upvoted.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "courseId", in: "query", schema: { type: "string" } },
          { name: "lessonId", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["recent", "votes"], default: "recent" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Paginated discussions", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Discussion" } }, pagination: { $ref: "#/components/schemas/Pagination" } } } } } },
        },
      },
    },
    "/discussions/create": {
      post: {
        tags: ["Discussions"],
        summary: "Create a discussion",
        description: "Create a new discussion thread. Requires authentication.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["title", "content"], properties: { title: { type: "string", maxLength: 200 }, content: { type: "string" }, courseId: { type: "string" }, lessonId: { type: "string" } } } } },
        },
        responses: {
          "201": { description: "Discussion created" },
          "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/replies/create": {
      post: {
        tags: ["Discussions"],
        summary: "Create a reply",
        description: "Reply to a discussion thread or to another reply.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["content", "discussionId"], properties: { content: { type: "string" }, discussionId: { type: "string" }, parentId: { type: "string" } } } } },
        },
        responses: {
          "201": { description: "Reply created" },
          "422": { description: "Validation error" },
        },
      },
    },
    "/rewards": {
      get: {
        tags: ["Rewards"],
        summary: "List available rewards",
        description: "Returns all active rewards and the user's current point balance.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Rewards and user points", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object", properties: { rewards: { type: "array", items: { $ref: "#/components/schemas/Reward" } }, userPoints: { type: "integer" } } } } } } } },
        },
      },
    },
    "/rewards/redeem": {
      post: {
        tags: ["Rewards"],
        summary: "Redeem a reward",
        description: "Redeem points for a reward. Points are deducted atomically and a redemption code is generated.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["rewardId"], properties: { rewardId: { type: "string" } } } } },
        },
        responses: {
          "201": { description: "Reward redeemed with code" },
          "400": { description: "Insufficient points or out of stock", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Reward not found" },
        },
      },
    },
    "/rewards/history": {
      get: {
        tags: ["Rewards"],
        summary: "Redemption history",
        description: "Returns the user's reward redemption history.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "List of redemptions", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Redemption" } } } } } } },
        },
      },
    },
    "/leaderboard": {
      get: {
        tags: ["Gamification"],
        summary: "Get leaderboard",
        parameters: [{ name: "period", in: "query", schema: { type: "string", enum: ["daily", "weekly", "monthly", "all_time"], default: "all_time" } }],
        responses: {
          "200": { description: "Leaderboard entries", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/LeaderboardEntry" } } } } } } },
        },
      },
    },
    "/xp": {
      get: {
        tags: ["Gamification"],
        summary: "Get XP and level",
        description: "Returns the authenticated user's current XP points and level.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "XP data", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/XP" } } } } } },
        },
      },
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List notifications",
        description: "Returns paginated notifications for the authenticated user, with unread count.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string" }, description: "Filter by notification type" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Notifications with unread count" },
        },
      },
    },
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Get user profile",
        description: "Returns the authenticated user's profile with bio, avatar, and contact info.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "User profile" },
        },
      },
    },
    "/analytics/student": {
      get: {
        tags: ["Analytics"],
        summary: "Student analytics",
        description: "Returns learning progress, XP growth, course progress, exam scores for the authenticated student.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Student analytics data" },
        },
      },
    },
    "/analytics/teacher": {
      get: {
        tags: ["Analytics"],
        summary: "Teacher analytics",
        description: "Returns course performance, enrollment stats, and completion data for the authenticated teacher.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Teacher analytics data" },
        },
      },
    },
    "/analytics/admin": {
      get: {
        tags: ["Analytics"],
        summary: "Admin analytics",
        description: "Returns platform-wide metrics. ADMIN role required.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Admin analytics data" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/bookmarks": {
      get: {
        tags: ["Bookmarks"],
        summary: "List bookmarks",
        description: "Returns the authenticated user's bookmarked courses and lessons.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string", enum: ["course", "lesson"] } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "List of bookmarks" },
        },
      },
      post: {
        tags: ["Bookmarks"],
        summary: "Toggle bookmark",
        description: "Add or remove a bookmark for a course or lesson. Toggles (removes if exists, creates if not).",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { courseId: { type: "string" }, lessonId: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Bookmark toggled (removed)" },
          "201": { description: "Bookmark created" },
        },
      },
    },
    "/bookmarks/check": {
      get: {
        tags: ["Bookmarks"],
        summary: "Check bookmark status",
        description: "Check if a specific course or lesson is bookmarked.",
        parameters: [
          { name: "courseId", in: "query", schema: { type: "string" } },
          { name: "lessonId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Bookmark status", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object", properties: { bookmarked: { type: "boolean" } } } } } } } },
        },
      },
    },
    "/reviews/create": {
      post: {
        tags: ["Reviews"],
        summary: "Create a course review",
        description: "Submit a course review. Requires enrollment with >=30% progress.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["courseId", "rating"], properties: { courseId: { type: "string" }, rating: { type: "integer", minimum: 1, maximum: 5 }, comment: { type: "string", maxLength: 2000 } } } } },
        },
        responses: {
          "201": { description: "Review created" },
          "403": { description: "Not enrolled or insufficient progress" },
          "422": { description: "Already reviewed or validation error" },
        },
      },
    },
    "/streak": {
      get: {
        tags: ["Streaks"],
        summary: "Get streak data",
        description: "Returns the authenticated user's streak data, activity calendar, milestones, and XP multiplier.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Streak data with milestones and activity" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/streak/log": {
      post: {
        tags: ["Streaks"],
        summary: "Log activity",
        description: "Records a learning activity and awards XP with streak multiplier.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["type"], properties: { type: { type: "string", enum: ["LESSON_WATCHED", "QUIZ_PASSED", "EXAM_TAKEN", "COURSE_COMPLETED"] }, courseId: { type: "string" }, lessonId: { type: "string" } } } } },
        },
        responses: {
          "201": { description: "Activity logged with XP earned" },
          "422": { description: "Invalid activity type" },
        },
      },
    },
    "/streak/config": {
      get: {
        tags: ["Streaks"],
        summary: "Get streak config",
        description: "Returns the streak XP multiplier and milestone configuration. ADMIN only.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Streak configuration" },
          "403": { description: "Forbidden" },
        },
      },
      put: {
        tags: ["Streaks"],
        summary: "Update streak config",
        description: "Updates streak XP multipliers and milestone rewards. ADMIN only.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object", additionalProperties: { type: "number" } } } },
        },
        responses: {
          "200": { description: "Configuration updated" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/streak/stats": {
      get: {
        tags: ["Streaks"],
        summary: "Get streak stats",
        description: "Returns platform-wide streak statistics. ADMIN only.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Streak statistics" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/reviews/course": {
      get: {
        tags: ["Reviews"],
        summary: "List course reviews",
        description: "Returns paginated reviews for a course with rating summary and breakdown.",
        parameters: [
          { name: "courseId", in: "query", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["recent", "highest", "lowest"] } },
        ],
        responses: {
          "200": { description: "Reviews with rating stats" },
        },
      },
    },
    "/teacher-reviews/create": {
      post: {
        tags: ["Reviews"],
        summary: "Create a teacher review",
        description: "Submit a review for a teacher.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["teacherId", "rating"], properties: { teacherId: { type: "string" }, courseId: { type: "string" }, rating: { type: "integer", minimum: 1, maximum: 5 }, comment: { type: "string", maxLength: 2000 } } } } },
        },
        responses: {
          "201": { description: "Teacher review created" },
          "422": { description: "Already reviewed or validation error" },
        },
      },
    },
    "/teacher-reviews/teacher": {
      get: {
        tags: ["Reviews"],
        summary: "List teacher reviews",
        description: "Returns paginated reviews for a teacher with rating summary and breakdown.",
        parameters: [
          { name: "teacherId", in: "query", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["recent", "highest", "lowest"] } },
        ],
        responses: {
          "200": { description: "Teacher reviews with rating stats" },
        },
      },
    },
    "/search": {
      get: {
        tags: ["Search"],
        summary: "Universal search",
        description: "Search across courses, teachers, lessons, categories, and certificates with filters and sorting.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query (min 2 chars)" },
          { name: "type", in: "query", schema: { type: "string", enum: ["courses", "teachers", "lessons", "categories", "certificates"] }, description: "Filter by entity type" },
          { name: "difficulty", in: "query", schema: { type: "string", enum: ["beginner", "intermediate", "advanced"] } },
          { name: "category", in: "query", schema: { type: "string" }, description: "Category ID" },
          { name: "sort", in: "query", schema: { type: "string", enum: ["relevance", "popular", "rating", "newest", "enrolled"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          "200": { description: "Search results with facets" },
          "422": { description: "Query too short" },
        },
      },
    },
    "/search/suggestions": {
      get: {
        tags: ["Search"],
        summary: "Autocomplete suggestions",
        description: "Returns autocomplete suggestions for courses, teachers, and categories based on the query prefix.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Query prefix (min 2 chars)" },
        ],
        responses: {
          "200": { description: "Suggestions array" },
        },
      },
    },
    "/search/popular": {
      get: {
        tags: ["Search"],
        summary: "Popular searches",
        description: "Returns the most popular search queries across the platform.",
        responses: {
          "200": { description: "Popular searches" },
        },
      },
    },
    "/search/recent": {
      get: {
        tags: ["Search"],
        summary: "Recent searches",
        description: "Returns the authenticated user's recent search history.",
        security: [{ bearerAuth: [], sessionAuth: [] }],
        responses: {
          "200": { description: "Recent searches" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/search/log": {
      post: {
        tags: ["Search"],
        summary: "Log a search",
        description: "Records a search query for popularity and history tracking.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["query"], properties: { query: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Search logged" },
        },
      },
    },
  },
  tags: [
    { name: "Authentication", description: "User authentication and profile" },
    { name: "Bookmarks", description: "Course and lesson bookmarking" },
    { name: "Courses", description: "Course browsing and details" },
    { name: "Enrollments", description: "Student course enrollments" },
    { name: "Certificates", description: "Certificate management and verification" },
    { name: "Discussions", description: "Community discussions and replies" },
    { name: "Reviews", description: "Course and teacher reviews" },
    { name: "Rewards", description: "Reward catalog and redemption" },
    { name: "Gamification", description: "XP, levels, and leaderboard" },
    { name: "Notifications", description: "User notifications" },
    { name: "Profile", description: "User profile management" },
    { name: "Analytics", description: "Role-specific analytics" },
    { name: "Streaks", description: "Learning streak tracking and milestones" },
    { name: "Search", description: "Universal search and autocomplete" },
  ],
}
