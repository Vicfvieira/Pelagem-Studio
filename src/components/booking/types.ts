import type { PetSizeCode } from "@/lib/business-rules";

export type WizardPet = {
  id: string;
  name: string;
  species: "CACHORRO" | "GATO";
  breed: string;
  size: PetSizeCode;
};
