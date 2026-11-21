export interface OpcodeDoc {
  name: string;
  summary: string;
  p1Desc?: string;
  p2Desc?: string;
  p3Desc?: string;
}

export const OPCODES_GLOSSARY: Record<string, OpcodeDoc> = {
  Init: {
    name: 'Init',
    summary: 'Start of VDBE program execution. Jumps to P2 to begin processing.',
    p2Desc: 'Target address to jump to after initialization',
  },
  OpenRead: {
    name: 'OpenRead',
    summary: 'Open a cursor for reading from a table or index.',
    p1Desc: 'Cursor number (index into cursor array)',
    p2Desc: 'Root page number of the table or index b-tree',
    p3Desc: 'Database index (0 = main)',
  },
  OpenWrite: {
    name: 'OpenWrite',
    summary: 'Open a cursor with read and write permissions.',
    p1Desc: 'Cursor number',
    p2Desc: 'Root page number',
  },
  Rewind: {
    name: 'Rewind',
    summary: 'Rewind cursor P1 to the first record. Jumps to P2 if table is empty.',
    p1Desc: 'Cursor number',
    p2Desc: 'Jump address if empty',
  },
  Column: {
    name: 'Column',
    summary: 'Extract value of column P2 from cursor P1 and store it into register P3.',
    p1Desc: 'Cursor number',
    p2Desc: 'Column index (0-based)',
    p3Desc: 'Target register',
  },
  ResultRow: {
    name: 'ResultRow',
    summary: 'Output a result row composed of consecutive registers starting at P1 with length P2.',
    p1Desc: 'First register index',
    p2Desc: 'Number of columns in output row',
  },
  Next: {
    name: 'Next',
    summary: 'Advance cursor P1 to the next entry. If another record exists, jump to P2.',
    p1Desc: 'Cursor number',
    p2Desc: 'Jump target loop address',
  },
  SeekGE: {
    name: 'SeekGE',
    summary: 'Seek cursor P1 to the first entry with key >= unpacked key in register P3.',
    p1Desc: 'Cursor number',
    p2Desc: 'Jump target if no matching key found',
    p3Desc: 'First register of search key',
  },
  Halt: {
    name: 'Halt',
    summary: 'Terminate VDBE program execution and return status code.',
    p1Desc: 'Error/result code',
    p2Desc: 'Error action or message register',
  },
  Goto: {
    name: 'Goto',
    summary: 'Unconditional jump to instruction address P2.',
    p2Desc: 'Jump destination address',
  },
  Integer: {
    name: 'Integer',
    summary: 'Write immediate 32-bit integer value P1 into register P2.',
    p1Desc: 'Integer value',
    p2Desc: 'Destination register',
  },
  String8: {
    name: 'String8',
    summary: 'Write string literal P4 into register P2.',
    p2Desc: 'Destination register',
  },
  Rowid: {
    name: 'Rowid',
    summary: 'Store the integer rowid of the current record pointed to by cursor P1 into register P2.',
    p1Desc: 'Cursor number',
    p2Desc: 'Destination register',
  },
  Transaction: {
    name: 'Transaction',
    summary: 'Begin a database transaction.',
    p1Desc: 'Database index (0 = main)',
    p2Desc: 'Transaction lock level (0 = read, 1 = write)',
  },
};
