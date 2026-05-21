// Pure grading functions. Each takes (question, response) and returns
//   { isCorrect: boolean, pointsAwarded: number, feedback?: string }
// Used by the server-side submit action so the learner can never tamper
// with their own grade.

export function gradeQuestion(question, response) {
  const points = Number(question.points) || 1;
  switch (question.type) {
    case 'mcq':         return gradeMcq(question, response, points);
    case 'true_false':  return gradeTrueFalse(question, response, points);
    case 'numeric':     return gradeNumeric(question, response, points);
    case 'fill_in':     return gradeFillIn(question, response, points);
    case 'free_text':   return { isCorrect: null, pointsAwarded: 0, feedback: 'Needs AI marking.' };
    default:            return { isCorrect: false, pointsAwarded: 0 };
  }
}

function gradeMcq(q, r, points) {
  // correct is a single option id (string); response is the option id picked
  const isCorrect = r != null && String(r) === String(q.correct);
  return {
    isCorrect,
    pointsAwarded: isCorrect ? points : 0,
    feedback: isCorrect ? null : optionText(q, q.correct),
  };
}

function gradeTrueFalse(q, r, points) {
  const expected = q.correct === true || q.correct === 'true';
  const got = r === true || r === 'true';
  const isCorrect = expected === got;
  return {
    isCorrect,
    pointsAwarded: isCorrect ? points : 0,
    feedback: isCorrect ? null : `Correct answer: ${expected ? 'True' : 'False'}`,
  };
}

function gradeNumeric(q, r, points) {
  const expected = Number(q.correct);
  const got = Number(r);
  if (Number.isNaN(got)) return { isCorrect: false, pointsAwarded: 0, feedback: `Expected ${expected}${q.unit ? ' ' + q.unit : ''}` };
  const tol = Number(q.tolerance) || 0;
  const isCorrect = Math.abs(got - expected) <= tol;
  return {
    isCorrect,
    pointsAwarded: isCorrect ? points : 0,
    feedback: isCorrect ? null : `Expected ${expected}${q.unit ? ' ' + q.unit : ''}${tol ? ` (±${tol})` : ''}`,
  };
}

function gradeFillIn(q, r, points) {
  const accepted = Array.isArray(q.correct) ? q.correct : [];
  const given = (r ?? '').toString().trim();
  if (!given) return { isCorrect: false, pointsAwarded: 0, feedback: `Accepted: ${accepted.join(', ')}` };
  const match = q.case_sensitive
    ? accepted.some((a) => a.trim() === given)
    : accepted.some((a) => a.trim().toLowerCase() === given.toLowerCase());
  return {
    isCorrect: match,
    pointsAwarded: match ? points : 0,
    feedback: match ? null : `Accepted: ${accepted.join(', ')}`,
  };
}

function optionText(q, optionId) {
  const opt = (q.options || []).find((o) => String(o.id) === String(optionId));
  return opt ? `Correct answer: ${opt.text}` : null;
}

export function summarise(responses) {
  let score = 0;
  let max = 0;
  responses.forEach((r) => {
    score += Number(r.pointsAwarded) || 0;
    max += Number(r.points) || 0;
  });
  return {
    score,
    maxScore: max,
    percent: max > 0 ? Math.round((score / max) * 100) : 0,
  };
}
