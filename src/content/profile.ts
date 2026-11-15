import { defineCollection, profileSchema } from "@/lib/schemas";

// TODO(guilherme): headline, bio, cidade, e-mail público e links (GitHub, LinkedIn).
export const profile = defineCollection("profile", profileSchema, {
  name: "Guilherme Martins Bezerra",
});
