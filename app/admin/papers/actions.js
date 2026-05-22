'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function jsonOrNull(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

export async function createPastPaperQuestion(formData) {
  const supabase = await createClient();

  const subject_id = formData.get("subject_id");
  const topic_id   = formData.get("topic_id") || null;
  const paper_year = parseInt(formData.get("paper_year"), 10);
  const paper_no   = String(formData.get("paper_no") || "").trim();
  const q_number   = String(formData.get("q_number") || "").trim();
  const marks      = parseInt(formData.get("marks") || "1", 10);
  const tier       = formData.get("tier") || "free";
  const type       = formData.get("type") || "mcq";
  const prompt     = String(formData.get("prompt") || "").trim();
  const memo       = String(formData.get("memo") || "").trim() || null;
  const explanation= String(formData.get("explanation") || "").trim() || null;
  const rubric     = String(formData.get("rubric") || "").trim() || null;
  const is_published = formData.get("is_published") === "on";

  let options = null;
  let correct = null;
  let tolerance = null;
  let unit = null;
  let case_sensitive = false;

  if (type === "mcq") {
    // Read options[] textarea, one option per line in form "id|text"
    const raw = String(formData.get("options_raw") || "").trim();
    options = raw.split("\n").filter(Boolean).map((line) => {
      const [id, ...rest] = line.split("|");
      return { id: id.trim(), text: rest.join("|").trim() };
    });
    correct = formData.get("correct_id") || null;
  } else if (type === "true_false") {
    correct = formData.get("correct_tf") === "true";
  } else if (type === "numeric") {
    correct = parseFloat(formData.get("correct_num"));
    tolerance = parseFloat(formData.get("tolerance")) || null;
    unit = String(formData.get("unit") || "").trim() || null;
  } else if (type === "fill_in") {
    const raw = String(formData.get("accepted_raw") || "").trim();
    correct = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    case_sensitive = formData.get("case_sensitive") === "on";
  }
  // free_text: correct stays null; rubric used by AI marker

  const row = {
    subject_id, topic_id, paper_year, paper_no, q_number, marks, tier,
    type, prompt, options, correct, memo, explanation, rubric,
    case_sensitive, tolerance, unit, is_published,
  };

  const { data, error } = await supabase
    .from("past_paper_questions")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/papers");
  // Stay on the new-question page with the same paper pre-filled so the admin
  // can add the next Q quickly. Append ?added=1 to flash a confirmation.
  const params = new URLSearchParams({
    subject: subject_id,
    year: String(paper_year),
    no: paper_no,
    added: "1",
  });
  redirect(`/admin/papers/new?${params.toString()}`);
}
