export enum ElementType {
  ShortAnswer = 'shortAnswer',
  MultipleChoice = 'multipleChoice',
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

export type MultipleChoiceItem = {
  value: string,
  isCorrect: boolean
};

export enum MultipleChoiceType {
  Radio = 'radio',
  Checkbox = 'checkbox'
}

export type MultipleChoice = {
  items: MultipleChoiceItem[],
  type: MultipleChoiceType,
  needsAllCorrect: boolean
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
  placeholder: boolean
};

export type Graph = {
  type: string,
  fileName: string
};

export type DAW = {
  placeholder: boolean
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
  content: CodespaceFile[],
  isSimplified: boolean,
  correctOutput: string | undefined
};

export type CodespaceFile = {
  name: string,
  content: string
}

export type Engine = {
  placeholder: boolean
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
  type: ElementType,
  text: string,
  value: ShortAnswer | MultipleChoice | TrueOrFalse | Matching | Ordering | Files | Drawing | Graph | DAW | Codespace | Engine | IFrame
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
  placeholder: boolean
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

export type Project = {
  title: string,
  description: string
};

export type Course = {
  title: string,
  description: string,
  skills: string[],
  projects: string[]
};

/*const codespaceExample: Skill = {
  title: `Loops in C#`,
  learn: {
    chapters: [
      {
        title: `Introduction`,
        elements: [
          {
            type: `codespace`,
            text: `In this lesson, you’ll be learning about loops in C#. <b>Loops allow you to create blocks of code that run multiple times without actually having to write the code multiple times</b>. We will be covering <code>for</code> Loops, <code>while</code> Loops, and <code>foreach</code> Loops. Experiment with the code above. You don’t need to understand it yet, but try changing different values and conditions to see what happens. Press "Run" when you’re ready.`,
            value: {
              codespaceLanguage: "csharp",
              codespaceFiles: [
                {
                  name: "Runner.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class Runner\n  {\n    public static void Main(string[] args)\n    {\n      // Test out For Loops.\n      Console.WriteLine(\"For Loops:\");\n      ForLoops.Test();\n      \n      // Test out While Loops.\n      Console.WriteLine(\"While Loops:\");\n      WhileLoops.Test();\n      \n      // Test out ForEach Loops.\n      Console.WriteLine(\"ForEach Loops:\");\n      ForEachLoops.Test();\n    }\n  }\n}\n"
                },
                {
                  name: "ForLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class ForLoops\n  {\n    public static void Test()\n    {\n      // The loop starts at 0, it runs while it's less than 4, and it increases by 1 every iteration.\n      // This makes the loop run exactly 4 times.\n      for (int i = 0; i < 4; ++i)\n      {\n        // Every time the loop iterates, it prints \"Hello!\".\n        Console.WriteLine(\"Hello!\");\n      }\n    }\n  }\n}\n"
                },
                {
                  name: "WhileLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class WhileLoops\n  {\n    public static void Test()\n    {\n      // Creating a variable that we can use to test the loop.\n      int num = 1;\n      \n      // The loop runs while the variable is less than 10.\n      while (num < 10)\n      {\n        // Every time the loop iterates, it prints the value that the variable is currently at.\n        Console.WriteLine(num);\n        \n        // Every time the loop iterates, the variable doubles in value.\n        num *= 2;\n      }\n    }\n  }\n}\n"
                },
                {
                  name: "ForEachLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class ForEachLoops\n  {\n    public static void Test()\n    {\n      // Creating a variable that we can use to test the loop.\n      String[] fruits = new String[] { \"Apple\", \"Fruit\", \"Pear\" };\n      \n      // The loop iterates over every item in the variable once.\n      foreach (String fruit in fruits)\n      {\n        // Every time the loop iterates, it prints the current value it's iterating on.\n        Console.WriteLine(fruit);\n      }\n    }\n  }\n}\n"
                }
              ]
            }
          },
          {
            type: `shortAnswer`,
            text: `<i>What are some features in a game that use might loops or repetition?</i> Think about actions or sequences that happen multiple times in a row, like spawning multiple enemies at once, taking turns in combat, or taking multiple steps on a grid. When you’re ready, write your answer above.`,
            value: {
              shortAnswerCorrectAnswers: [
                `spawning multiple items`,
                `running a gameplay loop`,
                `iterating through inventory items`
              ]
            }
          }
        ]
      },
      {
        title: `For Loops`,
        elements: [
          {
            type: `codespace`,
            text: `<code>for</code> Loops are the first type of loop we'll be learning about. This type of loop is used when <b>the number of times you want the code to repeat shouldn't change once the loop starts running</b>.`,
            value: {
              codespaceLanguage: "csharp",
              codespaceFiles: [
                {
                  name: "ForLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class ForLoops\n  {\n    public static void Main(string[] args)\n    {\n      // The loop starts at 0, it runs while it's less than 4, and it increases by 1 every iteration.\n      // This makes the loop run exactly 4 times.\n      for (int i = 0; i < 4; ++i)\n      {\n        // Every time the loop iterates, it prints \"Hello!\".\n        Console.WriteLine(\"Hello!\");\n      }\n    }\n  }\n}\n"
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `A <code>for</code> Loop is composed of 3 parts: an <b>initializer</b>, a <b>condition</b>, and an <b>iterator</b>. Finally, <code>for</code> Loops have a block of code surrounded by curly brackets that you want to be repeated.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForLoops.cs`,
                  content: `for (initializer; condition; incrementer) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>initializer</b> runs right before the loop starts and is normally used for creating counter variables to keep track of how many times the loop has run. In the example on your screen, the initializer is set to <code>int i = 0</code>. This creates a variable called <code>i</code> inside of the loop that starts at 0.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForLoops.cs`,
                  content: `for (int i = 0; condition; incrementer) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>condition</b> is checked after every iteration of the loop, and as soon as it resolves to false, the loop stops running. In the example on your screen, the condition is set to <code>i < 10</code>. This allows the loop to run while <code>i</code> is still less than 10.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForLoops.cs`,
                  content: `for (int i = 0; i < 10; incrementer) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>iterator</b> is ran after every iteration of the loop and is normally used to increase or decrease the value of the counter variable so the loop doesn't run infinitely. In the example on your screen, the iterator is set to <code>++i</code>. This increases <code>i</code> by 1 every time the loop runs.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
              {
                  name: `ForLoops.cs`,
                  content: `for (int i = 0; i < 10; ++i) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `After you write your initializer, condition, and iterator, you can write the <b>body</b> of your loop. The body is a block of code that will be executed every time the loop runs. In the example on your screen, the body is set to <code>Console.WriteLine(i)</code>. This will print the counter variable every iteration, which should print the numbers 0 through 9.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForLoops.cs`,
                  content: `for (int i = 0; i < 10; ++i) { Console.WriteLine(i); }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `Now that you know a little bit about <code>for</code> Loops, try writing a <code>for</code> Loop that prints every third number between 1 and 22.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForLoops.cs`,
                  content: ``
                }
              ],
              codespaceAnswer: `1 4 7 10 13 16 19 22`
            }
          }
        ]
      },
      {
        title: `While Loops`,
        elements: [
          {
            type: `codespace`,
            text: `<code>while</code> Loops are the next type of loop we'll be learning about. This type of loop is used when <b>the loop may stop running during any of its iterations</b>.`,
            value: {
              codespaceLanguage: "csharp",
              codespaceFiles: [
                {
                  name: "WhileLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class WhileLoops\n  {\n    public static void Main(string[] args)\n    {\n      // Creating a variable that we can use to test the loop.\n      int num = 1;\n      \n      // The loop runs while the variable is less than 10.\n      while (num < 10)\n      {\n        // Every time the loop iterates, it prints the value that the variable is currently at.\n        Console.WriteLine(num);\n        \n        // Every time the loop iterates, the variable doubles in value.\n        num *= 2;\n      }\n    }\n  }\n}\n"
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `A <code>while</code> Loop is composed of 1 part, the <b>condition</b>. <code>while</code> Loops also have a block of code surrounded by curly brackets that you want to be repeated.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `WhileLoops.cs`,
                  content: `while (condition) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>condition</b> is checked after every iteration of the loop, and as soon as it resolves to false, the loop stops running. In the example on your screen, the condition is set to <code>isAlive</code>. This allows the loop to run while some theoretical character is still alive.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `WhileLoops.cs`,
                  content: `isAlive = true; while (isAlive) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `After you write your condition, you can write the <b>body</b> of your loop. The body is a block of code that will be executed every time the loop runs. In the example on your screen, the body is set to <code>Console.WriteLine("Hello, world!")</code>. This will print the message "Hello, world!" every iteration while the theoretical player is still alive.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `WhileLoops.cs`,
                  content: `isAlive = true; while (isAlive) { Console.WriteLine("Hello, world!"); }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `Now that you know a little bit about <code>while</code> Loops, try writing a <code>while</code> Loop that prints every tenth number between 10 and 40.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `WhileLoops.cs`,
                  content: ``
                }
              ],
              codespaceAnswer: `10 20 30 40`
            }
          }
        ]
      },
      {
        title: `For Each Loops`,
        elements: [
          {
            type: `codespace`,
            text: `<code>foreach</code> Loops are the final type of loop we'll be learning about. This type of loop is used when <b>you need to iterate over every item in a collection, one at a time</b>.`,
            value: {
              codespaceLanguage: "csharp",
              codespaceFiles: [
                {
                  name: "ForEachLoops.cs",
                  content: "using System;\n\nnamespace Loops\n{\n  public class ForEachLoops\n  {\n    public static void Main(string[] args)\n    {\n      // Creating a variable that we can use to test the loop.\n      String[] fruits = new String[] { \"Apple\", \"Fruit\", \"Pear\" };\n      \n      // The loop iterates over every item in the variable once.\n      foreach (String fruit in fruits)\n      {\n        // Every time the loop iterates, it prints the current value it's iterating on.\n        Console.WriteLine(fruit);\n      }\n    }\n  }\n}\n"
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `A <code>foreach</code> Loop is composed of 3 parts: a <b>type</b>, an <b>identifier</b>, and a <b>collection to iterate over</b>. <code>foreach</code> Loops also have a block of code surrounded by curly brackets that you want to be repeated.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: `foreach (type identifier in collection) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>type</b> represents which data type the loop is handling. For example, if the <code>foreach</code> Loop is iterating over a list of ints, this would be <code>int</code>. To keep things simple, you can use <code>var</code> to represent any type. In the example on your screen, the type is set to <code>String</code> since the collection we're iterating over is an array of <code>String</code>s.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: `String[] fruits = [ "Fruit", "Apple", "Orange" ]; foreach (String identifier in collection) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>identifier</b> is what you would like to call your iteration variable. This, along with the type, allows the loop to store a reference to the current item being iterated on. What that means is that as you iterate through a collection, you can use this variable to access each item. In the example on your screen, the identifier is set to <code>fruit</code> since the collection we're iterating over is an array of fruit names.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: `String[] fruits = [ "Fruit", "Apple", "Orange" ]; foreach (String fruit in collection) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `The <b>collection</b> is which collection variable you will be iterating over. Any data structure can be iterated over, including arrays, lists, and dictionaries. The loop will run once for each item in this collection. In the example on your screen, the collection is set to <code>fruits</code>. <code>fruits</code> is an array of <code>String</code>s, each representing a different fruit.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: `String[] fruits = [ "Fruit", "Apple", "Orange" ]; foreach (String fruit in fruits) { }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `After you write your type, identifier, and collection, you can write the <b>body</b> of your loop. The body is a block of code that will be executed every time the loop runs. In the example on your screen, the body is set to <code>Console.WriteLine(fruit)</code>. This will print each of the fruits, one at a time.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: `String[] fruits = [ "Fruit", "Apple", "Orange" ]; foreach (String fruit in fruits) { Console.WriteLine(fruit); }`
                }
              ]
            }
          },
          {
            type: `codespace`,
            text: `Now that you know a little bit about <code>foreach</code> Loops, try writing a <code>foreach</code> Loop that prints each of these values from an array of <code>String</code>s: 'Zelda', 'Undertale', 'Call of Duty', 'Fortnite', 'Skyrim'.`,
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `ForEachLoops.cs`,
                  content: ``
                }
              ],
              codespaceAnswer: `Zelda Undertale Call of Duty Fortnite Skyrim`
            }
          }
        ]
      },
      {
        title: `Recap`,
        elements: [
          {
            type: `paragraph`,
            text: `Congratulations on learning about loops in C#. In this lesson, you learned about 3 kinds of loops.`
          },
          {
            type: `paragraph`,
            text: `<code>for</code> Loops, which run a <b>set number of times</b> and are useful when the number of times the loop runs won't change once it starts running.'`
          },
          {
            type: `paragraph`,
            text: `<code>while</code> Loops, which run <b>while a condition is met</b> and are useful when the loop may stop running during any of the iterations.`
          },
          {
            type: `paragraph`,
            text: `<code>foreach</code> Loops, which <b>iterate over every item in a collection</b> and are useful when you need to run code on each item in a collection.`
          }
        ]
      },
      {
        title: `Exit Ticket`,
        elements: [
          {
            type: 'codespace',
            text: 'Now that you know how to make loops in C#, your goal is to write a piece of code that uses loops to print the days of the week in order, 3 times each. Your output should look something like <code>Monday Monday Monday Tuesday Tuesday Tuesday Wednesday Wednesday Wednesday</code> and so on.',
            value: {
              codespaceLanguage: `csharp`,
              codespaceFiles: [
                {
                  name: `DaysOfWeek.cs`,
                  content: `// Insert code here. Use the different kinds of loops you learned about to print each day of the week 3 times in a row.`
                }
              ],
              codespaceCorrectOutput: `Monday Monday Monday Tuesday Tuesday Tuesday Wednesday Wednesday Wednesday Thursday Thursday Thursday Friday Friday Friday Saturday Saturday Saturday Sunday Sunday Sunday`
            }
          }
        ]
      }
    ]
  }
};*/

export type ElementID = {
  learn: Learn,
  chapterIndex: number,
  elementIndex: number,
  keys: string[]
};

export enum CodeStatus {
  Success = 'success',
  Failed = 'failed'
};

export type CodeResult = {
  stdout: string | undefined,
  stderr: string | undefined,
  exception: string | undefined,
  executionTime: number,
  limitPerMonthRemaining: number,
  status: CodeStatus,
  error: string | undefined
};

export enum ComponentMode {
  View = 'view',
  Edit = 'edit',
  Master = 'master'
}

export type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
