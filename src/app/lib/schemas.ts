import { Type } from "@google/genai";
import { types } from "util";

export const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN
    },
    feedback: {
      type: Type.STRING
    }
  },
  required: [
    "isValid",
    "feedback"
  ],
  propertyOrdering: [
    "isValid",
    "feedback"
  ]
};

export const embedTypeSchema = {
  type: Type.STRING,
  enum: [
    "Drawing",
    "Graph",
    "DAW",
    "Codespace",
    "Engine"
  ]
}

const shortAnswerSchema = {
  type: Type.OBJECT,
  properties: {
    shortAnswerCorrectAnswer: {
      type: Type.STRING
    }
  },
  propertyOrdering: [
    "shortAnswerCorrectAnswer"
  ]
};

const trueOrFalseSchema = {
  type: Type.OBJECT,
  properties: {
    isTrueOrFalseCorrect: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "isTrueOrFalseCorrect"
  ],
  propertyOrdering: [
    "isTrueOrFalseCorrect"
  ]
};

const matchingSchema = {
  type: Type.OBJECT,
  properties: {
    matchingItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          leftSide: {
            type: Type.STRING
          },
          rightSide: {
            type: Type.STRING
          }
        },
        required: [
          "leftSide",
          "rightSide"
        ],
        propertyOrdering: [
          "leftSide",
          "rightSide"
        ]
      },
      minItems: 2,
      maxItems: 4
    }
  },
  required: [
    "matchingItems"
  ],
  propertyOrdering: [
    "matchingItems"
  ]
};

const orderingSchema = {
  type: Type.OBJECT,
  properties: {
    orderingItems: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      minItems: 2,
      maxItems: 6
    }
  },
  required: [
    "orderingItems"
  ],
  propertyOrdering: [
    "orderingItems"
  ]
};

const fileSchema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fileSource: {
            type: Type.STRING
          },
          isFileDownloadable: {
            type: Type.BOOLEAN
          }
        },
        required: [
          "fileSource",
          "isFileDownloadable"
        ],
        propertyOrdering: [
          "fileSource",
          "isFileDownloadable"
        ]
      },
      minItems: 1,
      maxItems: 3
    }
  },
  required: [
    "files"
  ],
  propertyOrdering: [
    "files"
  ]
};

const drawingSchema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [
    
  ]
};

const graphSchema = {
  type: Type.OBJECT,
  properties: {
    
  },
  required: [

  ],
  propertyOrdering: [
    
  ]
};

const dawSchema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

const codespaceSchema = {
  type: Type.OBJECT,
  properties: {
    codespaceLanguage: {
      type: Type.STRING,
      enum: [
        "csharp",
        "javascript",
        "python",
        "c",
        "cpp",
        "java",
        "php",
        "html",
        "ruby",
        "react",
        "nodejs",
        "assembly",
        "lua",
        "haskell",
        "perl",
        "fortran",
        "go",
        "scala",
        "typescript",
        "swift",
        "rust",
        "kotlin",
        "cobol",
        "mysql",
        "jquery",
        "angular"
      ]
    },
    codespaceFiles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING
          },
          content: {
            type: Type.STRING
          }
        },
        propertyOrdering: [
          "name",
          "content"
        ]
      },
      minItems: 1,
      maxItems: 1
    },
    codespaceCorrectOutput: {
      type: Type.STRING
    }
  },
  required: [
    "codespaceLanguage",
    "codespaceFiles"
  ],
  propertyOrdering: [
    "codespaceLanguage",
    "codespaceFiles",
    "codespaceCorrectOutput"
  ]
};

const engineSchema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

const iframeSchema = {
  type: Type.OBJECT,
  properties: {
    iframeSource: {
      type: Type.STRING
    }
  },
  required: [
    "iframeSource"
  ],
  propertyOrdering: [
    "iframeSource"
  ]
};

const elementSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: [
        "shortAnswer",
        "trueOrFalse",
        "matching",
        "ordering",
        "files",
        "drawing",
        "graph",
        "daw",
        "codespace",
        "engine",
        "iframe"
      ]
    },
    text: {
      type: Type.STRING
    },
    value: {
      type: Type.OBJECT,
      anyOf: [
        shortAnswerSchema,
        trueOrFalseSchema,
        matchingSchema,
        orderingSchema,
        fileSchema,
        //drawingSchema,
        //graphSchema,
        //dawSchema,
        codespaceSchema,
        //engineSchema,
        iframeSchema
      ]
    }
  },
  required: [
    "type",
    "text",
    "value"
  ],
  propertyOrdering: [
    "type",
    "text",
    "value"
  ]
};

const chapterSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING
    },
    elements: {
      type: Type.ARRAY,
      items: elementSchema,
      minItems: 1,
      maxItems: 9
    }
  },
  required: [
    "title",
    "elements"
  ],
  propertyOrdering: [
    "title",
    "elements"
  ]
};

const learnSchema = {
  type: Type.OBJECT,
  properties: {
    chapters: {
      type: Type.ARRAY,
      items: chapterSchema,
      minItems: 5,
      maxItems: 9
    }
  },
  required: [
    "chapters"
  ],
  propertyOrdering: [
    "chapters"
  ]
};

const practiceSchema = {
  type: Type.OBJECT,
  properties: {
    
  },
  required: [

  ],
  propertyOrdering: [
    
  ]
};

export const skillSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING
    },
    description: {
      type: Type.STRING
    },
    learn: learnSchema,
    practice: practiceSchema,
    implement: {
      type: Type.STRING
    },
    study: {
      type: Type.STRING
    }
  },
  required: [
    "title",
    "description",
    "learn",
    "practice",
    "implement",
    "study"
  ],
  propertyOrdering: [
    "title",
    "description",
    "learn",
    "practice",
    "implement",
    "study"
  ]
}
