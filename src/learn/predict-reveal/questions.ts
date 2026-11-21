export interface PredictQuestion {
  id: string;
  subsystem: string;
  prompt: string;
  options: string[];
  getCorrectAnswer: (pre: any, post: any) => { answer: string; explanation: string };
}

export const PREDICT_QUESTIONS: PredictQuestion[] = [
  {
    id: 'page_allocation',
    subsystem: 'storage',
    prompt: 'How many total physical pages will the database allocate after this query?',
    options: ['1 Page', '2 Pages', '3 Pages', '4+ Pages'],
    getCorrectAnswer: (_pre, post) => {
      const count = post.pageStats?.pageCount ?? 1;
      const ans = count === 1 ? '1 Page' : count === 2 ? '2 Pages' : count === 3 ? '3 Pages' : '4+ Pages';
      return {
        answer: ans,
        explanation: `The database file now contains ${count} page(s) (${count * (post.pageStats?.pageSize ?? 8192)} bytes) based on real page allocation.`,
      };
    },
  },
  {
    id: 'query_plan_seek',
    subsystem: 'query',
    prompt: 'Will the SQLite query planner perform a full table scan or index seek?',
    options: ['FULL TABLE SCAN', 'INDEX SEEK / SEARCH', 'CONSTANT LOOKUP'],
    getCorrectAnswer: (_pre, post) => {
      const planStr = JSON.stringify(post.results ?? '');
      const isIndex = planStr.includes('USING INDEX') || planStr.includes('SEARCH');
      const ans = isIndex ? 'INDEX SEEK / SEARCH' : 'FULL TABLE SCAN';
      return {
        answer: ans,
        explanation: isIndex
          ? 'An index was available and cost-effective, so SQLite performed a logarithmic B-Tree seek.'
          : 'No covering index was usable for this predicate, so SQLite performed a full table scan.',
      };
    },
  },
  {
    id: 'freelist_count',
    subsystem: 'storage',
    prompt: 'Will this operation create unallocated pages in the freelist?',
    options: ['0 Freelist Pages', '1+ Freelist Pages'],
    getCorrectAnswer: (_pre, post) => {
      const fl = post.pageStats?.freelistCount ?? 0;
      const ans = fl > 0 ? '1+ Freelist Pages' : '0 Freelist Pages';
      return {
        answer: ans,
        explanation: fl > 0
          ? `Deleted pages were preserved in the freelist trunk (${fl} free pages).`
          : 'No pages were moved to the freelist trunk.',
      };
    },
  },
];

export function selectQuestionForSql(sql: string): PredictQuestion | null {
  const upper = sql.trim().toUpperCase();
  if (upper.startsWith('SELECT') && upper.includes('WHERE')) {
    return PREDICT_QUESTIONS[1]!;
  }
  if (upper.startsWith('INSERT') || upper.startsWith('CREATE')) {
    return PREDICT_QUESTIONS[0]!;
  }
  if (upper.startsWith('DELETE') || upper.startsWith('DROP')) {
    return PREDICT_QUESTIONS[2]!;
  }
  return null;
}
