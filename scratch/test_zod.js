
const { z } = require("zod");
const schema = z.object({
  body: z.object({
    category_id: z.string().uuid("Invalid category ID"),
    title: z.string(),
  })
});

async function test() {
  try {
    await schema.parseAsync({
      body: {
        categoryId: "20361ed2-ab58-427a-ad12-a8ace962b09f",
        title: "Offer 1"
      }
    });
  } catch (error) {
    console.log("instanceof ZodError:", error instanceof z.ZodError);
    console.log(error);
  }
}
test();

