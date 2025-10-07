import { Type } from "@google/genai";



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
    correctAnswer: {
      type: Type.STRING
    }
  },
  propertyOrdering: [
    "correctAnswer"
  ]
};

const multipleChoiceSchema = {
  type: Type.OBJECT,
  properties: {
    choices: {
      type: Type.OBJECT,
      properties: {
        value: {
          type: Type.STRING
        },
        isCorrect: {
          type: Type.BOOLEAN
        }
      },
      required: [
        "value",
        "isCorrect"
      ],
      propertyOrdering: [
        "value",
        "isCorrect"
      ]
    },
    needsAllCorrect: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "choices",
    "needsAllCorrect"
  ],
  propertyOrdering: [
    "choices",
    "needsAllCorrect"
  ]
};

const trueOrFalseSchema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "isCorrect"
  ],
  propertyOrdering: [
    "isCorrect"
  ]
};

const matchingSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
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
    "items"
  ],
  propertyOrdering: [
    "items"
  ]
};

const orderingSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      minItems: 2,
      maxItems: 6
    }
  },
  required: [
    "items"
  ],
  propertyOrdering: [
    "items"
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
          source: {
            type: Type.STRING
          },
          isDownloadable: {
            type: Type.BOOLEAN
          }
        },
        required: [
          "source",
          "isDownloadable"
        ],
        propertyOrdering: [
          "source",
          "isDownloadable"
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
    language: {
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
    content: {
      type: Type.STRING
    },
    correctOutput: {
      type: Type.STRING
    }
  },
  required: [
    "language",
    "content"
  ],
  propertyOrdering: [
    "language",
    "content",
    "correctOutput"
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
    source: {
      type: Type.STRING
    }
  },
  required: [
    "source"
  ],
  propertyOrdering: [
    "source"
  ]
};

const elementSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: [
        "shortAnswer",
        "multipleChoice",
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
        multipleChoiceSchema,
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
      maxItems: 7
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
    placeholder: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "placeholder"
  ],
  propertyOrdering: [
    "placeholder"
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
