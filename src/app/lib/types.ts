export enum ElementType {
  ShortAnswer = 'shortAnswer',
  TrueOrFalse = 'trueOrFalse',
  Matching = 'matching',
  Ordering = 'ordering',
  Files = 'files',
  Drawing = 'drawing',
  Graph = 'graph',
  DAW = 'daw',
  Codespace = 'codespace',
  Engine = 'engine',
  IFrame = 'iFrame'
};

export type ShortAnswer = {
  correctAnswer: string | undefined
};

export type TrueOrFalse = {
  isCorrect: boolean
};

export type MatchingItem = {
  leftSide: string,
  rightSide: string
};

export type Matching = {
  items: MatchingItem[]
};

export type Ordering = {
  correctOrder: string[]
};

export type File = {
  source: string,
  isDownloadable: boolean
};

export type Files = {
  files: File[]
};

export type Drawing = {
  placeholder: any
};

export type Graph = {
  type: string,
  fileName: string
};

export type DAW = {
  placeholder: any
};

export type CodespaceFile = {
  name: string,
  content: string
};

export enum CodespaceLanguage {
  Java = 'java',
  Python = 'python',
  C = 'c',
  CPP = 'cpp',
  NodeJS = 'nodejs',
  JavaScript = 'javascript',
  Groovy = 'groovy',
  JShell = 'jshell',
  Haskell = 'haskell',
  TCL = 'tcl',
  Lua = 'lua',
  Ada = 'ada',
  CommonLisp = 'commonlisp',
  D = 'd',
  Elixir = 'elixir',
  Erlang = 'erlang',
  FSharp = 'fsharp',
  Fortran = 'fortran',
  Assembly = 'assembly',
  Scala = 'scala',
  PHP = 'php',
  Python2 = 'python2',
  CSharp = 'csharp',
  Perl = 'perl',
  Ruby = 'ruby',
  Go = 'go',
  R = 'r',
  Racket = 'racket',
  OCaml = 'ocaml',
  VB = 'vb',
  Basic = 'basic',
  Bash = 'bash',
  Clojure = 'clojure',
  TypeScript = 'typescript',
  Cobol = 'cobol',
  Kotlin = 'kotlin',
  Pascal = 'pascal',
  Prolog = 'prolog',
  Rust = 'rust',
  Swift = 'swift',
  ObjectiveC = 'objectivec',
  Octave = 'octave',
  Text = 'text',
  BrainFK = 'brainfk',
  CoffeeScript = 'coffeescript',
  EJS = 'ejs',
  Dart = 'dart',
  Deno = 'deno',
  Bun = 'bun',
  MySQL = 'mysql',
  Oracle = 'oracle',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  SQLite = 'sqlite',
  Redis = 'redis',
  MariaDB = 'mariadb',
  PLSQL = 'plsql',
  SQLServer = 'sqlserver'
};

export type Codespace = {
  language: CodespaceLanguage,
  files: CodespaceFile[],
  correctOutput: string | undefined
};

export type Engine = {
  placeholder: any
};

export type IFrame = {
  source: string
};

export enum ElementState {
  Locked = 'locked',
  InProgress = 'inProgress',
  Complete = 'complete'
};

export type Element = {
  text: string,
  type: ElementType,
  value: ShortAnswer | TrueOrFalse | Matching | Ordering | Files | Drawing | Graph | DAW | Codespace | Engine | IFrame
  state: ElementState
};

export type Chapter = {
  title: string,
  elements: Element[]
};

export type Learn = {
  chapters: Chapter[]
};

export type Practice = {
  placeholder: any
};

export type Implement = {
  link: string
};

export type Study = {
  link: string
};

export type Skill = {
  title: string,
  description: string,
  learn: Learn,
  practice: Practice,
  implement: Implement,
  study: Study
};

export type Course = {
  title: string,
  description: string,
  skills: Skill[]
};
