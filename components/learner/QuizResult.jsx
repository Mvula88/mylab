import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, MinusCircle } from "lucide-react";

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

export default function QuizResult({ attempt, questions, responses, slugs, activity, nextLessonHref }) {
  const percent = attempt.max_score > 0
    ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
    : 0;
  const passed = !!attempt.passed;
  const responsesById = Object.fromEntries((responses || []).map((r) => [r.question_id, r]));

  return (
    <div>
      {/* SCORE BANNER */}
      <div className="p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
        style={{
          backgroundColor: passed ? 'rgba(46,125,50,0.08)' : 'rgba(194,24,91,0.06)',
          border: '1px solid ' + (passed ? 'rgba(46,125,50,0.4)' : 'rgba(194,24,91,0.4)'),
        }}>
        <div>
          <div className="text-[10px] uppercase mb-1 opacity-70"
            style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Your score</div>
          <div className="text-5xl" style={{ fontFamily: serif, fontWeight: 500 }}>
            {percent}<span className="text-2xl opacity-60">%</span>
          </div>
          <div className="text-[10px] mt-1 opacity-65" style={{ fontFamily: mono }}>
            {attempt.score} / {attempt.max_score} points
          </div>
        </div>
        <div className="text-center">
          {passed ? (
            <>
              <CheckCircle2 size={32} strokeWidth={1.5} style={{ color: '#2e7d32' }} className="mx-auto mb-1" />
              <div className="text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: '0.22em', color: '#2e7d32' }}>
                Passed
              </div>
            </>
          ) : (
            <>
              <XCircle size={32} strokeWidth={1.5} style={{ color: '#c2185b' }} className="mx-auto mb-1" />
              <div className="text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: '0.22em', color: '#c2185b' }}>
                Not yet
              </div>
            </>
          )}
        </div>
        <div className="text-right text-[11px]" style={{ fontFamily: mono }}>
          Pass threshold: {activity.pass_threshold}%<br />
          Submitted {new Date(attempt.submitted_at).toLocaleString()}
        </div>
      </div>

      {/* PER-QUESTION BREAKDOWN */}
      <div className="space-y-6">
        {questions.map((q, i) => {
          const r = responsesById[q.id];
          const status = r?.is_correct === true ? 'correct'
                       : r?.is_correct === false ? 'wrong'
                       : 'pending';
          return (
            <div key={q.id} className="pb-5 border-b border-stone-900/10">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] uppercase"
                  style={{ fontFamily: mono, letterSpacing: '0.22em', color: '#ec407a' }}>
                  Q{i + 1}
                </span>
                <StatusBadge status={status} pointsAwarded={r?.points_awarded} max={q.points} />
              </div>
              <div className="text-base mb-2 leading-snug" style={{ fontFamily: serif, fontWeight: 500 }}>
                {q.prompt}
              </div>
              {r && (
                <YourAnswer question={q} response={r.response} />
              )}
              {r?.feedback && (
                <div className="text-[12px] mt-2 p-2"
                  style={{ fontFamily: mono, backgroundColor: 'rgba(26,31,46,0.05)' }}>
                  {r.feedback}
                </div>
              )}
              {q.explanation && (
                <div className="text-sm mt-3 italic opacity-75" style={{ fontFamily: serif }}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="mt-10 pt-6 border-t border-stone-900/15 flex flex-wrap gap-3">
        <Link href={`/learn/${slugs.subject}/${slugs.topic}/${slugs.lesson}/quiz`}
          className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase"
          style={{ fontFamily: mono, letterSpacing: '0.25em',
            border: '1px solid rgba(26,31,46,0.35)' }}>
          <RotateCcw size={12} /> Try again
        </Link>
        <Link href={`/learn/${slugs.subject}/${slugs.topic}/${slugs.lesson}`}
          className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase"
          style={{ fontFamily: mono, letterSpacing: '0.25em',
            border: '1px solid rgba(26,31,46,0.35)' }}>
          Back to lesson
        </Link>
        {nextLessonHref && (
          <Link href={nextLessonHref}
            className="inline-flex items-center gap-2 py-3 px-5 text-[11px] uppercase ml-auto"
            style={{ fontFamily: mono, letterSpacing: '0.25em',
              backgroundColor: '#1a1f2e', color: '#e8e4d8' }}>
            Next lesson <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, pointsAwarded, max }) {
  if (status === 'correct') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase"
        style={{ fontFamily: mono, letterSpacing: '0.18em', color: '#2e7d32' }}>
        <CheckCircle2 size={11} /> Correct · {pointsAwarded}/{max}
      </span>
    );
  }
  if (status === 'wrong') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase"
        style={{ fontFamily: mono, letterSpacing: '0.18em', color: '#c2185b' }}>
        <XCircle size={11} /> Incorrect · 0/{max}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase opacity-65"
      style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
      <MinusCircle size={11} /> Awaiting AI · /{max}
    </span>
  );
}

function YourAnswer({ question, response }) {
  let display = '—';
  if (response == null || response === '') display = '(no answer)';
  else if (question.type === 'mcq') {
    const opt = (question.options || []).find((o) => String(o.id) === String(response));
    display = opt ? `${opt.id}) ${opt.text}` : String(response);
  }
  else if (question.type === 'true_false') display = response === true || response === 'true' ? 'True' : 'False';
  else if (question.type === 'numeric') display = `${response}${question.unit ? ' ' + question.unit : ''}`;
  else display = String(response);

  return (
    <div className="text-[12px] opacity-75" style={{ fontFamily: mono }}>
      <span className="opacity-60">Your answer:</span> {display}
    </div>
  );
}
