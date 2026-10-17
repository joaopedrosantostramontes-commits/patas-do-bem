import { Campaign } from "@/types";
import { Database } from "@/types/database";

type DbCampaign = Database["public"]["Tables"]["campaigns"]["Row"];
type DbOrganization = Database["public"]["Tables"]["organizations"]["Row"];
type DbAnimal = Database["public"]["Tables"]["animals"]["Row"];
type DbCampaignUpdate = Database["public"]["Tables"]["campaign_updates"]["Row"];

/**
 * Converte centavos (inteiro grande do banco) para valor numérico em Reais (BRL).
 * Ex: 320000 centavos -> 3200.00
 */
export function centsToBrl(cents: number | bigint): number {
  const numericCents = typeof cents === "bigint" ? Number(cents) : cents;
  return Number((numericCents / 100).toFixed(2));
}

/**
 * Converte valor em Reais (BRL) para centavos (inteiro).
 * Ex: 3200.50 -> 320050
 */
export function brlToCents(brl: number): number {
  return Math.round(brl * 100);
}

/**
 * Formata um valor diretamente a partir de centavos para moeda brasileira.
 */
export function formatCentsToCurrency(cents: number | bigint): string {
  const brl = centsToBrl(cents);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(brl);
}

/**
 * Adaptador que transforma registros relacionais do Supabase no ViewModel
 * consumido pelos componentes visuais da interface (aprovados na Etapa 1).
 */
export function mapDatabaseCampaignToUi(
  campaign: DbCampaign,
  organization: Pick<DbOrganization, "name" | "type" | "city" | "state">,
  animal: Pick<DbAnimal, "name" | "species" | "breed" | "approximate_age">,
  updates: Pick<DbCampaignUpdate, "created_at" | "description">[] = []
): Campaign {
  return {
    id: campaign.id,
    title: campaign.title,
    animalName: animal.name,
    species: animal.species,
    age: animal.approximate_age ?? "Idade não informada",
    breed: animal.breed ?? "Sem Raça Definida (SRD)",
    location: `${organization.city}, ${organization.state}`,
    rescuerName: organization.name,
    rescuerType: organization.type,
    category: campaign.category,
    categoryLabel: campaign.category_label,
    imageUrl: campaign.image_url,
    summary: campaign.summary,
    story: campaign.story,
    targetAmount: centsToBrl(campaign.target_amount_cents),
    raisedAmount: centsToBrl(campaign.raised_amount_cents),
    supportersCount: campaign.supporters_count,
    urgency: campaign.urgency,
    createdAt: campaign.created_at,
    updates: updates.map((u) => ({
      date: new Intl.DateTimeFormat("pt-BR").format(new Date(u.created_at)),
      description: u.description,
    })),
  };
}
