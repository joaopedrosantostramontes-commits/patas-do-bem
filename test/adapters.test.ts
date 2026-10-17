import test from "node:test";
import assert from "node:assert/strict";
import { centsToBrl, brlToCents, formatCentsToCurrency, mapDatabaseCampaignToUi } from "../src/lib/adapters";

test("centsToBrl converts integer cents to BRL float with 2 decimal places", () => {
  assert.equal(centsToBrl(320000), 3200);
  assert.equal(centsToBrl(185050), 1850.5);
  assert.equal(centsToBrl(0), 0);
  assert.equal(centsToBrl(BigInt(5000)), 50);
});

test("brlToCents converts float BRL to integer cents without floating point errors", () => {
  assert.equal(brlToCents(3200), 320000);
  assert.equal(brlToCents(19.99), 1999);
  assert.equal(brlToCents(0.05), 5);
});

test("formatCentsToCurrency formats accurately to Brazilian Real string", () => {
  const formatted = formatCentsToCurrency(245000);
  // Deve conter R$ e 2.450
  assert.match(formatted, /R\$\s?2\.450/);
});

test("mapDatabaseCampaignToUi maps database rows to UI ViewModel properly", () => {
  const dbCampaign = {
    id: "camp-uuid-1",
    organization_id: "org-uuid-1",
    animal_id: "animal-uuid-1",
    title: "Cirurgia do Pipoca",
    slug: "cirurgia-do-pipoca",
    category: "surgery" as const,
    category_label: "Cirurgia Ortopédica",
    summary: "Resumo do Pipoca",
    story: "História completa do Pipoca",
    target_amount_cents: 320000,
    raised_amount_cents: 245000,
    supporters_count: 42,
    urgency: "high" as const,
    status: "active" as const,
    image_url: "https://example.com/pipoca.jpg",
    approved_by: null,
    approved_at: null,
    created_at: "2026-10-10T12:00:00Z",
    updated_at: "2026-10-10T12:00:00Z",
  };

  const dbOrg = {
    name: "Dona Clara Resgates",
    type: "independent" as const,
    city: "Curitiba",
    state: "PR",
  };

  const dbAnimal = {
    name: "Pipoca",
    species: "dog" as const,
    breed: "Sem Raça Definida",
    approximate_age: "2 anos",
  };

  const uiCampaign = mapDatabaseCampaignToUi(dbCampaign, dbOrg, dbAnimal);

  assert.equal(uiCampaign.id, "camp-uuid-1");
  assert.equal(uiCampaign.animalName, "Pipoca");
  assert.equal(uiCampaign.targetAmount, 3200);
  assert.equal(uiCampaign.raisedAmount, 2450);
  assert.equal(uiCampaign.location, "Curitiba, PR");
  assert.equal(uiCampaign.rescuerName, "Dona Clara Resgates");
});
