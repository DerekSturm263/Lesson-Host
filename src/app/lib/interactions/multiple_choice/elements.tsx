'use client'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Markdown from 'react-markdown';
import { useState } from 'react';
import { ElementID, ComponentMode, InteractionProps } from '@/app/lib/types';
import { submitMultipleChoice } from '@/app/lib/functions';
import * as helpers from '@/app/lib/helpers';

type MultipleChoiceItem = {
  value: string,
  isCorrect: boolean
};

enum MultipleChoiceType {
  Radio = 'radio',
  Checkbox = 'checkbox'
}

type MultipleChoice = {
  items: MultipleChoiceItem[],
  type: MultipleChoiceType,
  needsAllCorrect: boolean
};

function MultipleChoice({ elementID, isDisabled, mode }: InteractionProps) {
  const [ type, setType ] = useState(helpers.getInteractionValue<MultipleChoice>(elementID).type);
  const [ needsAllCorrect, setNeedsAllCorrect ] = useState(helpers.getInteractionValue<MultipleChoice>(elementID).needsAllCorrect);

  const [ items, setItems ] = useState(helpers.getInteractionValue<MultipleChoice>(elementID).items);

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
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
        action={(e) => submitMultipleChoice(e, elementID)}
      >
        {items.map((item, index) => (
          <MultipleChoiceItem
            key={index}
            elementID={elementID}
            isDisabled={isDisabled}
            mode={mode}
            item={item}
            index={index}
            type={type}
          />
        ))}

        {mode == ComponentMode.Edit && (
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
        
        {mode == ComponentMode.Edit && (
          <FormControlLabel label="Needs All Correct" control={
            <Checkbox
              name="needsAllCorrect"
              id="needsAllCorrect"
              checked={needsAllCorrect}
              onChange={(e) => {
                setNeedsAllCorrect(e.target.checked);
                helpers.getInteractionValue<MultipleChoice>(elementID).needsAllCorrect = e.target.checked;
              }}
            />}
          />
        )}

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
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
                  helpers.getInteractionValue<MultipleChoice>(elementID).items[index].isCorrect = e.target.checked;
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
                helpers.getInteractionValue<MultipleChoice>(elementID).items[index].value = e.target.value;
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

export default MultipleChoice;
