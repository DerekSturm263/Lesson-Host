export const responseSchema = {
  type: 'object',
  properties: {
    isValid: {
      type: 'boolean'
    },
    feedback: {
      type: 'string'
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
