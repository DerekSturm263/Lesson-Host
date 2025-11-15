'use client'

import Markdown from 'react-markdown';
import verify from './functions';
import { useEffect, useState } from 'react';
import { ElementID, ComponentMode, InteractionProps, InteractionPackage } from '@/app/lib/types';
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

export type InteractionType = {
  items: MultipleChoiceItem[],
  choiceType: ChoiceType
};

export type MultipleChoiceItem = {
  value: string,
  isCorrect: boolean
};

export enum ChoiceType {
  NeedsAllCorrect = 'needsAllCorrect',
  NeedsOneCorrect = 'needsOneCorrect'
}

const defaultValue: InteractionType = {
  items: [
    {
      value: "New Item",
      isCorrect: true
    }
  ],
  choiceType: ChoiceType.NeedsAllCorrect,
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
    choiceType: {
      type: Type.BOOLEAN
    }
  },
  required: [
    "choices",
    "choiceType"
  ],
  propertyOrdering: [
    "choices",
    "choiceType"
  ]
};

function Component(props: InteractionProps) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).items);

  useEffect(() => {
    setItems(items.toSorted(item => Math.random()));
  }, []);

  const [ choiceType, setChoiceType ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).choiceType);
  const [ selected, setSelected ] = useState([ ] as MultipleChoiceItem[]);

  async function submit() {
    props.setIsThinking(true);

    const feedback = await verify(props.originalText, selected, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    props.setIsThinking(false);

    if (feedback.isValid) {
      props.setComplete(true);
    }
  }

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

  function selectItem(index: number) {
    const newSelected = selected;
    newSelected.push(items[index]);
    setSelected(newSelected);
  }

  function unselectItem(index: number) {
    const newSelected = selected;
    newSelected.splice(index, 1);
    setSelected(newSelected);
  }

  return (
    <Box
      sx={{ flexGrow: 1, alignSelf: "center", alignContent: "center" }}
    >
      <FormControl
        id={`interaction${helpers.getAbsoluteIndex(props.elementID)}`}
        className='multipleOptions'
      >
        
        {props.mode == ComponentMode.Edit && (
          <FormControl
            size="small"
          >
            <InputLabel id="mode-label">Type</InputLabel>
          
            <Select
              labelId="language-label"
              value={choiceType}
              label="Language"
              onChange={(e) => {
                setChoiceType(e.target.value as ChoiceType);
                helpers.getInteractionValue<InteractionType>(props.elementID).choiceType = e.target.value as ChoiceType;
              }}
            >
              {(Object.values(ChoiceType).map((item, index) => (
                <MenuItem
                  value={item}
                  key={index}
                >
                  {item}
                </MenuItem>
              )))}
            </Select>
          </FormControl>
        )}
        
        <RadioGroup>
          {items.map((item, index) => (
            <MultipleChoiceItem
              key={index}
              elementID={props.elementID}
              isDisabled={props.isDisabled}
              mode={props.mode}
              item={item}
              isRadio={items.filter((item) => item.isCorrect).length == 1}
              index={index}
              toggle={(index: number, toggleState: boolean) => {
                if (selected[index])
                  unselectItem(index);
                else
                  selectItem(index);
              }}
              setSelected={(index: number) => {
                setSelected([ items[index] ]);
              }}
            />
          ))}
        </RadioGroup>

        {props.mode == ComponentMode.View && (
          <>
            <br />
          
            <Button
              variant="contained"
              onClick={(e) => submit()}
              sx={{ width: '120px' }}
            >
              Submit
            </Button>
          </>
        )}
      </FormControl>
    </Box>
  );
}

function MultipleChoiceItem({ elementID, isDisabled, mode, item, index, isRadio, toggle, setSelected }: { elementID: ElementID, isDisabled: boolean, mode: ComponentMode, item: MultipleChoiceItem, index: number, isRadio: boolean, toggle: (index: number, toggleState: boolean) => void, setSelected: (index: number) => void }) {
  const [ value, setValue ] = useState(item.value);
  const [ isCorrect, setIsCorrect ] = useState(item.isCorrect);

  return (
    <>
      {(mode == ComponentMode.Edit ? (
        <Stack
          direction="row"
        >
          <TextField
            label="Value"
            name="value"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              helpers.getInteractionValue<InteractionType>(elementID).items[index].value = e.target.value;
            }}
          />

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
        </Stack>
      ) : (
        <FormControlLabel
          value={item.value}
          control={(isRadio ?
          <Radio
            onChange={(e) => {
              setSelected(index);
            }}
          />
          :
          <Checkbox
            onChange={(e) => {
              toggle(index, e.target.checked);
            }}
          />)}
          label={<Markdown>{item.value}</Markdown>}
        />
      ))}
    </>
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
