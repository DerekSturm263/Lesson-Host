'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Markdown from 'react-markdown';
import submit from './functions';
import { useState } from 'react';
import { ElementID, ComponentMode, InteractionProps, InteractionPackage } from '@/app/lib/types';
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';

export type InteractionType = {
  items: MultipleChoiceItem[],
  type: MultipleChoiceType,
  needsAllCorrect: boolean
};

type MultipleChoiceItem = {
  value: string,
  isCorrect: boolean
};

enum MultipleChoiceType {
  Radio = 'radio',
  Checkbox = 'checkbox'
}

const defaultValue: InteractionType = {
  items: [
    {
      value: "New Item",
      isCorrect: true
    }
  ],
  type: MultipleChoiceType.Radio,
  needsAllCorrect: true
}

const schema = {
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

function Component(props: InteractionProps) {
  const [ type, setType ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).type);
  const [ needsAllCorrect, setNeedsAllCorrect ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).needsAllCorrect);

  const [ items, setItems ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).items);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  function addItem() {
    const newItems = items;
    newItems.push({
      value: "New Multiple Choice Item",
      isCorrect: false
    });
    setItems(newItems);
  }

  function removeItem(index: number) {
    const newItems = items;
    newItems.splice(index, 1);
    setItems(newItems);
  }

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <FormControl
        id={`interaction${helpers.getAbsoluteIndex(props.elementID)}`}
        className='multipleOptions'
        onSubmit={(e) => submit(e, props.elementID)}
      >
        {items.map((item, index) => (
          <MultipleChoiceItem
            key={index}
            elementID={props.elementID}
            isDisabled={props.isDisabled}
            mode={props.mode}
            item={item}
            index={index}
            type={type}
          />
        ))}

        {props.mode == ComponentMode.Edit && (
          <label>
            Type:

            <select
              name="selectType"
              value={type}
              onChange={(e) => setType(e.target.value as MultipleChoiceType)}
            >
              {(Object.values(MultipleChoiceType).map((item, index) => (
                <option
                  key={index}
                  value={item}
                >
                  {item}
                </option>
              )))}
            </select>
          </label>
        )}
        
        {props.mode == ComponentMode.Edit && (
          <FormControlLabel label="Needs All Correct" control={
            <Checkbox
              name="needsAllCorrect"
              id="needsAllCorrect"
              checked={needsAllCorrect}
              onChange={(e) => {
                setNeedsAllCorrect(e.target.checked);
                helpers.getInteractionValue<InteractionType>(props.elementID).needsAllCorrect = e.target.checked;
              }}
            />}
          />
        )}

        <input
          type="submit"
          name="submit"
          disabled={props.isDisabled}
        />
      </FormControl>
    </Box>
  );
}

function MultipleChoiceItem({ elementID, isDisabled, mode, item, index, type }: { elementID: ElementID, isDisabled: boolean, mode: ComponentMode, item: MultipleChoiceItem, index: number, type: MultipleChoiceType }) {
  const [ value, setValue ] = useState(item.value);
  const [ isCorrect, setIsCorrect ] = useState(item.isCorrect);

  return (
    <label>
      <input
        type={type}
        name="response"
        id={value}
        value={isCorrect.toString()}
        disabled={isDisabled}
      />

      {(mode == ComponentMode.Edit ? (
        <Box>
          <FormControlLabel label="Is Correct" control={
            <Checkbox
              name="isCorrect"
              checked={isCorrect}
              onChange={(e) => {
                setIsCorrect(e.target.checked);

                if (mode == ComponentMode.Edit) {
                  helpers.getInteractionValue<InteractionType>(elementID).items[index].isCorrect = e.target.checked;
                }
              }}
            />}
          />
          
          <TextField
            label="Value"
            name="value"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              
              if (mode == ComponentMode.Edit) {
                helpers.getInteractionValue<InteractionType>(elementID).items[index].value = e.target.value;
              }
            }}
          />
        </Box>
      ) : (
        <Markdown>
          {value}
        </Markdown>
      ))}
    </label>
  );
}

const interaction: InteractionPackage = {
  id: "multipleChoice",
  prettyName: "Multiple Choice",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
